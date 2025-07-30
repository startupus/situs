import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import RedaktusEditor from './legacy/RedaktusEditor';

interface ProjectEditorViewProps {
  onBack: () => void;
}

const ProjectEditorView: React.FC<ProjectEditorViewProps> = ({ onBack }) => {
  const { currentPage, currentProject } = useProject();

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Проект не найден
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Не удалось загрузить данные проекта
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться к проектам
          </button>
        </div>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Страница не выбрана
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Выберите страницу для редактирования
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться к проекту
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RedaktusEditor 
        mode="editor" 
        onBack={onBack}
      />
    </div>
  );
};

export default ProjectEditorView; 