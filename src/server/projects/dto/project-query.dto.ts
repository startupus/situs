// import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

/**
 * DTO для запроса списка проектов с фильтрами
 */
export class ProjectQueryDto {
  // @ApiProperty
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Страница должна быть числом' })
  @Min(1, { message: 'Страница должна быть больше 0' })
  page?: number = 1;

  // @ApiProperty
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @Min(1, { message: 'Лимит должен быть больше 0' })
  @Max(100, { message: 'Лимит должен быть меньше 100' })
  limit?: number = 20;

  // @ApiProperty
  @IsOptional()
  @IsString({ message: 'Статус должен быть строкой' })
  status?: string;

  // @ApiProperty
  @IsOptional()
  @IsString({ message: 'Тип должен быть строкой' })
  type?: string;

  // @ApiProperty
  @IsOptional()
  @IsString({ message: 'ID владельца должен быть строкой' })
  ownerId?: string;
}
