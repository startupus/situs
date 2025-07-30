import React, { ReactNode } from 'react';
import { User, AuthCredentials, CreateUserData } from '../api/services/users.api';
interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (userData: CreateUserData) => Promise<void>;
    logout: () => void;
    updateProfile: (profileData: any) => Promise<void>;
    uploadAvatar: (file: File) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}
export declare const UserProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useUser: () => UserContextType;
export {};
//# sourceMappingURL=UserContext.d.ts.map