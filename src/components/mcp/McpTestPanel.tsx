import React, { useState } from 'react';
import { useMcpClient } from '../../hooks/useMcpClient';

/**
 * Панель для тестирования MCP функциональности
 * 
 * Позволяет тестировать инструменты, ресурсы и промпты MCP сервера
 */
export const McpTestPanel: React.FC = () => {
  const {
    isConnected,
    isLoading,
    error,
    createProject,
    listProjects,
    getProjectDocs,
    getComponentTemplates,
    getThemeConfig,
    listTools,
    listResources,
    listPrompts,
    clearError,
  } = useMcpClient();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [category, setCategory] = useState('ui');
  const [themeName, setThemeName] = useState('light');
  const [results, setResults] = useState<any>(null);

  // Создание проекта
  const handleCreateProject = async () => {
    try {
      const result = await createProject(projectName, projectDescription);
      setResults({ type: 'create-project', data: result });
    } catch (err) {
      console.error('Ошибка создания проекта:', err);
    }
  };

  // Получение списка проектов
  const handleListProjects = async () => {
    try {
      const result = await listProjects();
      setResults({ type: 'list-projects', data: result });
    } catch (err) {
      console.error('Ошибка получения списка проектов:', err);
    }
  };

  // Получение документации проекта
  const handleGetProjectDocs = async () => {
    try {
      const result = await getProjectDocs(projectId);
      setResults({ type: 'project-docs', data: result });
    } catch (err) {
      console.error('Ошибка получения документации проекта:', err);
    }
  };

  // Получение шаблонов компонентов
  const handleGetComponentTemplates = async () => {
    try {
      const result = await getComponentTemplates(category);
      setResults({ type: 'component-templates', data: result });
    } catch (err) {
      console.error('Ошибка получения шаблонов компонентов:', err);
    }
  };

  // Получение конфигурации темы
  const handleGetThemeConfig = async () => {
    try {
      const result = await getThemeConfig(themeName);
      setResults({ type: 'theme-config', data: result });
    } catch (err) {
      console.error('Ошибка получения конфигурации темы:', err);
    }
  };

  // Получение списка инструментов
  const handleListTools = async () => {
    try {
      const result = await listTools();
      setResults({ type: 'tools', data: result });
    } catch (err) {
      console.error('Ошибка получения списка инструментов:', err);
    }
  };

  // Получение списка ресурсов
  const handleListResources = async () => {
    try {
      const result = await listResources();
      setResults({ type: 'resources', data: result });
    } catch (err) {
      console.error('Ошибка получения списка ресурсов:', err);
    }
  };

  // Получение списка промптов
  const handleListPrompts = async () => {
    try {
      const result = await listPrompts();
      setResults({ type: 'prompts', data: result });
    } catch (err) {
      console.error('Ошибка получения списка промптов:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">MCP Тестовая Панель</h2>
      
      {/* Статус подключения */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">
            Статус: {isConnected ? 'Подключен' : 'Отключен'}
          </span>
        </div>
        
        {isLoading && (
          <div className="text-blue-600">Загрузка...</div>
        )}
        
        {error && (
          <div className="text-red-600 mb-2">
            Ошибка: {error}
            <button
              onClick={clearError}
              className="ml-2 text-sm underline"
            >
              Очистить
            </button>
          </div>
        )}
      </div>

      {/* Инструменты */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Создание проекта */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Создание проекта</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Название проекта"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Описание проекта"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleCreateProject}
              disabled={!projectName || isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Создать проект
            </button>
          </div>
        </div>

        {/* Список проектов */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Список проектов</h3>
          <button
            onClick={handleListProjects}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Получить список
          </button>
        </div>

        {/* Документация проекта */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Документация проекта</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="ID проекта"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleGetProjectDocs}
              disabled={!projectId || isLoading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Получить документацию
            </button>
          </div>
        </div>

        {/* Шаблоны компонентов */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Шаблоны компонентов</h3>
          <div className="space-y-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="ui">UI компоненты</option>
              <option value="forms">Формы</option>
              <option value="navigation">Навигация</option>
            </select>
            <button
              onClick={handleGetComponentTemplates}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Получить шаблоны
            </button>
          </div>
        </div>

        {/* Конфигурация темы */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Конфигурация темы</h3>
          <div className="space-y-3">
            <select
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="light">Светлая тема</option>
              <option value="dark">Темная тема</option>
            </select>
            <button
              onClick={handleGetThemeConfig}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Получить конфигурацию
            </button>
          </div>
        </div>

        {/* Списки */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Списки</h3>
          <div className="space-y-2">
            <button
              onClick={handleListTools}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Инструменты
            </button>
            <button
              onClick={handleListResources}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Ресурсы
            </button>
            <button
              onClick={handleListPrompts}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Промпты
            </button>
          </div>
        </div>
      </div>

      {/* Результаты */}
      {results && (
        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Результаты: {results.type}</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(results.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
