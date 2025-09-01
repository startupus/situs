# Меню (Joomla‑like)

Назначение: стандарты системы меню, иерархии, мультиязычности и роутинга.

## Чеклист реализации
- [x] Типы меню и пунктов (`src/types/menu.ts`)
- [x] Иерархия и родительские связи (бесконечная вложенность)
- [x] Языковые версии и параметры (вкладки/JSON)
- [x] Lookup-таблица и правила маршрутизации (`src/server/menus/*`)
- [x] Фронтенд‑редактор пунктов меню (UI/UX)

## Типы и данные
- Источник типов: `src/types/menu.ts` (аналог концепций Joomla — `menutype`, `menuitem`, `params`).
- Параметры пунктов — JSON с явными типами; хранение и валидация централизованы.

### Пример типа пункта
```ts
export interface MenuItem {
  id: string
  parentId: string | null
  type: 'link' | 'page' | 'category'
  title: string
  alias: string
  isActive: boolean
  order: number
  params: Record<string, unknown>
}
```

## Иерархия
- Бесконечная вложенность через родительские ссылки и упорядочивание.
- Операции: перемещение узлов, смена порядка, пакетная обработка.

### Lookup для роутинга
```ts
export function buildMenuLookup(items: Pick<MenuItem, 'id' | 'parentId'>[]) {
  const children = new Map<string, string[]>()
  for (const item of items) {
    const pid = item.parentId ?? '__root__'
    const list = children.get(pid) ?? []
    list.push(item.id)
    children.set(pid, list)
  }
  return children
}
```

## Мультиязычность
- Языковые версии через вкладки/параметры пункта, без дублирования структуры.
- Поля локализации отделены от структурных полей.

## UI/UX редактора
- `src/components/admin/menu/*`: drag & drop с бесконечной вложенностью, модалки редактирования, фильтры.
- Реалтайм‑синхронизация через SSE.

### Чеклист UI
- [ ] DnD и визуальная подсветка допустимых позиций
- [ ] Пакетные действия (вкл/выкл/удаление)
- [ ] Валидация alias/title на клиенте
- [ ] Предпросмотр URL и статуса

## Навигация
Назад: `./README.md`