var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
/**
 * Простой контроллер заказов
 */
let OrdersController = class OrdersController {
    findAll() {
        return {
            success: true,
            data: {
                orders: [
                    {
                        id: '1',
                        orderNumber: 'ORD-001',
                        projectName: 'Веб-сайт компании',
                        customerName: 'Иван Петров',
                        amount: 15000,
                        status: 'completed',
                        date: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: '2',
                        orderNumber: 'ORD-002',
                        projectName: 'SEO оптимизация',
                        customerName: 'Мария Сидорова',
                        amount: 25000,
                        status: 'processing',
                        date: '2024-01-16T09:15:00Z'
                    }
                ],
                pagination: { page: 1, limit: 20, total: 2, totalPages: 1 }
            }
        };
    }
    findOne(id) {
        return {
            success: true,
            data: {
                id,
                orderNumber: 'ORD-' + id.padStart(3, '0'),
                projectName: 'Тестовый проект',
                customerName: 'Тестовый клиент',
                amount: 10000,
                status: 'active'
            }
        };
    }
    create(createOrderDto) {
        return {
            success: true,
            data: {
                id: Date.now().toString(),
                ...createOrderDto,
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        };
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
OrdersController = __decorate([
    Controller('api/orders')
], OrdersController);
export { OrdersController };
