import { IsString, MinLength, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class ResetPasswordDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsString()
  code!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}
