import { Controller, Patch, Body, Param, UseGuards, HttpException, HttpStatus, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { PageCategoriesService } from './page-categories.service';
import { AssignCategoriesDto, SetPrimaryCategoryDto } from './dto/page-categories.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class PageCategoriesController {
  constructor(private readonly pageCategoriesService: PageCategoriesService) {}

  // PATCH /api/pages/:id/categories
  @Patch('pages/:id/categories')
  async assignCategories(
    @Param('id') pageId: string,
    @Body() assignDto: AssignCategoriesDto,
    @Request() req: ExpressRequest,
  ) {
    try {
      const result = await this.pageCategoriesService.assignCategories(pageId, assignDto, (req as any).user.id);
      return { success: true, ...result };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to assign categories',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PATCH /api/pages/:id/categories/primary
  @Patch('pages/:id/categories/primary')
  async setPrimaryCategory(
    @Param('id') pageId: string,
    @Body() setPrimaryDto: SetPrimaryCategoryDto,
    @Request() req: ExpressRequest,
  ) {
    try {
      const page = await this.pageCategoriesService.setPrimaryCategory(
        pageId,
        setPrimaryDto.categoryId,
        (req as any).user.id,
      );
      return { success: true, page };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to set primary category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
