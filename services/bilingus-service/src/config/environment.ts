import { z } from 'zod';

// Схема валидации окружения для Bilingus Service
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3003'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET должен быть не менее 32 символов'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().default('*'),
  
  // Payment Gateways
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  
  // Transaction Limits
  MAX_TRANSACTION_AMOUNT: z.string().transform(Number).default('10000'),
  MIN_TRANSACTION_AMOUNT: z.string().transform(Number).default('0.01'),
  
  // Multi-currency
  SUPPORTED_CURRENCIES: z.string().default('USD,EUR,RUB,CNY,INR'),
  DEFAULT_CURRENCY: z.string().default('USD'),
  EXCHANGE_RATE_API_KEY: z.string().optional(),
  EXCHANGE_RATE_PROVIDER: z.string().default('exchangerate-api'),
  
  // Security
  WEBHOOK_SECRET: z.string().min(32).default('default-webhook-secret-min-32-chars'),
  SESSION_SECRET: z.string().min(32).default('default-session-secret-min-32-chars'),
  
  // PCI DSS Compliance
  PCI_COMPLIANCE_ENABLED: z.string().transform(val => val === 'true').default('true'),
  ENCRYPTION_KEY: z.string().min(32).default('default-encryption-key-min-32-chars'),
});

type Environment = z.infer<typeof environmentSchema>;

class BilingusEnvironmentConfig {
  private config: Environment;

  constructor() {
    this.config = this.validateEnvironment();
  }

  private validateEnvironment(): Environment {
    try {
      return environmentSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Ошибка валидации окружения Bilingus Service:');
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

  // Payment Gateways
  getStripeConfig() {
    return {
      secretKey: this.config.STRIPE_SECRET_KEY,
      webhookSecret: this.config.STRIPE_WEBHOOK_SECRET,
    };
  }

  getPayPalConfig() {
    return {
      clientId: this.config.PAYPAL_CLIENT_ID,
      clientSecret: this.config.PAYPAL_CLIENT_SECRET,
    };
  }

  // Transaction Limits
  getTransactionLimits() {
    return {
      max: this.config.MAX_TRANSACTION_AMOUNT,
      min: this.config.MIN_TRANSACTION_AMOUNT,
    };
  }

  // Multi-currency
  getSupportedCurrencies(): string[] {
    return this.config.SUPPORTED_CURRENCIES.split(',');
  }

  getDefaultCurrency(): string {
    return this.config.DEFAULT_CURRENCY;
  }

  getExchangeRateConfig() {
    return {
      apiKey: this.config.EXCHANGE_RATE_API_KEY,
      provider: this.config.EXCHANGE_RATE_PROVIDER,
    };
  }

  // Security
  getWebhookConfig() {
    return {
      secret: this.config.WEBHOOK_SECRET,
    };
  }

  getSessionSecret(): string {
    return this.config.SESSION_SECRET;
  }

  // PCI DSS Compliance
  isPciComplianceEnabled(): boolean {
    return this.config.PCI_COMPLIANCE_ENABLED;
  }

  getEncryptionKey(): string {
    return this.config.ENCRYPTION_KEY;
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

  // Проверка наличия платежных шлюзов
  hasPaymentGateways(): boolean {
    return !!(this.config.STRIPE_SECRET_KEY || this.config.PAYPAL_CLIENT_ID);
  }

  // Полная конфигурация для тестов
  getAllConfig() {
    return this.config;
  }
}

export const config = new BilingusEnvironmentConfig();
export default config; 