import { registerAs } from '@nestjs/config';

export type ProjectRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
export type AccountRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER';

export const accessConfig = registerAs('access', () => ({
  project: {
    read: ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'] as ProjectRole[],
    write: ['OWNER', 'ADMIN', 'EDITOR'] as ProjectRole[],
    admin: ['OWNER', 'ADMIN'] as ProjectRole[],
  },
  account: {
    read: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER'] as AccountRole[],
    write: ['OWNER', 'ADMIN', 'MANAGER'] as AccountRole[],
    admin: ['OWNER', 'ADMIN'] as AccountRole[],
  },
}));
