# MCP (Model Context Protocol) Модуль

Этот модуль интегрирует Model Context Protocol в проект Situs для создания AI-инструментов и ресурсов.

## Структура

- `mcp.module.ts` - основной модуль MCP
- `tools/` - инструменты MCP (функции для AI)
- `resources/` - ресурсы MCP (данные и контент)
- `prompts/` - шаблоны промптов для AI
- `auth/` - аутентификация и авторизация

## Возможности

- 🚀 **Мультитранспортная поддержка**: HTTP+SSE, Streamable HTTP, STDIO
- 🔧 **Инструменты**: Экспорт методов NestJS как MCP инструментов
- 📁 **Ресурсы**: Предоставление контента через систему ресурсов MCP
- 💬 **Промпты**: Переиспользуемые шаблоны для AI взаимодействий
- 🔐 **Аутентификация**: Guard-based безопасность с OAuth поддержкой

## Использование

```typescript
// Создание инструмента
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

## Конфигурация

MCP сервер настраивается в `mcp.module.ts` с указанием имени, версии и транспорта.
