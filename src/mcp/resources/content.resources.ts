import { Tool, Prompt, Resource, ResourceTemplate, Context } from '../decorators.stub';
import { Injectable } from '@nestjs/common';
// import { Resource, ResourceTemplate } from '@rekog/mcp-nest';

@Injectable()
export class ContentResources {
  /**
   * Ресурс для получения документации проекта
   */
  @Resource({
    uri: 'situs://docs/project/{projectId}',
    description: 'Документация проекта Situs',
  })
  async getProjectDocs({ projectId }: { projectId: string }) {
    return {
      contents: [
        {
          uri: `situs://docs/project/${projectId}`,
          mimeType: 'text/markdown',
          text: `# Документация проекта ${projectId}

## Описание
Это документация для проекта ${projectId} в системе Situs.

## Структура
- Компоненты
- Страницы
- Настройки
- API

## Использование
Проект использует современные технологии для создания веб-приложений.
`,
        },
      ],
    };
  }

  /**
   * Ресурс для получения шаблонов компонентов
   */
  @Resource({
    uri: 'situs://templates/components/{category}',
    description: 'Шаблоны компонентов по категориям',
  })
  async getComponentTemplates({ category }: { category: string }) {
    const templates = {
      ui: [
        { name: 'Button', description: 'Кнопка с различными стилями' },
        { name: 'Card', description: 'Карточка для отображения контента' },
        { name: 'Modal', description: 'Модальное окно' },
      ],
      forms: [
        { name: 'Input', description: 'Поле ввода' },
        { name: 'Select', description: 'Выпадающий список' },
        { name: 'Checkbox', description: 'Флажок' },
      ],
      navigation: [
        { name: 'Navbar', description: 'Навигационная панель' },
        { name: 'Sidebar', description: 'Боковая панель' },
        { name: 'Breadcrumb', description: 'Хлебные крошки' },
      ],
    };

    return {
      contents: [
        {
          uri: `situs://templates/components/${category}`,
          mimeType: 'application/json',
          text: JSON.stringify(templates[category] || [], null, 2),
        },
      ],
    };
  }

  /**
   * Ресурс для получения конфигурации темы
   */
  @Resource({
    uri: 'situs://config/theme/{themeName}',
    description: 'Конфигурация темы интерфейса',
  })
  async getThemeConfig({ themeName }: { themeName: string }) {
    const themes = {
      light: {
        name: 'Светлая тема',
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          background: '#FFFFFF',
          text: '#1F2937',
        },
      },
      dark: {
        name: 'Темная тема',
        colors: {
          primary: '#60A5FA',
          secondary: '#9CA3AF',
          background: '#1F2937',
          text: '#F9FAFB',
        },
      },
    };

    return {
      contents: [
        {
          uri: `situs://config/theme/${themeName}`,
          mimeType: 'application/json',
          text: JSON.stringify(themes[themeName] || themes.light, null, 2),
        },
      ],
    };
  }

  /**
   * Шаблон ресурса для динамического контента
   */
  @ResourceTemplate({
    uri: 'situs://content/{type}/{id}',
    description: 'Динамический контент по типу и ID',
  })
  async getDynamicContent({ type, id }: { type: string; id: string }) {
    const contentMap = {
      page: `Содержимое страницы ${id}`,
      component: `Код компонента ${id}`,
      style: `Стили для ${id}`,
      script: `Скрипт ${id}`,
    };

    return {
      contents: [
        {
          uri: `situs://content/${type}/${id}`,
          mimeType: 'text/plain',
          text: contentMap[type] || `Контент типа ${type} с ID ${id}`,
        },
      ],
    };
  }
}
