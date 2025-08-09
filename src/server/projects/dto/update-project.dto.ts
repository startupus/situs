// import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
// import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

/**
 * DTO для обновления проекта
 */
export class UpdateProjectDto extends CreateProjectDto {
  // @ApiProperty({
  //   description: 'Статус проекта',
  //   example: 'published',
  //   required: false,
  //   enum: ['draft', 'published', 'archived'],
  // })
  @IsOptional()
  @IsString({ message: 'Статус должен быть строкой' })
  status?: string;

  // @ApiProperty({
  //   description: 'Дата публикации',
  //   example: '2024-01-01T00:00:00.000Z',
  //   required: false,
  // })
  @IsOptional()
  @IsDateString({}, { message: 'Некорректная дата публикации' })
  publishedAt?: string;
}
