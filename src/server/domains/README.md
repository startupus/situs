# Domains Module

Модуль для проверки и поведения доменов проекта.

## Middleware

- `DomainRedirectMiddleware` — 301 с `project.domain` на `project.customDomain`, если проект опубликован и домен верифицирован (флаг в `project.settings`).
- `TenantResolverMiddleware` — извлекает `tenant.projectId`/`tenant.productId` по `Host`/`X-Forwarded-Host`.

## Планы

- Вынести верификацию в явное поле `project.domainVerified` (миграция), вместо флага в `settings`.
