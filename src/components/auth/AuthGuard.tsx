import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

interface TokenPayload {
  sub: string;
  email: string;
  globalRole: string;
  scopes: string[];
  exp: number;
}

/**
 * Строгая защита авторизации - МГНОВЕННЫЙ редирект без показа контента
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  
  // Синхронная проверка токена - БЕЗ состояния loading
  const isAuthenticated = (() => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;
      
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Проверка обязательных полей
      if (!payload.sub || !payload.email || !payload.exp) return false;
      
      // Проверка срока действия
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        // Токен истёк - очищаем
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        return false;
      }
      
      // Проверка минимальных прав
      if (!payload.scopes?.includes('PROJECT_READ')) return false;
      
      return true;
    } catch {
      // При любой ошибке парсинга - очищаем токены
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
      } catch {}
      return false;
    }
  })();

  // МГНОВЕННЫЙ редирект без рендера контента
  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // Рендерим контент ТОЛЬКО при валидной авторизации
  return <>{children}</>;
};

export default AuthGuard;