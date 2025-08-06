import productService from '../../services/product';

export default async function findOne(ctx: { params: { projectId: string; productId: string } }) {
  try {
    const { projectId, productId } = ctx.params;
    const product = await productService.findOne(projectId, productId);
    
    return {
      data: product,
    };
  } catch (error) {
    console.error('Error in product controller findOne:', error);
    throw error;
  }
}
