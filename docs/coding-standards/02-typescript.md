# TypeScript

Назначение: правила типизации и конфигурации TS для фронтенда и бэкенда.

## Чеклист реализации
- [x] Строгий режим и компилятор (tsconfig, include/exclude)
- [x] Типизация: избегать any, использовать unknown/never, дженерики
- [x] Интерфейсы и типы: когда interface vs type, Props
- [x] Enums и константы
- [x] Паттерны утилитных типов
- [x] ESLint правила и автофиксы

## Конфигурация
- Строгий режим включён (`strict: true`) в `tsconfig.json` и `tsconfig.server.json`.
- Использовать пути/алиасы из `paths` (`@/*`, `redaktus/*`) вместо глубоких относительных импортов.
- Проверять компиляцию без эмита на CI: `tsc -p tsconfig.server.json --noEmit` и `tsc -p tsconfig.json --noEmit`.

## Типизация
- Не использовать `any` без крайней необходимости. Предпочитать `unknown` с явным сужением.
- Использовать `never` для исчерпывающих проверок (exhaustive checks в switch по union‑типам).
- Дженерики — именовать понятно (`TEntity`, `TResponse`).
- Для readonly структур применять `as const` и `readonly` поля/массивы.

### unknown vs any
```ts
function parseJson(input: string): unknown {
  return JSON.parse(input)
}

const data = parseJson('{"x":1}')
// Don't: (любой доступ без сужения)
// console.log(data.foo)

// Do: сузить тип перед использованием
if (typeof data === 'object' && data !== null && 'x' in data) {
  const { x } = data as { x: number }
  console.log(x)
}
```

### Исчерпывающие проверки (never)
```ts
type Status = 'idle' | 'loading' | 'success' | 'error'

function getLabel(status: Status): string {
  switch (status) {
    case 'idle':
      return 'Готово'
    case 'loading':
      return 'Загрузка'
    case 'success':
      return 'Успех'
    case 'error':
      return 'Ошибка'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}
```

### Дженерики и возвраты
```ts
export interface ApiResponse<TData> {
  data: TData
  error?: string
}

export async function fetchEntity<TEntity>(id: string): Promise<ApiResponse<TEntity>> {
  const res = await api.get(`/entities/${id}`)
  return { data: res.data as TEntity }
}
```

## Interface vs type
- `interface` — для объектных контрактов, расширяемых и публичных API.
- `type` — для алиасов сложных типов (union/intersection), mapped/conditional типов.
- Пропсы компонентов называть `SomethingProps`.

## Enum и константы
- Избегать `enum` в UI‑слое; использовать `union` строковых литералов или объект‑константы `as const`.
- Для бэкенда допустимы enum (особенно при интеграции со схемой БД), но предпочтительнее union + маппинги.

## Утилитные типы
- Использовать стандартные `Partial`, `Required`, `Pick`, `Omit`, `Record`, `ReturnType` и т.д.
- Для глубоких структур — явные вспомогательные типы; избегать чрезмерно сложных conditional типов.

## ESLint
- Следовать правилам из `eslint.config.js` (`@typescript-eslint`): запрет неиспользуемых, запрет `any`, `require-await` и др.
- Автофикс: `npm run lint:fix`. Не игнорировать предупреждения «строгих» правил — постепенно приводить код.

## Навигация
Назад: `./README.md`