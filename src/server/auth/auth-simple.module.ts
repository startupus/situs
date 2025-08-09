import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthSimpleController } from './auth-simple.controller';
import { AuthSimpleService } from './auth-simple.service';

/**
 * Упрощенный модуль аутентификации для тестирования
 */
@Module({
  imports: [
    JwtModule.register({
      secret: 'test-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthSimpleController],
  providers: [AuthSimpleService],
  exports: [AuthSimpleService],
})
export class AuthSimpleModule {}
