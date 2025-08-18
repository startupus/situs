import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Скрипт для обновления alias в существующих категориях
 * Устанавливает alias = slug для совместимости с Joomla-подобной системой
 */
async function fixCategoriesAlias() {
  console.log('🔄 Обновление alias в категориях...');
  
  // Получаем все категории
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true }
  });
  
  console.log(`📊 Найдено ${categories.length} категорий для обновления`);
  
  // Обновляем каждую категорию
  for (const category of categories) {
    await prisma.$executeRaw`
      UPDATE categories 
      SET alias = ${category.slug}
      WHERE id = ${category.id}
    `;
    console.log(`✅ Обновлена категория ${category.id}: alias = ${category.slug}`);
  }
  
  console.log('🎉 Все категории обновлены!');
}

fixCategoriesAlias()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
