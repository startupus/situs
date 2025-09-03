import { IsString } from 'class-validator';

/** DTO для смены статуса проекта */
export class UpdateProjectStatusDto {
  @IsString({ message: 'Статус должен быть строкой' })
  status!: string; // ожидает значения из enum ProjectStatus (ACTIVE/INACTIVE/ARCHIVED)
}
