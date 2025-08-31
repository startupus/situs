import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminScreensService } from './admin-screens.service';

@Controller('admin-screens')
export class AdminScreensController {
  constructor(private readonly service: AdminScreensService) {}

  @Get()
  async list(@Query('projectId') projectId: string) {
    return { success: true, data: await this.service.list(projectId) };
  }

  @Get(':alias')
  async get(@Query('projectId') projectId: string, @Param('alias') alias: string) {
    return { success: true, data: await this.service.getByAlias(projectId, alias) };
  }

  @Post()
  async upsert(@Query('projectId') projectId: string, @Body() body: any) {
    const created = await this.service.upsert(projectId, body);
    return { success: true, data: created };
  }

  @Delete(':alias')
  async remove(@Query('projectId') projectId: string, @Param('alias') alias: string) {
    return { success: true, data: await this.service.remove(projectId, alias) };
  }
}
