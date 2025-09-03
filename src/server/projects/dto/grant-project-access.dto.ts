import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';

export class GrantProjectAccessDto {
  @IsOptional()
  @IsString({ message: 'userId должен быть строкой' })
  userId?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  userEmail?: string;

  @IsString({ message: 'Роль должна быть строкой' })
  @IsIn(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'], { message: 'Недопустимая роль' })
  role!: string;
}
