import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SitusMainLayout from './layouts/SitusMainLayout';
import SitusDashboard from './pages/SitusDashboard';
import SitusProjects from './pages/SitusProjects';
import SitusWebsites from './pages/SitusWebsites';
import SitusStores from './pages/SitusStores';
import SitusChatbots from './pages/SitusChatbots';
import SitusOrders from './pages/SitusOrders';
import SitusMarketing from './pages/SitusMarketing';
import SitusUsers from './pages/SitusUsers';
import SitusUsersNew from './pages/SitusUsersNew';
import SitusSupport from './pages/SitusSupport';
import SitusProfileSettings from './pages/SitusProfileSettings';
import SitusSectionSettings from './pages/SitusSectionSettings';
import AppearanceDemoPage from './pages/settings/AppearanceDemoPage';
import ProjectPage from './projects/ProjectPage';

import SitusProjectPages from './pages/SitusProjectPages';
import SitusProjectPagesSettings from './pages/SitusProjectPagesSettings';
import SitusProjectStore from './pages/SitusProjectStore';
import MenuManager from '../admin/MenuManager';
import AcceptInvitation from './pages/AcceptInvitation';
import { LoginPage } from '../../auth/LoginPage';
import ForgotPassword from '../auth/ForgotPassword';
import Register from '../auth/Register';
import ProjectSettingsPlaceholder from './projects/settings/ProjectSettingsPlaceholder';
import ProjectThemeManager from './projects/settings/ProjectThemeManager';
import ProjectIntegrationsPage from './projects/settings/ProjectIntegrationsPage';

const SitusApp: React.FC = () => {
  console.log('SitusApp component rendered');

  return (
    <Routes>
      {/* Публичные страницы (без layout) */}
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<SitusMainLayout />}>
        {/* Главная страница - дашборд */}
        <Route index element={<SitusDashboard />} />

        {/* Проекты */}
        <Route path="projects" element={<SitusProjects />} />
        <Route path="projects/:projectId" element={<ProjectPage />} />
        <Route path="projects/:projectId/pages" element={<SitusProjectPages />} />
        <Route path="projects/:projectId/pages/settings" element={<SitusProjectPagesSettings />} />
        <Route path="projects/:projectId/store" element={<SitusProjectStore />} />
        <Route path="projects/:projectId/menus" element={<MenuManager />} />
        <Route path="projects/:projectId/settings" element={<ProjectSettingsPlaceholder title="Настройки проекта" />} />
        <Route path="projects/:projectId/settings/menu" element={<MenuManager />} />
        <Route path="projects/:projectId/settings/seo" element={<ProjectSettingsPlaceholder title="SEO настройки" />} />
        <Route
          path="projects/:projectId/settings/domain"
          element={<ProjectSettingsPlaceholder title="Домен и публикация" />}
        />
        <Route path="projects/:projectId/settings/theme" element={<ProjectThemeManager />} />
        <Route path="projects/:projectId/settings/integrations" element={<ProjectIntegrationsPage />} />
        <Route
          path="projects/:projectId/settings/team"
          element={<ProjectSettingsPlaceholder title="Команда проекта" />}
        />
        <Route
          path="projects/:projectId/settings/access"
          element={<ProjectSettingsPlaceholder title="Доступ и роли" />}
        />
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

        {/* Демо-страница компонентов (без layout настроек) */}
        <Route path="demo/components" element={<AppearanceDemoPage />} />

        {/* Fallback для несуществующих маршрутов */}
        <Route
          path="*"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-dark dark:text-white">404 - Страница не найдена</h1>
              <p className="text-body-color dark:text-dark-6 mt-2">Запрашиваемая страница не существует</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default SitusApp;
