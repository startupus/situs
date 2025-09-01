# Тестирование (Vitest/Playwright)

Назначение: стандарты для unit, integration и e2e тестов.

## Ссылки в проекте
- `vitest.config.ts`, `playwright.config.ts`
- `tests/e2e/` — e2e тесты

## Инструменты
- Unit/Integration — Vitest (`vitest.config.ts`, `npm run test`, `npm run test:coverage`).
- E2E — Playwright (`playwright.config.ts`, `npm run test:e2e`).
- Jest не использовать (см. `rules.md`).

## Размещение
- Тесты рядом с кодом: `*.test.ts(x)`; интеграционные/сквозные — в `tests/`.
- E2E — `tests/e2e/`.

## Покрытие
- Обязательное покрытие: бизнес‑логика сервисов, правила меню/роутинга, критические утилиты.
- Моки внешних сервисов; фикстуры данных для стабильности.

## Примеры (Vitest)
```ts
import { describe, it, expect } from 'vitest'
import { buildMenuLookup } from '@/lib/menu/lookup'

describe('buildMenuLookup', () => {
  it('creates parent-child map', () => {
    const items = [
      { id: '1', parentId: null },
      { id: '2', parentId: '1' },
    ]
    const map = buildMenuLookup(items as any)
    expect(map.get('1')).toContain('2')
  })
})
```

## Примеры (Playwright)
```ts
import { test, expect } from '@playwright/test'

test('menu manager loads', async ({ page }) => {
  await page.goto('http://localhost:5177')
  await page.getByRole('link', { name: 'Меню' }).click()
  await expect(page.getByText('Типы меню')).toBeVisible()
})
```

## Изоляция и стабильность
- Не зависеть от сети по умолчанию; использовать локальные моки/фикстуры.
- Для БД‑интеграционных тестов — отдельная БД/схема или транзакционный сброс между тестами.

## CI
- На CI запускать unit + e2e; собирать отчёты покрытия (`@vitest/coverage-v8`).

## Навигация
Назад: `./README.md`