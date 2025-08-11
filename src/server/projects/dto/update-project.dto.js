var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
// import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';
/**
 * DTO для обновления проекта
 */
export class UpdateProjectDto extends CreateProjectDto {
}
__decorate([
    IsOptional(),
    IsString({ message: 'Статус должен быть строкой' }),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsDateString({}, { message: 'Некорректная дата публикации' }),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "publishedAt", void 0);
