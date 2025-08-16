import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * JWT стратегия для авторизации
 * 
 * Проверяет валидность JWT токена
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (configService && configService.get<string>('jwt.secret')) || process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  /**
   * Валидация токена и извлечение данных пользователя
   */
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      globalRole: payload.globalRole || 'BUSINESS',
      scopes: payload.scopes || [],
    };
  }
}
