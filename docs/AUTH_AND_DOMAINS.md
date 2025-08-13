# Авторизация и домены

## Роли и скоупы

- Глобальные роли (`globalRole` в JWT): `SUPER_ADMIN`, `STAFF`, `AGENCY`, `BUSINESS`.
- Проектные роли (`ProjectAccess.role`): `OWNER`, `ADMIN`, `EDITOR`, `VIEWER`.
- Аккаунтные роли (`AccountMembership.role`): `OWNER`, `ADMIN`, `MANAGER`, `MEMBER`.

Скоупы (используются с декоратором `@Scopes()`):
- Проектные: `PROJECT_READ`, `PROJECT_WRITE`, `PROJECT_ADMIN`.
  - OWNER/ADMIN → admin/write/read; EDITOR → write/read; VIEWER → read.
- Аккаунтные: `ACCOUNT_READ`, `ACCOUNT_WRITE`, `ACCOUNT_ADMIN`.
  - OWNER/ADMIN → admin/write/read; MANAGER → write/read; MEMBER → read.

`@Roles()` — ограничивает доступ по глобальным ролям при необходимости.

Гварды:
- `JwtAuthGuard` — глобальный, пропускает `@Public` и публичный allowlist.
- `PoliciesGuard` — глобальный, проверяет скоупы через `ProjectAccess`/`AccountMembership`.

## Публичные эндпоинты

- `GET /`, `GET /health`
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- `GET /robots.txt`, `GET /sitemap.xml`
- `GET /api/projects/events` (SSE), `GET /api/projects/heartbeat`

## Домены: верификация и редирект

- Верификация: `GET /api/domains/check?domain=example.com&type=A|CNAME` — проверка DNS.
- Проект считается верифицированным, если `project.settings.verifiedDomain === true` (или `domainVerified === true`).
- 301‑редирект с базового домена (`project.domain`) на `project.customDomain` включается только если:
  - `project.isPublished === true`
  - домен верифицирован (`verifiedDomain === true`)
- Приложение доверяет прокси (`trust proxy`), Host определяется из `X-Forwarded-Host`.

## Примечания

- Рекомендуется вынести верификацию домена в отдельное поле `project.domainVerified` (будущая миграция), сейчас используется флаг в `settings`.
- Для SEO рекомендуется добавить заголовки кэширования (ETag/Last-Modified) на `robots.txt` и `sitemap.xml`.