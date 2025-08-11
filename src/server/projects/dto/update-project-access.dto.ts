import { IsString } from 'class-validator';

/**
 * DTO для изменения роли доступа
 */
export class UpdateProjectAccessDto {
  @IsString({ message: 'Роль обязательна' })
  role!: string; // ADMIN | EDITOR | VIEWER (OWNER не изменяется)
}


