import React from "react";
import { Routes, Route } from "react-router-dom";
import SitusMainLayout from "./layouts/SitusMainLayout";
import SitusDashboard from "./pages/SitusDashboard";
import SitusProjects from "./pages/SitusProjects";
import SitusWebsites from "./pages/SitusWebsites";
import SitusStores from "./pages/SitusStores";
import SitusChatbots from "./pages/SitusChatbots";
import SitusOrders from "./pages/SitusOrders";
import SitusMarketing from "./pages/SitusMarketing";
import SitusUsers from "./pages/SitusUsers";
import SitusUsersNew from "./pages/SitusUsersNew";
import SitusSupport from "./pages/SitusSupport";
import SitusProfileSettings from "./pages/SitusProfileSettings";
import SitusSectionSettings from "./pages/SitusSectionSettings";
import ProjectPage from "./projects/ProjectPage";
import SitusProjectWebsite from "./pages/SitusProjectWebsite";

const SitusApp: React.FC = () => {
  console.log("SitusApp component rendered");

  return (
    <Routes>
      <Route path="/" element={<SitusMainLayout />}>
        {/* Главная страница - дашборд */}
        <Route index element={<SitusDashboard />} />
        
        {/* Проекты */}
        <Route path="projects" element={<SitusProjects />} />
        <Route path="projects/:projectId" element={<ProjectPage />} />
        <Route path="projects/:projectId/website" element={<SitusProjectWebsite />} />
        <Route path="projects/websites" element={<SitusWebsites />} />
        <Route path="projects/stores" element={<SitusStores />} />
        <Route path="projects/chatbots" element={<SitusChatbots />} />
        
        {/* Заказы */}
        <Route path="orders" element={<SitusOrders />} />
        
        {/* Маркетинг */}
        <Route path="marketing" element={<SitusMarketing />} />
        
        {/* Пользователи */}
        <Route path="users" element={<SitusUsers />} />
        <Route path="users/new" element={<SitusUsersNew />} />
        
        {/* Поддержка */}
        <Route path="support" element={<SitusSupport />} />
        
        {/* Настройки */}
        <Route path="profile-settings" element={<SitusProfileSettings />} />
        <Route path="section-settings/*" element={<SitusSectionSettings />} />
        
        {/* Fallback для несуществующих маршрутов */}
        <Route path="*" element={
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-dark dark:text-white">404 - Страница не найдена</h1>
            <p className="text-body-color dark:text-dark-6 mt-2">Запрашиваемая страница не существует</p>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default SitusApp; 