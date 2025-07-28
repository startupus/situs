import { z } from 'zod';

// Схема валидации окружения
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3005'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET должен быть не менее 32 символов'),
  OPENROUTER_API_KEY: z.string().optional(),
  PROVIDER_SERVICE_URL: z.string().url().optional(),
  CLIENT_SERVICE_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('1000'),
  CIRCUIT_BREAKER_ENABLED: z.string().transform(val => val === 'true').default('false'),
  CIRCUIT_BREAKER_THRESHOLD: z.string().transform(Number).default('5'),
  LOAD_BALANCER_ALGORITHM: z.enum(['round-robin', 'least-connections', 'ip-hash']).default('round-robin'),
});

// Типы для конфигурации
type Environment = z.infer<typeof environmentSchema>;

// Класс конфигурации
class EnvironmentConfig {
  private config: Environment;

  constructor() {
    this.config = this.validateEnvironment();
  }

  private validateEnvironment(): Environment {
    try {
      return environmentSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Ошибка валидации окружения:');
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

  getOpenRouterApiKey(): string | undefined {
    return this.config.OPENROUTER_API_KEY;
  }

  getProviderServiceUrl(): string | undefined {
    return this.config.PROVIDER_SERVICE_URL;
  }

  getClientServiceUrl(): string | undefined {
    return this.config.CLIENT_SERVICE_URL;
  }

  getLogLevel(): string {
    return this.config.LOG_LEVEL;
  }

  getCorsOrigin(): string {
    return this.config.CORS_ORIGIN;
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

  // Конфигурация rate limiting
  getRateLimitConfig() {
    return {
      windowMs: this.config.RATE_LIMIT_WINDOW,
      max: this.config.RATE_LIMIT_MAX,
    };
  }

  // Конфигурация circuit breaker
  isCircuitBreakerEnabled(): boolean {
    return this.config.CIRCUIT_BREAKER_ENABLED;
  }

  getCircuitBreakerConfig() {
    return {
      threshold: this.config.CIRCUIT_BREAKER_THRESHOLD,
    };
  }

  // Конфигурация load balancer
  getLoadBalancerAlgorithm(): string {
    return this.config.LOAD_BALANCER_ALGORITHM;
  }

  // Полная конфигурация для тестов
  getAllConfig() {
    return this.config;
  }
}

// Экспорт экземпляра конфигурации
export const config = new EnvironmentConfig();

// Экспорт для совместимости с тестами
export default config; 