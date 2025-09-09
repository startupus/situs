import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Страница выхода из системы.
 * Очищает локальные токены и перенаправляет пользователя на страницу логина.
 */
const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    try {
      // Удаляем все аутентификационные маркеры клиента
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      // Удаляем вспомогательные локальные значения, если они использовались
      localStorage.removeItem('situs:sub-id');
    } catch {}

    // Готовим редирект на логин (сохранение next при наличии)
    const next = params.get('next');
    const query = next ? `?next=${encodeURIComponent(next)}` : '';
    navigate(`/login${query}`, { replace: true });
  }, [navigate, params]);

  // Минимальный UI на время мгновенного редиректа
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
      Выход...
    </div>
  );
};

export default LogoutPage;


