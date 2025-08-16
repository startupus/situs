# Common Module

- GlobalExceptionFilter: единый ответ ошибок `{ success: false, statusCode, message, error, errorCode, traceId, ... }`
- LoggingInterceptor: логирует метод/URL/статус/время
- ValidationPipe: `class-validator`, глобально подключён в `main.ts` с `whitelist: true, transform: true`
- Decorators: `@Roles()`, `@Scopes()` для глобальных ролей и скоупов
- Guards: `RolesGuard` (скелет), рекомендуется подключать совместно с JWT в контроллерах
- Middleware: `TenantResolverMiddleware` — добавляет `req.tenant` на основе Host
