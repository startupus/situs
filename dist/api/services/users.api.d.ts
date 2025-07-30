/**
 * Users API Service
 * Управление пользователями, аутентификация и профили
 */
import { User, UserRole, UserStatus } from '../../types/users';
export interface UserProfile {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    company?: string;
    position?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        instagram?: string;
    };
}
export interface UserBalance {
    amount: number;
    currency: string;
    symbol: string;
}
export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}
export interface UpdateUserData {
    username?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    profile?: Partial<UserProfile>;
}
export interface UserFilters {
    search?: string;
    role?: string;
    status?: string;
    sortBy?: 'username' | 'email' | 'created' | 'updated';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface UsersListResponse {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface AuthCredentials {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: User;
    token: string;
    expiresIn: number;
}
declare class UsersApiService {
    private readonly baseEndpoint;
    private readonly authEndpoint;
    /**
     * Аутентификация пользователя
     */
    login(credentials: AuthCredentials): Promise<AuthResponse>;
    /**
     * Регистрация нового пользователя
     */
    register(userData: CreateUserData): Promise<AuthResponse>;
    /**
     * Выход из системы
     */
    logout(): void;
    /**
     * Получить текущего пользователя
     */
    getCurrentUser(): Promise<User>;
    /**
     * Получить список пользователей
     */
    getUsers(filters?: UserFilters): Promise<UsersListResponse>;
    /**
     * Получить отдельного пользователя
     */
    getUser(userId: string): Promise<User>;
    /**
     * Создать нового пользователя
     */
    createUser(data: CreateUserData): Promise<User>;
    /**
     * Обновить пользователя
     */
    updateUser(userId: string, data: UpdateUserData): Promise<User>;
    /**
     * Обновить профиль пользователя
     */
    updateProfile(data: Partial<UserProfile>): Promise<User>;
    /**
     * Удалить пользователя
     */
    deleteUser(userId: string): Promise<void>;
    /**
     * Обновить статус пользователя
     */
    updateUserStatus(userId: string, status: UserStatus): Promise<void>;
    /**
     * Загрузить аватар
     */
    uploadAvatar(file: File): Promise<{
        url: string;
    }>;
    /**
     * Сменить пароль
     */
    changePassword(currentPassword: string, newPassword: string): Promise<void>;
}
export declare const usersApi: UsersApiService;
export default usersApi;
//# sourceMappingURL=users.api.d.ts.map