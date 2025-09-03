import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersApi } from '../../../api/services/users.api';

type UserMenuItem = { title: string; to: string; params?: any };

const UserMenuList: React.FC = () => {
  const [items, setItems] = useState<UserMenuItem[]>([]);
  const [userName, setUserName] = useState<string>('Администратор Системы');
  const [userRole, setUserRole] = useState<string>('Системный администратор');
  const [avatar, setAvatar] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    let aborted = false;
    (async () => {
      // Загружаем реального пользователя для шапки меню
      try {
        const me = await usersApi.getCurrentUser();
        const profile =
          (me as any)?.profile && typeof (me as any).profile === 'object' ? (me as any).profile : undefined;
        const name = (me as any)?.name || profile?.name || (me as any)?.username || 'Пользователь';
        setUserName(name);
        const roleMap: Record<string, string> = {
          SUPER_ADMIN: 'Супер администратор',
          STAFF: 'Сотрудник',
          AGENCY: 'Агентство',
          BUSINESS: 'Бизнес пользователь',
        };
        setUserRole(roleMap[(me as any)?.globalRole] || 'Пользователь');
        const avatarUrl =
          (me as any)?.avatar ||
          profile?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
        setAvatar(avatarUrl);
      } catch {}

      try {
        const res = await fetch('/api/ui/admin-user');
        const json = await res.json();
        if (!aborted && json?.success && Array.isArray(json.data)) {
          setItems(json.data as UserMenuItem[]);
        }
      } catch {
        if (!aborted)
          setItems([
            { title: 'Уведомления', to: '/profile-settings?tab=notifications' },
            { title: 'Настройки профиля', to: '/profile-settings' },
            { title: 'Дашборд', to: '/' },
            { title: 'Выйти', to: '/auth/logout', params: { action: 'logout' } },
          ]);
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  const onClickItem = (item: UserMenuItem) => (e: React.MouseEvent) => {
    if (item?.params?.action === 'logout') {
      e.preventDefault();
      usersApi.logout();
      navigate('/');
      return;
    }
  };

  return (
    <>
      <div className="px-3 py-2 border-b border-stroke dark:border-dark-3">
        <div>
          <div className="text-sm font-medium text-dark dark:text-white truncate max-w-[180px]">{userName}</div>
          <div className="text-xs text-body-color dark:text-dark-6 truncate max-w-[180px]">{userRole}</div>
        </div>
      </div>
      <ul className="py-2 text-sm">
        {items.map((item, index) => (
          <li key={index}>
            <Link
              to={item.to || '#'}
              onClick={onClickItem(item)}
              className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-3"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserMenuList;
