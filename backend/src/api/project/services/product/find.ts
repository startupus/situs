import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductFilters {
  search?: string;
  type?: string;
  status?: string;
}

interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface FindParams {
  projectId: string;
  filters: ProductFilters;
  sort: SortParams;
  pagination: PaginationParams;
}

export default async function find(params: FindParams) {
  try {
    const { projectId, filters, sort, pagination } = params;
    
    // Проверяем существование проекта
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Строим условия фильтрации
    const where: any = {
      projectId,
    };
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    if (filters.type) {
      where.type = filters.type;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    // Строим параметры сортировки
    const orderBy: any = {};
    if (sort.sortBy) {
      orderBy[sort.sortBy] = sort.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }
    
    // Выполняем запрос с пагинацией
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.product.count({ where }),
    ]);
    
    // Преобразуем JSON строки в объекты
    const processedProducts = products.map(product => ({
      ...product,
      settings: product.settings ? JSON.parse(product.settings) : {},
    }));
    
    return {
      data: processedProducts,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  } catch (error) {
    console.error('Error in product service find:', error);
    throw error;
  }
}


