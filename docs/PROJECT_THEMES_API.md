# Проектные темы — API (MVP)

## Эндпоинты

- GET `/api/projects/:projectId/theme`
  - Описание: Получить активную конфигурацию темы проекта (ThemeConfig).
  - Ответ: `{ success: true, data: ThemeConfig }`

- PUT `/api/projects/:projectId/theme`
  - Описание: Сохранить активную конфигурацию темы проекта.
  - Тело: `ThemeConfig` (DualThemeVariant — `colors.light` и `colors.dark`).
  - Ответ: `{ success: true }`
  - Побочный эффект: В `projects.settings.themeUsage` увеличивается `timesSaved`, обновляются `lastUpdatedAt`, `lastThemeId`.

- GET `/api/projects/:projectId/theme/active`
  - Описание: Публичный алиас для получения активной темы (аналогично GET `/theme`).
  - Ответ: `{ success: true, data: ThemeConfig }`

- GET `/api/projects/:projectId/theme/usage`
  - Описание: Получить статистику использования темы проекта.
  - Ответ: `{ success: true, data: { lastUpdatedAt?: string, lastThemeId?: string, timesSaved?: number } }`

## Формат ThemeConfig (MVP)

```ts
interface ThemeColors { /* primary, primaryHover, ... borderLight */ }
interface DualThemeVariant { light: ThemeColors; dark: ThemeColors }
interface ThemeConfig {
  id: string;
  name: string;
  colors: DualThemeVariant;
  typography?: any;
  layout?: any;
  animations?: any;
  gradients?: any;
  customCss?: string;
}
```

## Замечания
- Данные хранятся в `projects.theme` (JSON-строка).
- Вспомогательная статистика — в `projects.settings.themeUsage`.
- Предпросмотр на клиенте реализован через `ThemeContext` и CSS-переменные.
- Расширенная функциональность (мульти‑темность, шаблоны) относится к Фазе 2.