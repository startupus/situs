import React from 'react';

const ProjectSettingsPlaceholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="p-6">
      {/* Заголовок раздела выводится в верхней панели (SitusHeader). Здесь избегаем дублирования. */}
      <p className="text-body-color dark:text-dark-6">Раздел находится в разработке.</p>
    </div>
  );
};

export default ProjectSettingsPlaceholder;
