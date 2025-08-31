# Система интеграций

## Обзор

Система интеграций позволяет подключать внешние сервисы и автоматизировать процессы в проектах. Каждая интеграция представляет собой инстанс провайдера с собственной конфигурацией.

## Архитектура

### Компоненты системы

- **Backend**: `src/server/integrations/`
  - `integrations.service.ts` — бизнес-логика
  - `integrations.controller.ts` — REST API
  - `plugins/` — плагины провайдеров
  - `plugins/registry.ts` — реестр провайдеров

- **Frontend**: `src/components/situs/projects/settings/ProjectIntegrationsPage.tsx`
  - Каталог провайдеров
  - Управление инстансами
  - Тестирование и настройка

- **Database**: 
  - `Integration` — инстансы интеграций
  - `IntegrationEvent` — логи событий
  - `CommunicationSettings` — настройки каналов связи

## Добавление нового провайдера

### 1. Создание плагина

Создайте файл `src/server/integrations/plugins/[provider]/[provider].integration.ts`:

```typescript
import { Integration, IntegrationProvider } from '@prisma/client';
import { IntegrationMeta, IntegrationPlugin, HealthStatus } from '../integration.types';

export class MyProviderIntegrationPlugin implements IntegrationPlugin {
  getMeta(): IntegrationMeta {
    return {
      key: 'MY_PROVIDER' as IntegrationProvider,
      name: 'My Provider',
      category: 'AUTOMATION',
      version: '1.0.0',
      capabilities: { 
        sendMessage: true, 
        healthCheck: true 
      },
    };
  }

  async healthCheck(instance: Integration): Promise<HealthStatus> {
    try {
      const config: any = instance.config || {};
      
      // Проверка конфигурации
      if (!config.apiUrl || !config.apiKey) {
        return { 
          success: false, 
          status: 'ERROR', 
          detail: 'API URL and key required' 
        };
      }

      // Тестовый запрос к API
      const response = await fetch(`${config.apiUrl}/health`, {
        headers: { 'Authorization': `Bearer ${config.apiKey}` }
      });

      if (response.ok) {
        return { 
          success: true, 
          status: 'READY', 
          detail: 'Connection successful' 
        };
      } else {
        return { 
          success: false, 
          status: 'ERROR', 
          detail: `API error: ${response.status}` 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        status: 'ERROR', 
        detail: error?.message || 'Health check failed' 
      };
    }
  }
}
```

### 2. Регистрация в enum

Добавьте провайдера в `prisma/schema.prisma`:

```prisma
enum IntegrationProvider {
  EMAIL_SMTP
  WEBHOOK_GENERIC
  N8N
  MY_PROVIDER  // <-- новый провайдер
}
```

### 3. Регистрация в сервисе

Обновите `src/server/integrations/integrations.service.ts`:

```typescript
private ensureRegistry() {
  // ... existing providers ...
  if (!this.registry.getPlugin('MY_PROVIDER' as any)) {
    this.registry.register(new MyProviderIntegrationPlugin());
  }
}
```

### 4. Обновление типов frontend

Добавьте в `src/api/services/integrations.api.ts`:

```typescript
export type IntegrationProviderKey = 'EMAIL_SMTP' | 'WEBHOOK_GENERIC' | 'N8N' | 'MY_PROVIDER';
```

### 5. Добавление UI конфигурации

Обновите `ProjectIntegrationsPage.tsx` в секции редактирования:

```typescript
{editing.provider === 'MY_PROVIDER' && (
  <>
    <div>
      <label className="block text-sm mb-1">API URL</label>
      <input 
        value={(form.config?.apiUrl)||''} 
        onChange={(e)=>setForm(f=>({
          ...f,
          config: { ...(f.config||{}), apiUrl: e.target.value }
        }))} 
        placeholder="https://api.myprovider.com" 
        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" 
      />
    </div>
    <div>
      <label className="block text-sm mb-1">API Key</label>
      <div className="relative">
        <input 
          type={showSecrets['myProviderKey'] ? 'text' : 'password'} 
          value={(form.config?.apiKey)||''} 
          onChange={(e)=>setForm(f=>({
            ...f,
            config: { ...(f.config||{}), apiKey: e.target.value }
          }))} 
          placeholder="API Key" 
          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 pr-10" 
        />
        <button
          type="button"
          onClick={() => setShowSecrets(prev => ({ ...prev, myProviderKey: !prev.myProviderKey }))}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showSecrets['myProviderKey'] ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  </>
)}
```

### 6. Добавление справки

Обновите функцию `getProviderHelp()`:

```typescript
'MY_PROVIDER': {
  title: 'Настройка My Provider',
  content: 'Описание настройки и использования провайдера...'
}
```

## API Endpoints

### Основные endpoints

- `GET /api/integrations/providers` — список доступных провайдеров
- `GET /api/integrations?projectId=xxx` — список интеграций проекта
- `POST /api/integrations` — создание интеграции
- `PATCH /api/integrations/:id` — обновление интеграции
- `POST /api/integrations/:id/test` — тестирование интеграции
- `DELETE /api/integrations/:id` — удаление интеграции

### Специфичные endpoints

- `GET /api/integrations/:id/n8n/workflows` — список n8n workflow
- `POST /api/integrations/:id/email/preview` — предпросмотр email

### SSE Events

- `GET /api/realtime/integrations?projectId=xxx` — события интеграций
  - `integration_created`
  - `integration_updated` 
  - `integration_deleted`
  - `integration_status_changed`
  - `integration_health_changed`

## Конфигурация провайдеров

### EMAIL_SMTP

Использует глобальные настройки из `CommunicationSettings`:

```json
{
  "channel": "EMAIL",
  "enabled": true,
  "config": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "auth": {
      "user": "user@gmail.com",
      "pass": "password"
    },
    "from": "Situs <no-reply@situs.com>"
  },
  "inviteTemplate": "Добро пожаловать {{userName}}! Ссылка: {{inviteLink}}"
}
```

### N8N

Конфигурация инстанса:

```json
{
  "baseUrl": "https://n8n.company.com",
  "auth": {
    "apiKey": "n8n_api_key_here"
  },
  "security": {
    "hmacSecret": "optional_webhook_secret"
  },
  "routes": {
    "email.send": "workflow_id_1",
    "invitations.send": "workflow_id_2",
    "content.ai.process": "workflow_id_3"
  }
}
```

### WEBHOOK_GENERIC

```json
{
  "url": "https://api.external.com/webhook",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },
  "timeout": 30000
}
```

## Функции системы

### Rate Limiting

- Максимум 10 тестов в минуту на интеграцию
- Кеширование результатов health check на 60 секунд

### Health Monitoring

- Автоматическое сохранение результатов проверок в БД
- Индикаторы здоровья в UI
- SSE события при изменении статуса

### Security

- Маскирование чувствительных полей в UI
- Планируется шифрование secrets в БД (этап 2)

## Разработка и тестирование

### Запуск в dev режиме

```bash
# Backend
npm run nestjs:build && PORT=3002 npm run serve:api:dist

# Frontend  
npm run dev:situs

# E2E тесты
npm run test:e2e
```

### Тестирование интеграций

```bash
# Тест health check
curl -X POST http://localhost:3002/api/integrations/{id}/test

# Список провайдеров
curl http://localhost:3002/api/integrations/providers

# SSE подключение
curl -N http://localhost:3002/api/realtime/integrations?projectId=xxx
```