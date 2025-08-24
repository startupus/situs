import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { WebCategoriesService } from './web-categories.service';
import { CreateWebCategoryDto, UpdateWebCategoryDto, ReorderWebCategoriesDto } from './dto/web-category.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class WebCategoriesController {
  constructor(private readonly webCategoriesService: WebCategoriesService) {}

  // GET /api/projects/:projectId/pages/categories
  @Get('projects/:projectId/pages/categories')
  async getProjectWebCategories(
    @Param('projectId') projectId: string,
    @Request() req: ExpressRequest,
    @Query('includeInactive') includeInactive?: string,
  ) {
    try {
      const categories = await this.webCategoriesService.getProjectCategories(
        projectId,
        (req as any).user.id,
        includeInactive === 'true',
      );
      return { success: true, categories };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch website categories',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /api/projects/:projectId/pages/categories
  @Post('projects/:projectId/pages/categories')
  async createWebCategory(
    @Param('projectId') projectId: string,
    @Body() createDto: CreateWebCategoryDto,
    @Request() req: ExpressRequest,
  ) {
    try {
      const category = await this.webCategoriesService.createCategory(
        projectId,
        createDto,
        (req as any).user.id,
      );
      return { success: true, category };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create website category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/pages/categories/:id
  @Put('pages/categories/:id')
  async updateWebCategory(
    @Param('id') categoryId: string,
    @Body() updateDto: UpdateWebCategoryDto,
    @Request() req: ExpressRequest,
  ) {
    try {
      const category = await this.webCategoriesService.updateCategory(
        categoryId,
        updateDto,
        (req as any).user.id,
      );
      return { success: true, category };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to update website category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE /api/pages/categories/:id
  @Delete('pages/categories/:id')
  async deleteWebCategory(
    @Param('id') categoryId: string,
    @Request() req: ExpressRequest,
  ) {
    try {
      await this.webCategoriesService.deleteCategory(categoryId, (req as any).user.id);
      return { success: true, message: 'Website category deleted successfully' };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to delete website category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PATCH /api/pages/categories/reorder
  @Patch('pages/categories/reorder')
  async reorderWebCategories(
    @Body() reorderDto: ReorderWebCategoriesDto,
    @Request() req: ExpressRequest,
  ) {
    try {
      await this.webCategoriesService.reorderCategories(reorderDto, (req as any).user.id);
      return { success: true, message: 'Website categories reordered successfully' };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to reorder website categories',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
