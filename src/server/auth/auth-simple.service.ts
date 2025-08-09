import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Упрощенный сервис аутентификации
 */
@Injectable()
export class AuthSimpleService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    try {
      // Простая проверка для тестирования
      if (email === 'test@example.com' && password === 'password') {
        const payload = { 
          sub: 'test-user-id', 
          id: 'test-user-id',
          email, 
          name: 'Test User' 
        };
        
        return {
          access_token: this.jwtService.sign(payload),
          user: payload,
        };
      }
      
      throw new UnauthorizedException('Неверные учетные данные');
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Ошибка входа в систему');
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
