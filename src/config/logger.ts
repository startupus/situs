// Строго типизированный logger для production использования

export type LogMetadata = Record<string, unknown> | string | number | boolean | null;

export interface Logger {
  info(message: string, meta?: LogMetadata): void;
  error(message: string, error?: Error | LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  debug(message: string, meta?: LogMetadata): void;
}

// Production-ready logger implementation
export const logger: Logger = {
  info(message: string, meta?: LogMetadata): void {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level: 'INFO', message, meta };
    
    // В production здесь должен быть настоящий logger (Winston, Pino и т.д.)
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write(`${JSON.stringify(logEntry)  }\n`);
    }
  },
  
  error(message: string, error?: Error | LogMetadata): void {
    const timestamp = new Date().toISOString();
    const logEntry = { 
      timestamp, 
      level: 'ERROR', 
      message, 
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error 
    };
    
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`${JSON.stringify(logEntry)  }\n`);
    }
  },
  
  warn(message: string, meta?: LogMetadata): void {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level: 'WARN', message, meta };
    
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write(`${JSON.stringify(logEntry)  }\n`);
    }
  },
  
  debug(message: string, meta?: LogMetadata): void {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      const timestamp = new Date().toISOString();
      const logEntry = { timestamp, level: 'DEBUG', message, meta };
      
      process.stdout.write(`${JSON.stringify(logEntry)  }\n`);
    }
  }
};