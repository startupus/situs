import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SitusSidebar from '../../situs/Sidebar/SitusSidebar';
import SitusHeader from '../../situs/Header/SitusHeader';

/**
 * SitusMainLayout - Главный лейаут приложения Situs
 * Включает боковую панель навигации, хедер и область контента
 */
const SitusMainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Боковая панель */}
      <SitusSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Основная область */}
      <div className="lg:pl-64">
        {/* Хедер */}
        <SitusHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Контент */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SitusMainLayout;