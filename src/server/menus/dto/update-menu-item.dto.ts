import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu-item.dto';

/**
 * DTO для обновления пункта меню
 */
export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
  // Все поля опциональны благодаря PartialType
}
