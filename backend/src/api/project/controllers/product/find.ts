import productService from '../../services/product';

export default async function find(ctx: { params: { projectId: string }; query: any }) {
  try {
    const { projectId } = ctx.params;
    const { search, type, status, sortBy, sortOrder, page, limit } = ctx.query;
    
    const params = {
      projectId,
      filters: {
        search: search as string,
        type: type as string,
        status: status as string,
      },
      sort: {
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      },
      pagination: {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      },
    };
    
    const result = await productService.find(params);
    
    return {
      data: result.data,
      meta: result.meta,
    };
  } catch (error) {
    console.error('Error in product controller find:', error);
    throw error;
  }
}
