# Common Module

Общие элементы NestJS уровня приложения: фильтры, интерсепторы, пайпы.

## Состав
- `common.module.ts` — регистрация общих провайдеров
- `filters/global-exception.filter.ts` — единая обработка исключений
- `interceptors/logging.interceptor.ts` — базовое логирование
- `pipes/validation.pipe.ts` — глобальная валидация DTO

## Планы
- Расширить формат ошибок (коды/traceId)
- Добавить перехватчики аудита и метрик
