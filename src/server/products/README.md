# Products Module

Каркас для управления продуктами проекта (Website, Shop, Blog и др.). Единые правила маршрутов:
`/api/projects/:projectId/products/:productId/...`

## Состав
- `products.module.ts` — модуль NestJS
- `products.controller.ts` — общий CRUD/список продуктов проекта
- `project-products.controller.ts` — маршруты, привязанные к проекту
- `products.service.ts` — сервисная логика

## Взаимосвязи (Prisma)
- `Product.projectId → Project.id`
- `Product.type ∈ { WEBSITE, ECOMMERCE, BLOG, LANDING }`
- Website имеет `Page[]` (см. Pages Module), Shop — свои сущности (товар/категории и т.д.)

## Планы развития
- Строгое разделение Website vs Shop (без смешения с `Page`)
- Единые DTO и валидация (class-validator)
- Доменные операции: публикация продукта, статусы
- Маршруты совместимости для текущего фронта
