import Joi from 'joi';

// Базовые схемы
const slugSchema = Joi.string()
  .min(1)
  .max(100)
  .pattern(/^[a-z0-9-]+$/)
  .message('Слаг может содержать только строчные буквы, цифры и дефисы');

const domainSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)
  .message('Некорректный формат домена');

const projectNameSchema = Joi.string()
  .min(1)
  .max(100)
  .required()
  .messages({
    'string.empty': 'Название проекта не может быть пустым',
    'string.max': 'Название проекта не может быть длиннее 100 символов',
    'any.required': 'Название проекта обязательно для заполнения'
  });

// Схема для создания проекта
export const createProjectSchema = Joi.object({
  name: projectNameSchema,
  
  description: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Описание не может быть длиннее 500 символов'
    }),
  
  slug: slugSchema.optional(),
  
  type: Joi.string()
    .valid('WEBSITE', 'ECOMMERCE', 'LANDING', 'BLOG', 'APP')
    .default('WEBSITE')
    .optional(),
  
  domain: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .min(3)
    .max(63)
    .optional()
    .messages({
      'string.pattern.base': 'Домен может содержать только строчные буквы, цифры и дефисы'
    }),
  
  customDomain: domainSchema.optional(),
  
  settings: Joi.object({
    theme: Joi.string()
      .valid('light', 'dark', 'auto')
      .default('auto')
      .optional(),
    
    language: Joi.string()
      .valid('ru', 'en')
      .default('ru')
      .optional(),
    
    creationType: Joi.string()
      .valid('manual', 'ai')
      .default('manual')
      .optional()
  }).optional()
}).options({ stripUnknown: true });

// Схема для обновления проекта
export const updateProjectSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Название проекта не может быть пустым',
      'string.max': 'Название проекта не может быть длиннее 100 символов'
    }),
  
  description: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Описание не может быть длиннее 500 символов'
    }),
  
  type: Joi.string()
    .valid('WEBSITE', 'ECOMMERCE', 'LANDING', 'BLOG', 'APP')
    .optional(),
  
  domain: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .min(3)
    .max(63)
    .optional()
    .messages({
      'string.pattern.base': 'Домен может содержать только строчные буквы, цифры и дефисы'
    }),
  
  customDomain: domainSchema.optional(),
  
  settings: Joi.object({
    theme: Joi.string()
      .valid('light', 'dark', 'auto')
      .optional(),
    
    language: Joi.string()
      .valid('ru', 'en')
      .optional(),
    
    creationType: Joi.string()
      .valid('manual', 'ai')
      .optional()
  }).optional(),
  
  // SEO поля
  metaTitle: Joi.string()
    .max(60)
    .optional()
    .messages({
      'string.max': 'Meta title не может быть длиннее 60 символов'
    }),
  
  metaDescription: Joi.string()
    .max(160)
    .optional()
    .messages({
      'string.max': 'Meta description не может быть длиннее 160 символов'
    }),
  
  metaKeywords: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Meta keywords не может быть длиннее 255 символов'
    })
}).options({ stripUnknown: true });

// Схема для изменения статуса проекта
export const updateProjectStatusSchema = Joi.object({
  status: Joi.string()
    .valid('DRAFT', 'DEVELOPMENT', 'STAGING', 'PUBLISHED', 'ARCHIVED')
    .required()
    .messages({
      'any.required': 'Статус обязателен для заполнения',
      'any.only': 'Недопустимый статус проекта'
    })
}).options({ stripUnknown: true });

// Схема для запросов списка проектов
export const getProjectsQuerySchema = Joi.object({
  search: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Поисковый запрос не может быть длиннее 100 символов'
    }),
  
  status: Joi.string()
    .valid('DRAFT', 'DEVELOPMENT', 'STAGING', 'PUBLISHED', 'ARCHIVED')
    .optional(),
  
  type: Joi.string()
    .valid('WEBSITE', 'ECOMMERCE', 'LANDING', 'BLOG', 'APP')
    .optional(),
  
  sortBy: Joi.string()
    .valid('name', 'updated', 'created')
    .default('updated')
    .optional(),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .optional(),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional()
}).options({ stripUnknown: true });

// Схема для создания страницы
export const createPageSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Заголовок страницы не может быть пустым',
      'string.max': 'Заголовок страницы не может быть длиннее 200 символов',
      'any.required': 'Заголовок страницы обязателен для заполнения'
    }),
  
  slug: Joi.string()
    .pattern(/^[a-z0-9-\/]+$/)
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.pattern.base': 'Слаг может содержать только строчные буквы, цифры, дефисы и слеши',
      'any.required': 'Слаг страницы обязателен для заполнения'
    }),
  
  content: Joi.object().optional(),
  
  isHomePage: Joi.boolean()
    .default(false)
    .optional(),
  
  metaTitle: Joi.string()
    .max(60)
    .optional(),
  
  metaDescription: Joi.string()
    .max(160)
    .optional(),
  
  metaKeywords: Joi.string()
    .max(255)
    .optional()
}).options({ stripUnknown: true });

// Схема для обновления страницы
export const updatePageSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .optional()
    .messages({
      'string.empty': 'Заголовок страницы не может быть пустым',
      'string.max': 'Заголовок страницы не может быть длиннее 200 символов'
    }),
  
  content: Joi.object().optional(),
  
  metaTitle: Joi.string()
    .max(60)
    .optional(),
  
  metaDescription: Joi.string()
    .max(160)
    .optional(),
  
  metaKeywords: Joi.string()
    .max(255)
    .optional()
}).options({ stripUnknown: true });

// Утилитарные функции для валидации
export const validateRequest = (schema: Joi.Schema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Ошибка валидации данных',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.Schema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Ошибка валидации параметров запроса',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.query = value;
    next();
  };
};

export const validateParams = (schema: Joi.Schema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.params);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Ошибка валидации параметров',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.params = value;
    next();
  };
};