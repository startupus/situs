import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function findOne(projectId: string, productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        projectId,
      },
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Преобразуем JSON строку в объект
    return {
      ...product,
      settings: product.settings ? JSON.parse(product.settings) : {},
    };
  } catch (error) {
    console.error('Error in product service findOne:', error);
    throw error;
  }
}


