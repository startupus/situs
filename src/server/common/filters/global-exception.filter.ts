import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Глобальный фильтр исключений
 * 
 * Обрабатывает все ошибки в приложении
 * и возвращает унифицированный формат ответа
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Внутренняя ошибка сервера';
    let error = 'Internal Server Error';
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
        errorCode = (exceptionResponse as any).code || (exception as any)?.name;
      }
    } else if (exception instanceof Error) {
      errorCode = exception.name;
    }

    const traceId = request.headers['x-request-id'] || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

    // Логирование ошибки
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message} [traceId=${traceId}]`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    // Ответ клиенту
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      errorCode,
      traceId,
    });
  }
}
