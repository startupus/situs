/**
 * Validation-related type definitions
 */

import { z } from 'zod';

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  path?: (string | number)[];
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationOptions {
  strict?: boolean;
  abortEarly?: boolean;
  allowUnknown?: boolean;
  stripUnknown?: boolean;
  context?: Record<string, any>;
}

export interface ValidationSchema<T = any> {
  validate: (data: unknown, options?: ValidationOptions) => ValidationResult<T>;
  parse: (data: unknown, options?: ValidationOptions) => T;
  safeParse: (data: unknown, options?: ValidationOptions) => ValidationResult<T>;
}

export interface TenantAwareValidationContext {
  tenantId: string;
  userId?: string;
  projectId?: string;
  accountId?: string;
  permissions?: string[];
  role?: string;
}

export interface ValidationRule<T = any> {
  name: string;
  schema: z.ZodSchema<T>;
  message?: string;
  transform?: (data: T) => T;
  validate?: (data: T, context: TenantAwareValidationContext) => Promise<boolean>;
}

export interface ValidationPipeline<T = any> {
  rules: ValidationRule<T>[];
  execute: (data: unknown, context: TenantAwareValidationContext) => Promise<ValidationResult<T>>;
}

export interface ValidationCache {
  get: (key: string) => ValidationResult | null;
  set: (key: string, result: ValidationResult, ttl?: number) => void;
  clear: () => void;
  stats: () => { hits: number; misses: number; size: number };
}
