import { IsEnum, IsString } from 'class-validator';
import { AccountRole } from '@prisma/client';

export class CreateAccountMembershipDto {
  @IsString({ message: 'accountId обязателен' })
  accountId!: string;

  @IsString({ message: 'userId обязателен' })
  userId!: string;

  @IsEnum(AccountRole, { message: 'Некорректная роль' })
  role!: AccountRole | string;
}
