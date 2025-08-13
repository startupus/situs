# Auth Module

Модуль аутентификации и авторизации. Содержит контроллеры/сервисы входа, стратегии и guard’ы.

## Состав
- `auth.controller.ts`, `auth.service.ts`, `auth.module.ts`
- Простая связка для экспериментов: `auth-simple.*`, `auth-test.controller.ts`
- `dto/` — DTO: `login.dto.ts`, `register.dto.ts`, `auth-response.dto.ts`
- `strategies/` — `local.strategy.ts`, `jwt.strategy.ts`
- `guards/` — `local-auth.guard.ts`, `jwt-auth.guard.ts`, `simple-jwt.guard.ts`

## Маршруты (базово)
- `POST /api/auth/login` — вход по логину/паролю (Local → JWT)
- `POST /api/auth/register` — регистрация (упрощённо)
- `GET /api/auth/me` — профиль текущего пользователя (JWT)

Фактический набор маршрутов может отличаться — см. контроллеры.

## Планы развития
- Внедрить роли и политики: GlobalRole, Account/AccountMembership (OWNER/ADMIN/MANAGER/MEMBER), ProjectAccess
- Декораторы `@Roles()`, `@Scopes()`, guard/политики на 3 уровнях (Global, Account, Project)
- Мультиарендность: резолв аккаунта/проекта по домену/хосту

## Зависимости
- `users` модуль (CRUD пользователей)
- `database/PrismaService`
