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
- Рекомендуется pre-push: `npm run test` и `npm run test:e2e`.

### Пример pre-commit (дополнительно)
```bash
#!/bin/bash
npm run lint && npm run test --silent
```

## CI (пример GitHub Actions)
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test --if-present
      - run: npm run test:e2e --if-present
      - run: npm run build --if-present
```

## Документация
- Ссылки на стандарты в `docs/README.md` и `docs/CODING_STANDARDS.md`.

## Навигация
Назад: `./README.md`