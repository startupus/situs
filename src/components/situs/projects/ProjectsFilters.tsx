import React from 'react';

interface ProjectsFiltersProps {
  onCreateProject: () => void;
}

const ProjectsFilters: React.FC<ProjectsFiltersProps> = ({
  onCreateProject
}) => {
  return (
    <div className="mb-6">
      {/* Только кнопка создания проекта */}
      <div className="flex justify-end">
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
            <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z"/>
          </svg>
          Создать проект
        </button>
      </div>
    </div>
  );
};

export default ProjectsFilters;
