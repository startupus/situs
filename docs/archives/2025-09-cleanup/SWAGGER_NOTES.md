# Swagger setup notes

- Подключение в `main.ts` (по флагу), генерировать схему только в dev.
- Описать контроллеры: Auth, Users, Projects, Pages, Products, Accounts, Domains, SEO.
- DTO: включить `class-validator` описания.

## Особенности

- Пользователь: `profile` — JSON‑строка с полями `name`, `avatar`, `bio`.
- Auth payload включает `globalRole`, `scopes`.
- Публичные маршруты помечены `@Public()`.

## Тестовая конфигурация

- В `NODE_ENV=test` доступен `AUTH_TEST_TOKEN` для e2e (обход `JwtAuthGuard`), в проде не активен.
