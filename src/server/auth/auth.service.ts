import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CommunicationService } from '../communication/communication.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterPublicDto } from './dto/register-public.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
    private readonly communicationService: CommunicationService,
  ) {}

  // Временное хранилище кодов (в продакшене использовать Redis)
  private loginCodes = new Map<string, { code: string; expiresAt: Date; userId: string }>();
  private resetCodes = new Map<string, { code: string; expiresAt: Date; userId: string }>();

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
    } as any);

    // Генерация токенов
    return this.generateTokens(user);
  }

  /**
   * Валидация пользователя для Local Strategy
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await this.comparePasswords(password, user.password))) {
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

      return this.generateTokens(user as any);
    } catch (error) {
      throw new UnauthorizedException('Невалидный refresh токен');
    }
  }

  /**
   * Генерация JWT токенов
   */
  private async generateTokens(user: any): Promise<AuthResponseDto> {
    // Определяем глобальную роль и соответствующие ей скоупы доступа
    const globalRole = ((user.globalRole || (user as any).global_role || 'BUSINESS') as string)
      .toString()
      .toUpperCase();

    const scopesByRole = (role: string): string[] => {
      switch (role) {
        case 'SUPER_ADMIN':
          return ['PROJECT_READ', 'PROJECT_WRITE', 'PROJECT_ADMIN'];
        case 'STAFF':
          return ['PROJECT_READ', 'PROJECT_WRITE'];
        case 'AGENCY':
          return ['PROJECT_READ', 'PROJECT_WRITE'];
        case 'BUSINESS':
        default:
          // Минимально необходимый скоуп для чтения списка проектов
          return ['PROJECT_READ'];
      }
    };

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      globalRole,
      scopes: scopesByRole(globalRole),
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
    } as AuthResponseDto;
  }

  /**
   * Хеширование пароля
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Отправка кода для входа
   */
  async sendLoginCode(sendCodeDto: SendCodeDto) {
    const { email, phone, channel } = sendCodeDto;

    // Определяем пользователя по email или телефону
    let user;
    if (email) {
      user = await this.usersService.findByEmail(email);
    } else if (phone) {
      // TODO: Добавить поиск по телефону в UsersService
      throw new BadRequestException('Поиск по телефону пока не реализован');
    }

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Генерируем 6-значный код (временно фиксированный для тестирования)
    const code = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    // Сохраняем код (используем email или phone как ключ)
    const key = email || phone || '';
    this.loginCodes.set(key, { code, expiresAt, userId: user.id });

    // Логируем код для отладки
    console.log(`🔐 Сгенерирован код для ${key}: ${code}`);

    // Отправляем код через выбранный канал
    try {
      await this.communicationService.sendMessage(channel as any, {
        to: email || phone || '',
        subject: 'Код для входа в Situs Platform',
        content: `Ваш код для входа: ${code}. Код действителен 10 минут.`,
      });

      return {
        success: true,
        message: 'Код отправлен',
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
      throw new BadRequestException('Не удалось отправить код');
    }
  }

  /**
   * Проверка кода и вход
   */
  async verifyLoginCode(verifyCodeDto: VerifyCodeDto): Promise<AuthResponseDto> {
    const { email, phone, code } = verifyCodeDto;

    const key = email || phone || '';
    const storedCodeData = this.loginCodes.get(key);

    if (!storedCodeData) {
      throw new UnauthorizedException('Код не найден или истек');
    }

    // Проверяем срок действия
    if (new Date() > storedCodeData.expiresAt) {
      this.loginCodes.delete(key);
      throw new UnauthorizedException('Код истек');
    }

    // Проверяем код
    if (storedCodeData.code !== code) {
      throw new UnauthorizedException('Неверный код');
    }

    // Удаляем использованный код
    this.loginCodes.delete(key);

    // Получаем пользователя и генерируем токены
    const user = await this.usersService.findById(storedCodeData.userId);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return this.generateTokens(user);
  }

  /**
   * Публичная регистрация с подтверждением по коду
   */
  async registerPublic(registerPublicDto: RegisterPublicDto): Promise<AuthResponseDto> {
    const { email, phone, name, password, verificationCode } = registerPublicDto;

    // Проверяем код подтверждения
    const key = email || phone || '';
    const storedData = this.loginCodes.get(key);

    if (!storedData) {
      throw new BadRequestException('Неверный или истекший код');
    }

    // Временно используем захардкоженный код для тестирования
    const expectedCode = '123456';
    if (verificationCode !== expectedCode) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    // Проверяем, не существует ли уже пользователь
    const existingUser = await this.usersService.findByEmailOrPhone(email, phone);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email или телефоном уже существует');
    }

    // Создаем пользователя
    const hashedPassword = await this.hashPassword(password);
    const userData = {
      email,
      phone,
      name,
      password: hashedPassword,
      globalRole: 'USER' as any, // Обычные пользователи получают роль USER
    };

    const user = await this.usersService.create(userData);

    // Удаляем использованный код
    this.loginCodes.delete(key);

    return this.generateTokens(user);
  }

  /**
   * Отправка кода для восстановления пароля
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email, phone, channel } = forgotPasswordDto;

    // Находим пользователя
    const user = await this.usersService.findByEmailOrPhone(email, phone);
    if (!user) {
      // Не раскрываем информацию о существовании пользователя
      return { message: 'Если пользователь существует, код восстановления будет отправлен' };
    }

    // Генерируем код восстановления
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    // Сохраняем код
    const key = email || phone || '';
    this.resetCodes.set(key, {
      code,
      expiresAt,
      userId: user.id,
    });

    // Отправляем код
    try {
      await this.communicationService.sendMessage(channel, {
        to: email || phone || '',
        subject: 'Восстановление пароля',
        content: `Ваш код для восстановления пароля: ${code}. Код действителен 10 минут.`,
      });

      console.log(`Reset code for ${email || phone}: ${code}`); // Для отладки
    } catch (error) {
      console.error('Failed to send reset code:', error);
    }

    return { message: 'Если пользователь существует, код восстановления будет отправлен' };
  }

  /**
   * Сброс пароля по коду
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, phone, code, newPassword } = resetPasswordDto;

    const key = email || phone || '';
    const storedData = this.resetCodes.get(key);

    if (!storedData) {
      throw new BadRequestException('Неверный или истекший код');
    }

    if (storedData.code !== code) {
      throw new BadRequestException('Неверный код');
    }

    if (new Date() > storedData.expiresAt) {
      this.resetCodes.delete(key);
      throw new BadRequestException('Код истек');
    }

    // Обновляем пароль пользователя
    const hashedPassword = await this.hashPassword(newPassword);
    await this.usersService.updatePassword(storedData.userId, hashedPassword);

    // Удаляем использованный код
    this.resetCodes.delete(key);

    return { message: 'Пароль успешно изменен' };
  }

  /**
   * Сравнение паролей
   */
  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
