import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TenantContext } from '../../types/tenant/tenant-context.types';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private readonly logger = new Logger(TenantContextService.name);
  private tenantContext: TenantContext | null = null;

  constructor(@Inject(REQUEST) private request: Request) {}

  /**
   * Set tenant context for current request
   */
  setTenantContext(context: TenantContext): void {
    this.tenantContext = context;
    this.logger.debug(`Set tenant context: ${context.tenantId}`);
  }

  /**
   * Get tenant context for current request
   */
  getTenantContext(): TenantContext | null {
    return this.tenantContext;
  }

  /**
   * Get tenant ID for current request
   */
  getTenantId(): string | null {
    return this.tenantContext?.tenantId || null;
  }

  /**
   * Check if tenant context exists
   */
  hasTenantContext(): boolean {
    return this.tenantContext !== null;
  }

  /**
   * Clear tenant context
   */
  clearTenantContext(): void {
    this.tenantContext = null;
    this.logger.debug('Cleared tenant context');
  }

  /**
   * Get user ID from tenant context
   */
  getUserId(): string | null {
    return this.tenantContext?.userId || null;
  }

  /**
   * Get project ID from tenant context
   */
  getProjectId(): string | null {
    return this.tenantContext?.projectId || null;
  }

  /**
   * Get account ID from tenant context
   */
  getAccountId(): string | null {
    return this.tenantContext?.accountId || null;
  }

  /**
   * Update tenant context with additional data
   */
  updateTenantContext(updates: Partial<TenantContext>): void {
    if (this.tenantContext) {
      this.tenantContext = { ...this.tenantContext, ...updates };
      this.logger.debug(`Updated tenant context: ${this.tenantContext.tenantId}`);
    }
  }

  /**
   * Validate tenant context
   */
  validateTenantContext(): boolean {
    if (!this.tenantContext) {
      this.logger.warn('No tenant context available');
      return false;
    }

    if (!this.tenantContext.tenantId) {
      this.logger.warn('Tenant context missing tenantId');
      return false;
    }

    return true;
  }

  /**
   * Get tenant context summary for logging
   */
  getContextSummary(): Record<string, any> {
    if (!this.tenantContext) {
      return { hasContext: false };
    }

    return {
      hasContext: true,
      tenantId: this.tenantContext.tenantId,
      userId: this.tenantContext.userId || 'anonymous',
      projectId: this.tenantContext.projectId || 'none',
      accountId: this.tenantContext.accountId || 'none',
    };
  }
}
