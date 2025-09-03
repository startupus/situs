#!/usr/bin/env tsx
import { PrismaClient, MenuItemType, ProjectStatus, ProductType, PageStatus, PageType } from '@prisma/client';

/**
 * Мини-сидер только для меню проекта startapus-ecosystem.
 * Создает MenuType 'main' и базовые пункты меню (home/about/contacts),
 * а также минимальные страницы для Website продукта, если их нет.
 */
async function run() {
  const prisma = new PrismaClient();
  try {
    console.log('🧭 Seeding startapus-ecosystem menus...');

    // Ensure project
    const projectId = 'startapus-ecosystem';
    const project = await prisma.project.upsert({
      where: { id: projectId },
      update: { status: ProjectStatus.ACTIVE },
      create: {
        id: projectId,
        name: 'Сайт экосистемы Стартапус',
        slug: 'startapus-ecosystem',
        ownerId: (await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } }))!.id,
        status: ProjectStatus.ACTIVE,
        isPublished: true,
      },
    });
    console.log('📦 Project OK:', project.id);

    // Ensure WEBSITE product
    const website = await prisma.product.upsert({
      where: { projectId_name: { projectId: project.id, name: 'Сайт' } as any },
      update: { type: ProductType.WEBSITE },
      create: {
        name: 'Сайт',
        description: 'Website product',
        type: ProductType.WEBSITE,
        projectId: project.id,
        settings: '{}',
      },
    });
    console.log('🧩 Product WEBSITE OK:', website.id);

    // Ensure pages
    const pages = [
      { title: 'Главная', slug: 'home', isHomePage: true },
      { title: 'О компании', slug: 'about', isHomePage: false },
      { title: 'Контакты', slug: 'contacts', isHomePage: false },
    ];

    let order = 0;
    for (const p of pages) {
      await prisma.page.upsert({
        where: { productId_slug: { productId: website.id, slug: p.slug } as any },
        update: { isHomePage: p.isHomePage },
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
    }
    console.log('📝 Pages OK');

    // Ensure main menu type
    const mainMenu = await prisma.menuType.upsert({
      where: { projectId_name: { projectId: project.id, name: 'main' } as any },
      update: { title: 'Главное меню' },
      create: { name: 'main', title: 'Главное меню', projectId: project.id },
    });
    console.log('📁 MenuType main OK:', mainMenu.id);

    // Ensure main items
    const mainMenuItems = [
      { title: 'Главная', alias: 'home', component: 'Website', view: 'page', targetId: 'home' },
      { title: 'О компании', alias: 'about', component: 'Website', view: 'page', targetId: 'about' },
      { title: 'Контакты', alias: 'contacts', component: 'Website', view: 'page', targetId: 'contacts' },
    ];
    let menuOrder = 0;
    for (const item of mainMenuItems) {
      await prisma.menuItem.upsert({
        where: { menuTypeId_alias: { menuTypeId: mainMenu.id, alias: item.alias } as any },
        update: {
          title: item.title,
          component: item.component,
          view: item.view,
          targetId: item.targetId,
          isPublished: true,
        },
        create: {
          title: item.title,
          alias: item.alias,
          type: MenuItemType.COMPONENT,
          level: 1,
          orderIndex: menuOrder++,
          component: item.component,
          view: item.view,
          targetId: item.targetId,
          isPublished: true,
          accessLevel: 'PUBLIC' as any,
          language: '*',
          parameters: JSON.stringify({ menu_show: true }),
          menuTypeId: mainMenu.id,
        },
      });
    }
    console.log('🔗 Menu items OK');

    console.log('✅ startapus-ecosystem menus seeded');
  } catch (e) {
    console.error('❌ seed-startapus-menus error:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
