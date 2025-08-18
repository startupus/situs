# Accounts Module

Модуль управления аккаунтами и членствами, а также связями агентство ↔ клиент.

## Маршруты
- `GET /api/accounts` — список аккаунтов (`@Scopes('ACCOUNT_READ')`)
- `GET /api/accounts/:id` — деталь (`ACCOUNT_READ`)
- `POST /api/accounts` — создать (`ACCOUNT_WRITE`)
- `PATCH /api/accounts/:id` — обновить (`ACCOUNT_WRITE`)
- `DELETE /api/accounts/:id` — удалить (`ACCOUNT_ADMIN`)

### Членства
- `GET /api/account-memberships/:accountId` — список (`ACCOUNT_READ`)
- `POST /api/account-memberships` — создать/обновить (`ACCOUNT_WRITE`)
- `PATCH /api/account-memberships/:id` — изменить роль (`ACCOUNT_WRITE`)
- `DELETE /api/account-memberships/:id` — удалить (`ACCOUNT_ADMIN`)

### Агентские связи
- `GET /api/agency-clients/:agencyAccountId` — список клиентов агентства (`ACCOUNT_READ`)
- `POST /api/agency-clients` — привязать клиента (`ACCOUNT_WRITE`)
- `DELETE /api/agency-clients/:id` — отвязать (`ACCOUNT_ADMIN`)

## Политики доступа
Используются декораторы `@Scopes()` и глобальные guard’ы `JwtAuthGuard`/`PoliciesGuard`/`RolesGuard`.


