# Интеграция MCP (Model Context Protocol) в Situs

## Обзор

MCP (Model Context Protocol) интегрирован в проект Situs для предоставления AI инструментов, ресурсов и промптов через стандартизированный протокол. Это позволяет внешним AI системам взаимодействовать с функциональностью Situs.

## Архитектура

### Компоненты

1. **MCP Сервер** (`src/mcp/`) - NestJS сервер, предоставляющий MCP функциональность
2. **MCP Клиент** (`src/mcp/client/`) - Клиент для подключения к MCP серверу
3. **React Хук** (`src/hooks/useMcpClient.ts`) - React хук для использования MCP в компонентах
4. **Тестовая панель** (`src/components/mcp/McpTestPanel.tsx`) - UI для тестирования MCP

### Структура файлов

```
src/mcp/
├── mcp.module.ts              # Основной модуль MCP
├── server.ts                  # Сервер MCP
├── README.md                  # Документация модуля
├── tools/
│   └── project.tools.ts       # Инструменты для работы с проектами
├── resources/
│   └── content.resources.ts   # Ресурсы контента
├── prompts/
│   └── editor.prompts.ts      # Промпты для редактора
└── client/
    └── mcp-client.ts          # Клиент MCP
```

## Установка и запуск

### Зависимости

```bash
npm install @rekog/mcp-nest @modelcontextprotocol/sdk zod@^3 --legacy-peer-deps
```

### Скрипты запуска

```bash
# Запуск только MCP сервера
npm run mcp:start

# Запуск фронтенда + MCP сервера
npm run mcp:dev

# Запуск полного стека (фронтенд + бэкенд + MCP)
npm run mcp:full
```

## Доступные инструменты

### Проекты

- `create-project` - Создание нового проекта
- `list-projects` - Получение списка проектов
- `update-project` - Обновление проекта

### Параметры

Все инструменты используют Zod для валидации параметров и предоставляют подробные описания.

## Доступные ресурсы

### URI схемы

- `situs://docs/project/{projectId}` - Документация проекта
- `situs://templates/components/{category}` - Шаблоны компонентов
- `situs://config/theme/{themeName}` - Конфигурация темы
- `situs://content/{type}/{id}` - Динамический контент

### Категории компонентов

- `ui` - UI компоненты (Button, Card, Modal)
- `forms` - Компоненты форм (Input, Select, Checkbox)
- `navigation` - Навигационные компоненты (Navbar, Sidebar, Breadcrumb)

## Доступные промпты

### Редактор

- `create-react-component` - Создание React компонента
- `refactor-code` - Рефакторинг кода
- `create-api-endpoint` - Создание API эндпоинта
- `optimize-performance` - Оптимизация производительности
- `create-tests` - Создание тестов
- `generate-documentation` - Генерация документации

## Использование в React компонентах

### Базовое использование

```typescript
import { useMcpClient } from '../hooks/useMcpClient';

function MyComponent() {
  const {
    isConnected,
    isLoading,
    error,
    createProject,
    listProjects,
  } = useMcpClient();

  const handleCreateProject = async () => {
    try {
      const result = await createProject('Новый проект', 'Описание');
      console.log('Проект создан:', result);
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <div>
      <div>Статус: {isConnected ? 'Подключен' : 'Отключен'}</div>
      {isLoading && <div>Загрузка...</div>}
      {error && <div>Ошибка: {error}</div>}
      <button onClick={handleCreateProject}>Создать проект</button>
    </div>
  );
}
```

### Прямое использование клиента

```typescript
import { mcpClient } from '../mcp/client/mcp-client';

async function example() {
  await mcpClient.connect();

  // Создание проекта
  const project = await mcpClient.createProject('Тест', 'Описание');

  // Получение ресурса
  const docs = await mcpClient.getProjectDocs('project-1');

  await mcpClient.disconnect();
}
```

## Тестирование

### Тестовая страница

Откройте `/mcp-test` в браузере для тестирования всех MCP функций.

### Функции тестирования

- Создание проектов
- Получение списков
- Доступ к ресурсам
- Проверка статуса подключения

## Конфигурация

### MCP Сервер

Настройки сервера в `src/mcp/mcp.module.ts`:

```typescript
McpModule.forRoot({
  name: 'situs-mcp-server',
  version: '1.0.0',
  transport: {
    type: 'http-sse',
    port: 3001,
  },
});
```

### CORS

Сервер настроен для работы с:

- `http://localhost:3000` (основное приложение)
- `http://localhost:5173` (Vite dev server)

## Безопасность

### Аутентификация

MCP сервер поддерживает guard-based аутентификацию с OAuth поддержкой.

### Валидация

Все входные данные валидируются с помощью Zod схем.

## Расширение функциональности

### Добавление нового инструмента

1. Создайте новый файл в `src/mcp/tools/`
2. Используйте декоратор `@Tool`
3. Добавьте в `mcp.module.ts`

```typescript
@Injectable()
export class MyTool {
  @Tool({
    name: 'my-tool',
    description: 'Описание инструмента',
    parameters: z.object({
      param: z.string(),
    }),
  })
  async execute({ param }, context: Context) {
    return `Результат: ${param}`;
  }
}
```

### Добавление нового ресурса

```typescript
@Resource({
  uri: 'situs://my-resource/{id}',
  description: 'Описание ресурса',
})
async getMyResource({ id }: { id: string }) {
  return {
    contents: [{
      uri: `situs://my-resource/${id}`,
      mimeType: 'application/json',
      text: JSON.stringify({ id, data: 'value' }),
    }],
  };
}
```

### Добавление нового промпта

```typescript
@Prompt({
  name: 'my-prompt',
  description: 'Описание промпта',
  prompt: `Шаблон промпта с {{переменными}}`,
})
async myPrompt() {
  // Промпт уже определен в декораторе
}
```

## Мониторинг и логирование

### Логи сервера

MCP сервер выводит подробные логи о:

- Запуске и остановке
- Доступных инструментах/ресурсах/промптах
- Ошибках подключения

### Статус клиента

React хук предоставляет:

- Статус подключения
- Состояние загрузки
- Ошибки

## Интеграция с внешними системами

### Claude Desktop

MCP сервер совместим с Claude Desktop и другими MCP-совместимыми клиентами.

### Конфигурация клиента

```json
{
  "mcpServers": {
    "situs": {
      "command": "npx",
      "args": ["tsx", "src/mcp/server.ts"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Устранение неполадок

### Проблемы подключения

1. Проверьте, что MCP сервер запущен на порту 3001
2. Убедитесь, что CORS настроен правильно
3. Проверьте логи сервера

### Проблемы зависимостей

При конфликтах зависимостей используйте:

```bash
npm install --legacy-peer-deps
```

### Проблемы транспорта

MCP сервер поддерживает:

- HTTP+SSE (рекомендуется для веб)
- Streamable HTTP
- STDIO

## Будущие улучшения

- [ ] Интеграция с реальной базой данных
- [ ] Кэширование ресурсов
- [ ] Аутентификация пользователей
- [ ] Мониторинг производительности
- [ ] Дополнительные инструменты для редактора
- [ ] Интеграция с AI ассистентами
