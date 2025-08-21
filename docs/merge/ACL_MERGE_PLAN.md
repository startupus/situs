## План слияния: ACL система прав доступа → dev

### Область изменений
- ACL модуль (Permissions, Guards, Decorators, Resolvers), включение в `AppModule`/`CommonModule`.
- Prisma схема: `CustomAccessLevel`, поля `accessLevel/customAccessLevelId` в `Project/Product/Page`, связки `Account/AccountMembership/AgencyClient/ProjectAccess`, `MenuType/MenuItem`.
- Маршруты меню: приоритет статических над динамическими; корректировки `lookup`.
- UI: стабильные селекторы `data-testid` для компонентов меню; обновления e2e сценариев.
- Миграции: create-only `acl_baseline` (фиксирует дельту без применения).
- Сиды: `npm run db:seed:acl` (демо уровни доступа, меню).

### Статус качества
- Backend тесты: 53/53.
- Playwright e2e: 20/20.
- Health: /health OK. SSE потоки стабильны.
- Новых зависимостей не добавлено; аудит лицензий не изменился.

### Миграции (dev → prod)
1) Зафиксировано: `npx prisma migrate dev --name acl_baseline --create-only`.
2) Перед деплоем: `prisma migrate deploy`.
3) Демо-данные по желанию: `npm run db:seed:acl`.
4) Smoke‑чек:
   - `/health` 200
   - CRUD `Accounts/AccountMemberships/AgencyClient`
   - Меню: GET `/api/menu-items/lookup`, `active-by-path`, `authorized`
   - SSE: `/api/projects/events` (обновление статуса)

### Откат
- Бэкап БД перед применением.
- В случае проблем: восстановление бэкапа; при необходимости — откат последней миграции и рестарт сервисов.

### Риски и меры
- Риск несовместимых данных для `accessLevel/customAccessLevelId`: дефолты и idempotent сиды, обязательные smoke‑чек листы.
- Риск перехвата роутов динамикой: порядок маршрутов зафиксирован; автотесты покрывают кейсы.

### Комментарии для ревью
- Нейминг декораторов изменён для устранения конфликтов типов: `RequirePermission/RequireAnyPermission/RequireAllPermissions/SetPermissionContext`.
- Типы и реэкспорты выстроены жёстко, чтобы исключить `TS2308`/`TS2395` при дальнейших изменениях.


