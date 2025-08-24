import { PartialType } from '@nestjs/swagger';
import { CreateViewLevelDto } from './create-view-level.dto';

/**
 * DTO для обновления уровня доступа
 */
export class UpdateViewLevelDto extends PartialType(CreateViewLevelDto) {}
