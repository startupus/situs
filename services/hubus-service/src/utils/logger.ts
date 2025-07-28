import winston from 'winston';
import { config } from '../config/environment.js';

// Форматы для логов
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Консольный формат для разработки
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

// Создание логгера
const logger = winston.createLogger({
  level: config.getLogLevel(),
  format: logFormat,
  defaultMeta: { service: 'hubus-service' },
  transports: [
    // Файл для ошибок
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Файл для всех логов
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Добавляем консольный транспорт для разработки
if (config.isDevelopment()) {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Создаем папку для логов если её нет
import { mkdirSync } from 'fs';
import { dirname } from 'path';

try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Папка уже существует
}

export { logger }; 