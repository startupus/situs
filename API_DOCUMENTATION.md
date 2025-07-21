# 🚀 Startupus Platform - API Documentation

## 📋 Обзор API

- *Startupus Platform** предоставляет comprehensive REST API для интеграции с AI-powered экосистемой. Все API endpoints
доступны через единый Gateway Service и используют JWT аутентификацию.

- *Базовый URL**: `<https://api.startupus.dev`>
- *Версия API**: v1
- *Аутентификация**: JWT Bearer Token

## 🔐 Аутентификация

Все API endpoints требуют JWT токен в заголовке:
```bash
Authorization: Bearer <jwt_token>
```

Получение токена:
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

## 🤖 AI Services API

### Hubus Service - AI Engine

#### Chat API

```bash

## Стандартный chat

POST /api/v1/ai/hubus/chat
Content-Type: application/json

{
  "message": "Привет, как дела?",
  "model": "gpt-4",
  "userId": "user123",
  "stream": false
}

## Streaming chat

POST /api/v1/ai/hubus/chat/stream
Content-Type: application/json

{
  "message": "Расскажи о TypeScript",
  "model": "gpt-4",
  "userId": "user123",
  "stream": true
}
```

#### Models API

```bash

## Получить все доступные модели

GET /api/v1/ai/hubus/models

## Получить информацию о конкретной модели

GET /api/v1/ai/hubus/models/gpt-4

## Поиск моделей по параметрам

GET /api/v1/ai/hubus/models/search?provider=openai&type=chat&maxTokens=8000
```

#### Providers API

```bash

## Получить всех провайдеров

GET /api/v1/ai/hubus/providers

## Проверить состояние провайдера

GET /api/v1/ai/hubus/providers/openai/health

## Получить метрики провайдера

GET /api/v1/ai/hubus/providers/openai/metrics
```

### Testus Service - AI Testing

#### AI Agents API

```bash

## Генерация тестовых сценариев

POST /api/v1/ai/testus/agents/scenario-generator
Content-Type: application/json

{
  "userStory": "Как пользователь, я хочу зарегистрироваться в системе",
  "projectId": "proj_123",
  "framework": "vitest"
}

## Генерация кода тестов

POST /api/v1/ai/testus/agents/test-code-generator
Content-Type: application/json

{
  "scenario": {
    "name": "User Registration",
    "steps": ["Open registration page", "Fill form", "Submit"]
  },
  "framework": "vitest",
  "language": "typescript"
}

## Анализ изменений в Git

POST /api/v1/ai/testus/agents/git-analyzer
Content-Type: application/json

{
  "repoUrl": "<https://github.com/user/repo",>
  "branch": "main",
  "since": "2025-01-01"
}

## Валидация качества тестов

POST /api/v1/ai/testus/agents/quality-validator
Content-Type: application/json

{
  "testCode": "describe('User', () => { ... })",
  "criteria": {
    "coverage": 80,
    "complexity": "medium"
  }
}

## Приоритизация тестов

POST /api/v1/ai/testus/agents/test-prioritizer
Content-Type: application/json

{
  "tests": [
    {"name": "login", "risk": "high"},
    {"name": "profile", "risk": "medium"}
  ],
  "criteria": {
    "businessImpact": 8,
    "changeFrequency": 5
  }
}
```

### Codus Service - Code Interpreter

#### Code Execution

```bash

## Выполнить код

POST /api/v1/ai/codus/execute
Content-Type: application/json

{
  "code": "print('Hello, World!')",
  "language": "python",
  "userId": "user123",
  "context": {
    "environment": "sandbox",
    "timeout": 30
  }
}

## Выполнить код с файлами

POST /api/v1/ai/codus/execute-with-files
Content-Type: multipart/form-data

{
  "code": "import pandas as pd; df = pd.read_csv('data.csv'); print(df.head())",
  "language": "python",
  "files": [/* file attachments */]
}

## Получить артефакты выполнения

GET /api/v1/ai/codus/artifacts/:executionId

## Поддерживаемые языки

GET /api/v1/ai/codus/languages

## Получить состояние среды выполнения

GET /api/v1/ai/codus/runtime/:runtimeId/status
```

### Agents Service - AI Orchestration

#### Agents Management

```bash

## Получить список агентов

GET /api/v1/ai/agents

## Создать нового агента

POST /api/v1/ai/agents
Content-Type: application/json

{
  "name": "Code Reviewer",
  "type": "code-analysis",
  "config": {
    "model": "gpt-4",
    "temperature": 0.1
  }
}

## Выполнить задачу агентом

POST /api/v1/ai/agents/:id/execute
Content-Type: application/json

{
  "task": "Review this code",
  "input": "function add(a, b) { return a + b; }",
  "context": {
    "language": "javascript",
    "project": "web-app"
  }
}
```

### Chat Service - Modern Chat Interface

#### Chat Management

```bash

## Создать новую чат-сессию

POST /api/v1/ai/chat/sessions
Content-Type: application/json

{
  "agentId": "agent_123",
  "userId": "user123",
  "title": "New Chat Session"
}

## Отправить сообщение в чат

POST /api/v1/ai/chat/sessions/:id/messages
Content-Type: application/json

{
  "message": "Привет! Как дела?",
  "type": "user",
  "attachments": [
    {
      "type": "file",
      "url": "https://example.com/file.pdf",
      "name": "document.pdf"
    }
  ]
}

## Получить историю чата

GET /api/v1/ai/chat/sessions/:id/messages?limit=50&offset=0

## Экспорт чата в различных форматах

POST /api/v1/ai/chat/sessions/:id/export
Content-Type: application/json

{
  "format": "js-widget", // js-widget, iframe, telegram-bot, discord-bot, standalone, rest-api
  "options": {
    "includeStyles": true,
    "customDomain": "myapp.com"
  }
}
```

#### Agent Constructor

```bash

## Создать агента через конструктор

POST /api/v1/ai/chat/constructor/agents
Content-Type: application/json

{
  "name": "Customer Support Bot",
  "description": "AI assistant for customer support",
  "config": {
    "model": "gpt-4",
    "temperature": 0.7,
    "systemPrompt": "You are a helpful customer support assistant...",
    "maxTokens": 2000
  },
  "components": [
    {
      "type": "text-input",
      "config": { "placeholder": "Type your message..." }
    },
    {
      "type": "file-upload",
      "config": { "allowedTypes": ["image", "document"] }
    }
  ]
}

## Предпросмотр агента

POST /api/v1/ai/chat/constructor/preview
Content-Type: application/json

{
  "agentConfig": { /* agent configuration */ },
  "testMessage": "Hello, test message"
}

## Получить доступные компоненты

GET /api/v1/ai/chat/constructor/components
```

## 💼 Business Services API

### Bilingus Service - Billing & Accounting

#### Billing API

```bash

## Получить баланс пользователя

GET /api/v1/business/bilingus/balance/:userId

## Списать средства за использование AI

POST /api/v1/business/bilingus/charge
Content-Type: application/json

{
  "userId": "user123",
  "amount": 100,
  "currency": "USD",
  "description": "AI API usage",
  "metadata": {
    "model": "gpt-4",
    "tokens": 1000
  }
}

## Получить историю транзакций

GET /api/v1/business/bilingus/transactions/:userId?limit=50&offset=0

## Создать подписку

POST /api/v1/business/bilingus/subscriptions
Content-Type: application/json

{
  "userId": "user123",
  "planId": "pro",
  "paymentMethod": "card_123"
}
```

### Situs Service - Website Builder

#### Website Management

```bash

## Создать сайт через AI

POST /api/v1/business/situs/websites
Content-Type: application/json

{
  "name": "My Startup",
  "description": "AI-powered startup platform",
  "template": "saas",
  "aiGenerate": true
}

## Получить список сайтов

GET /api/v1/business/situs/websites?userId=user123

## Обновить сайт

PUT /api/v1/business/situs/websites/:id
Content-Type: application/json

{
  "content": "<html>...</html>",
  "settings": {
    "theme": "dark",
    "seo": true
  }
}
```

## 🌐 Infrastructure Services API

### Gateway Service - API Gateway

#### Health & Monitoring

```bash

## Проверить состояние Gateway

GET /health

## Детальная информация о состоянии экосистемы

GET /health/detailed

## Метрики производительности

GET /metrics

## Статистика использования API

GET /api/v1/usage?service=hubus&period=24h
```

### Client Service - API Management

#### Client Management

```bash

## Регистрация нового клиента

POST /api/v1/clients
Content-Type: application/json

{
  "name": "My App",
  "description": "Mobile application",
  "scopes": ["ai.chat", "ai.models"],
  "redirectUris": ["<https://myapp.com/callback>"]
}

## Получить API ключи

GET /api/v1/clients/:id/keys

## Обновить права доступа

PUT /api/v1/clients/:id/scopes
Content-Type: application/json

{
  "scopes": ["ai.chat", "ai.models", "ai.agents"]
}
```

## 📊 Response Formats

### Успешный ответ

```json
{
  "success": true,
  "data": {
    "result": "...",
    "metadata": {
      "timestamp": "2025-01-11T12:00:00Z",
      "processingTime": 150,
      "requestId": "req_123"
    }
  }
}
```

### Ошибка

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "model",
      "reason": "Model not found"
    },
    "requestId": "req_123"
  }
}
```

### Streaming Response

```
data: {"type": "start", "requestId": "req_123"}
data: {"type": "chunk", "content": "Hello"}
data: {"type": "chunk", "content": " world"}
data: {"type": "end", "metadata": {"tokens": 2}}
```

## 🔒 Rate Limiting

### Лимиты по планам

```bash

## Free Plan

100 requests/hour per user
1,000 AI tokens/day

## Pro Plan

1,000 requests/hour per user
10,000 AI tokens/day

## Enterprise Plan

Unlimited requests
Custom AI token limits
```

### Заголовки ответа

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🌍 Webhooks

### Настройка webhooks

```bash
POST /api/v1/webhooks
Content-Type: application/json

{
  "url": "<https://myapp.com/webhook",>
  "events": ["ai.chat.completed", "billing.charged"],
  "secret": "webhook_secret"
}
```

### События

```json
{
  "event": "ai.chat.completed",
  "data": {
    "userId": "user123",
    "model": "gpt-4",
    "tokens": 150,
    "cost": 0.003
  },
  "timestamp": "2025-01-11T12:00:00Z"
}
```

## 📚 SDK и библиотеки

### JavaScript/TypeScript

```bash
npm install @startupus/sdk
```

```typescript
import { StartupusClient } from '@startupus/sdk';

const client = new StartupusClient({
  apiKey: 'your-api-key',
  baseUrl: '<https://api.startupus.dev'>
});

// AI Chat
const response = await client.ai.chat({
  message: 'Hello',
  model: 'gpt-4'
});

// Chat Service
const chatSession = await client.chat.createSession({
  agentId: 'agent_123',
  title: 'New Chat'
});

const message = await client.chat.sendMessage(chatSession.id, {
  message: 'Hello!',
  attachments: []
});

// Generate tests
const tests = await client.testing.generateTests({
  userStory: 'User login functionality'
});
```

### Python

```bash
pip install startupus-sdk
```

```python
from startupus import StartupusClient

client = StartupusClient(api_key='your-api-key')

## AI Chat

response = client.ai.chat(
    message='Hello',
    model='gpt-4'
)

## Chat Service

chat_session = client.chat.create_session(
    agent_id='agent_123',
    title='New Chat'
)

message = client.chat.send_message(chat_session.id, {
    'message': 'Hello!',
    'attachments': []
})

## Generate tests

tests = client.testing.generate_tests(
    user_story='User login functionality'
)
```

## 🔧 Примеры интеграций

### React Hook

```typescript
import { useStartupus } from '@startupus/react';

function ChatComponent() {
  const { chat, loading } = useStartupus();

  const handleSend = async (message: string) => {
    const response = await chat({
      message,
      model: 'gpt-4',
      stream: true
    });

    return response;
  };

  return (
    <div>
      {/* Chat UI */}
    </div>
  );
}
```

### Node.js Express

```javascript
const express = require('express');
const { StartupusClient } = require('@startupus/sdk');

const app = express();
const client = new StartupusClient({
  apiKey: process.env.STARTUPUS_API_KEY
});

app.post('/chat', async (req, res) => {
  try {
    const response = await client.ai.chat({
      message: req.body.message,
      model: 'gpt-4',
      userId: req.user.id
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📈 Мониторинг и аналитика

### Метрики API

```bash

## Получить метрики использования

GET /api/v1/analytics/usage?period=7d&service=hubus

## Получить метрики производительности

GET /api/v1/analytics/performance?period=24h

## Получить статистику ошибок

GET /api/v1/analytics/errors?period=1h&severity=high
```

### Dashboard интеграция

```bash

## Встроить виджеты в ваше приложение

GET /api/v1/dashboard/widgets/usage
GET /api/v1/dashboard/widgets/performance
GET /api/v1/dashboard/widgets/costs
```

- --

- *🚀 Startupus Platform API** - Мощный инструмент для создания AI-powered приложений

- *Версия**: v1
- *Статус**: ✅ Production Ready
- *Поддержка**: [support@startupus.dev](mailto:support@startupus.dev)
- *Документация**: [docs.startupus.dev](<https://docs.startupus.dev)>
