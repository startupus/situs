import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  globalRole: string;
  scopes: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, refreshToken?: string) => boolean;
  logout: () => void;
  hasScope: (scope: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Глобальный провайдер авторизации
 * 
 * Управляет состоянием авторизации на уровне всего приложения.
 * Обеспечивает строгую проверку токенов и автоматическую очистку при истечении.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Парсинг JWT токена
   */
  const parseToken = (token: string): AuthUser | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Валидация обязательных полей
      if (!payload.sub || !payload.email || !payload.exp) {
        return null;
      }
      
      // Проверка срока действия
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        return null;
      }
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        globalRole: payload.globalRole || 'BUSINESS',
        scopes: payload.scopes || [],
      };
    } catch {
      return null;
    }
  };

  /**
   * Очистка данных авторизации
   */
  const clearAuth = () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('situs:sub-id');
      sessionStorage.clear();
    } catch {}
    
    setUser(null);
    setError(null);
  };

  /**
   * Установка авторизации
   */
  const login = (token: string, refreshToken?: string): boolean => {
    const userData = parseToken(token);
    if (!userData) {
      setError('Недействительный токен авторизации');
      clearAuth();
      return false;
    }

    try {
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('auth_refresh_token', refreshToken);
      }
    } catch {}

    setUser(userData);
    setError(null);
    return true;
  };

  /**
   * Выход из системы
   */
  const logout = () => {
    clearAuth();
  };

  /**
   * Проверка наличия scope
   */
  const hasScope = (scope: string): boolean => {
    return user?.scopes?.includes(scope) ?? false;
  };

  /**
   * Проверка роли
   */
  const hasRole = (role: string): boolean => {
    return user?.globalRole === role;
  };

  /**
   * Проверка административных прав
   */
  const isAdmin = (): boolean => {
    return hasRole('SUPER_ADMIN') || hasRole('STAFF');
  };

  /**
   * Инициализация авторизации при загрузке
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const userData = parseToken(token);
        if (!userData) {
          console.warn('[AuthContext] Invalid token found, clearing');
          clearAuth();
          setIsLoading(false);
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error('[AuthContext] Auth initialization failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Автоматическая проверка истечения токена
   */
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiry = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        logout();
        return;
      }

      const userData = parseToken(token);
      if (!userData) {
        console.warn('[AuthContext] Token expired, logging out');
        logout();
      }
    };

    // Проверяем каждую минуту
    const interval = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    hasScope,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Хук для использования контекста авторизации
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
