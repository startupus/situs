import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создание администратора
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@startapus.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@startapus.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // Создание основного пользователя
  const userPassword = await hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'dmitriy@startapus.com' },
    update: {},
    create: {
      username: 'dmitriy',
      email: 'dmitriy@startapus.com',
      password: userPassword,
      role: 'BUSINESS',
      status: 'ACTIVE',
    },
  });

  // Создание проекта "Сайт экосистемы Стартапус"
  const startapusProject = await prisma.project.upsert({
    where: { id: 'startapus-ecosystem' },
    update: {},
    create: {
      id: 'startapus-ecosystem',
      name: 'Сайт экосистемы Стартапус',
      description:
        'Официальный сайт экосистемы Стартапус - инновационная платформа для создания и управления веб-проектами',
      slug: 'startapus-ecosystem',
      domain: 'startapus.com',
      isPublished: true,
      ownerId: user.id,
    },
  });

  // Создание продукта Website для проекта Стартапус
  const websiteProduct = await prisma.product.upsert({
    where: {
      projectId_name: {
        projectId: startapusProject.id,
        name: 'Website',
      },
    },
    update: {},
    create: {
      name: 'Website',
      description: 'Основной сайт проекта',
      type: 'WEBSITE',
      status: 'ACTIVE',
      projectId: startapusProject.id,
    },
  });

  // Создание страниц для проекта Стартапус
  const pages = [
    {
      id: 'home',
      title: 'Главная',
      slug: '',
      isHomePage: true,
      metaTitle: 'Стартапус - Инновационная экосистема для веб-разработки',
      metaDescription:
        'Создавайте профессиональные веб-сайты с экосистемой Стартапус. Визуальный редактор, AI-помощник и мощные инструменты.',
      content: JSON.stringify({
        blocks: [
          {
            id: 'hero-1',
            type: 'hero-section',
            props: {
              title: 'Создавайте будущее веба с экосистемой Стартапус',
              subtitle: 'Полный набор инструментов для создания современных веб-сайтов без программирования',
              buttonText: 'Начать бесплатно',
              buttonLink: '/situs',
              backgroundImage: '/images/hero-bg.jpg',
              overlayOpacity: 0.4,
            },
          },
          {
            id: 'products-1',
            type: 'products-section',
            props: {
              title: 'Наши продукты',
              subtitle: 'Каждый инструмент создан для решения конкретных задач',
              products: [
                {
                  name: 'Situs',
                  description: 'Визуальный конструктор сайтов',
                  icon: '🏗️',
                  features: ['Drag & Drop редактор', 'Готовые блоки', 'Адаптивный дизайн'],
                },
                {
                  name: 'Redaktus',
                  description: 'Продвинутый контент-редактор',
                  icon: '✏️',
                  features: ['Блочный редактор', 'Совместная работа', 'История изменений'],
                },
                {
                  name: 'Hubus',
                  description: 'AI-помощник для контента',
                  icon: '🤖',
                  features: ['Генерация текстов', 'Оптимизация SEO', 'Перевод контента'],
                },
                {
                  name: 'Bilingus',
                  description: 'Система биллинга и платежей',
                  icon: '💳',
                  features: ['Подписки', 'Платежи', 'Аналитика доходов'],
                },
                {
                  name: 'Controlus',
                  description: 'Мониторинг и аналитика',
                  icon: '📊',
                  features: ['Метрики производительности', 'Пользовательская аналитика', 'Отчеты'],
                },
                {
                  name: 'Loginus',
                  description: 'Единая система авторизации',
                  icon: '🔐',
                  features: ['Single Sign-On', 'OAuth2', 'Безопасность'],
                },
              ],
            },
          },
        ],
      }),
    },
    {
      id: 'about',
      title: 'О компании',
      slug: 'about',
      metaTitle: 'О компании Стартапус - Наша миссия и команда',
      metaDescription: 'Узнайте больше о команде Стартапус, нашей миссии и видении будущего веб-разработки.',
      content: JSON.stringify({
        blocks: [
          {
            id: 'about-hero',
            type: 'text-section',
            props: {
              title: 'О компании Стартапус',
              content:
                'Мы создаем инновационные инструменты для веб-разработки, которые делают создание сайтов простым и доступным для всех.',
              layout: 'centered',
            },
          },
          {
            id: 'mission',
            type: 'mission-section',
            props: {
              title: 'Наша миссия',
              mission:
                'Демократизировать веб-разработку, предоставив каждому возможность создавать профессиональные сайты без глубоких технических знаний.',
              values: [
                'Инновации в каждом продукте',
                'Простота использования',
                'Открытость и прозрачность',
                'Поддержка сообщества',
              ],
            },
          },
        ],
      }),
    },
    {
      id: 'products',
      title: 'Продукты',
      slug: 'products',
      metaTitle: 'Продукты Стартапус - Полная экосистема для веб-разработки',
      metaDescription:
        'Изучите все продукты экосистемы Стартапус: Situs, Redaktus, Hubus, Bilingus, Controlus и Loginus.',
      content: JSON.stringify({
        blocks: [
          {
            id: 'products-detail',
            type: 'products-detail-section',
            props: {
              title: 'Продукты экосистемы',
              description: 'Каждый продукт решает конкретные задачи и работает в единой экосистеме',
            },
          },
        ],
      }),
    },
    {
      id: 'blog',
      title: 'Блог',
      slug: 'blog',
      metaTitle: 'Блог Стартапус - Новости и статьи о веб-разработке',
      metaDescription: 'Читайте последние новости, гайды и статьи о веб-разработке в блоге Стартапус.',
      content: JSON.stringify({
        blocks: [
          {
            id: 'blog-list',
            type: 'blog-section',
            props: {
              title: 'Блог',
              subtitle: 'Новости, обновления и полезные статьи',
            },
          },
        ],
      }),
    },
    {
      id: 'contact',
      title: 'Контакты',
      slug: 'contact',
      metaTitle: 'Контакты Стартапус - Свяжитесь с нами',
      metaDescription: 'Свяжитесь с командой Стартапус. Мы всегда готовы помочь и ответить на ваши вопросы.',
      content: JSON.stringify({
        blocks: [
          {
            id: 'contact-form',
            type: 'contact-section',
            props: {
              title: 'Свяжитесь с нами',
              subtitle: 'Мы всегда готовы помочь и ответить на ваши вопросы',
              email: 'hello@startapus.com',
              phone: '+7 (495) 123-45-67',
              address: 'Москва, Россия',
            },
          },
        ],
      }),
    },
  ];

  for (const pageData of pages) {
    await prisma.page.upsert({
      where: {
        productId_slug: {
          productId: websiteProduct.id,
          slug: pageData.slug,
        },
      },
      update: {},
      create: {
        ...pageData,
        productId: websiteProduct.id,
        pageType: 'PAGE',
        status: 'PUBLISHED',
      },
    });
  }

  // Создание тестового проекта
  const testProject = await prisma.project.create({
    data: {
      name: 'Тестовый интернет-магазин',
      description: 'Демонстрационный проект интернет-магазина',
      slug: 'test-ecommerce-store',
      ownerId: user.id,
    },
  });

  // Создание продукта Store для тестового проекта
  const storeProduct = await prisma.product.create({
    data: {
      name: 'Store',
      description: 'Интернет-магазин',
      type: 'ECOMMERCE',
      status: 'ACTIVE',
      projectId: testProject.id,
    },
  });

  await prisma.page.create({
    data: {
      title: 'Главная страница магазина',
      slug: '',
      isHomePage: true,
      productId: storeProduct.id,
      pageType: 'PAGE',
      status: 'PUBLISHED',
      content: JSON.stringify({
        blocks: [
          {
            id: 'shop-hero',
            type: 'ecommerce-hero',
            props: {
              title: 'Добро пожаловать в наш магазин',
              subtitle: 'Лучшие товары по выгодным ценам',
            },
          },
        ],
      }),
    },
  });

  // Создание типов меню для проекта Стартапус
  const mainMenuType = await prisma.menuType.upsert({
    where: {
      projectId_name: {
        projectId: startapusProject.id,
        name: 'main',
      },
    },
    update: {},
    create: {
      name: 'main',
      title: 'Главное меню',
      description: 'Основное навигационное меню сайта',
      isActive: true,
      projectId: startapusProject.id,
    },
  });

  const footerMenuType = await prisma.menuType.upsert({
    where: {
      projectId_name: {
        projectId: startapusProject.id,
        name: 'footer',
      },
    },
    update: {},
    create: {
      name: 'footer',
      title: 'Меню подвала',
      description: 'Навигационное меню в подвале сайта',
      isActive: true,
      projectId: startapusProject.id,
    },
  });

  const sidebarMenuType = await prisma.menuType.upsert({
    where: {
      projectId_name: {
        projectId: startapusProject.id,
        name: 'sidebar',
      },
    },
    update: {},
    create: {
      name: 'sidebar',
      title: 'Боковое меню',
      description: 'Дополнительное меню в боковой панели',
      isActive: true,
      projectId: startapusProject.id,
    },
  });

  // Создание пунктов главного меню
  const mainMenuItems = [
    {
      title: 'Главная',
      alias: 'home',
      type: 'COMPONENT',
      component: 'Website',
      view: 'page',
      layout: 'default',
      targetId: 'home',
      orderIndex: 1,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        menu_image: '',
        css_class: 'nav-home',
      }),
    },
    {
      title: 'О компании',
      alias: 'about',
      type: 'COMPONENT',
      component: 'Website',
      view: 'page',
      layout: 'default',
      targetId: 'about',
      orderIndex: 2,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        menu_image: '',
        css_class: 'nav-about',
      }),
    },
    {
      title: 'Продукты',
      alias: 'products',
      type: 'COMPONENT',
      component: 'Website',
      view: 'page',
      layout: 'default',
      targetId: 'products',
      orderIndex: 3,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        menu_image: '',
        css_class: 'nav-products',
      }),
    },
    {
      title: 'Блог',
      alias: 'blog',
      type: 'COMPONENT',
      component: 'Website',
      view: 'page',
      layout: 'default',
      targetId: 'blog',
      orderIndex: 4,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        menu_image: '',
        css_class: 'nav-blog',
      }),
    },
    {
      title: 'Контакты',
      alias: 'contact',
      type: 'COMPONENT',
      component: 'Website',
      view: 'page',
      layout: 'default',
      targetId: 'contact',
      orderIndex: 5,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        menu_image: '',
        css_class: 'nav-contact',
      }),
    },
  ];

  // Создаем пункты главного меню
  for (const itemData of mainMenuItems) {
    await prisma.menuItem.upsert({
      where: {
        menuTypeId_alias: {
          menuTypeId: mainMenuType.id,
          alias: itemData.alias,
        },
      },
      update: {},
      create: {
        ...itemData,
        menuTypeId: mainMenuType.id,
        isPublished: true,
        accessLevel: 'PUBLIC',
        language: '*',
      },
    });
  }

  // Создание пунктов меню подвала
  const footerMenuItems = [
    {
      title: 'Политика конфиденциальности',
      alias: 'privacy',
      type: 'URL',
      externalUrl: '/privacy',
      orderIndex: 1,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        target: '_self',
        css_class: 'footer-link',
      }),
    },
    {
      title: 'Условия использования',
      alias: 'terms',
      type: 'URL',
      externalUrl: '/terms',
      orderIndex: 2,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        target: '_self',
        css_class: 'footer-link',
      }),
    },
    {
      title: 'Поддержка',
      alias: 'support',
      type: 'URL',
      externalUrl: 'mailto:support@startapus.com',
      orderIndex: 3,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        target: '_blank',
        css_class: 'footer-link',
      }),
    },
  ];

  // Создаем пункты меню подвала
  for (const itemData of footerMenuItems) {
    await prisma.menuItem.upsert({
      where: {
        menuTypeId_alias: {
          menuTypeId: footerMenuType.id,
          alias: itemData.alias,
        },
      },
      update: {},
      create: {
        ...itemData,
        menuTypeId: footerMenuType.id,
        isPublished: true,
        accessLevel: 'PUBLIC',
        language: '*',
      },
    });
  }

  // Создание типов меню для тестового проекта (интернет-магазин)
  const shopMainMenuType = await prisma.menuType.upsert({
    where: {
      projectId_name: {
        projectId: testProject.id,
        name: 'main',
      },
    },
    update: {},
    create: {
      name: 'main',
      title: 'Главное меню магазина',
      description: 'Основное навигационное меню интернет-магазина',
      isActive: true,
      projectId: testProject.id,
    },
  });

  // Создание пунктов меню для интернет-магазина
  const shopMenuItems = [
    {
      title: 'Главная',
      alias: 'home',
      type: 'COMPONENT',
      component: 'Store',
      view: 'home',
      layout: 'default',
      orderIndex: 1,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        show_featured: true,
        css_class: 'shop-nav-home',
      }),
    },
    {
      title: 'Каталог',
      alias: 'catalog',
      type: 'HEADING',
      orderIndex: 2,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        css_class: 'shop-nav-heading',
      }),
    },
    {
      title: 'Электроника',
      alias: 'electronics',
      type: 'COMPONENT',
      component: 'Store',
      view: 'category',
      layout: 'grid',
      parentId: null, // Будет установлен после создания родительского элемента
      orderIndex: 1,
      level: 2,
      parameters: JSON.stringify({
        menu_show: true,
        items_per_page: 12,
        css_class: 'shop-nav-category',
      }),
    },
    {
      title: 'Одежда',
      alias: 'clothing',
      type: 'COMPONENT',
      component: 'Store',
      view: 'category',
      layout: 'grid',
      parentId: null, // Будет установлен после создания родительского элемента
      orderIndex: 2,
      level: 2,
      parameters: JSON.stringify({
        menu_show: true,
        items_per_page: 12,
        css_class: 'shop-nav-category',
      }),
    },
    {
      title: 'О магазине',
      alias: 'about-shop',
      type: 'COMPONENT',
      component: 'Website',
      view: 'page',
      layout: 'default',
      orderIndex: 3,
      level: 1,
      parameters: JSON.stringify({
        menu_show: true,
        css_class: 'shop-nav-about',
      }),
    },
  ];

  // Создаем пункты меню магазина и устанавливаем иерархию
  const createdShopItems = [];
  for (const itemData of shopMenuItems) {
    const item = await prisma.menuItem.upsert({
      where: {
        menuTypeId_alias: {
          menuTypeId: shopMainMenuType.id,
          alias: itemData.alias,
        },
      },
      update: {},
      create: {
        ...itemData,
        menuTypeId: shopMainMenuType.id,
        isPublished: true,
        accessLevel: 'PUBLIC',
        language: '*',
      },
    });
    createdShopItems.push(item);
  }

  // Устанавливаем родительские связи для подкатегорий
  const catalogItem = createdShopItems.find((item) => item.alias === 'catalog');
  if (catalogItem) {
    await prisma.menuItem.updateMany({
      where: {
        menuTypeId: shopMainMenuType.id,
        alias: { in: ['electronics', 'clothing'] },
      },
      data: {
        parentId: catalogItem.id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Created:');
  console.log(`- Admin user: admin@startapus.com / admin123`);
  console.log(`- User: dmitriy@startapus.com / user123`);
  console.log(`- Project: ${startapusProject.name}`);
  console.log(`- Pages: ${pages.length} pages`);
  console.log(`- Menu Types: 4 types (main, footer, sidebar for Startapus + main for shop)`);
  console.log(`- Menu Items: ${mainMenuItems.length + footerMenuItems.length + shopMenuItems.length} items`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
