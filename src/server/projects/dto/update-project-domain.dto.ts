import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/**
 * DTO для обновления доменных настроек проекта
 */
export class UpdateProjectDomainDto {
  @IsOptional()
  @IsString({ message: 'Домен должен быть строкой' })
  @MaxLength(255)
  @Matches(/^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/,
    { message: 'Некорректный формат домена' })
  domain?: string;

  @IsOptional()
  @IsString({ message: 'Пользовательский домен должен быть строкой' })
  @MaxLength(255)
  @Matches(/^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/,
    { message: 'Некорректный формат пользовательского домена' })
  customDomain?: string;
}


