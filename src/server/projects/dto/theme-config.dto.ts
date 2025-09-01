import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, Length, Matches, ValidateNested } from 'class-validator';

const HEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export class ThemeColorsDto {
  @IsString() @Matches(HEX) primary!: string;
  @IsString() @Matches(HEX) primaryHover!: string;
  @IsString() @Matches(HEX) primaryActive!: string;
  @IsString() @Matches(HEX) secondary!: string;
  @IsString() @Matches(HEX) accent!: string;
  @IsString() @Matches(HEX) success!: string;
  @IsString() @Matches(HEX) warning!: string;
  @IsString() @Matches(HEX) error!: string;
  @IsString() @Matches(HEX) info!: string;
  @IsString() @Matches(HEX) background!: string;
  @IsString() @Matches(HEX) surface!: string;
  @IsString() @Matches(HEX) text!: string;
  @IsString() @Matches(HEX) textSecondary!: string;
  @IsString() @Matches(HEX) border!: string;
  @IsString() @Matches(HEX) borderLight!: string;
}

export class DualThemeVariantDto {
  @ValidateNested() @Type(() => ThemeColorsDto) light!: ThemeColorsDto;
  @ValidateNested() @Type(() => ThemeColorsDto) dark!: ThemeColorsDto;
}

export class ThemeConfigDto {
  @IsString() @Length(1, 100) id!: string;
  @IsString() @Length(1, 200) name!: string;
  @ValidateNested() @Type(() => DualThemeVariantDto) colors!: DualThemeVariantDto;
  @IsOptional() @IsString() @Length(0, 10000) customCss?: string;
  @IsOptional() @IsObject() typography?: Record<string, unknown>;
  @IsOptional() @IsObject() layout?: Record<string, unknown>;
  @IsOptional() @IsObject() animations?: Record<string, unknown>;
  @IsOptional() @IsObject() gradients?: Record<string, unknown>;
}

