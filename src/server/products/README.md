# Products Module

- Глобальные маршруты продуктов: `GET /api/products`, `POST /api/products`, `GET /api/products/:id`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- Вложенные маршруты в проекте: `/api/projects/:projectId/products/...`
- DTO: `CreateProductDto`, `UpdateProductDto`, `ProductQueryDto` (class-validator)
- Единый ответ API: `{ success, data, error }`

Все новые продукты в проекте WEBSITE автоматически создают типовые страницы (Главная/О компании/...).
