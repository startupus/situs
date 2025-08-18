import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AccountType } from '@prisma/client';

export class UpdateAccountDto {
  @IsOptional()
  @IsString({ message: 'Название аккаунта должно быть строкой' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  name?: string;

  @IsOptional()
  @IsEnum(AccountType, { message: 'Тип аккаунта должен быть AGENCY или BUSINESS' })
  type?: AccountType | string;
}