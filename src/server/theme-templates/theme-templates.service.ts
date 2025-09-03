import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface ListParams { category?: string; search?: string; limit?: number }

@Injectable()
export class ThemeTemplatesService {
	constructor(private readonly prisma: PrismaService) {}

	private readonly builtIn = [
		{ id: 'tpl-business-pro', name: 'Business Pro', tags: ['business'] },
		{ id: 'tpl-creative-agency', name: 'Creative Agency', tags: ['creative'] },
		{ id: 'tpl-ecommerce', name: 'E-commerce', tags: ['ecommerce'] },
	];

	async list(params: ListParams): Promise<{ templates: any[]; total: number }> {
		try {
			let where: any = {};
			if (params.category) where.category = params.category as string;
			if (params.search) where.name = { contains: params.search as string } as any;
			const take = typeof params.limit === 'number' ? params.limit : undefined;
			const list = await this.prisma.themeTemplate.findMany({ where, take });
			return { templates: list, total: list.length };
		} catch {
			// Fallback на встроенные
			let list = this.builtIn;
			if (params.search) {
				const s = params.search.toLowerCase();
				list = list.filter(t => t.name.toLowerCase().includes(s) || (t.tags || []).some((x: string) => x.includes(s)));
			}
			if (params.category) list = list.filter(t => (t.tags || []).includes(params.category as string));
			if (params.limit) list = list.slice(0, params.limit);
			return { templates: list, total: list.length };
		}
	}
}