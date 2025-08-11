import React from 'react';
import { ProjectsMain } from '../projects';

/**
 * Страница проектов для админки Situs
 * Использует ProjectsMain - основной компонент списка проектов
 */
const SitusProjects: React.FC = () => {
  return (
    <div className="p-6">
      {/* Заголовок перенесён в верхнюю панель. Здесь оставляем только контент раздела */}
      <ProjectsMain />
    </div>
  );
};

export default SitusProjects;
