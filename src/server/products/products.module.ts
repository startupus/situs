import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProjectProductsController } from './project-products.controller';
import { CategoriesController } from './categories.controller';
import { ItemsController } from './items.controller';

/**
 * Модуль продуктов
 * Отвечает за CRUD операций над продуктами и вложенные маршруты в рамках проекта
 */
@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController, ProjectProductsController, CategoriesController, ItemsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}


