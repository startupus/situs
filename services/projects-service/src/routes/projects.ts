import { Router } from 'express';
import { ProjectsController } from '../controllers/projectsController.js';
import { authenticateToken, logRequest } from '../middleware/auth.js';
import { 
  validateRequest, 
  validateQuery,
  createProjectSchema,
  updateProjectSchema,
  updateProjectStatusSchema,
  getProjectsQuerySchema
} from '../validation/schemas.js';

const router = Router();

// Применяем middleware логирования и аутентификации ко всем маршрутам
router.use(logRequest);
router.use(authenticateToken);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Получить список проектов пользователя
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поисковый запрос
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, DEVELOPMENT, STAGING, PUBLISHED, ARCHIVED]
 *         description: Фильтр по статусу
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [WEBSITE, ECOMMERCE, LANDING, BLOG, APP]
 *         description: Фильтр по типу
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, updated, created]
 *           default: updated
 *         description: Поле для сортировки
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Порядок сортировки
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список проектов
 *       401:
 *         description: Не авторизован
 */
router.get('/', 
  validateQuery(getProjectsQuerySchema),
  ProjectsController.getProjects
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Получить проект по ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Данные проекта
 *       404:
 *         description: Проект не найден
 *       401:
 *         description: Не авторизован
 */
router.get('/:id', ProjectsController.getProject);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Создать новый проект
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Название проекта
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Описание проекта
 *               slug:
 *                 type: string
 *                 pattern: '^[a-z0-9-]+$'
 *                 description: Слаг проекта
 *               type:
 *                 type: string
 *                 enum: [WEBSITE, ECOMMERCE, LANDING, BLOG, APP]
 *                 default: WEBSITE
 *               domain:
 *                 type: string
 *                 description: Поддомен Situs
 *               customDomain:
 *                 type: string
 *                 description: Кастомный домен
 *               settings:
 *                 type: object
 *                 properties:
 *                   theme:
 *                     type: string
 *                     enum: [light, dark, auto]
 *                     default: auto
 *                   language:
 *                     type: string
 *                     enum: [ru, en]
 *                     default: ru
 *                   creationType:
 *                     type: string
 *                     enum: [manual, ai]
 *                     default: manual
 *     responses:
 *       201:
 *         description: Проект создан
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Конфликт (проект уже существует)
 *       401:
 *         description: Не авторизован
 */
router.post('/', 
  validateRequest(createProjectSchema),
  ProjectsController.createProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Обновить проект
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID проекта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               type:
 *                 type: string
 *                 enum: [WEBSITE, ECOMMERCE, LANDING, BLOG, APP]
 *               domain:
 *                 type: string
 *               customDomain:
 *                 type: string
 *               settings:
 *                 type: object
 *               metaTitle:
 *                 type: string
 *                 maxLength: 60
 *               metaDescription:
 *                 type: string
 *                 maxLength: 160
 *               metaKeywords:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       200:
 *         description: Проект обновлен
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Проект не найден
 *       401:
 *         description: Не авторизован
 */
router.put('/:id', 
  validateRequest(updateProjectSchema),
  ProjectsController.updateProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Удалить проект
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Проект удален
 *       404:
 *         description: Проект не найден
 *       401:
 *         description: Не авторизован
 */
router.delete('/:id', ProjectsController.deleteProject);

/**
 * @swagger
 * /api/projects/{id}/publish:
 *   patch:
 *     summary: Опубликовать проект
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Проект опубликован
 *       404:
 *         description: Проект не найден
 *       401:
 *         description: Не авторизован
 */
router.patch('/:id/publish', ProjectsController.publishProject);

/**
 * @swagger
 * /api/projects/{id}/unpublish:
 *   patch:
 *     summary: Снять проект с публикации
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Проект снят с публикации
 *       404:
 *         description: Проект не найден
 *       401:
 *         description: Не авторизован
 */
router.patch('/:id/unpublish', ProjectsController.unpublishProject);

/**
 * @swagger
 * /api/projects/{id}/status:
 *   patch:
 *     summary: Изменить статус проекта
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID проекта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DRAFT, DEVELOPMENT, STAGING, PUBLISHED, ARCHIVED]
 *     responses:
 *       200:
 *         description: Статус изменен
 *       400:
 *         description: Недопустимый статус
 *       404:
 *         description: Проект не найден
 *       401:
 *         description: Не авторизован
 */
router.patch('/:id/status', 
  validateRequest(updateProjectStatusSchema),
  ProjectsController.updateProjectStatus
);

/**
 * @swagger
 * /api/projects/check-slug/{slug}:
 *   get:
 *     summary: Проверить доступность слага
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Слаг для проверки
 *       - in: query
 *         name: exclude
 *         schema:
 *           type: string
 *         description: ID проекта для исключения из проверки
 *     responses:
 *       200:
 *         description: Результат проверки доступности
 */
router.get('/check-slug/:slug', ProjectsController.checkSlugAvailability);

/**
 * @swagger
 * /api/projects/check-domain/{domain}:
 *   get:
 *     summary: Проверить доступность домена
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Домен для проверки
 *       - in: query
 *         name: exclude
 *         schema:
 *           type: string
 *         description: ID проекта для исключения из проверки
 *     responses:
 *       200:
 *         description: Результат проверки доступности
 */
router.get('/check-domain/:domain', ProjectsController.checkDomainAvailability);

export default router;