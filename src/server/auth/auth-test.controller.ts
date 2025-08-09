import { Controller, Post, Body, Get } from '@nestjs/common';

/**
 * Тестовый контроллер аутентификации без зависимостей
 */
@Controller('api/auth-test')
export class AuthTestController {
  @Get('ping')
  ping() {
    return {
      message: 'Auth test controller works',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('login')
  login(@Body() loginDto: any) {
    console.log('Получен запрос login:', loginDto);
    
    // Простейшая проверка без JWT
    if (loginDto?.email === 'test@example.com' && loginDto?.password === 'password') {
      return {
        success: true,
        data: {
          access_token: 'test-token-12345',
          user: {
            id: 'test-user-id',
            email: loginDto.email,
            name: 'Test User',
          },
        },
      };
    }

    return {
      success: false,
      error: 'Неверные учетные данные',
      received: loginDto,
    };
  }
}
