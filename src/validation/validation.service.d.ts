import { z } from 'zod';
import { ValidationResult, ValidationOptions, TenantAwareValidationContext } from '../types/shared';
export declare class ValidationService {
  private readonly logger;
  private readonly cache;
  private readonly CACHE_TTL;
  /**
   * Validate data against Zod schema
   */
  validate<T>(schema: z.ZodSchema<T>, data: unknown, options?: ValidationOptions): ValidationResult<T>;
  /**
   * Validate with tenant context
   */
  validateWithTenantContext<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context: TenantAwareValidationContext,
    options?: ValidationOptions,
  ): Promise<ValidationResult<T>>;
  /**
   * Transform data using schema
   */
  transform<T>(schema: z.ZodSchema<T>, data: unknown, options?: ValidationOptions): T;
  /**
   * Safe transform with error handling
   */
  safeTransform<T>(schema: z.ZodSchema<T>, data: unknown, options?: ValidationOptions): ValidationResult<T>;
  /**
   * Validate tenant access
   */
  private validateTenantAccess;
  /**
   * Create custom error map for Zod
   */
  private createErrorMap;
  /**
   * Generate cache key
   */
  private generateCacheKey;
  /**
   * Clear validation cache
   */
  clearCache(): void;
  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    entries: string[];
  };
}
//# sourceMappingURL=validation.service.d.ts.map
