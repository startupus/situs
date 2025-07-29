declare class ProjectsEnvironmentConfig {
    private config;
    constructor();
    private validateEnvironment;
    getNodeEnv(): string;
    getPort(): number;
    getDatabaseUrl(): string;
    getJwtSecret(): string;
    getLogLevel(): string;
    getCorsOrigin(): string;
    getLoginusUrl(): string;
    getBilingusUrl(): string;
    getGatewayUrl(): string;
    isDevelopment(): boolean;
    isProduction(): boolean;
    isTest(): boolean;
    getRateLimitConfig(): {
        windowMs: number;
        max: number;
    };
    getSessionSecret(): string;
    isCookieSecure(): boolean;
    getDefaultSitusDomain(): string;
    isCustomDomainsEnabled(): boolean;
    getUploadPath(): string;
    getMaxFileSize(): number;
    getAllConfig(): {
        NODE_ENV: "development" | "production" | "test";
        PORT: number;
        DATABASE_URL: string;
        JWT_SECRET: string;
        LOG_LEVEL: "error" | "warn" | "info" | "debug";
        CORS_ORIGIN: string;
        LOGINUS_URL: string;
        BILINGUS_URL: string;
        GATEWAY_URL: string;
        RATE_LIMIT_WINDOW: number;
        RATE_LIMIT_MAX: number;
        SESSION_SECRET: string;
        COOKIE_SECURE: boolean;
        DEFAULT_SITUS_DOMAIN: string;
        ENABLE_CUSTOM_DOMAINS: boolean;
        UPLOAD_PATH: string;
        MAX_FILE_SIZE: number;
    };
}
export declare const config: ProjectsEnvironmentConfig;
export default config;
//# sourceMappingURL=environment.d.ts.map