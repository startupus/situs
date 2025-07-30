import { z } from 'zod';

/**
 * Validation Schemas - Схемы валидации данных с использованием Zod
 * Обеспечивают строгую типизацию и валидацию входящих данных
 */

// Базовые схемы для переиспользования
const emailSchema = z.string().email('Некорректный формат email');
const passwordSchema = z.string().min(6, 'Пароль должен содержать минимум 6 символов');
const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефисы');
const uuidSchema = z.string().uuid('Некорректный формат ID');

// Схемы для пользователей
export const UserSchemas = {
  // Регистрация пользователя
  register: z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя не должно превышать 50 символов').optional(),
    lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия не должна превышать 50 символов').optional()
  }),

  // Авторизация пользователя
  login: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Пароль обязателен')
  }),

  // Создание пользователя админом
  create: z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя не должно превышать 50 символов').optional(),
    lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия не должна превышать 50 символов').optional(),
    role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER'),
    isActive: z.boolean().default(true)
  }),

  // Обновление пользователя
  update: z.object({
    email: emailSchema.optional(),
    firstName: z.string().min(1, 'Имя не может быть пустым').max(50, 'Имя не должно превышать 50 символов').optional(),
    lastName: z.string().min(1, 'Фамилия не может быть пустой').max(50, 'Фамилия не должна превышать 50 символов').optional(),
    role: z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
    isActive: z.boolean().optional()
  }),

  // Изменение пароля
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Текущий пароль обязателен'),
    newPassword: passwordSchema
  }),

  // Восстановление пароля
  forgotPassword: z.object({
    email: emailSchema
  }),

  // Сброс пароля
  resetPassword: z.object({
    token: z.string().min(1, 'Токен обязателен'),
    newPassword: passwordSchema
  })
};

// Схемы для проектов
export const ProjectSchemas = {
  // Создание проекта
  create: z.object({
    name: z.string().min(1, 'Название проекта обязательно').max(100, 'Название не должно превышать 100 символов'),
    description: z.string().max(500, 'Описание не должно превышать 500 символов').optional(),
    slug: slugSchema.optional(),
    type: z.enum(['WEBSITE', 'ECOMMERCE', 'LANDING', 'BLOG', 'APP']).default('WEBSITE'),
    domain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, 'Некорректный формат домена').optional(),
    customDomain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, 'Некорректный формат домена').optional(),
    settings: z.object({
      theme: z.enum(['light', 'dark', 'auto']).default('auto'),
      language: z.enum(['ru', 'en']).default('ru'),
      creationType: z.enum(['manual', 'ai']).default('manual')
    }).optional()
  }),

  // Обновление проекта
  update: z.object({
    name: z.string().min(1, 'Название проекта не может быть пустым').max(100, 'Название не должно превышать 100 символов').optional(),
    description: z.string().max(500, 'Описание не должно превышать 500 символов').optional(),
    type: z.enum(['WEBSITE', 'ECOMMERCE', 'LANDING', 'BLOG', 'APP']).optional(),
    domain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, 'Некорректный формат домена').optional(),
    customDomain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, 'Некорректный формат домена').optional(),
    settings: z.object({
      theme: z.enum(['light', 'dark', 'auto']),
      language: z.enum(['ru', 'en']),
      creationType: z.enum(['manual', 'ai'])
    }).partial().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    isPublished: z.boolean().optional()
  }),

  // Фильтры для получения проектов
  filters: z.object({
    search: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    sortBy: z.enum(['name', 'updated', 'created']).default('updated'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
};

// Схемы для страниц
export const PageSchemas = {
  // Создание страницы
  create: z.object({
    title: z.string().min(1, 'Заголовок страницы обязателен').max(200, 'Заголовок не должен превышать 200 символов'),
    slug: z.string().min(1, 'Slug обязателен').regex(/^[a-z0-9-\/]+$/, 'Slug может содержать только строчные буквы, цифры, дефисы и слеши'),
    content: z.any().optional(), // JSON содержимое страницы
    projectId: uuidSchema,
    isHomePage: z.boolean().default(false),
    metaTitle: z.string().max(60, 'Meta title не должен превышать 60 символов').optional(),
    metaDescription: z.string().max(160, 'Meta description не должно превышать 160 символов').optional()
  }),

  // Обновление страницы
  update: z.object({
    title: z.string().min(1, 'Заголовок страницы не может быть пустым').max(200, 'Заголовок не должен превышать 200 символов').optional(),
    slug: z.string().min(1, 'Slug не может быть пустым').regex(/^[a-z0-9-\/]+$/, 'Slug может содержать только строчные буквы, цифры, дефисы и слеши').optional(),
    content: z.any().optional(),
    isHomePage: z.boolean().optional(),
    metaTitle: z.string().max(60, 'Meta title не должен превышать 60 символов').optional(),
    metaDescription: z.string().max(160, 'Meta description не должно превышать 160 символов').optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional()
  }),

  // Дублирование страницы
  duplicate: z.object({
    title: z.string().min(1, 'Заголовок для копии обязателен').max(200, 'Заголовок не должен превышать 200 символов').optional()
  }),

  // Фильтры для получения страниц
  filters: z.object({
    projectId: uuidSchema.optional(),
    search: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    isHomePage: z.boolean().optional(),
    sortBy: z.enum(['title', 'created', 'updated']).default('updated'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
};

// Схемы для параметров запроса
export const ParamSchemas = {
  // ID в параметрах URL
  id: z.object({
    id: uuidSchema
  }),

  // Project ID и Slug
  projectSlug: z.object({
    projectId: uuidSchema,
    slug: z.string().min(1, 'Slug обязателен')
  }),

  // Пагинация
  pagination: z.object({
    page: z.string().regex(/^\d+$/, 'Номер страницы должен быть числом').transform(Number).refine(n => n > 0, 'Номер страницы должен быть больше 0').default('1'),
    limit: z.string().regex(/^\d+$/, 'Лимит должен быть числом').transform(Number).refine(n => n > 0 && n <= 100, 'Лимит должен быть от 1 до 100').default('10')
  })
};

// Общие схемы
export const CommonSchemas = {
  // Фильтры пользователей для админа
  userFilters: z.object({
    search: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
    isActive: z.string().transform(val => val === 'true' ? true : val === 'false' ? false : undefined).optional(),
    sortBy: z.enum(['email', 'firstName', 'created', 'lastLogin']).default('created'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }),

  // Массовые операции
  bulkDelete: z.object({
    ids: z.array(uuidSchema).min(1, 'Должен быть указан хотя бы один ID')
  }),

  // Поиск
  search: z.object({
    q: z.string().min(1, 'Поисковый запрос не может быть пустым').max(100, 'Поисковый запрос не должен превышать 100 символов')
  })
};

// Экспорт всех схем для удобства
export const ValidationSchemas = {
  User: UserSchemas,
  Project: ProjectSchemas,
  Page: PageSchemas,
  Params: ParamSchemas,
  Common: CommonSchemas
};

// Типы для TypeScript на основе схем
export type CreateUserRequest = z.infer<typeof UserSchemas.create>;
export type UpdateUserRequest = z.infer<typeof UserSchemas.update>;
export type LoginRequest = z.infer<typeof UserSchemas.login>;
export type RegisterRequest = z.infer<typeof UserSchemas.register>;

export type CreateProjectRequest = z.infer<typeof ProjectSchemas.create>;
export type UpdateProjectRequest = z.infer<typeof ProjectSchemas.update>;
export type ProjectFilters = z.infer<typeof ProjectSchemas.filters>;

export type CreatePageRequest = z.infer<typeof PageSchemas.create>;
export type UpdatePageRequest = z.infer<typeof PageSchemas.update>;
export type PageFilters = z.infer<typeof PageSchemas.filters>;

export type IdParam = z.infer<typeof ParamSchemas.id>;
export type ProjectSlugParam = z.infer<typeof ParamSchemas.projectSlug>;
export type PaginationQuery = z.infer<typeof ParamSchemas.pagination>;