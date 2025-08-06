import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function deleteProduct(projectId: string, productId: string) {
  try {
    // Проверяем существование продукта
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        projectId,
      },
    });
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    
    // Удаляем продукт
    await prisma.product.delete({
      where: { id: productId },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error in product service delete:', error);
    throw error;
  }
}


