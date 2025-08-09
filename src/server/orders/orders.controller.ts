import { Controller, Get, Post, Body, Param } from '@nestjs/common';

/**
 * Простой контроллер заказов
 */
@Controller('api/orders')
export class OrdersController {
  @Get()
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

  @Get(':id')
  findOne(@Param('id') id: string) {
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

  @Post()
  create(@Body() createOrderDto: any) {
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
}
