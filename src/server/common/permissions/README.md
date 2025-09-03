# 🔐 Система прав доступа - Модульная архитектура

## 📁 Структура модулей

```
src/server/common/permissions/
├── README.md                           # Этот файл
├── types/                              # Типы и интерфейсы
│   ├── index.ts                        # Экспорты типов
│   ├── permissions.types.ts            # Основные типы прав
│   ├── roles.types.ts                  # Типы ролей
│   └── context.types.ts                # Контекстные типы
├── config/                             # Конфигурация
│   ├── index.ts                        # Экспорты конфигов
│   ├── roles.config.ts                 # Иерархия ролей
│   ├── permissions.config.ts           # Конфигурация прав
│   └── access-levels.config.ts         # Системные уровни доступа
├── services/                           # Бизнес-логика
│   ├── index.ts                        # Экспорты сервисов
│   ├── permissions.service.ts          # Проверка прав
│   ├── access-levels.service.ts        # Управление уровнями доступа
│   ├── role-hierarchy.service.ts       # Работа с иерархией ролей
│   └── context-resolver.service.ts     # Резолвинг контекста
├── decorators/                         # Декораторы
│   ├── index.ts                        # Экспорты декораторов
│   ├── permission.decorator.ts         # Основные декораторы прав
│   ├── role.decorator.ts               # Декораторы ролей
│   └── context.decorator.ts            # Контекстные декораторы
├── guards/                             # Guards
│   ├── index.ts                        # Экспорты guards
│   ├── permission.guard.ts             # Основной guard
│   ├── role.guard.ts                   # Guard ролей
│   └── context.guard.ts                # Контекстный guard
├── utils/                              # Утилиты
│   ├── index.ts                        # Экспорты утилит
│   ├── permission-checker.util.ts      # Проверка прав
│   ├── role-matcher.util.ts            # Сопоставление ролей
│   └── context-builder.util.ts         # Построение контекста
└── permissions.module.ts               # Основной модуль
```

## 🎯 Принципы модульной архитектуры

### 1. **Разделение ответственности**

- **Types** - только определения типов и интерфейсов
- **Config** - статическая конфигурация системы
- **Services** - бизнес-логика и операции с данными
- **Decorators** - метаданные для контроллеров
- **Guards** - проверка доступа на уровне запросов
- **Utils** - вспомогательные чистые функции

### 2. **Размер файлов**

- Максимум **150 строк** на файл
- Если файл больше - разбиваем на логические части
- Каждая функция - максимум **30 строк**
- Комплексная логика выносится в отдельные утилиты

### 3. **Именование и экспорты**

- Каждая папка имеет `index.ts` с экспортами
- Файлы именуются по паттерну `{name}.{type}.ts`
- Интерфейсы начинаются с `I`, типы - с `T`
- Сервисы заканчиваются на `.service.ts`

### 4. **Документация**

- Каждый модуль имеет JSDoc комментарии
- README.md в каждой основной папке
- Примеры использования в комментариях

## 🚀 Быстрый старт

### Импорт компонентов

```typescript
// Основные типы
import { Permission, PermissionContext } from './permissions/types';

// Декораторы
import { RequirePermission, AnyPermission } from './permissions/decorators';

// Сервисы
import { PermissionsService } from './permissions/services';

// Guards
import { PermissionGuard } from './permissions/guards';
```

### Использование в контроллере

```typescript
@Controller('api/projects')
@UseGuards(PermissionGuard)
export class ProjectsController {
  @Get()
  @AnyPermission(['project.view.own', 'project.view.clients'])
  async findAll() {
    // Логика контроллера
  }
}
```

## 📋 Чек-лист разработки

### При создании нового файла:

- [ ] Размер не превышает 150 строк
- [ ] Есть JSDoc для всех экспортируемых элементов
- [ ] Добавлен экспорт в соответствующий `index.ts`
- [ ] Типы вынесены в отдельные файлы
- [ ] Есть unit тесты (если применимо)

### При рефакторинге:

- [ ] Проверить зависимости между модулями
- [ ] Обновить экспорты в `index.ts`
- [ ] Обновить документацию
- [ ] Проверить обратную совместимость

## 🔗 Связанные модули

- `../database/` - интеграция с Prisma
- `../auth/` - аутентификация пользователей
- `../config/` - глобальная конфигурация приложения
