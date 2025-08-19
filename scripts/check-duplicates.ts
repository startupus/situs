#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDuplicates() {
  try {
    const items = await prisma.menuItem.findMany({
      where: {
        menuType: {
          project: { slug: 'startapus-ecosystem' }
        }
      },
      select: {
        id: true,
        title: true,
        alias: true,
        menuTypeId: true
      },
      orderBy: { alias: 'asc' }
    });
    
    console.log('📋 Все пункты меню:');
    items.forEach(item => {
      console.log(`  ${item.alias} - ${item.title} (ID: ${item.id}, MenuType: ${item.menuTypeId})`);
    });
    
    // Группируем по алиасам
    const groups = new Map();
    items.forEach(item => {
      if (!groups.has(item.alias)) {
        groups.set(item.alias, []);
      }
      groups.get(item.alias).push(item);
    });
    
    console.log('\n🔍 Дубликаты:');
    let foundDuplicates = false;
    for (const [alias, itemList] of groups) {
      if (itemList.length > 1) {
        foundDuplicates = true;
        console.log(`  ${alias}: ${itemList.length} пунктов`);
        itemList.forEach(item => console.log(`    - ${item.title} (ID: ${item.id})`));
      }
    }
    
    if (!foundDuplicates) {
      console.log('  ✅ Дубликатов не найдено');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates().catch(console.error);
