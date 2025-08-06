# Frontend API Layer

## Структура

```
src/api/
├── client.ts                 # Основной API клиент
├── client/
│   └── ApiClient.ts         # Класс для HTTP запросов
├── services/                # API сервисы по доменам
│   ├── projects.api.ts      # API для проектов
│   ├── orders.api.ts        # API для заказов
│   └── sites.api.ts         # API для сайтов (адаптер)
├── middleware/              # Middleware для API
├── validation/              # Схемы валидации
└── README.md
```

## Основные компоненты

### ApiClient
Центральный класс для выполнения HTTP запросов:
- Автоматическая обработка ошибок
- Единообразные заголовки
- Поддержка проксирования
- Типизированные ответы

### API Сервисы
Каждый сервис отвечает за свой домен:
- `projects.api.ts` - управление проектами
- `orders.api.ts` - управление заказами
- `sites.api.ts` - адаптер для совместимости с SiteContext

### Формат ответов
Все API методы возвращают данные в формате:
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

## Использование

### В компонентах
```typescript
import { projectsApi } from '../api/services/projects.api';

// Получить проекты
const projects = await projectsApi.getProjects();

// Создать проект
const newProject = await projectsApi.createProject({
  name: 'Новый проект',
  description: 'Описание'
});
```

### В контекстах
```typescript
import { sitesApi } from '../api/services/sites.api';

// В SiteContext
const sites = await sitesApi.getSites();
```

## Обработка ошибок

### ApiUtils
Утилиты для обработки ошибок:
```typescript
import { ApiUtils } from '../api/client';

try {
  const data = await api.getData();
} catch (error) {
  const errorMessage = ApiUtils.handleError(error);
  // Показать ошибку пользователю
}
```

### Типы ошибок
- `ApiClientError` - ошибки сети
- `ValidationError` - ошибки валидации
- `ServerError` - ошибки сервера

## Конфигурация

### Проксирование
В `vite.config.ts` настроено проксирование:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

### Переменные окружения
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
```

## Разработка

### Добавление нового API сервиса
1. Создать файл в `src/api/services/`
2. Определить интерфейсы типов
3. Создать класс сервиса
4. Экспортировать экземпляр

### Пример нового сервиса
```typescript
// src/api/services/users.api.ts
import { apiClient, ApiResponse } from '../client';

export interface User {
  id: string;
  name: string;
  email: string;
}

class UsersApiService {
  private readonly baseEndpoint = '/api/users';

  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(this.baseEndpoint);
    return response.data;
  }
}

export const usersApi = new UsersApiService();
```

## Интеграция с backend

### Формат запросов
- GET запросы с параметрами
- POST/PUT с JSON телом
- Правильные заголовки Content-Type

### Формат ответов
- Единообразная структура `{success, data, error}`
- Правильная обработка HTTP статусов
- Типизированные данные

## Тестирование

### Моковые данные
Временно используются моковые данные в backend для демонстрации. В будущем будут заменены на реальную базу данных.

### Отладка
- Логирование всех API запросов
- Отображение ошибок в консоли
- Возможность переключения на моковые данные

## Следующие шаги
- Добавление кэширования
- Оптимизация запросов
- Добавление retry логики
- Интеграция с реальной БД
