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

    // Создаем демо-категории для магазина (иерархические как в системе меню)
    const categories = [
      { name: 'Электроника', slug: 'electronics', description: 'Смартфоны, ноутбуки, аксессуары' },
      { name: 'Одежда', slug: 'clothing', description: 'Мужская и женская одежда' },
      { name: 'Дом и сад', slug: 'home-garden', description: 'Товары для дома и дачи' },
    ];

    const createdCategories = [];
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const created = await prisma.category.upsert({
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
      createdCategories.push(created);
      console.log('📂 Category ready:', cat.name);
    }

    // Создаем подкатегории для Электроники (аналог подменю)
    const electronicsCategory = createdCategories.find(c => c.slug === 'electronics');
    if (electronicsCategory) {
      const subCategories = [
        { name: 'Смартфоны', slug: 'smartphones', description: 'Мобильные телефоны' },
        { name: 'Ноутбуки', slug: 'laptops', description: 'Портативные компьютеры' },
        { name: 'Аксессуары', slug: 'accessories', description: 'Чехлы, зарядки, наушники' },
      ];

      for (let i = 0; i < subCategories.length; i++) {
        const subCat = subCategories[i];
        await prisma.category.upsert({
          where: { productId_slug: { productId: store.id, slug: subCat.slug } as any },
          update: {},
          create: {
            name: subCat.name,
            slug: subCat.slug,
            description: subCat.description,
            orderIndex: i,
            isActive: true,
            parentId: electronicsCategory.id, // Иерархия!
            productId: store.id,
          },
        });
        console.log('📱 SubCategory ready:', subCat.name);
      }
    }

    // Создаем подкатегории для Одежды
    const clothingCategory = createdCategories.find(c => c.slug === 'clothing');
    if (clothingCategory) {
      const clothingSubCategories = [
        { name: 'Мужская одежда', slug: 'mens-clothing', description: 'Одежда для мужчин' },
        { name: 'Женская одежда', slug: 'womens-clothing', description: 'Одежда для женщин' },
      ];

      for (let i = 0; i < clothingSubCategories.length; i++) {
        const subCat = clothingSubCategories[i];
        await prisma.category.upsert({
          where: { productId_slug: { productId: store.id, slug: subCat.slug } as any },
          update: {},
          create: {
            name: subCat.name,
            slug: subCat.slug,
            description: subCat.description,
            orderIndex: i,
            isActive: true,
            parentId: clothingCategory.id, // Иерархия!
            productId: store.id,
          },
        });
        console.log('👕 SubCategory ready:', subCat.name);
      }
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

    // Создаем демо-меню
    console.log('🧭 Creating demo menus...');
    
    // Главное меню
    const mainMenu = await prisma.menuType.upsert({
      where: { projectId_name: { projectId: project.id, name: 'main' } as any },
      update: {},
      create: {
        name: 'main',
        title: 'Главное меню',
        description: 'Основная навигация сайта',
        projectId: project.id,
      },
    });
    console.log('📁 MenuType main ready:', mainMenu.id);

    // Пункты главного меню
    const mainMenuItems = [
      { title: 'Главная', alias: 'home', component: 'Website', view: 'page', targetId: seedPages.find(p => p.isHomePage)?.slug },
      { title: 'Каталог', alias: 'catalog', component: 'Store', view: 'categories' },
      { title: 'О компании', alias: 'about', component: 'Website', view: 'page', targetId: 'about' },
      { title: 'Контакты', alias: 'contacts', component: 'Website', view: 'page', targetId: 'contacts' },
    ];

    let menuOrder = 0;
    for (const item of mainMenuItems) {
      const created = await prisma.menuItem.upsert({
        where: { menuTypeId_alias: { menuTypeId: mainMenu.id, alias: item.alias } as any },
        update: {},
        create: {
          title: item.title,
          alias: item.alias,
          type: 'COMPONENT',
          level: 1,
          orderIndex: menuOrder++,
          component: item.component,
          view: item.view,
          targetId: item.targetId,
          isPublished: true,
          accessLevel: 'PUBLIC',
          language: '*',
          parameters: JSON.stringify({
            menu_show: true,
            css_class: 'nav-link'
          }),
          menuTypeId: mainMenu.id,
        },
      });
      console.log('🧩 MenuItem ready:', created.alias);
    }

    // Подменю для каталога
    const catalogMenuItem = await prisma.menuItem.findFirst({
      where: { menuTypeId: mainMenu.id, alias: 'catalog' }
    });

    if (catalogMenuItem && createdCategories.length > 0) {
      let subMenuOrder = 0;
      for (const category of createdCategories) {
        const subItem = await prisma.menuItem.upsert({
          where: { menuTypeId_alias: { menuTypeId: mainMenu.id, alias: `category-${category.slug}` } as any },
          update: {},
          create: {
            title: category.name,
            alias: `category-${category.slug}`,
            type: 'COMPONENT',
            level: 2,
            parentId: catalogMenuItem.id,
            orderIndex: subMenuOrder++,
            component: 'Store',
            view: 'category',
            targetId: category.id,
            isPublished: true,
            accessLevel: 'PUBLIC',
            language: '*',
            parameters: JSON.stringify({
              menu_show: true,
              itemsPerPage: 20,
              showFilters: true
            }),
            menuTypeId: mainMenu.id,
          },
        });
        console.log('🔗 SubMenuItem ready:', subItem.alias);
      }
    }

    // Футер меню
    const footerMenu = await prisma.menuType.upsert({
      where: { projectId_name: { projectId: project.id, name: 'footer' } as any },
      update: {},
      create: {
        name: 'footer',
        title: 'Меню подвала',
        description: 'Навигация в нижней части сайта',
        projectId: project.id,
      },
    });

    const footerItems = [
      { title: 'Политика конфиденциальности', alias: 'privacy', externalUrl: '/privacy' },
      { title: 'Условия использования', alias: 'terms', externalUrl: '/terms' },
      { title: 'Поддержка', alias: 'support', externalUrl: '/support' },
    ];

    let footerOrder = 0;
    for (const item of footerItems) {
      await prisma.menuItem.upsert({
        where: { menuTypeId_alias: { menuTypeId: footerMenu.id, alias: item.alias } as any },
        update: {},
        create: {
          title: item.title,
          alias: item.alias,
          type: 'URL',
          level: 1,
          orderIndex: footerOrder++,
          externalUrl: item.externalUrl,
          isPublished: true,
          accessLevel: 'PUBLIC',
          language: '*',
          menuTypeId: footerMenu.id,
        },
      });
    }

    console.log('🧭 Demo menus created successfully');

    console.log('✅ Startapus seeder: done');
  } catch (e) {
    console.error('❌ Startapus seeder error:', e);
    process.exitCode = 1;
  }
}

run();


