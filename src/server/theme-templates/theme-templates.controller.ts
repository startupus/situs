import { Controller, Get, Query } from '@nestjs/common';
import { ThemeTemplatesService } from './theme-templates.service';

@Controller('theme-templates')
export class ThemeTemplatesController {
	constructor(private readonly templates: ThemeTemplatesService) {}

	@Get()
	async list(@Query('category') category?: string, @Query('search') search?: string, @Query('limit') limit?: string) {
		const lim = limit ? Number(limit) : undefined;
		const result = await this.templates.list({ category, search, limit: lim });
		return { success: true, data: result.templates, total: result.total } as const;
	}
}