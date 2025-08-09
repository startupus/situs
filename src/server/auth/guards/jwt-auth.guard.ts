import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard для JWT авторизации
 * 
 * Используется для защиты приватных endpoint'ов
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
