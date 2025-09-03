#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDuplicateAliases() {
  console.log('🔍 Поиск дублирующихся алиасов в пунктах меню...');

  try {
    // Получаем все пункты меню для проекта startapus-ecosystem
    const menuItems = await prisma.menuItem.findMany({
      where: {
        menuType: {
          project: {
            slug: 'startapus-ecosystem',
          },
        },
      },
      include: {
        menuType: {
          include: {
            project: true,
          },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    console.log(`📋 Найдено ${menuItems.length} пунктов меню`);

    // Группируем по алиасам
    const aliasGroups = new Map<string, typeof menuItems>();

    menuItems.forEach((item) => {
      const alias = item.alias;
      if (!aliasGroups.has(alias)) {
        aliasGroups.set(alias, []);
      }
      aliasGroups.get(alias)!.push(item);
    });

    // Находим дубликаты
    const duplicates = Array.from(aliasGroups.entries()).filter(([alias, items]) => items.length > 1);

    console.log(`🔍 Найдено ${duplicates.length} групп дублирующихся алиасов:`);

    for (const [alias, items] of duplicates) {
      console.log(`  - "${alias}": ${items.length} пунктов`);
      items.forEach((item, index) => {
        console.log(
          `    ${index + 1}. ID: ${item.id}, Title: "${item.title}", Level: ${item.level}, Created: ${item.createdAt.toISOString()}`,
        );
      });
    }

    if (duplicates.length === 0) {
      console.log('✅ Дублирующихся алиасов не найдено!');
      return;
    }

    console.log('\n🔧 Исправление дублирующихся алиасов...');

    // Исправляем дубликаты
    for (const [alias, items] of duplicates) {
      console.log(`\n📝 Обработка алиаса "${alias}":`);

      // Оставляем первый элемент без изменений, остальным добавляем суффикс
      for (let i = 1; i < items.length; i++) {
        const item = items[i];
        const newAlias = `${alias}-${i + 1}`;

        console.log(`  - Изменяем "${item.title}" (ID: ${item.id}): "${alias}" → "${newAlias}"`);

        await prisma.menuItem.update({
          where: { id: item.id },
          data: { alias: newAlias },
        });
      }
    }

    console.log('\n✅ Все дублирующиеся алиасы исправлены!');

    // Проверяем результат
    const updatedItems = await prisma.menuItem.findMany({
      where: {
        menuType: {
          project: {
            slug: 'startapus-ecosystem',
          },
        },
      },
      select: {
        id: true,
        title: true,
        alias: true,
      },
      orderBy: [{ alias: 'asc' }],
    });

    console.log('\n📋 Итоговый список алиасов:');
    updatedItems.forEach((item) => {
      console.log(`  - "${item.alias}": ${item.title}`);
    });
  } catch (error) {
    console.error('❌ Ошибка при исправлении алиасов:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
fixDuplicateAliases().catch(console.error);
