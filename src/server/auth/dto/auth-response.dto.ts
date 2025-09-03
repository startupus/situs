import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для ответа аутентификации
 */
export class UserResponseDto {
  @ApiProperty({ description: 'ID пользователя' })
  id!: string;

  @ApiProperty({ description: 'Email пользователя' })
  email!: string;

  @ApiProperty({ description: 'Имя пользователя' })
  name!: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt!: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt!: Date;
}

export class TokensDto {
  @ApiProperty({ description: 'Access токен' })
  accessToken!: string;

  @ApiProperty({ description: 'Refresh токен' })
  refreshToken!: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Данные пользователя',
    type: UserResponseDto,
  })
  user!: UserResponseDto;

  @ApiProperty({
    description: 'JWT токены',
    type: TokensDto,
  })
  tokens!: TokensDto;
}
