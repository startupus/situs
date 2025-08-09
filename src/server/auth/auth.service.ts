import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';

/**
 * Сервис аутентификации
 * 
 * Обеспечивает:
 * - Хеширование паролей
 * - Генерацию JWT токенов
 * - Валидацию пользователей
 * - Обновление токенов
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Регистрация нового пользователя
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name } = registerDto;

    // Проверка существования пользователя
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await this.hashPassword(password);

    // Создание пользователя
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    // Генерация токенов
    return this.generateTokens(user);
  }

  /**
   * Валидация пользователя для Local Strategy
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await this.comparePasswords(password, user.password)) {
      // Удаляем пароль из результата
      const { password: _, ...result } = user;
      return result as User;
    }
    
    return null;
  }

  /**
   * Вход в систему
   */
  async login(user: User): Promise<AuthResponseDto> {
    return this.generateTokens(user);
  }

  /**
   * Обновление токенов
   */
  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Невалидный refresh токен');
    }
  }

  /**
   * Генерация JWT токенов
   */
  private async generateTokens(user: User): Promise<AuthResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwt.refreshTokenExpiresIn'),
      }),
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Хеширование пароля
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Сравнение паролей
   */
  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
