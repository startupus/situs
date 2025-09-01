# Структура файлов и модулей

Назначение: рекомендации по организации папок, точек входа и переиспользуемых типов.

## Чеклист реализации
- [x] Бэкенд: модульная структура по доменам (`src/server/*`)
- [x] Фронтенд: компоненты/хуки/типы/утилиты (папки и алиасы)
- [x] Индексы (`index.ts`) и публичные API подпакетов
- [x] Исключение циклических зависимостей
- [x] README в значимых папках

## Бэкенд
- Доменные модули: `<domain>.module.ts`, `<domain>.controller.ts`, `<domain>.service.ts`, `entities/`, `dto/`.
- Общие фильтры/интерсепторы/пайпы — в `src/server/common/`.

## Фронтенд
- Компоненты — `src/components/<area>/*` (например, `admin/menu/*`).
- Хуки — `src/hooks/*`; типы — `src/types/*`; утилиты — `src/lib/*`/`src/utils/*`.
- API‑слой — `src/api/services/*`. Переиспользуемые UI — `src/components/ui/*`.

## Пример дерева
```text
src/
  components/
    admin/
      menu/
        drag-drop/
        MenuManager.tsx
        MenuItemsList.tsx
        README.md
  hooks/
    useMenuSystemRealtime.ts
  types/
    menu.ts
  server/
    menus/
      menus.module.ts
      menus.service.ts
      menu-resolver.service.ts
      dto/
      entities/
```

## Публичные точки входа
- Использовать `index.ts` для реэкспорта модулей/типов; избегать глубоких относительных импортов.

```ts
// src/components/admin/menu/index.ts
export * from './MenuManager'
export * from './MenuItemsList'
```

## Зависимости
- Перед выносом кода — выделять явные контракты/интерфейсы в `src/types/*`.
- Исключить циклические зависимости (проверять по графу импортов при рефакторинге).

## Документация
- В каждой значимой папке — `README.md` с обзором назначения и точек входа.

## Навигация
Назад: `./README.md`