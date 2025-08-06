import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateProductData {
  name: string;
  description?: string;
  type: 'WEBSITE' | 'STORE' | 'SCHOOL' | 'CHATBOT' | 'BLOG';
  settings?: Record<string, any>;
}

export default async function create(projectId: string, productData: CreateProductData) {
  try {
    // Проверяем существование проекта
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Создаем продукт
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        type: productData.type,
        settings: productData.settings ? JSON.stringify(productData.settings) : '{}',
        projectId,
      },
    });
    
    // Преобразуем JSON строку в объект
    return {
      ...product,
      settings: product.settings ? JSON.parse(product.settings) : {},
    };
  } catch (error) {
    console.error('Error in product service create:', error);
    throw error;
  }
}


