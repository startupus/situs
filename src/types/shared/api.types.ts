/**
 * API-related type definitions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  error?: ApiError;
  metadata?: ApiMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ApiMetadata {
  timestamp: Date;
  requestId: string;
  version: string;
  tenantId?: string;
  userId?: string;
  executionTime?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  headers: Record<string, string>;
  query: Record<string, any>;
  body?: any;
  tenantId?: string;
  userId?: string;
}

export interface ApiEndpoint {
  path: string;
  method: string;
  handler: string;
  middleware: string[];
  guards: string[];
  roles: string[];
  permissions: string[];
}

export interface ApiValidationError {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
}

export interface ApiRateLimit {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}
