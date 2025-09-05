'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var ValidationService_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidationService = void 0;
const common_1 = require('@nestjs/common');
const zod_1 = require('zod');
let ValidationService = (ValidationService_1 = class ValidationService {
  constructor() {
    this.logger = new common_1.Logger(ValidationService_1.name);
    this.cache = new Map();
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }
  /**
   * Validate data against Zod schema
   */
  validate(schema, data, options = {}) {
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
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
        value: err.received || 'unknown',
        path: err.path,
      }));
      return {
        success: false,
        errors,
        warnings: [],
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Validation error: ${err.message}`, err.stack);
      return {
        success: false,
        errors: [
          {
            field: 'root',
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            value: data,
          },
        ],
        warnings: [],
      };
    }
  }
  /**
   * Validate with tenant context
   */
  async validateWithTenantContext(schema, data, context, options = {}) {
    const cacheKey = this.generateCacheKey(schema, data, context, options);
    // Check cache
    if (true) {
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
    if (true) {
      this.cache.set(cacheKey, {
        result,
        expires: Date.now() + (this.CACHE_TTL || this.CACHE_TTL),
      });
    }
    return result;
  }
  /**
   * Transform data using schema
   */
  transform(schema, data, options = {}) {
    const result = this.validate(schema, data, options);
    if (!result.success) {
      throw new Error(`Transform failed: ${result.errors.map((e) => e.message).join(', ')}`);
    }
    return result.data;
  }
  /**
   * Safe transform with error handling
   */
  safeTransform(schema, data, options = {}) {
    try {
      const transformed = this.transform(schema, data, options);
      return {
        success: true,
        data: transformed,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        errors: [
          {
            field: 'root',
            message: err.message,
            code: 'TRANSFORM_ERROR',
            value: data,
          },
        ],
        warnings: [],
      };
    }
  }
  /**
   * Validate tenant access
   */
  async validateTenantAccess(data, context) {
    const errors = [];
    const warnings = [];
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
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Tenant access validation error: ${err.message}`, err.stack);
      return {
        valid: false,
        errors: [
          {
            field: 'tenant',
            message: 'Tenant access validation failed',
            code: 'TENANT_VALIDATION_ERROR',
          },
        ],
        warnings,
      };
    }
  }
  /**
   * Create custom error map for Zod
   */
  createErrorMap() {
    return (issue, ctx) => {
      switch (issue.code) {
        case zod_1.z.ZodIssueCode.invalid_type:
          return {
            message: `Expected ${issue.expected}, received ${issue.received}`,
          };
        case zod_1.z.ZodIssueCode.too_small:
          return {
            message: `Value must be at least ${issue.minimum}`,
          };
        case zod_1.z.ZodIssueCode.too_big:
          return {
            message: `Value must be at most ${issue.maximum}`,
          };
        case zod_1.z.ZodIssueCode.invalid_string:
          return {
            message: `Invalid string format`,
          };
        case zod_1.z.ZodIssueCode.custom:
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
  generateCacheKey(schema, data, context, options) {
    const dataHash = JSON.stringify(data);
    const contextHash = JSON.stringify(context);
    const optionsHash = JSON.stringify(options);
    return `validation:${schema.constructor.name}:${dataHash}:${contextHash}:${optionsHash}`;
  }
  /**
   * Clear validation cache
   */
  clearCache() {
    this.cache.clear();
    this.logger.debug('Validation cache cleared');
  }
  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
});
exports.ValidationService = ValidationService;
exports.ValidationService =
  ValidationService =
  ValidationService_1 =
    __decorate([(0, common_1.Injectable)()], ValidationService);
