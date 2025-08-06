import React from 'react';

interface ProjectsFiltersProps {
  selectedType: string;
  searchTerm: string;
  onTypeChange: (type: string) => void;
  onSearchChange: (search: string) => void;
  onCreateProject: () => void;
}

const ProjectsFilters: React.FC<ProjectsFiltersProps> = ({
  selectedType,
  searchTerm,
  onTypeChange,
  onSearchChange,
  onCreateProject
}) => {
  const projectTypes = [
    { 
      id: 'all', 
      name: 'Все проекты', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M2 2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2H2ZM2 3H14V13H2V3Z"/>
          <path d="M4 4H12V6H4V4ZM4 8H12V10H4V8ZM4 12H8V14H4V12Z"/>
        </svg>
      )
    },
    { 
      id: 'website', 
      name: 'Сайты', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3C10.7614 3 13 5.23858 13 8C13 10.7614 10.7614 13 8 13Z"/>
          <path d="M6 6H10V8H6V6ZM6 10H10V12H6V10Z"/>
        </svg>
      )
    },
    { 
      id: 'store', 
      name: 'Магазины', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M2 2V4H3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V4H14V2H2ZM4 4H12V13H4V4Z"/>
          <path d="M6 6V8H7V6H6ZM9 6V8H10V6H9Z"/>
        </svg>
      )
    },
    { 
      id: 'landing', 
      name: 'Лендинги', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M3 3H13V5H3V3ZM3 7H13V9H3V7ZM3 11H13V13H3V11ZM3 15H13V17H3V15Z"/>
        </svg>
      )
    },
    { 
      id: 'blog', 
      name: 'Блоги', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M2 2C2 1.44772 2.44772 1 3 1H13C13.5523 1 14 1.44772 14 2V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 2 14.5523 2 14V2ZM4 4V12H12V4H4Z"/>
          <path d="M6 6H10V8H6V6ZM6 10H10V12H6V10Z"/>
        </svg>
      )
    },
    { 
      id: 'app', 
      name: 'Приложения', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M5 2H11C12.1046 2 13 2.89543 13 4V12C13 13.1046 12.1046 14 11 14H5C3.89543 14 3 13.1046 3 12V4C3 2.89543 3.89543 2 5 2ZM5 4V12H11V4H5Z"/>
          <path d="M6 5H10V7H6V5ZM6 9H10V11H6V9Z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Заголовок и кнопка создания */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Проекты
          </h1>
          <p className="text-body-color dark:text-dark-6 mt-1">
            Управляйте всеми своими проектами в одном месте
          </p>
        </div>
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

      {/* Поиск */}
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск проектов..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 fill-current text-body-color dark:text-dark-6"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
      </div>

      {/* Фильтры по типам */}
      <div className="flex flex-wrap gap-2">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === type.id
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-2 text-body-color dark:text-dark-6 border border-stroke dark:border-dark-3 hover:border-primary dark:hover:border-primary'
            }`}
          >
            <span className="flex-shrink-0">{type.icon}</span>
            <span>{type.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectsFilters;
