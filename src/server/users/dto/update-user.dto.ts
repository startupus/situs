import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO для обновления пользователя
 *
 * Наследует все поля от CreateUserDto, делая их опциональными
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
