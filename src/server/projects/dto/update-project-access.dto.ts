import { IsIn, IsString } from 'class-validator';

/**
 * DTO для изменения роли доступа
 */
export class UpdateProjectAccessDto {
  @IsString({ message: 'Роль должна быть строкой' })
  @IsIn(['ADMIN', 'EDITOR', 'VIEWER'], { message: 'Недопустимая роль' })
  role!: string;
}


