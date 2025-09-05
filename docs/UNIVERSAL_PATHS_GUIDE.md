# Универсальные пути в Situs Platform

## Обзор

Система универсальных путей автоматически определяет правильные URL и пути в зависимости от среды выполнения (development, production, Docker). Это обеспечивает единообразную работу приложения в разных окружениях без необходимости изменения кода.

## Основные компоненты

### 1. Конфигурация путей (Backend)

Файл: `src/server/config/paths.config.ts`

```typescript
import { pathsConfig } from './config/paths.config';

// В контроллере или сервисе
constructor(private configService: ConfigService) {
  const paths = this.configService.get('paths');
  console.log('API Base URL:', paths.api.baseUrl);
  console.log('Frontend Base URL:', paths.frontend.baseUrl);
}
```

### 2. Утилиты путей (Frontend)

Файл: `src/lib/pathUtils.ts`

```typescript
import { pathUtils } from '../lib/pathUtils';

// Создание URL для API
const apiUrl = pathUtils.createApiUrl('/projects');
// Результат: http://localhost:3002/api/projects (dev) или https://api.situs.com/api/projects (prod)

// Создание URL для статических файлов
const staticUrl = pathUtils.createStaticUrl('/images/logo.png');
// Результат: http://localhost:3002/static/images/logo.png (dev) или https://cdn.situs.com/images/logo.png (prod)

// Создание URL для медиа файлов
const mediaUrl = pathUtils.createMediaUrl('/uploads/photo.jpg');
// Результат: http://localhost:3002/media/uploads/photo.jpg (dev) или https://media.situs.com/uploads/photo.jpg (prod)
```

## Конфигурация окружений

### Development

```bash
# Запуск с автоматическим определением окружения
./scripts/setup-environment.sh development

# Или вручную
NODE_ENV=development npm run dev:api
NODE_ENV=development npm run dev:situs
```

### Docker

```bash
# Запуск с Docker Compose
docker-compose -f docker-compose.paths.yml up -d

# Или с автоматической настройкой
./scripts/setup-environment.sh docker
```

### Production

```bash
# Запуск в production
./scripts/setup-environment.sh production
npm run build
npm run start:prod
```

## Переменные окружения

### Backend (.env)

```env
# Основные настройки
NODE_ENV=development
DOCKER_ENV=false
CONTAINER=false

# API URLs
API_BASE_URL=http://localhost:3002
API_INTERNAL_URL=http://localhost:3002

# Frontend URLs
FRONTEND_BASE_URL=http://localhost:5177
FRONTEND_INTERNAL_URL=http://localhost:5177

# Static files
STATIC_BASE_URL=http://localhost:3002/static
STATIC_INTERNAL_URL=http://localhost:3002/static

# Media files
MEDIA_BASE_URL=http://localhost:3002/media
MEDIA_INTERNAL_URL=http://localhost:3002/media

# WebSocket
WS_BASE_URL=ws://localhost:3002
WS_INTERNAL_URL=ws://localhost:3002

# SSE
SSE_BASE_URL=http://localhost:3002/api/realtime
SSE_INTERNAL_URL=http://localhost:3002/api/realtime

# CORS
CORS_ORIGINS=http://localhost:5177,http://localhost:3000

# Database
DATABASE_URL=postgresql://situs:situs_password@localhost:55432/situs?schema=public
```

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3002
VITE_USERS_API_URL=http://localhost:3002
VITE_GATEWAY_API_URL=http://localhost:3002

# Frontend URLs
VITE_FRONTEND_BASE_URL=http://localhost:5177
VITE_FRONTEND_INTERNAL_URL=http://localhost:5177

# Static files
VITE_STATIC_BASE_URL=http://localhost:3002/static
VITE_STATIC_INTERNAL_URL=http://localhost:3002/static

# Media files
VITE_MEDIA_BASE_URL=http://localhost:3002/media
VITE_MEDIA_INTERNAL_URL=http://localhost:3002/media

# WebSocket
VITE_WS_BASE_URL=ws://localhost:3002
VITE_WS_INTERNAL_URL=ws://localhost:3002

# SSE
VITE_SSE_BASE_URL=http://localhost:3002/api/realtime
VITE_SSE_INTERNAL_URL=http://localhost:3002/api/realtime
```

## Примеры использования

### 1. API клиент

```typescript
// src/api/client.ts
import { pathUtils } from '../lib/pathUtils';

class ApiClient {
  private getBaseURL(): string {
    if (typeof window !== 'undefined') {
      return ''; // Используем Vite proxy
    }
    return pathUtils.createApiUrl('');
  }
}
```

### 2. Компонент React

```typescript
// src/components/ProjectCard.tsx
import { pathUtils } from '../lib/pathUtils';

const ProjectCard = ({ project }) => {
  const imageUrl = pathUtils.createMediaUrl(project.image);
  const apiUrl = pathUtils.createApiUrl(`/projects/${project.id}`);

  return (
    <div>
      <img src={imageUrl} alt={project.name} />
      <a href={apiUrl}>View Project</a>
    </div>
  );
};
```

### 3. WebSocket соединение

```typescript
// src/hooks/useWebSocket.ts
import { pathUtils } from '../lib/pathUtils';

const useWebSocket = (endpoint: string) => {
  const wsUrl = pathUtils.createWebSocketUrl(endpoint);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    // ... WebSocket logic
  }, [wsUrl]);
};
```

### 4. SSE соединение

```typescript
// src/hooks/useSSE.ts
import { pathUtils } from '../lib/pathUtils';

const useSSE = (endpoint: string) => {
  const sseUrl = pathUtils.createSSEUrl(endpoint);

  useEffect(() => {
    const eventSource = new EventSource(sseUrl);
    // ... SSE logic
  }, [sseUrl]);
};
```

### 5. Backend контроллер

```typescript
// src/server/projects/projects.controller.ts
import { ConfigService } from '@nestjs/config';

@Controller('projects')
export class ProjectsController {
  constructor(private configService: ConfigService) {}

  @Get()
  async findAll(@Request() req: any) {
    const paths = this.configService.get('paths');
    const frontendUrl = paths.frontend.baseUrl;

    // Используем правильный URL для фронтенда
    return {
      success: true,
      data: projects,
      frontendUrl,
    };
  }
}
```

## Автоматическое определение окружения

Система автоматически определяет окружение на основе:

1. **Docker**: Наличие файла `/.dockerenv` или переменной `DOCKER_ENV=true`
2. **Production**: `NODE_ENV=production`
3. **Development**: По умолчанию, если не определено иное

## Преимущества

1. **Единообразие**: Один код работает во всех окружениях
2. **Автоматизация**: Автоматическое определение правильных путей
3. **Гибкость**: Легко настраивается через переменные окружения
4. **Безопасность**: Разделение внутренних и внешних URL
5. **Масштабируемость**: Поддержка микросервисной архитектуры

## Отладка

Для отладки конфигурации путей:

```typescript
import { pathUtils } from '../lib/pathUtils';

console.log('Environment info:', pathUtils.getEnvironmentInfo());
console.log('Path config:', pathUtils.getPathConfig());
```

## Миграция существующего кода

1. Замените хардкод URL на вызовы `pathUtils`
2. Обновите переменные окружения
3. Протестируйте в разных окружениях
4. Обновите документацию

## Лучшие практики

1. Всегда используйте `pathUtils` вместо хардкод URL
2. Настройте переменные окружения для каждого окружения
3. Используйте внутренние URL для межсервисного взаимодействия
4. Тестируйте в разных окружениях
5. Документируйте изменения в конфигурации
