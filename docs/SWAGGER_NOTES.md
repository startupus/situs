# Swagger/OpenAPI Notes

- Подключить `@nestjs/swagger` в `main.ts` при необходимости:
  ```ts
  import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
  const config = new DocumentBuilder()
    .setTitle('Situs API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  ```
- Включить контроллеры: Auth, Projects, Pages, Products, Accounts, Domains, Realtime (описать SSE как текстовый stream).
- DTO уже аннотированы частью `@ApiProperty` (в users/auth); при необходимости добавить описания в созданные DTO.