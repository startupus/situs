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

    // ECOMMERCE product (магазин)
    const store = await prisma.product.upsert({
      where: { projectId_name: { projectId: project.id, name: 'Магазин' } as any },
      update: { type: ProductType.ECOMMERCE },
      create: {
        name: 'Магазин',
        description: 'Интернет-магазин проекта',
        type: ProductType.ECOMMERCE,
        projectId: project.id,
        settings: JSON.stringify({ currency: 'RUB', paymentMethods: ['card', 'cash'] }),
      },
    });
    console.log('🛒 Product ECOMMERCE ready:', store.id);

    // Создаем демо-категории для магазина
    const categories = [
      { name: 'Электроника', slug: 'electronics', description: 'Смартфоны, ноутбуки, аксессуары' },
      { name: 'Одежда', slug: 'clothing', description: 'Мужская и женская одежда' },
      { name: 'Дом и сад', slug: 'home-garden', description: 'Товары для дома и дачи' },
    ];

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      await prisma.category.upsert({
        where: { productId_slug: { productId: store.id, slug: cat.slug } as any },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          orderIndex: i,
          isActive: true,
          productId: store.id,
        },
      });
      console.log('📂 Category ready:', cat.name);
    }

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


