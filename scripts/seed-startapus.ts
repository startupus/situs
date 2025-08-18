#!/usr/bin/env tsx
import { PrismaClient, ProductType, PageStatus, PageType, ProjectStatus } from '@prisma/client';

/**
 * Локальный сидер для проекта startapus-ecosystem
 * Создаёт проект со slug/id "startapus-ecosystem", продукт WEBSITE и базовые страницы
 */
async function run() {
  const prisma = new PrismaClient();
  try {
    console.log('🌱 Startapus seeder: begin');

    // Dev user (owner)
    const dev = await prisma.user.upsert({
      where: { email: 'dev@situs.local' },
      update: {},
      create: {
        username: 'dev',
        email: 'dev@situs.local',
        password: 'dev',
      },
    });
    console.log('👤 Owner ready:', dev.id);

    // Project (id = slug for convenience in dev)
    const projectId = 'startapus-ecosystem';
    const project = await prisma.project.upsert({
      where: { id: projectId },
      update: { name: 'Сайт экосистемы Стартапус', slug: 'startapus-ecosystem', status: ProjectStatus.ACTIVE },
      create: {
        id: projectId,
        name: 'Сайт экосистемы Стартапус',
        description: 'Официальный сайт экосистемы Стартапус',
        slug: 'startapus-ecosystem',
        ownerId: dev.id,
        status: ProjectStatus.ACTIVE,
        isPublished: true,
        settings: JSON.stringify({ theme: 'auto', language: 'ru' }),
      },
    });
    console.log('📦 Project ready:', project.id);

    // WEBSITE product
    const website = await prisma.product.upsert({
      where: { projectId_name: { projectId: project.id, name: 'Сайт' } as any },
      update: { type: ProductType.WEBSITE },
      create: {
        name: 'Сайт',
        description: 'Управление страницами проекта',
        type: ProductType.WEBSITE,
        projectId: project.id,
        settings: '{}',
      },
    });
    console.log('🧩 Product WEBSITE ready:', website.id);

    // Pages
    const seedPages = [
      { title: 'Главная', slug: 'home', isHomePage: true },
      { title: 'О компании', slug: 'about' },
      { title: 'Контакты', slug: 'contacts' },
    ];

    let order = 0;
    for (const p of seedPages) {
      const created = await prisma.page.upsert({
        where: { productId_slug: { productId: website.id, slug: p.slug } as any },
        update: {},
        create: {
          title: p.title,
          slug: p.slug,
          content: JSON.stringify({ blocks: [] }),
          status: PageStatus.PUBLISHED,
          pageType: PageType.PAGE,
          isHomePage: Boolean(p.isHomePage),
          orderIndex: order++,
          productId: website.id,
        },
      });
      console.log('📝 Page ready:', created.slug);
    }

    console.log('✅ Startapus seeder: done');
  } catch (e) {
    console.error('❌ Startapus seeder error:', e);
    process.exitCode = 1;
  }
}

run();


