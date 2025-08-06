import productService from '../../services/product';

export default async function create(ctx: { params: { projectId: string }; request: { body: any } }) {
  try {
    const { projectId } = ctx.params;
    const { name, description, type, settings } = ctx.request.body;
    
    if (!name) {
      throw new Error('Product name is required');
    }
    
    if (!type) {
      throw new Error('Product type is required');
    }
    
    const productData = {
      name,
      description,
      type,
      settings,
    };
    
    const product = await productService.create(projectId, productData);
    
    return {
      data: product,
    };
  } catch (error) {
    console.error('Error in product controller create:', error);
    throw error;
  }
}
