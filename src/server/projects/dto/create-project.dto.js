var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, MaxLength, MinLength } from 'class-validator';
/**
 * DTO для создания проекта
 */
export class CreateProjectDto {
}
__decorate([
    IsString({ message: 'Название должно быть строкой' }),
    MinLength(1, { message: 'Название обязательно' }),
    MaxLength(100, { message: 'Название должно содержать максимум 100 символов' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Описание должно быть строкой' }),
    MaxLength(500, { message: 'Описание должно содержать максимум 500 символов' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsObject({ message: 'Настройки должны быть объектом' }),
    __metadata("design:type", Object)
], CreateProjectDto.prototype, "settings", void 0);
