export type UserRole = 'super_admin' | 'company_admin' | 'admin' | 'moderator' | 'editor' | 'client';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export interface UserPermission {
    id: string;
    name: string;
    description: string;
    category: 'projects' | 'users' | 'orders' | 'marketing' | 'settings' | 'reports';
}
export interface Role {
    id: string;
    name: UserRole;
    displayName: string;
    description: string;
    permissions: string[];
    level: number;
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    isEmailVerified: boolean;
    phone?: string;
    company?: string;
    position?: string;
    notes?: string;
    projectsCount: number;
    ordersCount: number;
    permissions: string[];
    clientInfo?: {
        balance: number;
        currency: string;
        totalSpent: number;
        registrationSource: string;
    };
}
export interface UserFilters {
    role?: UserRole | 'all';
    status?: UserStatus | 'all';
    search?: string;
    company?: string;
    dateFrom?: Date;
    dateTo?: Date;
}
export interface UserStats {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    pending: number;
    byRole: Record<UserRole, number>;
    newThisMonth: number;
    newThisWeek: number;
}
export interface UserForm {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    phone?: string;
    company?: string;
    position?: string;
    notes?: string;
    permissions?: string[];
    password?: string;
    sendWelcomeEmail?: boolean;
}
//# sourceMappingURL=users.d.ts.map