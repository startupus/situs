# UI/UX и доступность

Назначение: визуальная консистентность, взаимодействие и A11y.

## Чеклист реализации
- [x] Единые UI-паттерны (кнопки, формы, диалоги)
- [x] Tailwind токены и семантические классы
- [x] Контрасты, размеры, фокус-стили
- [x] Навигация с клавиатуры и ARIA
- [x] Скелетоны, состояния загрузки/ошибок/пусто

## Паттерны
- Переиспользуемые компоненты из `src/components/ui/*`; единые состояния disabled/error/loading.
- Диалоги/модалки — один паттерн на проект, ловля фокуса, esc/overlay click.

## Tailwind
- Консистентные токены (цвета/отступы/радиусы). Композиции классов — через `clsx`/`tailwind-merge`.
- Не дублировать стили, выделять семантические утилиты.

Пример кнопки с токенами:
```tsx
<button
  className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
>
  Сохранить
</button>
```

## Доступность
- Минимальный контраст текста/фона (WCAG AA). Видимые фокусы.
- ARIA‑атрибуты и роли для интерактивных элементов.

Пример ARIA и клавиатуры:
```tsx
<ul role="tree" aria-label="Меню проекта">
  <li role="treeitem" aria-expanded={true} tabIndex={0} onKeyDown={handleKey}>
    Главная
  </li>
</ul>

function handleKey(e: React.KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    // trigger action
  }
  if (e.key === 'ArrowRight') {
    // expand node
  }
}
```

## Состояния
- Для загрузки — skeleton/спиннер с описанием. Для пустых состояний — понятные заглушки.

## Навигация
Назад: `./README.md`