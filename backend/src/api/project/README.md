# Project API

API для управления проектами и их продуктами.

## Структура

```
api/project/
├── controllers/          # Контроллеры для обработки запросов
│   ├── product/         # Контроллеры продуктов (разбиты на отдельные файлы)
│   │   ├── find.ts      # Поиск продуктов
│   │   ├── findOne.ts   # Получение одного продукта
│   │   ├── create.ts    # Создание продукта
│   │   ├── update.ts    # Обновление продукта
│   │   └── delete.ts    # Удаление продукта
│   ├── product.ts       # Основной контроллер продуктов
│   └── project.ts       # Контроллер проектов
├── services/            # Бизнес-логика
│   ├── product/         # Сервисы продуктов (разбиты на отдельные файлы)
│   │   ├── find.ts      # Логика поиска продуктов
│   │   ├── findOne.ts   # Логика получения продукта
│   │   ├── create.ts    # Логика создания продукта
│   │   ├── update.ts    # Логика обновления продукта
│   │   └── delete.ts    # Логика удаления продукта
│   ├── product.ts       # Основной сервис продуктов
│   └── project.ts       # Сервис проектов
└── routes/              # Роуты API
    └── products.ts      # Роуты для продуктов
```

## API Endpoints

### Проекты
- `GET /api/projects` - получить список проектов
- `GET /api/projects/:id` - получить проект по ID
- `POST /api/projects` - создать новый проект
- `PUT /api/projects/:id` - обновить проект
- `DELETE /api/projects/:id` - удалить проект

### Продукты проекта
- `GET /api/projects/:projectId/products` - получить список продуктов проекта
- `GET /api/projects/:projectId/products/:productId` - получить продукт по ID
- `POST /api/projects/:projectId/products` - создать новый продукт
- `PUT /api/projects/:projectId/products/:productId` - обновить продукт
- `DELETE /api/projects/:projectId/products/:productId` - удалить продукт

## Типы продуктов

- `WEBSITE` - Веб-сайт
- `STORE` - Интернет-магазин
- `SCHOOL` - Образовательная платформа
- `CHATBOT` - Чат-бот
- `BLOG` - Блог

## Статусы продуктов

- `DRAFT` - Черновик
- `PUBLISHED` - Опубликован
- `ARCHIVED` - В архиве


