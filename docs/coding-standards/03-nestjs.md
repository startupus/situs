# NestJS (Backend)

Назначение: стандарты модульной архитектуры, DTO, валидации и исключений.

## Чеклист реализации
- [x] Структура модулей, контроллеров, сервисов и сущностей
- [x] DTO и валидация (class-validator, class-transformer)
- [x] Исключения и обработка ошибок (HTTP exeptions)
- [x] Провайдеры, DI и инверсия зависимостей
- [x] Логирование и метрики
- [x] ORM-границы: Prisma/TypeORM на модуль, не смешивать внутри
- [x] Тестирование сервисов и контроллеров

## Архитектура модулей
- По доменам: `src/server/<domain>/*` с файлами `*.module.ts`, `*.controller.ts`, `*.service.ts`, `entities/*`, `dto/*`.
- Контроллер — тонкий слой: маршрутизация, DTO/валидация, коды ответа. Бизнес‑логика — в сервисах.
- Репозитории/доступ к данным инкапсулировать в провайдерах слоя данных.

### Шаблон модуля
```ts
import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Шаблон контроллера
```ts
import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UserDto } from './dto/user.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  async getOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.getById(id)
    return UserDto.fromEntity(user)
  }
}
```

### Шаблон сервиса
```ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/src/server/database/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }
}
```

### DTO и маппинг
```ts
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class UserDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsEmail()
  email!: string

  static fromEntity(entity: { id: string; email: string }): UserDto {
    const dto = new UserDto()
    dto.id = entity.id
    dto.email = entity.email
    return dto
  }
}
```

## DTO и валидация
- DTO в `dto/*.ts`, классы с декораторами `class-validator` и `class-transformer`.
- Глобальные пайпы: `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.

## Исключения
- Использовать `HttpException` и производные (`BadRequestException`, `NotFoundException`, `ForbiddenException`, ...).
- Не возвращать «сырые» ошибки. Приводить доменные ошибки к HTTP‑исключениям.

## Провайдеры и DI
- Провайдеры объявлять в модуле, зависимости передавать через конструктор.
- Выносить интерфейсы/контракты в `src/types/*` при многократном использовании.

## Логирование и метрики
- Централизованный логгер и интерсепторы для логирования запросов/исключений.
- Метрики/тайминги для критических путей (при наличии).

## ORM‑границы
- В рамках одного домена придерживаться одного ORM: Prisma или TypeORM. Не смешивать внутри модуля.
- Транзакции — средствами выбранного ORM.

## Тестирование
- Юнит‑тесты сервисов/пайпов/гардов; интеграционные — для контроллеров (запуск в изолированном модуле).
- Инструменты: Vitest; Jest не использовать.

## Документация API
- Использовать Swagger декораторы (`@ApiTags`, `@ApiOperation`, `@ApiProperty`) для публичных контрактов.

## Навигация
Назад: `./README.md`