#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userGroups = [
  {
    title: 'Public',
    description: 'Публичный доступ (неавторизованные пользователи)',
    isCore: true,
  },
  {
    title: 'Registered',
    description: 'Зарегистрированные пользователи',
    isCore: true,
  },
  {
    title: 'Author',
    description: 'Авторы контента',
    isCore: true,
  },
  {
    title: 'Editor',
    description: 'Редакторы контента',
    isCore: true,
  },
  {
    title: 'Publisher',
    description: 'Публикаторы контента',
    isCore: true,
  },
  {
    title: 'Manager',
    description: 'Менеджеры проектов',
    isCore: true,
  },
  {
    title: 'Administrator',
    description: 'Администраторы',
    isCore: true,
  },
  {
    title: 'Super Users',
    description: 'Супер-пользователи',
    isCore: true,
  },
];

async function seedUserGroups() {
  console.log('🌱 Создание базовых групп пользователей...');

  for (const group of userGroups) {
    const existingGroup = await prisma.userGroup.findFirst({
      where: { title: group.title },
    });

    if (!existingGroup) {
      await prisma.userGroup.create({
        data: group,
      });
      console.log(`✅ Создана группа: ${group.title}`);
    } else {
      console.log(`⏭️  Группа уже существует: ${group.title}`);
    }
  }

  console.log('🎉 Сиды групп пользователей завершены!');
}

async function main() {
  try {
    await seedUserGroups();
  } catch (error) {
    console.error('❌ Ошибка при создании сидов:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск только если файл выполняется напрямую
main();

export { seedUserGroups };
