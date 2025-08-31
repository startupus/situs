import { Controller, Get, Query, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { IntegrationsService, CreateIntegrationDto, UpdateIntegrationDto } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get('providers')
  providers() {
    return this.service.listProviders();
  }

  @Get()
  list(@Query('projectId') projectId: string) {
    return this.service.listByProject(projectId);
  }

  @Post()
  create(@Body() dto: CreateIntegrationDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIntegrationDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/test')
  test(@Param('id') id: string) {
    return this.service.test(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // Список воркфлоу n8n для инстанса (по сохранённому конфигу)
  @Get(':id/n8n/workflows')
  listN8nWorkflows(
    @Param('id') id: string,
    @Query('baseUrl') baseUrl?: string,
    @Query('apiKey') apiKey?: string,
  ) {
    return this.service.listN8nWorkflows(id, { baseUrl, apiKey });
  }

  // Предпросмотр email шаблона для EMAIL_SMTP интеграций
  @Post(':id/email/preview')
  previewEmail(
    @Param('id') id: string,
    @Body() body: { template?: string; variables?: Record<string, any> }
  ) {
    return this.service.previewEmail(id, body.template, body.variables);
  }
}


