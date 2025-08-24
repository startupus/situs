import { PartialType } from '@nestjs/swagger';
import { CreateUserGroupDto } from './create-user-group.dto';

/**
 * DTO для обновления группы пользователей
 */
export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {}
