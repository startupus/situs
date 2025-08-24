import { Controller, Post, Body } from '@nestjs/common';
// import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthSimpleService } from './auth-simple.service';

/**
 * Упрощенный контроллер аутентификации
 */
// @ApiTags('auth')
@Controller('auth')
export class AuthSimpleController {
  constructor(private readonly authService: AuthSimpleService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const result = await this.authService.login(loginDto.email, loginDto.password);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Auth failed',
      };
    }
  }
}
