 
import { Routes, Route, Navigate } from 'react-router-dom';
import SitusLayout from './dashy/layouts/SitusLayout';
import SitusDashboard from './dashy/pages/SitusDashboard';
import ProjectsList from './dashy/pages/ProjectsList';

const TaildashProjectWorkspace: React.FC = () => {
  return (
    <SitusLayout>
      <Routes>
        {/* Главная страница - дашборд */}
        <Route path="/" element={<SitusDashboard />} />
        
        {/* Список проектов */}
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/all" element={<ProjectsList />} />
        
        {/* Редирект по умолчанию на дашборд */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SitusLayout>
  );
};

export default TaildashProjectWorkspace;
