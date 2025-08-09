import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

/**
 * Клиент для подключения к MCP серверу Situs
 * 
 * Этот клиент позволяет взаимодействовать с MCP сервером
 * для выполнения инструментов, получения ресурсов и использования промптов.
 */
export class SitusMcpClient {
  private client: Client;
  private isConnected = false;

  constructor() {
    // Создание клиента с HTTP+SSE транспортом
    this.client = new Client({
      name: 'situs-mcp-client',
      version: '1.0.0',
    });
  }

  /**
   * Подключение к MCP серверу
   */
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.isConnected = true;
      console.log('✅ Подключение к MCP серверу установлено');
    } catch (error) {
      console.error('❌ Ошибка подключения к MCP серверу:', error);
      throw error;
    }
  }

  /**
   * Отключение от MCP сервера
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Отключение от MCP сервера');
    }
  }

  /**
   * Выполнение инструмента
   */
  async callTool(toolName: string, arguments_: Record<string, any>): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      const request = CallToolRequestSchema.parse({
        name: toolName,
        arguments: arguments_,
      });

      const response = await this.client.callTool(request);
      return response.content;
    } catch (error) {
      console.error(`❌ Ошибка выполнения инструмента ${toolName}:`, error);
      throw error;
    }
  }

  /**
   * Получение ресурса
   */
  async readResource(uri: string): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      const response = await this.client.readResource({ uri });
      return response.contents;
    } catch (error) {
      console.error(`❌ Ошибка получения ресурса ${uri}:`, error);
      throw error;
    }
  }

  /**
   * Получение списка доступных инструментов
   */
  async listTools(): Promise<any[]> {
    if (!this.isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      const response = await this.client.listTools();
      return response.tools;
    } catch (error) {
      console.error('❌ Ошибка получения списка инструментов:', error);
      throw error;
    }
  }

  /**
   * Получение списка доступных ресурсов
   */
  async listResources(): Promise<any[]> {
    if (!this.isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      const response = await this.client.listResources();
      return response.resources;
    } catch (error) {
      console.error('❌ Ошибка получения списка ресурсов:', error);
      throw error;
    }
  }

  /**
   * Получение списка доступных промптов
   */
  async listPrompts(): Promise<any[]> {
    if (!this.isConnected) {
      throw new Error('Клиент не подключен к MCP серверу');
    }

    try {
      const response = await this.client.listPrompts();
      return response.prompts;
    } catch (error) {
      console.error('❌ Ошибка получения списка промптов:', error);
      throw error;
    }
  }

  /**
   * Создание нового проекта через MCP
   */
  async createProject(name: string, description?: string, template?: string): Promise<any> {
    return this.callTool('create-project', {
      name,
      description,
      template,
    });
  }

  /**
   * Получение списка проектов через MCP
   */
  async listProjects(limit = 10, offset = 0): Promise<any> {
    return this.callTool('list-projects', {
      limit,
      offset,
    });
  }

  /**
   * Обновление проекта через MCP
   */
  async updateProject(projectId: string, name?: string, description?: string): Promise<any> {
    return this.callTool('update-project', {
      projectId,
      name,
      description,
    });
  }

  /**
   * Получение документации проекта
   */
  async getProjectDocs(projectId: string): Promise<any> {
    return this.readResource(`situs://docs/project/${projectId}`);
  }

  /**
   * Получение шаблонов компонентов
   */
  async getComponentTemplates(category: string): Promise<any> {
    return this.readResource(`situs://templates/components/${category}`);
  }

  /**
   * Получение конфигурации темы
   */
  async getThemeConfig(themeName: string): Promise<any> {
    return this.readResource(`situs://config/theme/${themeName}`);
  }

  /**
   * Проверка статуса подключения
   */
  get connected(): boolean {
    return this.isConnected;
  }
}

// Экспорт синглтона клиента
export const mcpClient = new SitusMcpClient();
