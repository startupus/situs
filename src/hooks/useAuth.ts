import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  token: string | null;
}

interface TokenPayload {
  sub: string;
  email: string;
  name?: string;
  globalRole: string;
  scopes: string[];
  exp: number;
  iat: number;
}

/**
 * Хук для управления состоянием авторизации
 * 
 * Обеспечивает:
 * - Проверку валидности JWT токена
 * - Автоматическую очистку при истечении
 * - Реактивное обновление состояния
 * - Безопасный доступ к данным пользователя
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
  });

  /**
   * Парсинг JWT токена
   */
  const parseToken = useCallback((token: string): TokenPayload | null => {
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
      
      return payload;
    } catch {
      return null;
    }
  }, []);

  /**
   * Очистка данных авторизации
   */
  const clearAuth = useCallback(() => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('situs:sub-id');
      sessionStorage.clear();
    } catch {}
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
    });
  }, []);

  /**
   * Установка данных авторизации
   */
  const setAuth = useCallback((token: string, refreshToken?: string) => {
    const payload = parseToken(token);
    if (!payload) {
      clearAuth();
      return false;
    }

    try {
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('auth_refresh_token', refreshToken);
      }
    } catch {}

    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        globalRole: payload.globalRole,
        scopes: payload.scopes,
      },
      token,
    });

    return true;
  }, [parseToken, clearAuth]);

  /**
   * Проверка авторизации при загрузке
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const payload = parseToken(token);
        if (!payload) {
          clearAuth();
          return;
        }

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            globalRole: payload.globalRole,
            scopes: payload.scopes,
          },
          token,
        });
      } catch (error) {
        console.error('[useAuth] Auth check failed:', error);
        clearAuth();
      }
    };

    checkAuth();
  }, [parseToken, clearAuth]);

  /**
   * Проверка наличия определённого scope
   */
  const hasScope = useCallback((scope: string): boolean => {
    return authState.user?.scopes?.includes(scope) ?? false;
  }, [authState.user?.scopes]);

  /**
   * Проверка роли пользователя
   */
  const hasRole = useCallback((role: string): boolean => {
    return authState.user?.globalRole === role;
  }, [authState.user?.globalRole]);

  /**
   * Проверка, является ли пользователь администратором
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole('SUPER_ADMIN') || hasRole('STAFF');
  }, [hasRole]);

  return {
    ...authState,
    setAuth,
    clearAuth,
    hasScope,
    hasRole,
    isAdmin,
    parseToken,
  };
};

export default useAuth;
