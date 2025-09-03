# Безопасность

Назначение: минимальные стандарты безопасности на фронте и бэке.

## Ссылки в проекте

- `src/server/config/cors.config.ts`, `rate-limit.config.ts`, `env.validation.ts`

## AuthN/AuthZ

- Роли и уровни доступа (view levels) реализованы централизованно; проверка в гард/декораторах.
- Не доверять фронту. Все права — на сервере.

### Пример guard

```ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly requiredRole: string) {}
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.roles?.includes(this.requiredRole)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
```

## Валидация и санитизация

- Входные DTO — `class-validator` + `ValidationPipe` с `whitelist`, `forbidNonWhitelisted`.
- Санитизация строк/HTML там, где это необходимо. В React избегать `dangerouslySetInnerHTML`.

## Заголовки и CORS

- `helmet` на бэкенде; CORS с явным allowlist (см. конфиги).

```ts
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';

const app = await NestFactory.create(AppModule);
app.use(helmet());
app.enableCors({
  origin: ['http://localhost:5177'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## Секреты

- Не коммитить .env; хранить секреты в окружении/менеджерах секретов. Разделять dev/stage/prod.

## Логи

- Логи доступа, ошибок, аномалий; alerting на критические события.

## Навигация

Назад: `./README.md`
