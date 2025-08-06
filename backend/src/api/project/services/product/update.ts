import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateProductData {
  name?: string;
  description?: string;
  type?: 'WEBSITE' | 'STORE' | 'SCHOOL' | 'CHATBOT' | 'BLOG';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  url?: string;
  editorUrl?: string;
  settings?: Record<string, any>;
}

export default async function update(projectId: string, productId: string, updateData: UpdateProductData) {
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
    
    // Подготавливаем данные для обновления
    const updateFields: any = {};
    
    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.type !== undefined) updateFields.type = updateData.type;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.url !== undefined) updateFields.url = updateData.url;
    if (updateData.editorUrl !== undefined) updateFields.editorUrl = updateData.editorUrl;
    
    if (updateData.settings !== undefined) {
      updateFields.settings = JSON.stringify(updateData.settings);
    }
    
    // Обновляем продукт
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateFields,
    });
    
    // Преобразуем JSON строку в объект
    return {
      ...product,
      settings: product.settings ? JSON.parse(product.settings) : {},
    };
  } catch (error) {
    console.error('Error in product service update:', error);
    throw error;
  }
}


