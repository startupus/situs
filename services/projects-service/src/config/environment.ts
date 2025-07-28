import { z } from 'zod';

// Схема валидации окружения для Projects Service
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3009'),
  DATABASE_URL: z.string().url('Некорректный DATABASE_URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET должен быть не менее 32 символов'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().default('*'),
  
  // Service URLs для взаимодействия
  LOGINUS_URL: z.string().url().default('http://localhost:3001'),
  BILINGUS_URL: z.string().url().default('http://localhost:3003'),
  GATEWAY_URL: z.string().url().default('http://localhost:3000'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'), // 15 минут
  RATE_LIMIT_MAX: z.string().transform(Number).default('1000'),
  
  // Security
  SESSION_SECRET: z.string().min(32).default('default-session-secret-min-32-chars-projects'),
  COOKIE_SECURE: z.string().transform(val => val === 'true').default('false'),
  
  // Domain settings
  DEFAULT_SITUS_DOMAIN: z.string().default('situs.com'),
  ENABLE_CUSTOM_DOMAINS: z.string().transform(val => val === 'true').default('true'),
  
  // Storage
  UPLOAD_PATH: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
});

type Environment = z.infer<typeof environmentSchema>;

class ProjectsEnvironmentConfig {
  private config: Environment;

  constructor() {
    this.config = this.validateEnvironment();
  }

  private validateEnvironment(): Environment {
    try {
      return environmentSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Ошибка валидации окружения Projects Service:');
        error.errors.forEach(err => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
      }
      process.exit(1);
    }
  }

  // Основные методы
  getNodeEnv(): string {
    return this.config.NODE_ENV;
  }

  getPort(): number {
    return this.config.PORT;
  }

  getDatabaseUrl(): string {
    return this.config.DATABASE_URL;
  }

  getJwtSecret(): string {
    return this.config.JWT_SECRET;
  }

  getLogLevel(): string {
    return this.config.LOG_LEVEL;
  }

  getCorsOrigin(): string {
    return this.config.CORS_ORIGIN;
  }

  // Service URLs
  getLoginusUrl(): string {
    return this.config.LOGINUS_URL;
  }

  getBilingusUrl(): string {
    return this.config.BILINGUS_URL;
  }

  getGatewayUrl(): string {
    return this.config.GATEWAY_URL;
  }

  // Проверки окружения
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  // Rate limiting
  getRateLimitConfig() {
    return {
      windowMs: this.config.RATE_LIMIT_WINDOW,
      max: this.config.RATE_LIMIT_MAX,
    };
  }

  // Security
  getSessionSecret(): string {
    return this.config.SESSION_SECRET;
  }

  isCookieSecure(): boolean {
    return this.config.COOKIE_SECURE;
  }

  // Domain settings
  getDefaultSitusDomain(): string {
    return this.config.DEFAULT_SITUS_DOMAIN;
  }

  isCustomDomainsEnabled(): boolean {
    return this.config.ENABLE_CUSTOM_DOMAINS;
  }

  // Storage
  getUploadPath(): string {
    return this.config.UPLOAD_PATH;
  }

  getMaxFileSize(): number {
    return this.config.MAX_FILE_SIZE;
  }

  // Полная конфигурация для тестов
  getAllConfig() {
    return this.config;
  }
}

export const config = new ProjectsEnvironmentConfig();
export default config;