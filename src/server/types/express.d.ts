import type { TenantContext } from '../../types/tenant/tenant-context.types';
import type { TenantInfo } from '../tenant/tenant.decorator';

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantInfo;
      tenantContext?: TenantContext;
    }
  }
}

export {};
