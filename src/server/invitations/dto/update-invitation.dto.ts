import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export class UpdateInvitationDto {
  @ApiProperty({
    description: 'Статус приглашения',
    enum: InvitationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvitationStatus)
  status?: InvitationStatus;

  @ApiProperty({
    description: 'Персональное сообщение',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Дата истечения приглашения (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
