import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { 
  ValidationResult, 
  ValidationError, 
  ValidationWarning, 
  ValidationOptions,
  TenantAwareValidationContext 
} from '../types/shared';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);
  private readonly cache = new Map<string, { result: ValidationResult; expires: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Validate data against Zod schema
   */
  validate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    options: ValidationOptions = {}
  ): ValidationResult<T> {
    try {
      const result = schema.safeParse(data, {
        errorMap: this.createErrorMap(),
        ...options,
      });

      if (result.success) {
        return {
          success: true,
          data: result.data,
          errors: [],
          warnings: [],
        };
      }

      const errors: ValidationError[] = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
        value: err.input,
        path: err.path,
      }));

      return {
        success: false,
        errors,
        warnings: [],
      };
    } catch (error) {
      this.logger.error(`Validation error: ${error.message}`, error.stack);
      return {
        success: false,
        errors: [{
          field: 'root',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          value: data,
        }],
        warnings: [],
      };
    }
  }

  /**
   * Validate with tenant context
   */
  async validateWithTenantContext<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context: TenantAwareValidationContext,
    options: ValidationOptions = {}
  ): Promise<ValidationResult<T>> {
    const cacheKey = this.generateCacheKey(schema, data, context, options);
    
    // Check cache
    if (options.cache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expires) {
        this.logger.debug('Validation cache hit');
        return cached.result;
      }
    }

    // Perform validation
    const result = this.validate(schema, data, options);

    // Add tenant-specific validation
    if (result.success && context.tenantId) {
      const tenantValidation = await this.validateTenantAccess(data, context);
      if (!tenantValidation.valid) {
        result.errors.push(...tenantValidation.errors);
        result.success = false;
      }
      result.warnings.push(...tenantValidation.warnings);
    }

    // Cache result
    if (options.cache !== false) {
      this.cache.set(cacheKey, {
        result,
        expires: Date.now() + (options.cacheTtl || this.CACHE_TTL),
      });
    }

    return result;
  }

  /**
   * Transform data using schema
   */
  transform<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    options: ValidationOptions = {}
  ): T {
    const result = this.validate(schema, data, options);
    if (!result.success) {
      throw new Error(`Transform failed: ${result.errors.map(e => e.message).join(', ')}`);
    }
    return result.data!;
  }

  /**
   * Safe transform with error handling
   */
  safeTransform<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    options: ValidationOptions = {}
  ): ValidationResult<T> {
    try {
      const transformed = this.transform(schema, data, options);
      return {
        success: true,
        data: transformed,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          field: 'root',
          message: error.message,
          code: 'TRANSFORM_ERROR',
          value: data,
        }],
        warnings: [],
      };
    }
  }

  /**
   * Validate tenant access
   */
  private async validateTenantAccess(
    data: any,
    context: TenantAwareValidationContext
  ): Promise<{ valid: boolean; errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Check if data has tenantId and it matches context
      if (data && typeof data === 'object' && 'tenantId' in data) {
        if (data.tenantId !== context.tenantId) {
          errors.push({
            field: 'tenantId',
            message: 'Tenant ID mismatch',
            code: 'TENANT_MISMATCH',
            value: data.tenantId,
          });
        }
      }

      // Check user permissions if provided
      if (context.userId && context.permissions) {
        // Add permission validation logic here
        // This would typically check against a permissions service
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      this.logger.error(`Tenant access validation error: ${error.message}`, error.stack);
      return {
        valid: false,
        errors: [{
          field: 'tenant',
          message: 'Tenant access validation failed',
          code: 'TENANT_VALIDATION_ERROR',
        }],
        warnings,
      };
    }
  }

  /**
   * Create custom error map for Zod
   */
  private createErrorMap(): z.ZodErrorMap {
    return (issue, ctx) => {
      switch (issue.code) {
        case z.ZodIssueCode.invalid_type:
          return {
            message: `Expected ${issue.expected}, received ${issue.received}`,
          };
        case z.ZodIssueCode.too_small:
          return {
            message: `Value must be at least ${issue.minimum}`,
          };
        case z.ZodIssueCode.too_big:
          return {
            message: `Value must be at most ${issue.maximum}`,
          };
        case z.ZodIssueCode.invalid_string:
          return {
            message: `Invalid string format`,
          };
        case z.ZodIssueCode.custom:
          return {
            message: issue.message || 'Custom validation failed',
          };
        default:
          return {
            message: ctx.defaultError,
          };
      }
    };
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(
    schema: z.ZodSchema,
    data: unknown,
    context: TenantAwareValidationContext,
    options: ValidationOptions
  ): string {
    const dataHash = JSON.stringify(data);
    const contextHash = JSON.stringify(context);
    const optionsHash = JSON.stringify(options);
    return `validation:${schema.constructor.name}:${dataHash}:${contextHash}:${optionsHash}`;
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.debug('Validation cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}
