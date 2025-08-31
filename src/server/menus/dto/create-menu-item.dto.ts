import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsInt, 
  IsEnum, 
  IsUrl,
  IsJSON,
  MaxLength, 
  Min, 
  Max 
} from 'class-validator';
import { MenuItemType, AccessLevel } from '@prisma/client';

/**
 * DTO для создания пункта меню
 */
export class CreateMenuItemDto {
  @IsString({ message: 'Название пункта меню должно быть строкой' })
  @MaxLength(100, { message: 'Название должно содержать максимум 100 символов' })
  title!: string;

  @IsString({ message: 'Alias должен быть строкой' })
  @MaxLength(50, { message: 'Alias должен содержать максимум 50 символов' })
  alias!: string;

  @IsOptional()
  @IsEnum(MenuItemType, { message: 'Недопустимый тип пункта меню' })
  type?: MenuItemType = MenuItemType.COMPONENT;

  @IsOptional()
  @IsInt({ message: 'Уровень должен быть целым числом' })
  @Min(1, { message: 'Минимальный уровень: 1' })
  @Max(10, { message: 'Максимальный уровень: 10' })
  level?: number = 1;

  @IsOptional()
  @IsString({ message: 'ID родительского пункта должен быть строкой' })
  parentId?: string;

  @IsOptional()
  @IsInt({ message: 'Порядок должен быть целым числом' })
  @Min(0)
  orderIndex?: number = 0;

  // Привязка к компоненту
  @IsOptional()
  @IsString({ message: 'Компонент должен быть строкой' })
  @MaxLength(50)
  component?: string;

  @IsOptional()
  @IsString({ message: 'View должен быть строкой' })
  @MaxLength(50)
  view?: string;

  @IsOptional()
  @IsString({ message: 'Layout должен быть строкой' })
  @MaxLength(50)
  layout?: string;

  @IsOptional()
  @IsString({ message: 'Target ID должен быть строкой' })
  targetId?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL' })
  externalUrl?: string;

  // Настройки отображения
  @IsOptional()
  @IsBoolean({ message: 'isPublished должно быть булевым значением' })
  isPublished?: boolean = true;

  @IsOptional()
  @IsEnum(AccessLevel, { message: 'Недопустимый уровень доступа' })
  accessLevel?: AccessLevel = AccessLevel.PUBLIC;

  @IsOptional()
  @IsString({ message: 'Язык должен быть строкой' })
  @MaxLength(10)
  language?: string = '*';

  // Параметры (JSON)
  @IsOptional()
  @IsJSON({ message: 'Параметры должны быть в формате JSON' })
  parameters?: string = '{}';

  // SEO метаданные
  @IsOptional()
  @IsString({ message: 'Meta title должен быть строкой' })
  @MaxLength(200)
  metaTitle?: string;

  @IsOptional()
  @IsString({ message: 'Meta description должно быть строкой' })
  @MaxLength(500)
  metaDescription?: string;

  @IsOptional()
  @IsString({ message: 'Meta keywords должны быть строкой' })
  @MaxLength(500)
  metaKeywords?: string;

  // CSS и стили
  @IsOptional()
  @IsString({ message: 'CSS класс должен быть строкой' })
  @MaxLength(100)
  cssClass?: string;

  @IsOptional()
  @IsString({ message: 'Изображение меню должно быть строкой' })
  @MaxLength(500)
  menuImage?: string;

  // Иконка для пункта меню
  @IsOptional()
  @IsString({ message: 'Название иконки должно быть строкой' })
  @MaxLength(50)
  icon?: string;

  @IsOptional()
  @IsString({ message: 'Библиотека иконок должна быть строкой' })
  @MaxLength(10)
  iconLibrary?: string = 'fi';

  // Связи
  @IsString({ message: 'ID типа меню должен быть строкой' })
  menuTypeId!: string;
}
