import productService from '../../services/product';

export default async function update(ctx: { params: { projectId: string; productId: string }; request: { body: any } }) {
  try {
    const { projectId, productId } = ctx.params;
    const updateData = ctx.request.body;
    
    const product = await productService.update(projectId, productId, updateData);
    
    return {
      data: product,
    };
  } catch (error) {
    console.error('Error in product controller update:', error);
    throw error;
  }
}
