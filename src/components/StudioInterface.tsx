import React, { useState } from 'react';
import { useSite } from '../contexts/SiteContext';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useCanvasTheme } from '../hooks/useCanvasTheme';

export function StudioInterface() {
  const { state, actions } = useSite();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const { theme: canvasTheme, resolvedTheme: canvasResolvedTheme, toggleTheme: toggleCanvasTheme } = useCanvasTheme();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка Redaktus Studio...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Ошибка</div>
          <p className="text-gray-600 dark:text-gray-400">{state.error}</p>
          <button
            onClick={() => actions.loadSites()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      resolvedTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Верхняя панель */}
      <header className={`border-b transition-colors duration-200 ${
        resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Redaktus Studio</h1>
            {state.currentSite && (
              <div className="text-sm text-gray-500">
                {state.currentSite.name}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Переключатель языка */}
            <button
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>{language === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Переключатель темы интерфейса */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Переключить тему интерфейса"
            >
              {resolvedTheme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Переключатель темы канваса */}
            <button
              onClick={toggleCanvasTheme}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Переключить тему канваса"
            >
              {canvasResolvedTheme === 'dark' ? '🎨🌙' : '🎨☀️'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Левая панель - сайты и страницы */}
        <aside className={`w-80 border-r transition-colors duration-200 ${
          resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Проекты</h2>
            
            {/* Список сайтов */}
            <div className="space-y-2 mb-6">
              {state.sites.map((site) => (
                <div
                  key={site.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    state.currentSite?.id === site.id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    actions.selectSite(site.id);
                    setIsEditMode(false); // Сбрасываем режим редактирования при смене сайта
                  }}
                >
                  <div className="font-medium">{site.name}</div>
                  <div className="text-sm text-gray-500">{site.domain || 'Нет домена'}</div>
                  <div className="text-xs text-gray-400">{site.pages.length} страниц</div>
                </div>
              ))}
            </div>

            {/* Список страниц текущего сайта */}
            {state.currentSite && (
              <div>
                <h3 className="text-md font-semibold mb-3">Страницы</h3>
                <div className="space-y-1">
                  {state.currentSite.pages.map((page) => (
                    <div
                      key={page.id}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        state.currentPage?.id === page.id
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        actions.selectPage(page.id);
                        setIsEditMode(false); // По умолчанию показываем просмотр
                      }}
                    >
                      <div className="font-medium text-sm">{page.title}</div>
                      <div className="text-xs text-gray-500">
                        {page.isHomePage ? '🏠 Главная' : `/${page.slug}`}
                      </div>
                    </div>
                  ))}
                  
                  {/* Кнопка добавления страницы */}
                  <button
                    onClick={() => {
                      const title = prompt('Название страницы:');
                      const slug = prompt('URL slug:');
                      if (title && slug) {
                        actions.createPage({
                          title,
                          slug,
                          content: [],
                          isHomePage: false,
                          isPublished: false
                        });
                      }
                    }}
                    className="w-full p-2 mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
                  >
                    + Добавить страницу
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Основная область - канвас */}
        <main className="flex-1 flex flex-col">
          {/* Тулбар канваса */}
          <div className={`border-b p-3 transition-colors duration-200 ${
            resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {state.currentPage && (
                  <div>
                    <span className="font-medium">{state.currentPage.title}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({state.currentPage.isHomePage ? 'Главная' : state.currentPage.slug})
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {state.currentPage && (
                  <>
                    {isEditMode ? (
                      <>
                        <button 
                          onClick={() => setIsEditMode(false)}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
                        >
                          👁️ Просмотр
                        </button>
                        <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 rounded">💻 Desktop</button>
                        <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded">📱 Mobile</button>
                        <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded">🖥️ Tablet</button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => setIsEditMode(true)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          ✏️ Редактировать
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Канвас редактирования */}
          <div 
            className={`flex-1 redaktus-canvas transition-colors duration-200 ${
              canvasResolvedTheme === 'dark' ? 'dark' : ''
            }`}
            style={{
              backgroundColor: canvasResolvedTheme === 'dark' ? '#111827' : '#ffffff',
              color: canvasResolvedTheme === 'dark' ? '#f9fafb' : '#1f2937',
              colorScheme: canvasResolvedTheme === 'dark' ? 'dark' : 'light'
            }}
          >
            <div className="h-full overflow-y-auto p-8">
              {state.currentPage ? (
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold mb-8">{state.currentPage.title}</h1>
                  
                  {/* Отображение контента страницы */}
                  {state.currentPage.content.length > 0 ? (
                    <div className="space-y-6">
                      {state.currentPage.content.map((block) => (
                        <div 
                          key={block.id} 
                          className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                            canvasResolvedTheme === 'dark' 
                              ? 'border-gray-600 bg-gray-800' 
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          <div className="text-sm text-gray-500 mb-2">
                            Блок: {block.type}
                          </div>
                          {block.type === 'hero-unit' && (
                            <div>
                              <h2 className="text-2xl font-bold mb-4">{block.props.title}</h2>
                              <p className="text-lg">{block.props.text}</p>
                            </div>
                          )}
                          {block.type === 'text-content' && (
                            <div>
                              {block.props.title && (
                                <h3 className="text-xl font-semibold mb-2">{block.props.title}</h3>
                              )}
                              <p>{block.props.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-16 ${
                      canvasResolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="text-4xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold mb-2">Страница пуста</h3>
                      <p>Добавьте блоки для создания контента</p>
                      {isEditMode && (
                        <button
                          onClick={() => {
                            // Добавим простой блок для демонстрации
                            const newContent = [
                              {
                                id: `block-${Date.now()}`,
                                type: 'hero-unit',
                                props: {
                                  title: 'Добро пожаловать!',
                                  text: 'Это ваш первый блок на странице'
                                }
                              }
                            ];
                            actions.savePageContent(state.currentPage!.id, newContent);
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Добавить первый блок
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-center py-16 ${
                  canvasResolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">Выберите страницу</h3>
                  <p>Выберите страницу из левой панели для начала работы</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 