import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuTypeDto } from './create-menu-type.dto';

/**
 * DTO для обновления типа меню
 */
export class UpdateMenuTypeDto extends PartialType(CreateMenuTypeDto) {
  // Все поля опциональны благодаря PartialType
}
