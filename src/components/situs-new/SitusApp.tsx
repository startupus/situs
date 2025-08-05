import React from "react";
import { Routes, Route } from "react-router-dom";
import SitusMainLayout from "./layouts/SitusMainLayout";
import SitusDashboard from "./pages/SitusDashboard";
import SitusProjects from "./pages/SitusProjects";
import SitusUsersNew from "./pages/SitusUsersNew";
import SitusAnalytics from "./pages/SitusAnalytics";

/**
 * SitusApp - Главный компонент приложения Situs
 * Обрабатывает роутинг для всех страниц интерфейса
 */
const SitusApp: React.FC = () => {
  console.log("SitusApp (situs-new) component rendered");

  return (
    <Routes>
      <Route path="/" element={<SitusMainLayout />}>
        {/* Главная страница - дашборд */}
        <Route index element={<SitusDashboard />} />
        
        {/* Проекты */}
        <Route path="projects" element={<SitusProjects />} />
        
        {/* Пользователи */}
        <Route path="users" element={<SitusUsersNew />} />
        
        {/* Аналитика */}
        <Route path="analytics" element={<SitusAnalytics />} />
        
        {/* Fallback для несуществующих маршрутов */}
        <Route path="*" element={
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">404 - Страница не найдена</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Запрашиваемая страница не существует</p>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default SitusApp;