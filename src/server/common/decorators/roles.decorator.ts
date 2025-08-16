import { SetMetadata } from '@nestjs/common';

export type GlobalRole = 'SUPER_ADMIN' | 'STAFF' | 'AGENCY' | 'BUSINESS';
export type ProjectScope = 'PROJECT_READ' | 'PROJECT_WRITE' | 'PROJECT_ADMIN';
export type AccountScope = 'ACCOUNT_READ' | 'ACCOUNT_WRITE' | 'ACCOUNT_ADMIN';

export const ROLES_KEY = 'roles';
export const SCOPES_KEY = 'scopes';

export const Roles = (...roles: GlobalRole[]) => SetMetadata(ROLES_KEY, roles);
export const Scopes = (...scopes: Array<ProjectScope | AccountScope>) => SetMetadata(SCOPES_KEY, scopes);