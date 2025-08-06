import productService from '../../services/product';

export default async function deleteProduct(ctx: { params: { projectId: string; productId: string } }) {
  try {
    const { projectId, productId } = ctx.params;
    await productService.delete(projectId, productId);
    
    return {
      data: { success: true },
    };
  } catch (error) {
    console.error('Error in product controller delete:', error);
    throw error;
  }
}
