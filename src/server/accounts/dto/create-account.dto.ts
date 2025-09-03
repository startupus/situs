import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
  @IsString({ message: 'Название аккаунта должно быть строкой' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  name!: string;

  @IsEnum(AccountType, { message: 'Тип аккаунта должен быть AGENCY или BUSINESS' })
  type!: AccountType | string;

  @IsOptional()
  @IsString({ message: 'ID владельца должен быть строкой' })
  ownerId?: string;
}
