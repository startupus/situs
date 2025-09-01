# Инструменты (ESLint/TS/Pre-commit)

Назначение: единые правила контроля качества кода и дев‑утилиты.

## Чеклист реализации
- [x] ESLint конфиг и запуск (`eslint.config.js`, npm scripts)
- [x] TypeScript компиляция (фронт/бэк: `tsconfig*.json`)
- [x] Pre-commit hooks (линт, tsc, schema:sync)
- [x] CI проверки: линт, тесты, сборка
- [x] Документация и авто‑линки в README

## ESLint
- Конфиг — `eslint.config.js` с `@typescript-eslint`. Запуск: `npm run lint`, `npm run lint:fix`.
- Запрет `console.log`, `eval`, `var`, неиспользуемых переменных, т.д. (см. конфиг).

## TypeScript
- Два конфига: `tsconfig.json` (фронт) и `tsconfig.server.json` (бэк, декораторы).
- Запуск без эмита на CI: `tsc -p tsconfig.server.json --noEmit`, `tsc -p tsconfig.json --noEmit`.

## Hooks
- `.githooks/pre-commit`: `schema:sync` + `dev:safe --check-only` (прерывает коммит при ошибках).
- Рекомендуется добавить pre-push: `npm run test` и `npm run test:e2e`.

## CI
- Базовый пайплайн: установка зависимостей → линт → `tsc` → unit → e2e.

## Документация
- Ссылки на стандарты в `docs/README.md` и `docs/CODING_STANDARDS.md`.

## Навигация
Назад: `./README.md`