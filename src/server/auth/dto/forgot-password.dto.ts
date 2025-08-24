import { IsEmail, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { CommunicationChannel } from '@prisma/client';

export class ForgotPasswordDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsEnum(CommunicationChannel)
  channel!: CommunicationChannel;
}
