import React, { useEffect, useState } from 'react';
import { FiSave, FiEye, FiGlobe, FiClock, FiArrowLeft } from 'react-icons/fi';

// Redaktus Editor - НАГЛО СКОПИРОВАНО С REACTBRICKS!

// Импортируем скопированные админские компоненты (исправленные пути)
import AdminEditor from '../redaktus/admin/editor';
import AdminLogin from '../redaktus/admin/index';
import AdminPlayground from '../redaktus/admin/playground';
import AdminMedia from '../redaktus/admin/media';
import AdminAppSettings from '../redaktus/admin/app-settings';

// Импортируем конфигурацию
import config from '../redaktus/config/config';

// Импортируем главный провайдер из starter
import RedaktusApp from '../redaktus/starter-components/RedaktusApp';

// Интеграция с проектами
import { useProject } from '../../contexts/ProjectContext';
import { useAutoSave } from '../../hooks/useAutoSave';

interface RedaktusEditorProps {
  mode?: 'editor' | 'login' | 'playground' | 'media' | 'app-settings';
  onBack?: () => void;
}

const RedaktusEditor: React.FC<RedaktusEditorProps> = ({ mode = 'editor', onBack }) => {
  const { currentPage, currentProject, savePage, updatePage } = useProject();
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Автосохранение для текущего контента страницы
  const { isSaving, saveNow } = useAutoSave(currentPage?.content || {}, {
    onSave: async (content: any) => {
      if (currentPage) {
        await savePage(currentPage.id, content);
        setLastSaved(new Date());
      }
    },
    delay: 3000,
    enabled: isAutoSaveEnabled && !!currentPage,
  });

  console.log('RedaktusEditor render - mode:', mode);
  console.log('RedaktusEditor config:', config);
  console.log('Current page:', currentPage);

  // Ручное сохранение
  const handleManualSave = async () => {
    if (currentPage) {
      await saveNow();
    }
  };

  // Публикация страницы
  const handlePublish = async () => {
    if (currentPage && currentPage.status === 'draft') {
      await updatePage(currentPage.id, {
        status: 'published',
        publishedAt: new Date(),
      });
    }
  };

  // Роутинг как в ReactBricks
  const renderAdminComponent = () => {
    console.log('renderAdminComponent called - mode:', mode);

    switch (mode) {
      case 'login':
        console.log('Rendering AdminLogin');
        return <AdminLogin />;
      case 'playground':
        console.log('Rendering AdminPlayground');
        return <AdminPlayground />;
      case 'media':
        console.log('Rendering AdminMedia');
        return <AdminMedia />;
      case 'app-settings':
        console.log('Rendering AdminAppSettings');
        return <AdminAppSettings />;
      default:
        console.log('Rendering AdminEditor (default)');
        return (
          <div className="h-full flex flex-col">
            {/* Топ-бар редактора */}
            {currentPage && (
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {onBack && (
                    <button
                      onClick={onBack}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Назад к проекту"
                    >
                      <FiArrowLeft className="w-5 h-5" />
                    </button>
                  )}

                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{currentPage.title}</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>/{currentPage.slug}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        {currentPage.status === 'published' ? (
                          <>
                            <FiGlobe className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">Опубликовано</span>
                          </>
                        ) : (
                          <>
                            <FiClock className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-600 dark:text-yellow-400">Черновик</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Статус автосохранения */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {isSaving ? (
                      <span>Сохранение...</span>
                    ) : lastSaved ? (
                      <span>Сохранено в {lastSaved.toLocaleTimeString()}</span>
                    ) : null}
                  </div>

                  {/* Кнопка предпросмотра */}
                  <button
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Предпросмотр"
                  >
                    <FiEye className="w-4 h-4" />
                    <span className="text-sm">Предпросмотр</span>
                  </button>

                  {/* Кнопка сохранения */}
                  <button
                    onClick={handleManualSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                    title="Сохранить"
                  >
                    <FiSave className="w-4 h-4" />
                    <span className="text-sm">Сохранить</span>
                  </button>

                  {/* Кнопка публикации */}
                  {currentPage.status === 'draft' && (
                    <button
                      onClick={handlePublish}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                      title="Опубликовать страницу"
                    >
                      <FiGlobe className="w-4 h-4" />
                      <span className="text-sm">Опубликовать</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Редактор */}
            <div className="flex-1">
              <AdminEditor />
            </div>
          </div>
        );
    }
  };

  console.log('About to render RedaktusApp');
  return (
    <RedaktusApp
      Component={() => {
        console.log('RedaktusApp Component function called');
        return renderAdminComponent();
      }}
      pageProps={{}}
    />
  );
};

export default RedaktusEditor;
