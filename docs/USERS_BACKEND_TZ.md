# ТЗ: Бэкенд под задачи фронта — Модуль Пользователи

Документ для ИИ-агента разработчика. Содержит цели, архитектуру, модели данных, эндпоинты, требования к реализации, источники данных, интеграционные точки с фронтом и чеклист задач.

## Цель
- Обеспечить фронту стабильные API для страницы `/users` и связанных функций: список, статистика, фильтры/сортировка/пагинация, массовые операции, управление ролями/статусами, группы пользователей (Joomla-like), уровни доступа (view levels), внешние провайдеры, приглашения, настройки.

## Технологии и окружение
- NestJS (REST, Swagger), Prisma ORM (SQLite dev; совместимо с PostgreSQL prod), JWT аутентификация, RBAC.
- Глобальный префикс: `/api`.
- Формат ответов: ApiResponse.
- CORS по `.env` (`CORS_ORIGINS`). Порт API: `PORT=3002`.
- Переменные окружения: `.env` в корне.

## Источники и интеграции (откуда брать правду)
- Фронт:
  - Хук `src/components/situs/pages/users/useUsers.ts` — определяет форму данных, которой питается UI таблицы и статистики.
  - API-клиент `src/api/client.ts` — готовые методы: `getUsers`, `createUser`, `updateUser`, `getUsersStatistics`, `activateUser`, `suspendUser`, `changeUserRole`, `bulkUpdateUsers`, `bulkDeleteUsers`. Все запросы идут на `/api/*`.
- Бэкенд: модуль пользователей в `src/server/users/*`.
- Prisma схема: `prisma/schema.prisma` (модели и связи).
- Быстрая проверка доступности: `/api/health`, `/api/users`.

## Модели данных (Prisma)
- User:
  - Поля: `id (cuid)`, `username (unique)`, `email? (unique)`, `password?`, `globalRole (SUPER_ADMIN|STAFF|AGENCY|BUSINESS)`, `status (ACTIVE|INACTIVE|PENDING|SUSPENDED|BANNED)`, `profile (JSON string { name, avatar, bio })`, `createdAt`, `updatedAt`.
  - Связи: `ownedProjects`, `accountMemberships`, `userGroups (via UserGroupMap)`, `authProviders`, `invitationsSent`, `invitationsAccepted`.
- UserGroup: `id`, `title (unique)`, `description?`, `isCore`, `createdAt`, `updatedAt`, M:N с User.
- UserGroupMap: `id`, `userId`, `groupId`, `createdAt`, `@@unique([userId, groupId])`.
- ViewLevel: `id`, `title (unique)`, `description?`, `ordering`, `createdAt`, `updatedAt`, M:N с UserGroup.
- UserAuthProvider: `id`, `userId`, `provider`, `providerUserId (unique)`, `accessToken?`, `refreshToken?`, `expiresAt?`, `createdAt`, `updatedAt`.
- UserInvitation: `id`, `email`, `token (unique)`, `expiresAt`, `status (string: pending|accepted|expired|cancelled)`, `invitedById`, `acceptedById?`, `acceptedAt?`, `createdAt`.

Примечания:
- Email и пароль опциональны (SSO). Enum статусов хранится в БД UPPERCASE; фронт мапит к нижнему регистру для UI.

## Формат ответа (ApiResponse)
```
{
  "success": true,
  "data": {},
  "message": "",
  "error": "",
  "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

Пример пользователя в списке:
```
{
  "id": "cuid",
  "email": "admin@example.com",
  "name": "Администратор Системы",
  "avatar": "https://...",
  "globalRole": "SUPER_ADMIN",
  "status": "ACTIVE",
  "lastLogin": "2025-08-22T08:15:43.546Z",
  "createdAt": "2025-08-22T08:15:43.546Z",
  "projectsCount": 0,
  "permissions": ["*"],
  "isEmailVerified": true,
  "twoFactorEnabled": false,
  "username": "admin",
  "groups": ["Registered", "Super Users"],
  "authProviders": ["google"]
}
```

## Эндпоинты — Пользователи
- GET `/api/users`
  - Auth: JWT + permission `users.read` (в dev допустимо без guard, в prod — обязательны guard'ы).
  - Query: `search?, role?, status?, sortBy? (username|email|created|updated), sortOrder? (asc|desc), page? (1), limit? (20)`.
  - Response: ApiResponse<User[] + pagination>.
- GET `/api/users/statistics`
  - Auth: `users.read`.
  - Response: `{ total, active, pending, suspended, inactive, banned }`.
- GET `/api/users/:id`
  - Auth: `users.read`.
- POST `/api/users`
  - Auth: `users.manage`.
  - Body: `{ email?, password?, name?, globalRole?, isActive?, provider?, providerUserId? }`.
  - Валидация: email/password обязательны только если нет `provider+providerUserId`.
- PATCH `/api/users/:id`
  - Auth: `users.manage`.
- PUT `/api/users/:id/activate`
  - Auth: `users.manage.status`.
- PUT `/api/users/:id/suspend`
  - Auth: `users.manage.status`.
- PUT `/api/users/:id/role`
  - Auth: `users.manage.roles`, Body: `{ globalRole }`.
- PUT `/api/users/bulk/update`
  - Auth: `users.manage.bulk`, Body: `{ userIds: string[], data: { status?, globalRole? } }`.
- DELETE `/api/users/bulk/delete`
  - Auth: `users.manage.bulk`, Body: `{ userIds: string[] }`.

## Эндпоинты — Группы пользователей (Joomla-like)
- GET `/api/user-groups`, GET `/api/user-groups/:id` — `groups.read`.
- POST `/api/user-groups`, PATCH `/api/user-groups/:id`, DELETE `/api/user-groups/:id` — `groups.manage`.
- POST `/api/users/:id/groups` — `groups.assign`, Body: `{ groupIds: string[] }`.
- DELETE `/api/users/:id/groups/:groupId` — `groups.assign`.

## Эндпоинты — Уровни доступа (View Levels)
- GET `/api/view-levels`, GET `/api/view-levels/:id` — `viewlevels.read`.
- POST `/api/view-levels`, PATCH `/api/view-levels/:id`, DELETE `/api/view-levels/:id` — `viewlevels.manage`.
- PUT `/api/view-levels/:id/groups` — `viewlevels.manage`, Body: `{ groupIds: string[] }`.

## Эндпоинты — Внешние провайдеры пользователя
- GET `/api/users/:id/auth-providers` — `users.read`.
- POST `/api/users/:id/auth-providers` — `users.manage.providers`, Body: `{ provider, providerUserId, accessToken?, refreshToken?, expiresAt? }`.
- DELETE `/api/users/:id/auth-providers/:provider` — `users.manage.providers`.

## Эндпоинты — Приглашения
- POST `/api/invitations` — `users.invite`, Body: `{ emails: string[], role: GlobalRole, message?, expiresInHours? }`.
- GET `/api/invitations` — `users.invite.read`.
- POST `/api/invitations/:token/accept` — публичный, создаёт/привязывает пользователя (SSO-friendly).
- POST `/api/invitations/:id/cancel` — `users.invite`.

## Настройки пользователей
- GET `/api/users/settings` — `users.settings.read`.
- PATCH `/api/users/settings` — `users.settings.manage`, Body по схеме фронта: `{ registration, authentication, notifications, privacy }`.

## Безопасность
- JWT Bearer, роли: SUPER_ADMIN, STAFF, AGENCY, BUSINESS.
- Permissions (минимум):
  - `users.read`, `users.manage`, `users.manage.roles`, `users.manage.status`, `users.manage.bulk`.
  - `users.invite`, `users.invite.read`.
  - `groups.read`, `groups.manage`, `groups.assign`.
  - `viewlevels.read`, `viewlevels.manage`.
  - `users.manage.providers`.
- Throttler на чувствительных маршрутах. Валидация через `class-validator`.

## Сериализация и маппинг (важно для фронта)
- В `UsersService.enrichUserData` формировать поля, которые ждёт фронт: `name`, `avatar`, `projectsCount`, `permissions`, `isEmailVerified`, `twoFactorEnabled`, `lastLogin`.
- Возвращать статусы БД в UPPERCASE; фронт уже мапит в UI-статусы (lowercase).

## Документация и тесты
- Swagger `/api-docs` (DTO, ответы, enums).
- Unit/Integration/E2E тесты: CRUD пользователей, bulk, статистика, группы, приглашения.

## Миграции и сиды
- Prisma миграции для всех новых моделей.
- Сиды: группы (Registered, Author, Editor, Publisher, Manager, Administrator, Super Users), view levels (Public, Guest, Registered, Special), тест-пользователи (admin/staff/agency/business), примеры приглашений.

## Нефункциональные требования
- Производительность: GET `/users` ≤ 200ms при ~1000 пользователях (индексы, легковесные выборки).
- Лимиты и rate limiting на мутации.
- Логирование запросов/ошибок. Метрики по пользователям/статусам.

---

## Инструкция для ИИ-агента: пошагово «что делать и откуда брать»
1) Настроить окружение:
   - `.env`: `PORT=3002`, `DATABASE_URL=file:./prisma/dev.db`, `CORS_ORIGINS=...`.
   - Команды: `npx prisma db push && npx prisma generate`.
   - Старт API: `npm run serve:api:dist` (или dev режим).
2) Реализовать/проверить Users API:
   - Файлы: `src/server/users/users.module.ts`, `users.controller.ts`, `users.service.ts`, `dto/*`, `entities/*`.
   - Убедиться, что эндпоинты соответствуют разделу «Эндпоинты — Пользователи».
   - В `CreateUserDto` сделать email/password опциональными при наличии `provider+providerUserId`.
   - В `UsersService.create` при переданном `provider` создать `UserAuthProvider`.
   - В `enrichUserData` вернуть все поля, которые ожидает фронт (смотри `useUsers.ts`).
3) Включить Joomla-like сущности:
   - Добавить модули `user-groups`, `view-levels`, `invitations` (контроллеры/сервисы/DTO, права).
   - Добавить сиды групп и view levels.
4) Интеграция с фронтом:
   - Проверить `src/api/client.ts` — базовый URL и методы.
   - Проверить `src/components/situs/pages/users/useUsers.ts` — соответствие полей бэку.
   - Перевести `src/api/services/users.api.ts` с моков на реальный `apiClient`.
   - Реализовать фильтры/сортировки/пагинацию через query.
5) Тестирование:
   - Прогнать unit/integration/e2e; руками проверить `/users` в браузере.

### Где смотреть и как сверяться
- Схема БД: `prisma/schema.prisma`.
- API контракты: Swagger `/api-docs` (после запуска API).
- Ожидания фронта: `useUsers.ts`, компоненты `UserTable`, `UserStats`, `UserControls`.
- Быстрый sanity-check: `curl -s http://localhost:3002/api/users | jq`.

---

## Чеклист задач
- [ ] Окружение .env и CORS настроены, API слушает на 3002
- [ ] Prisma схема обновлена и сгенерирована, миграции выполнены
- [ ] UsersController: список/деталь/статистика/CRUD/активация/блокировка/смена роли/bulk
- [ ] UsersService: enrichUserData, permissions маппинг, корректная сериализация
- [ ] CreateUserDto: email/password опциональны при SSO, привязка провайдера сохраняется
- [ ] Публичное чтение GET `/api/users` (dev), guard'ы на мутациях
- [ ] Документация Swagger для всех DTO/ответов
- [ ] Реализованы модули: user-groups, view-levels, invitations
- [ ] Добавлены сиды групп и уровней, базовые пользователи
- [ ] `src/api/services/users.api.ts` переведён на `apiClient`
- [ ] Фильтры/сортировки/пагинация работают, статистика корректна
- [ ] Unit/Integration/E2E тесты зелёные

---

## Быстрые команды
```
# Миграции
npx prisma db push && npx prisma generate

# Проверка эндпоинтов
curl -s http://localhost:3002/api/health
curl -s http://localhost:3002/api/users | jq
curl -s http://localhost:3002/api/users/statistics | jq
```
