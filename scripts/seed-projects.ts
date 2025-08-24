#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    name: 'Активный проект',
    description: 'Проект в активном состоянии',
    slug: 'active-project',
    domain: 'active.situs.com',
    status: 'ACTIVE',
    isPublished: true,
    settings: JSON.stringify({ theme: 'light', language: 'ru' }),
    theme: JSON.stringify({ primaryColor: '#3B82F6', secondaryColor: '#8B5CF6' }),
  },
  {
    name: 'Приостановленный проект',
    description: 'Проект приостановлен из-за неоплаты',
    slug: 'suspended-project',
    domain: 'suspended.situs.com',
    status: 'SUSPENDED',
    isPublished: false,
    settings: JSON.stringify({ theme: 'dark', language: 'en' }),
    theme: JSON.stringify({ primaryColor: '#EF4444', secondaryColor: '#F59E0B' }),
  },
  {
    name: 'Архивный проект',
    description: 'Старый проект в архиве',
    slug: 'archived-project',
    domain: 'archived.situs.com',
    status: 'ARCHIVED',
    isPublished: false,
    settings: JSON.stringify({ theme: 'auto', language: 'ru' }),
    theme: JSON.stringify({ primaryColor: '#6B7280', secondaryColor: '#9CA3AF' }),
  },
  {
    name: 'Удаленный проект',
    description: 'Проект помечен к удалению',
    slug: 'deleted-project',
    domain: 'deleted.situs.com',
    status: 'DELETED',
    isPublished: false,
    settings: JSON.stringify({ theme: 'light', language: 'ru' }),
    theme: JSON.stringify({ primaryColor: '#DC2626', secondaryColor: '#B91C1C' }),
  },
];

async function seedProjects() {
  console.log('🌱 Создание тестовых проектов...');

  // Получаем первого пользователя как владельца
  const owner = await prisma.user.findFirst({
    where: { globalRole: 'SUPER_ADMIN' },
  });

  if (!owner) {
    console.error('❌ Не найден пользователь для создания проектов');
    return;
  }

  for (const project of projects) {
    const existingProject = await prisma.project.findFirst({
      where: { slug: project.slug },
    });

    if (!existingProject) {
      await prisma.project.create({
        data: {
          ...project,
          ownerId: owner.id,
        },
      });
      console.log(`✅ Создан проект: ${project.name} (${project.status})`);
    } else {
      console.log(`⏭️  Проект уже существует: ${project.name}`);
    }
  }

  console.log('🎉 Сиды проектов завершены!');
}

async function main() {
  try {
    await seedProjects();
  } catch (error) {
    console.error('❌ Ошибка при создании сидов:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск только если файл выполняется напрямую
main();

export { seedProjects };
