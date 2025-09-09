import React, { useEffect, useState } from 'react';
import SitusSidebar from '../Sidebar/SitusSidebar';
import SitusHeader from '../Header/SitusHeader';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';

interface SitusMainLayoutProps {}

const SitusMainLayout: React.FC<SitusMainLayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Редирект на страницу логина, если пользователь не авторизован
  const tokenMissing = (() => {
    try {
      const accessToken = localStorage.getItem('auth_token');
      return !accessToken;
    } catch {
      return true;
    }
  })();
  if (tokenMissing) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return (
    <>
      <div className="relative flex min-h-screen w-full items-start">
        <SitusSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="w-full xl:pl-[90px]">
          <SitusHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Базовый унифицированный внутренний отступ шапки/контента */}
          <div className="px-6 pt-6 pb-6">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default SitusMainLayout;
