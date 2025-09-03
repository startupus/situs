#!/usr/bin/env tsx
import {
  PrismaClient,
  ProductType,
  PageStatus,
  PageType,
  ProjectStatus,
  GlobalRole,
  UserStatus,
  ProductStatus,
  MenuItemType,
  AccessLevel,
} from '@prisma/client';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureDemoOwner() {
  const username = 'demo-owner';
  const email = 'demo-owner@example.com';
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      username,
      email,
      password: 'dev-password',
      globalRole: GlobalRole.BUSINESS,
      status: UserStatus.ACTIVE,
    },
  });
}

async function createDemoProject(name: string, description: string, owner: any) {
  const slug = slugify(name);

  // Проверяем существование проекта
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    console.log(`📦 Проект "${name}" уже существует, пропускаем`);
    return existing;
  }

  // Создаем проект
  const project = await prisma.project.create({
    data: {
      name,
      slug,
      description,
      ownerId: owner.id,
      status: ProjectStatus.ACTIVE,
      isPublished: true,
      settings: JSON.stringify({
        theme: 'auto',
        language: 'ru',
        primaryColor: '#4F46E5',
        secondaryColor: '#10B981',
      }),
    },
  });
  console.log(`📦 Создан проект: ${project.name}`);

  // Создаем продукт WEBSITE
  const website = await prisma.product.create({
    data: {
      name: 'Сайт',
      description: 'Корпоративный сайт проекта',
      type: ProductType.WEBSITE,
      status: ProductStatus.ACTIVE,
      projectId: project.id,
      settings: JSON.stringify({
        theme: 'modern',
        layout: 'responsive',
      }),
    },
  });
  console.log(`🌐 Создан продукт WEBSITE: ${website.id}`);

  // Создаем продукт ECOMMERCE
  const store = await prisma.product.create({
    data: {
      name: 'Магазин',
      description: 'Интернет-магазин проекта',
      type: ProductType.ECOMMERCE,
      status: ProductStatus.ACTIVE,
      projectId: project.id,
      settings: JSON.stringify({
        currency: 'RUB',
        paymentMethods: ['card', 'cash', 'online'],
        shippingMethods: ['pickup', 'courier', 'post'],
      }),
    },
  });
  console.log(`🛒 Создан продукт ECOMMERCE: ${store.id}`);

  // Создаем продукт BLOG
  const blog = await prisma.product.create({
    data: {
      name: 'Блог',
      description: 'Блог проекта',
      type: ProductType.BLOG,
      status: ProductStatus.ACTIVE,
      projectId: project.id,
      settings: JSON.stringify({
        postsPerPage: 10,
        allowComments: true,
        moderateComments: true,
      }),
    },
  });
  console.log(`📝 Создан продукт BLOG: ${blog.id}`);

  // Создаем страницы для WEBSITE
  const websitePages = [
    {
      title: 'Главная',
      slug: 'home',
      isHomePage: true,
      content: {
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            props: {
              title: `Добро пожаловать в ${name}`,
              subtitle: description,
              buttonText: 'Узнать больше',
              backgroundImage: '/images/hero-bg.jpg',
            },
          },
          {
            id: 'features-1',
            type: 'features',
            props: {
              title: 'Наши преимущества',
              features: [
                { title: 'Качество', description: 'Высокое качество продукции', icon: 'star' },
                { title: 'Скорость', description: 'Быстрая доставка', icon: 'zap' },
                { title: 'Поддержка', description: '24/7 поддержка клиентов', icon: 'headphones' },
              ],
            },
          },
        ],
      },
    },
    {
      title: 'О компании',
      slug: 'about',
      content: {
        blocks: [
          {
            id: 'about-1',
            type: 'text',
            props: {
              title: 'О нашей компании',
              content: `<p>Компания "${name}" работает на рынке уже много лет и зарекомендовала себя как надежный партнер.</p><p>Мы предлагаем качественные услуги и продукты, которые помогают нашим клиентам достигать поставленных целей.</p>`,
            },
          },
        ],
      },
    },
    {
      title: 'Услуги',
      slug: 'services',
      content: {
        blocks: [
          {
            id: 'services-1',
            type: 'services',
            props: {
              title: 'Наши услуги',
              services: [
                { title: 'Консультации', description: 'Профессиональные консультации', price: 'от 5000₽' },
                { title: 'Разработка', description: 'Разработка под ключ', price: 'от 50000₽' },
                { title: 'Поддержка', description: 'Техническая поддержка', price: 'от 10000₽/мес' },
              ],
            },
          },
        ],
      },
    },
    {
      title: 'Контакты',
      slug: 'contacts',
      content: {
        blocks: [
          {
            id: 'contacts-1',
            type: 'contacts',
            props: {
              title: 'Свяжитесь с нами',
              phone: '+7 (495) 123-45-67',
              email: 'info@example.com',
              address: 'Москва, ул. Примерная, д. 1',
              workingHours: 'Пн-Пт: 9:00-18:00',
            },
          },
        ],
      },
    },
  ];

  for (let i = 0; i < websitePages.length; i++) {
    const pageData = websitePages[i];
    await prisma.page.create({
      data: {
        title: pageData.title,
        slug: pageData.slug,
        content: JSON.stringify(pageData.content),
        status: PageStatus.PUBLISHED,
        pageType: PageType.PAGE,
        isHomePage: pageData.isHomePage || false,
        orderIndex: i,
        productId: website.id,
        metaTitle: `${pageData.title} - ${name}`,
        metaDescription: `${pageData.title} компании ${name}. ${description}`,
      },
    });
    console.log(`📄 Создана страница: ${pageData.title}`);
  }

  // Создаем категории для магазина
  const categories = [
    { name: 'Электроника', slug: 'electronics', description: 'Смартфоны, ноутбуки, аксессуары' },
    { name: 'Одежда', slug: 'clothing', description: 'Мужская и женская одежда' },
    { name: 'Дом и сад', slug: 'home-garden', description: 'Товары для дома и дачи' },
    { name: 'Спорт', slug: 'sport', description: 'Спортивные товары и инвентарь' },
  ];

  const createdCategories = [];
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        alias: cat.slug, // Дублируем slug в alias
        description: cat.description,
        orderIndex: i,
        isActive: true,
        productId: store.id,
      },
    });
    createdCategories.push(category);
    console.log(`📂 Создана категория: ${cat.name}`);
  }

  // Создаем подкатегории для Электроники
  const electronicsCategory = createdCategories.find((c) => c.slug === 'electronics');
  if (electronicsCategory) {
    const subCategories = [
      { name: 'Смартфоны', slug: 'smartphones', description: 'Мобильные телефоны' },
      { name: 'Ноутбуки', slug: 'laptops', description: 'Портативные компьютеры' },
      { name: 'Аксессуары', slug: 'accessories', description: 'Чехлы, зарядки, наушники' },
    ];

    for (let i = 0; i < subCategories.length; i++) {
      const subCat = subCategories[i];
      await prisma.category.create({
        data: {
          name: subCat.name,
          slug: subCat.slug,
          alias: subCat.slug, // Дублируем slug в alias
          description: subCat.description,
          orderIndex: i,
          isActive: true,
          parentId: electronicsCategory.id,
          productId: store.id,
        },
      });
      console.log(`📱 Создана подкатегория: ${subCat.name}`);
    }
  }

  // Создаем товары для магазина
  const items = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Новейший смартфон Apple с титановым корпусом',
      price: 99999,
      categorySlug: 'smartphones',
    },
    {
      name: 'MacBook Pro M3',
      slug: 'macbook-pro-m3',
      description: 'Мощный ноутбук для профессионалов',
      price: 199999,
      categorySlug: 'laptops',
    },
    {
      name: 'AirPods Pro',
      slug: 'airpods-pro',
      description: 'Беспроводные наушники с шумоподавлением',
      price: 24999,
      categorySlug: 'accessories',
    },
  ];

  for (const itemData of items) {
    const category = await prisma.category.findFirst({
      where: { slug: itemData.categorySlug, productId: store.id },
    });

    if (category) {
      await prisma.item.create({
        data: {
          name: itemData.name,
          slug: itemData.slug,
          description: itemData.description,
          price: itemData.price,
          status: 'ACTIVE',
          categoryId: category.id,
          productId: store.id,
        },
      });
      console.log(`🛍️ Создан товар: ${itemData.name}`);
    }
  }

  // Создаем посты для блога
  const blogPosts = [
    {
      title: 'Добро пожаловать в наш блог!',
      slug: 'welcome-to-blog',
      content: {
        blocks: [
          {
            id: 'post-1',
            type: 'text',
            props: {
              content:
                '<p>Добро пожаловать в официальный блог нашей компании! Здесь мы будем делиться новостями, полезными советами и интересными материалами.</p>',
            },
          },
        ],
      },
    },
    {
      title: 'Как выбрать качественный продукт',
      slug: 'how-to-choose-quality-product',
      content: {
        blocks: [
          {
            id: 'post-2',
            type: 'text',
            props: {
              content:
                '<p>В этой статье мы расскажем о том, на что стоит обращать внимание при выборе качественного продукта.</p><p>Основные критерии выбора:</p><ul><li>Качество материалов</li><li>Репутация производителя</li><li>Отзывы покупателей</li><li>Соотношение цена-качество</li></ul>',
            },
          },
        ],
      },
    },
  ];

  for (let i = 0; i < blogPosts.length; i++) {
    const postData = blogPosts[i];
    await prisma.page.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        content: JSON.stringify(postData.content),
        status: PageStatus.PUBLISHED,
        pageType: PageType.POST,
        isHomePage: false,
        orderIndex: i,
        productId: blog.id,
        metaTitle: `${postData.title} - Блог ${name}`,
        metaDescription: `${postData.title}. Читайте в блоге компании ${name}`,
      },
    });
    console.log(`📝 Создан пост блога: ${postData.title}`);
  }

  // Создаем систему меню
  console.log('🧭 Создание системы меню...');

  // Главное меню
  const mainMenu = await prisma.menuType.create({
    data: {
      name: 'main',
      title: 'Главное меню',
      description: 'Основная навигация сайта',
      projectId: project.id,
    },
  });
  console.log('📁 Создан тип меню: Главное меню');

  // Пункты главного меню
  const mainMenuItems = [
    {
      title: 'Главная',
      alias: 'home',
      component: 'Website',
      view: 'page',
      targetId: 'home',
      orderIndex: 0,
    },
    {
      title: 'О компании',
      alias: 'about',
      component: 'Website',
      view: 'page',
      targetId: 'about',
      orderIndex: 1,
    },
    {
      title: 'Услуги',
      alias: 'services',
      component: 'Website',
      view: 'page',
      targetId: 'services',
      orderIndex: 2,
    },
    {
      title: 'Каталог',
      alias: 'catalog',
      component: 'Store',
      view: 'categories',
      orderIndex: 3,
    },
    {
      title: 'Блог',
      alias: 'blog',
      component: 'Blog',
      view: 'posts',
      orderIndex: 4,
    },
    {
      title: 'Контакты',
      alias: 'contacts',
      component: 'Website',
      view: 'page',
      targetId: 'contacts',
      orderIndex: 5,
    },
  ];

  for (const item of mainMenuItems) {
    const menuItem = await prisma.menuItem.create({
      data: {
        title: item.title,
        alias: item.alias,
        type: MenuItemType.COMPONENT,
        level: 1,
        orderIndex: item.orderIndex,
        component: item.component,
        view: item.view,
        targetId: item.targetId,
        isPublished: true,
        accessLevel: AccessLevel.PUBLIC,
        language: '*',
        parameters: JSON.stringify({
          menu_show: true,
          css_class: 'nav-link',
        }),
        menuTypeId: mainMenu.id,
      },
    });
    console.log(`🔗 Создан пункт меню: ${menuItem.title}`);
  }

  // Подменю для каталога
  const catalogMenuItem = await prisma.menuItem.findFirst({
    where: { menuTypeId: mainMenu.id, alias: 'catalog' },
  });

  if (catalogMenuItem && createdCategories.length > 0) {
    for (let i = 0; i < createdCategories.length; i++) {
      const category = createdCategories[i];
      await prisma.menuItem.create({
        data: {
          title: category.name,
          alias: `category-${category.slug}`,
          type: MenuItemType.COMPONENT,
          level: 2,
          parentId: catalogMenuItem.id,
          orderIndex: i,
          component: 'Store',
          view: 'category',
          targetId: category.id,
          isPublished: true,
          accessLevel: AccessLevel.PUBLIC,
          language: '*',
          parameters: JSON.stringify({
            menu_show: true,
            itemsPerPage: 20,
            showFilters: true,
          }),
          menuTypeId: mainMenu.id,
        },
      });
      console.log(`🔗 Создан подпункт меню: ${category.name}`);
    }
  }

  // Футер меню
  const footerMenu = await prisma.menuType.create({
    data: {
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

  for (let i = 0; i < footerItems.length; i++) {
    const item = footerItems[i];
    await prisma.menuItem.create({
      data: {
        title: item.title,
        alias: item.alias,
        type: MenuItemType.URL,
        level: 1,
        orderIndex: i,
        externalUrl: item.externalUrl,
        isPublished: true,
        accessLevel: AccessLevel.PUBLIC,
        language: '*',
        menuTypeId: footerMenu.id,
      },
    });
  }

  console.log('🧭 Система меню создана успешно');
  console.log(`✅ Проект "${name}" полностью настроен!`);

  return project;
}

async function main() {
  console.log('🚀 Создание полноценных демо-проектов...');

  const owner = await ensureDemoOwner();
  console.log(`👤 Владелец готов: ${owner.username}`);

  const demoProjects = [
    {
      name: 'TechStore - Магазин электроники',
      description: 'Современный интернет-магазин с широким ассортиментом электроники и гаджетов',
    },
    {
      name: 'WebDev Agency - Веб-студия',
      description: 'Профессиональное агентство по созданию сайтов и веб-приложений',
    },
    {
      name: 'Delicious Food - Ресторан',
      description: 'Уютный ресторан с авторской кухней и домашней атмосферой',
    },
  ];

  for (const projectData of demoProjects) {
    try {
      await createDemoProject(projectData.name, projectData.description, owner);
    } catch (error) {
      console.error(`❌ Ошибка создания проекта "${projectData.name}":`, error);
    }
  }

  console.log('🎉 Все демо-проекты созданы успешно!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Ошибка выполнения скрипта:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
