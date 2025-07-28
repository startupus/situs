import { z } from 'zod';

// Схема валидации окружения для Gateway Service
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET должен быть не менее 32 символов'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().default('*'),
  
  // Service URLs
  HUBUS_PROXY_URL: z.string().url(),
  HUBUS_AGENTS_URL: z.string().url(),
  HUBUS_PROVIDER_URL: z.string().url(),
  HUBUS_CLIENT_URL: z.string().url(),
  LOGINUS_URL: z.string().url(),
  BILINGUS_URL: z.string().url(),
  SITUS_URL: z.string().url(),
  DASHBOARD_URL: z.string().url(),
  CHAT_URL: z.string().url(),
  
  // Rate limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('1000'),
  
  // Security
  SESSION_SECRET: z.string().min(32).default('default-session-secret-min-32-chars'),
  COOKIE_SECURE: z.string().transform(val => val === 'true').default('false'),
});

type Environment = z.infer<typeof environmentSchema>;

class GatewayEnvironmentConfig {
  private config: Environment;

  constructor() {
    this.config = this.validateEnvironment();
  }

  private validateEnvironment(): Environment {
    try {
      return environmentSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Ошибка валидации окружения Gateway Service:');
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
  getProxyUrl(): string {
    return this.config.HUBUS_PROXY_URL;
  }

  getAgentsUrl(): string {
    return this.config.HUBUS_AGENTS_URL;
  }

  getProviderUrl(): string {
    return this.config.HUBUS_PROVIDER_URL;
  }

  getClientUrl(): string {
    return this.config.HUBUS_CLIENT_URL;
  }

  getLoginusUrl(): string {
    return this.config.LOGINUS_URL;
  }

  getBilingusUrl(): string {
    return this.config.BILINGUS_URL;
  }

  getSitusUrl(): string {
    return this.config.SITUS_URL;
  }

  getDashboardUrl(): string {
    return this.config.DASHBOARD_URL;
  }

  getChatUrl(): string {
    return this.config.CHAT_URL;
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

  // Полная конфигурация для тестов
  getAllConfig() {
    return this.config;
  }
}

export const config = new GatewayEnvironmentConfig();
export default config; 