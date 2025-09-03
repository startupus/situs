import { useState, useEffect, useCallback } from 'react';
import { mcpClient, SitusMcpClient } from '../mcp/client/mcp-client';

/**
 * React хук для работы с MCP клиентом
 *
 * Предоставляет удобный интерфейс для взаимодействия с MCP сервером
 * из React компонентов.
 */
export function useMcpClient() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Подключение к MCP серверу
  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await mcpClient.connect();
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения к MCP серверу');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Отключение от MCP сервера
  const disconnect = useCallback(async () => {
    try {
      await mcpClient.disconnect();
      setIsConnected(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отключения от MCP сервера');
    }
  }, []);

  // Выполнение инструмента
  const callTool = useCallback(
    async (toolName: string, arguments_: Record<string, any>) => {
      if (!isConnected) {
        throw new Error('Клиент не подключен к MCP серверу');
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await mcpClient.callTool(toolName, arguments_);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Ошибка выполнения инструмента ${toolName}`;
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected],
  );

  // Получение ресурса
  const readResource = useCallback(
    async (uri: string) => {
      if (!isConnected) {
        throw new Error('Клиент не подключен к MCP серверу');
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await mcpClient.readResource(uri);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Ошибка получения ресурса ${uri}`;
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected],
  );

  // Создание проекта
  const createProject = useCallback(
    async (name: string, description?: string, template?: string) => {
      return callTool('create-project', { name, description, template });
    },
    [callTool],
  );

  // Получение списка проектов
  const listProjects = useCallback(
    async (limit = 10, offset = 0) => {
      return callTool('list-projects', { limit, offset });
    },
    [callTool],
  );

  // Обновление проекта
  const updateProject = useCallback(
    async (projectId: string, name?: string, description?: string) => {
      return callTool('update-project', { projectId, name, description });
    },
    [callTool],
  );

  // Получение документации проекта
  const getProjectDocs = useCallback(
    async (projectId: string) => {
      return readResource(`situs://docs/project/${projectId}`);
    },
    [readResource],
  );

  // Получение шаблонов компонентов
  const getComponentTemplates = useCallback(
    async (category: string) => {
      return readResource(`situs://templates/components/${category}`);
    },
    [readResource],
  );

  // Получение конфигурации темы
  const getThemeConfig = useCallback(
    async (themeName: string) => {
      return readResource(`situs://config/theme/${themeName}`);
    },
    [readResource],
  );

  // Получение списка инструментов
  const listTools = useCallback(async () => {
    if (!isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await mcpClient.listTools();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения списка инструментов';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  // Получение списка ресурсов
  const listResources = useCallback(async () => {
    if (!isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await mcpClient.listResources();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения списка ресурсов';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  // Получение списка промптов
  const listPrompts = useCallback(async () => {
    if (!isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await mcpClient.listPrompts();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения списка промптов';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Автоматическое подключение при монтировании компонента
  useEffect(() => {
    connect();

    // Отключение при размонтировании
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    // Состояние
    isConnected,
    isLoading,
    error,

    // Методы подключения
    connect,
    disconnect,
    clearError,

    // Основные методы
    callTool,
    readResource,

    // Методы для проектов
    createProject,
    listProjects,
    updateProject,

    // Методы для ресурсов
    getProjectDocs,
    getComponentTemplates,
    getThemeConfig,

    // Методы для получения списков
    listTools,
    listResources,
    listPrompts,
  };
}
