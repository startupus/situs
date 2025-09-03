import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderPagesDto {
  @IsArray({ message: 'ids должно быть массивом строк' })
  @ArrayNotEmpty({ message: 'ids не может быть пустым' })
  @IsString({ each: true, message: 'Каждый элемент ids должен быть строкой' })
  ids!: string[];
}
