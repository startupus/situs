#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const viewLevels = [
  {
    title: 'Public',
    description: 'Публичный доступ для всех пользователей',
    ordering: 1,
    groupIds: JSON.stringify(['public']), // Будет обновлено после создания групп
  },
  {
    title: 'Guest',
    description: 'Доступ для гостей (неавторизованные пользователи)',
    ordering: 2,
    groupIds: JSON.stringify([]),
  },
  {
    title: 'Registered',
    description: 'Доступ для зарегистрированных пользователей',
    ordering: 3,
    groupIds: JSON.stringify([]), // Будет заполнено ID группы Registered
  },
  {
    title: 'Special',
    description: 'Специальный уровень доступа',
    ordering: 4,
    groupIds: JSON.stringify([]), // Будет заполнено ID групп Author, Editor, Publisher
  },
];

async function seedViewLevels() {
  console.log('🌱 Создание базовых уровней доступа...');

  // Получаем ID созданных групп
  const registeredGroup = await prisma.userGroup.findFirst({
    where: { title: 'Registered' },
  });

  const authorGroup = await prisma.userGroup.findFirst({
    where: { title: 'Author' },
  });

  const editorGroup = await prisma.userGroup.findFirst({
    where: { title: 'Editor' },
  });

  const publisherGroup = await prisma.userGroup.findFirst({
    where: { title: 'Publisher' },
  });

  // Обновляем groupIds с реальными ID
  if (registeredGroup) {
    viewLevels[2].groupIds = JSON.stringify([registeredGroup.id]);
  }

  if (authorGroup && editorGroup && publisherGroup) {
    viewLevels[3].groupIds = JSON.stringify([authorGroup.id, editorGroup.id, publisherGroup.id]);
  }

  for (const level of viewLevels) {
    const existingLevel = await prisma.viewLevel.findFirst({
      where: { title: level.title },
    });

    if (!existingLevel) {
      await prisma.viewLevel.create({
        data: level,
      });
      console.log(`✅ Создан уровень доступа: ${level.title}`);
    } else {
      console.log(`⏭️  Уровень доступа уже существует: ${level.title}`);
    }
  }

  console.log('🎉 Сиды уровней доступа завершены!');
}

async function main() {
  try {
    await seedViewLevels();
  } catch (error) {
    console.error('❌ Ошибка при создании сидов:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск только если файл выполняется напрямую
main();

export { seedViewLevels };
