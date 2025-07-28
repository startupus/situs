import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usersApi, User, AuthCredentials, CreateUserData } from '../api/services/users.api';
import { ApiUtils } from '../api/client';

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

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const currentUser = await usersApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        // Токен недействителен, удаляем его
        localStorage.removeItem('auth_token');
        console.log('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const authResponse = await usersApi.login(credentials);
      setUser(authResponse.user);
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: CreateUserData) => {
    setLoading(true);
    setError(null);
    
    try {
      const authResponse = await usersApi.register(userData);
      setUser(authResponse.user);
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    usersApi.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData: any) => {
    setError(null);
    
    try {
      const updatedUser = await usersApi.updateProfile(profileData);
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    setError(null);
    
    try {
      const result = await usersApi.uploadAvatar(file);
      if (user) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            avatar: result.url
          }
        });
      }
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setError(null);
    
    try {
      await usersApi.changePassword(currentPassword, newPassword);
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const value: UserContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    changePassword
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 