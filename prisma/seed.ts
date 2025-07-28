import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создание валют
  const usdCurrency = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      decimals: 2,
      isActive: true,
      isSystem: true,
      description: 'United States Dollar',
      color: '#22C55E'
    }
  });

  const rubCurrency = await prisma.currency.upsert({
    where: { code: 'RUB' },
    update: {},
    create: {
      code: 'RUB',
      name: 'Russian Ruble',
      symbol: '₽',
      decimals: 2,
      isActive: true,
      isSystem: true,
      description: 'Russian Ruble',
      color: '#3B82F6'
    }
  });

  const monetusCurrency = await prisma.currency.upsert({
    where: { code: 'MONETUS' },
    update: {},
    create: {
      code: 'MONETUS',
      name: 'Monetus',
      symbol: '₿',
      decimals: 0,
      isActive: true,
      isSystem: true,
      description: 'Situs Platform Internal Currency',
      color: '#8B5CF6'
    }
  });

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
      status: 'ACTIVE'
    }
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
      role: 'USER',
      status: 'ACTIVE'
    }
  });

  // Создание балансов для пользователя
  await prisma.balance.upsert({
    where: {
      userId_currencyId: {
        userId: user.id,
        currencyId: monetusCurrency.id
      }
    },
    update: {},
    create: {
      userId: user.id,
      currencyId: monetusCurrency.id,
      amount: 1250,
      reserved: 0
    }
  });

  await prisma.balance.upsert({
    where: {
      userId_currencyId: {
        userId: user.id,
        currencyId: usdCurrency.id
      }
    },
    update: {},
    create: {
      userId: user.id,
      currencyId: usdCurrency.id,
      amount: 500,
      reserved: 0
    }
  });

  // Создание проекта "Сайт экосистемы Стартапус"
  const startapusProject = await prisma.project.upsert({
    where: { id: 'startapus-ecosystem' },
    update: {},
    create: {
      id: 'startapus-ecosystem',
      name: 'Сайт экосистемы Стартапус',
      description: 'Официальный сайт экосистемы Стартапус - инновационная платформа для создания и управления веб-проектами',
      type: 'WEBSITE',
      status: 'PUBLISHED',
      domain: 'startapus.com',
      subdomain: 'www',
      metaTitle: 'Стартапус - Экосистема для создания веб-проектов',
      metaDescription: 'Создавайте современные веб-сайты с помощью экосистемы Стартапус. Situs, Redaktus, Hubus и другие инструменты для вашего успеха.',
      metaKeywords: 'стартапус, situs, redaktus, веб-разработка, конструктор сайтов, CMS',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      fontFamily: 'Inter',
      hasEcommerce: false,
      hasAnalytics: true,
      hasBlog: true,
      hasContactForm: true,
      ownerId: user.id
    }
  });

  // Создание страниц для проекта Стартапус
  const pages = [
    {
      id: 'home',
      title: 'Главная',
      slug: '',
      isHomePage: true,
      metaTitle: 'Стартапус - Инновационная экосистема для веб-разработки',
      metaDescription: 'Создавайте профессиональные веб-сайты с экосистемой Стартапус. Визуальный редактор, AI-помощник и мощные инструменты.',
      content: {
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
              overlayOpacity: 0.4
            }
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
                  features: ['Drag & Drop редактор', 'Готовые блоки', 'Адаптивный дизайн']
                },
                {
                  name: 'Redaktus',
                  description: 'Продвинутый контент-редактор',
                  icon: '✏️',
                  features: ['Блочный редактор', 'Совместная работа', 'История изменений']
                },
                {
                  name: 'Hubus',
                  description: 'AI-помощник для контента',
                  icon: '🤖',
                  features: ['Генерация текстов', 'Оптимизация SEO', 'Перевод контента']
                },
                {
                  name: 'Bilingus',
                  description: 'Система биллинга и платежей',
                  icon: '💳',
                  features: ['Подписки', 'Платежи', 'Аналитика доходов']
                },
                {
                  name: 'Controlus',
                  description: 'Мониторинг и аналитика',
                  icon: '📊',
                  features: ['Метрики производительности', 'Пользовательская аналитика', 'Отчеты']
                },
                {
                  name: 'Loginus',
                  description: 'Единая система авторизации',
                  icon: '🔐',
                  features: ['Single Sign-On', 'OAuth2', 'Безопасность']
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'about',
      title: 'О компании',
      slug: 'about',
      metaTitle: 'О компании Стартапус - Наша миссия и команда',
      metaDescription: 'Узнайте больше о команде Стартапус, нашей миссии и видении будущего веб-разработки.',
      content: {
        blocks: [
          {
            id: 'about-hero',
            type: 'text-section',
            props: {
              title: 'О компании Стартапус',
              content: 'Мы создаем инновационные инструменты для веб-разработки, которые делают создание сайтов простым и доступным для всех.',
              layout: 'centered'
            }
          },
          {
            id: 'mission',
            type: 'mission-section',
            props: {
              title: 'Наша миссия',
              mission: 'Демократизировать веб-разработку, предоставив каждому возможность создавать профессиональные сайты без глубоких технических знаний.',
              values: [
                'Инновации в каждом продукте',
                'Простота использования',
                'Открытость и прозрачность',
                'Поддержка сообщества'
              ]
            }
          }
        ]
      }
    },
    {
      id: 'products',
      title: 'Продукты',
      slug: 'products',
      metaTitle: 'Продукты Стартапус - Полная экосистема для веб-разработки',
      metaDescription: 'Изучите все продукты экосистемы Стартапус: Situs, Redaktus, Hubus, Bilingus, Controlus и Loginus.',
      content: {
        blocks: [
          {
            id: 'products-detail',
            type: 'products-detail-section',
            props: {
              title: 'Продукты экосистемы',
              description: 'Каждый продукт решает конкретные задачи и работает в единой экосистеме'
            }
          }
        ]
      }
    },
    {
      id: 'blog',
      title: 'Блог',
      slug: 'blog',
      metaTitle: 'Блог Стартапус - Новости и статьи о веб-разработке',
      metaDescription: 'Читайте последние новости, гайды и статьи о веб-разработке в блоге Стартапус.',
      content: {
        blocks: [
          {
            id: 'blog-list',
            type: 'blog-section',
            props: {
              title: 'Блог',
              subtitle: 'Новости, обновления и полезные статьи'
            }
          }
        ]
      }
    },
    {
      id: 'contact',
      title: 'Контакты',
      slug: 'contact',
      metaTitle: 'Контакты Стартапус - Свяжитесь с нами',
      metaDescription: 'Свяжитесь с командой Стартапус. Мы всегда готовы помочь и ответить на ваши вопросы.',
      content: {
        blocks: [
          {
            id: 'contact-form',
            type: 'contact-section',
            props: {
              title: 'Свяжитесь с нами',
              subtitle: 'Мы всегда готовы помочь и ответить на ваши вопросы',
              email: 'hello@startapus.com',
              phone: '+7 (495) 123-45-67',
              address: 'Москва, Россия'
            }
          }
        ]
      }
    }
  ];

  for (const pageData of pages) {
    await prisma.page.upsert({
      where: {
        projectId_slug: {
          projectId: startapusProject.id,
          slug: pageData.slug
        }
      },
      update: {},
      create: {
        ...pageData,
        projectId: startapusProject.id,
        pageType: 'PAGE',
        status: 'PUBLISHED'
      }
    });
  }

  // Создание тестового проекта
  const testProject = await prisma.project.create({
    data: {
      name: 'Тестовый интернет-магазин',
      description: 'Демонстрационный проект интернет-магазина',
      type: 'ECOMMERCE',
      status: 'DRAFT',
      hasEcommerce: true,
      hasAnalytics: true,
      ownerId: user.id
    }
  });

  await prisma.page.create({
    data: {
      title: 'Главная страница магазина',
      slug: '',
      isHomePage: true,
      projectId: testProject.id,
      pageType: 'PAGE',
      status: 'DRAFT',
      content: {
        blocks: [
          {
            id: 'shop-hero',
            type: 'ecommerce-hero',
            props: {
              title: 'Добро пожаловать в наш магазин',
              subtitle: 'Лучшие товары по выгодным ценам'
            }
          }
        ]
      }
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Created:');
  console.log(`- Admin user: admin@startapus.com / admin123`);
  console.log(`- User: dmitriy@startapus.com / user123`);
  console.log(`- Project: ${startapusProject.name}`);
  console.log(`- Pages: ${pages.length} pages`);
  console.log(`- Currencies: USD, RUB, MONETUS`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
