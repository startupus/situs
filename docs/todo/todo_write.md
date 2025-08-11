# TODO Write

- [x] Исправить PATCH /api/projects/:id/status (status + isPublished, публикация событий в сервисе)
- [x] Удалить минимальный сервер и артефакты .js из `src/server/projects`
- [x] Добавить heartbeat `/api/projects/heartbeat` и README для realtime/projects
- [x] Добавить глобальные пайпы/фильтры/интерцептор и graceful shutdown
- [x] Добавить pm2 конфиг и npm-скрипты деплоя
- [ ] Прогнать e2e Playwright: status toggle + SSE sync
- [ ] Создать unit-тесты для `ProjectsService.update` (без Jest)
- [ ] Документация: обновить корневой README архитектуры, добавить Swagger
- [ ] Очистить корень от артефактов компиляции и дублирующих конфигов TS
 
## UI реорганизация
- [x] Перенести `SitusDarkModeToggle` в `src/components/ui` и обновить импорты
- [ ] Стандартизировать импорты UI на `@/components/ui/*` (проверить весь проект)
- [ ] Объединить/перенести дубли из `src/components/situs/UI` (не создавать новые дубликаты)
- [x] Обновить `src/components/ui/README.md` и `src/components/situs/README.md`