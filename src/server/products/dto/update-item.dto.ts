import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';

/**
 * DTO для обновления товара
 */
export class UpdateItemDto extends PartialType(CreateItemDto) {
  // Все поля опциональны благодаря PartialType
}
