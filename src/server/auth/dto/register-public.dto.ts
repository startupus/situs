import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength, IsEnum } from 'class-validator';
import { CommunicationChannel } from '@prisma/client';

export class RegisterPublicDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsString()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  verificationCode!: string;
}
