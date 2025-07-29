import winston from 'winston';
declare const logger: winston.Logger;
export declare const projectsLogger: {
    error: (message: string, meta?: any) => winston.Logger;
    warn: (message: string, meta?: any) => winston.Logger;
    info: (message: string, meta?: any) => winston.Logger;
    debug: (message: string, meta?: any) => winston.Logger;
    projectCreated: (projectId: string, userId: string, projectName: string) => void;
    projectUpdated: (projectId: string, userId: string, changes: any) => void;
    projectDeleted: (projectId: string, userId: string) => void;
    projectPublished: (projectId: string, userId: string, domain?: string) => void;
    authAttempt: (userId: string, success: boolean, ip?: string) => void;
    apiRequest: (method: string, url: string, userId?: string, responseTime?: number) => void;
    securityEvent: (event: string, details: any) => void;
    performanceMetric: (metric: string, value: number, context?: any) => void;
};
export { logger };
export default projectsLogger;
//# sourceMappingURL=logger.d.ts.map