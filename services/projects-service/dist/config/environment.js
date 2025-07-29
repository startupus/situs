import { z } from 'zod';
const environmentSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3009'),
    DATABASE_URL: z.string().url('Некорректный DATABASE_URL'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET должен быть не менее 32 символов'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    CORS_ORIGIN: z.string().default('*'),
    LOGINUS_URL: z.string().url().default('http://localhost:3001'),
    BILINGUS_URL: z.string().url().default('http://localhost:3003'),
    GATEWAY_URL: z.string().url().default('http://localhost:3000'),
    RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX: z.string().transform(Number).default('1000'),
    SESSION_SECRET: z.string().min(32).default('default-session-secret-min-32-chars-projects'),
    COOKIE_SECURE: z.string().transform(val => val === 'true').default('false'),
    DEFAULT_SITUS_DOMAIN: z.string().default('situs.com'),
    ENABLE_CUSTOM_DOMAINS: z.string().transform(val => val === 'true').default('true'),
    UPLOAD_PATH: z.string().default('./uploads'),
    MAX_FILE_SIZE: z.string().transform(Number).default('10485760'),
});
class ProjectsEnvironmentConfig {
    config;
    constructor() {
        this.config = this.validateEnvironment();
    }
    validateEnvironment() {
        try {
            return environmentSchema.parse(process.env);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                console.error('❌ Ошибка валидации окружения Projects Service:');
                error.errors.forEach(err => {
                    console.error(`  - ${err.path.join('.')}: ${err.message}`);
                });
            }
            process.exit(1);
        }
    }
    getNodeEnv() {
        return this.config.NODE_ENV;
    }
    getPort() {
        return this.config.PORT;
    }
    getDatabaseUrl() {
        return this.config.DATABASE_URL;
    }
    getJwtSecret() {
        return this.config.JWT_SECRET;
    }
    getLogLevel() {
        return this.config.LOG_LEVEL;
    }
    getCorsOrigin() {
        return this.config.CORS_ORIGIN;
    }
    getLoginusUrl() {
        return this.config.LOGINUS_URL;
    }
    getBilingusUrl() {
        return this.config.BILINGUS_URL;
    }
    getGatewayUrl() {
        return this.config.GATEWAY_URL;
    }
    isDevelopment() {
        return this.config.NODE_ENV === 'development';
    }
    isProduction() {
        return this.config.NODE_ENV === 'production';
    }
    isTest() {
        return this.config.NODE_ENV === 'test';
    }
    getRateLimitConfig() {
        return {
            windowMs: this.config.RATE_LIMIT_WINDOW,
            max: this.config.RATE_LIMIT_MAX,
        };
    }
    getSessionSecret() {
        return this.config.SESSION_SECRET;
    }
    isCookieSecure() {
        return this.config.COOKIE_SECURE;
    }
    getDefaultSitusDomain() {
        return this.config.DEFAULT_SITUS_DOMAIN;
    }
    isCustomDomainsEnabled() {
        return this.config.ENABLE_CUSTOM_DOMAINS;
    }
    getUploadPath() {
        return this.config.UPLOAD_PATH;
    }
    getMaxFileSize() {
        return this.config.MAX_FILE_SIZE;
    }
    getAllConfig() {
        return this.config;
    }
}
export const config = new ProjectsEnvironmentConfig();
export default config;
//# sourceMappingURL=environment.js.map