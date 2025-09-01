## Исследование: ACL ↔ Prisma схема (2025‑08‑20)

Цель: подтвердить соответствие схемы БД требованиям ACL и сформировать безопасный план миграции.

### Дельты схемы, необходимые для ACL
- Пользовательские уровни доступа: `CustomAccessLevel { allowedRoles, conditions, projectId?, accountId?, isSystem, isActive }`.
- Ресурсные уровни доступа и связки с кастомным уровнем:
  - `Project { accessLevel: AccessLevel, customAccessLevelId? }`
  - `Product { accessLevel: AccessLevel, customAccessLevelId? }`
  - `Page { accessLevel: AccessLevel, customAccessLevelId? }`
- Мульти‑аккаунтная модель и доступы:
  - `Account`, `AccountMembership`, `AgencyClient`, `ProjectAccess`.
- Универсальная система меню: `MenuType`, `MenuItem { component, view, layout, targetId, language, accessLevel }`.

Фактическое использование в коде (сопоставление):
- `AccessLevelsService` использует поля `accessLevel`/`customAccessLevelId` у `Project/Product/Page` и модель `CustomAccessLevel`.
- ACL‑резолверы опираются на `ProjectAccess`, `AccountMembership`, `AgencyClient` для проверки контекста.
- Меню‑сервисы используют компонентную модель `MenuItem` (в т.ч. `language`, `accessLevel`).

Вывод: текущая `schema.prisma` соответствует требованиям ACL и подтверждена зелёными backend+e2e тестами.

### План миграции (dev → prod)
1) Зафиксировать состояние схемы миграцией (create‑only сделано: `acl_baseline`).
2) Проверка миграции в dev:
   - `prisma migrate reset --force` (на копии) → `prisma migrate dev` → `npm run test:ci`.
3) Подготовка prod:
   - Бэкап БД.
   - `prisma migrate deploy`.
   - Smoke‑проверки: `/health`, типовые ACL‑потоки (права проекта, меню, страницы).
4) Откат (rollback):
   - В случае проблем: восстановить бэкап; либо откатить последнюю миграцию (если применимо) и перезапустить сервис.

### Совместимость и наполнение данных
- Новые поля имеют дефолты, что минимизирует влияние на существующие записи.
- Рекомендуется добавить семплы ACL (CustomAccessLevel) в отдельный seed‑скрипт (не смешивать с историческим seed).

### Риски и меры
- Риск рассинхронизации миграций и фактической БД: внедрить `migrate deploy` в CI/CD перед деплоем.
- Риск ошибки данных при апгрейде: прогонить миграции на staging с реалистичным дампом.

### Решение
- Не «подгонять» ACL под старую схему, а поднять схему до требований ACL миграциями.
- Хранить изменение схемы в миграциях и документации; включить smoke‑проверки ACL в CI.


