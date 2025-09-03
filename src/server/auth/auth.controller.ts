import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { RegisterPublicDto } from './dto/register-public.dto';
import { LoginDto } from './dto/login.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Request as ExpressRequest } from 'express';
import { Public } from '../common/decorators/public.decorator';

/**
 * Контроллер аутентификации
 *
 * Обрабатывает запросы:
 * - Регистрация пользователей
 * - Вход в систему
 * - Обновление токенов
 * - Получение профиля
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация нового пользователя
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Вход в систему
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() _loginDto: LoginDto, @Request() req: ExpressRequest): Promise<AuthResponseDto> {
    return this.authService.login((req as any).user);
  }

  /**
   * Получение профиля текущего пользователя
   */
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getProfile(@Request() req: ExpressRequest) {
    return (req as any).user;
  }

  /**
   * Отправка кода подтверждения для входа
   */
  @Public()
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправка кода подтверждения для входа' })
  @ApiResponse({
    status: 200,
    description: 'Код отправлен',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendLoginCode(sendCodeDto);
  }

  /**
   * Вход по коду подтверждения
   */
  @Public()
  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход по коду подтверждения' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Неверный код' })
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto): Promise<AuthResponseDto> {
    return this.authService.verifyLoginCode(verifyCodeDto);
  }

  /**
   * Обновление access токена
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление access токена' })
  @ApiResponse({
    status: 200,
    description: 'Токен обновлен',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Невалидный refresh токен' })
  async refresh(@Body('refreshToken') refreshToken: string): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(refreshToken);
  }

  /**
   * Публичная регистрация
   */
  @Public()
  @Post('register-public')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Публичная регистрация пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные или код' })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  async registerPublic(@Body() registerPublicDto: RegisterPublicDto): Promise<AuthResponseDto> {
    return this.authService.registerPublic(registerPublicDto);
  }

  /**
   * Запрос кода для восстановления пароля
   */
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Запрос кода для восстановления пароля' })
  @ApiResponse({
    status: 200,
    description: 'Код отправлен (если пользователь существует)',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Сброс пароля по коду
   */
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Сброс пароля по коду' })
  @ApiResponse({
    status: 200,
    description: 'Пароль успешно изменен',
  })
  @ApiResponse({ status: 400, description: 'Неверный или истекший код' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
