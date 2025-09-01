# Инструменты (ESLint/TS/Pre-commit)

Назначение: единые правила контроля качества кода и дев‑утилиты.

## Ссылки в проекте
- `.githooks/pre-commit` — проверки и форматирование
- `.prettierrc.json` — Prettier
- `.commitlintrc.json` — commitlint

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

## Установка хуков
```bash
npm run hooks:install
```

## Навигация
Назад: `./README.md`