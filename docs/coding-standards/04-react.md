# React (Frontend)

Назначение: стандарты компонентов, хуков, состояния и стилизации.

## Ссылки в проекте
- `src/components/admin/menu/MenuItemsList.tsx` — сложный список с DnD
- `src/hooks/useMenuSystemRealtime.ts` — SSE синхронизация

## Компоненты
- Одна ответственность на компонент. Крупные — раскладывать на подкомпоненты.
- Именование — `PascalCase`; хуки — `use*`.
- Пропсы — интерфейсы `SomethingProps`; `children` описывать явно.

Пример компонента:
```tsx
interface MenuBadgeProps {
  count: number
  className?: string
}

export function MenuBadge({ count, className = '' }: MenuBadgeProps) {
  const label = count > 99 ? '99+' : String(count)
  return (
    <span className={`inline-flex items-center rounded bg-blue-600 px-2 py-0.5 text-white text-xs ${className}`}>
      {label}
    </span>
  )
}
```

## Хуки
- Названия с `use`. Возвращать узкие значения/селекторы.

```ts
export function useMounted() {
  const ref = React.useRef(true)
  React.useEffect(() => () => { ref.current = false }, [])
  return ref
}
```

## Состояние (zustand)
- Глобальные состояния — через `zustand` с узкими селекторами и мемоизацией.

```ts
import { create } from 'zustand'

interface MenuState {
  activeTypeId?: string
  setActiveTypeId: (id?: string) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  activeTypeId: undefined,
  setActiveTypeId: (id) => set({ activeTypeId: id }),
}))

// селектор
export const useActiveTypeId = () => useMenuStore((s) => s.activeTypeId)
```

## Эффекты
- Полные зависимости. Асинхронность — с отменой/флагом.

```ts
export function useFetchMenuTypes(projectId: string) {
  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const items = await api.menu.getTypes(projectId)
      if (!cancelled) setTypes(items)
    })()
    return () => { cancelled = true }
  }, [projectId])
}
```

## Стили
- Tailwind как основной слой. Классы собирать через `clsx`/`tailwind-merge`.
- Не дублировать «магические» классы; выделять токены/композиции.

## Доступность
- ARIA‑атрибуты, видимый фокус, клавиатура. Меню/диалоги — ловля фокуса и esc.

## Тестирование
- React Testing Library для unit; e2e — Playwright.

## Навигация
Назад: `./README.md`