import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard для локальной аутентификации
 *
 * Используется для защиты endpoint'а входа в систему
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
