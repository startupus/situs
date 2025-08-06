import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Скрипт для создания проекта "Стартапус" с базовыми страницами
 */

async function createStartapusProject() {
  try {
    console.log('🚀 Создание проекта "Стартапус"...');

    // Сначала нужно найти пользователя или создать тестового
    let user = await prisma.user.findFirst({
      where: { email: 'test@startapus.com' }
    });

    if (!user) {
      console.log('👤 Создание тестового пользователя...');
      user = await prisma.user.create({
        data: {
          username: 'startapus_admin',
          email: 'test@startapus.com',
          password: 'hashed_password_here', // В реальном проекте должен быть хеш
          role: 'ADMIN',
          profile: {
            name: 'Администратор Стартапус',
            bio: 'Администратор проекта Стартапус'
          }
        }
      });
      console.log('✅ Пользователь создан:', user.email);
    }

    // Проверяем, есть ли уже проект Стартапус
    const existingProject = await prisma.project.findFirst({
      where: { 
        slug: 'startapus',
        ownerId: user.id 
      }
    });

    let project;
    if (existingProject) {
      console.log('📁 Проект "Стартапус" уже существует');
      project = existingProject;
    } else {
      console.log('📁 Создание проекта "Стартапус"...');
      project = await prisma.project.create({
        data: {
          name: 'Стартапус',
          description: 'Платформа для запуска стартапов и развития бизнеса',
          slug: 'startapus',
          type: 'WEBSITE',
          domain: 'startapus.situs.com',
          status: 'DRAFT',
          ownerId: user.id,
          settings: {
            theme: 'auto',
            language: 'ru',
            creationType: 'manual'
          },
          primaryColor: '#4F46E5',
          secondaryColor: '#10B981',
          fontFamily: 'Inter'
        }
      });
      console.log('✅ Проект создан:', project.name);
    }

    // Создаем базовые страницы
    const pages = [
      {
        title: 'Главная страница',
        slug: 'home',
        isHomePage: true,
        metaTitle: 'Стартапус - Платформа для стартапов',
        metaDescription: 'Запустите свой стартап с помощью платформы Стартапус. Инструменты, ресурсы и поддержка для успешного развития бизнеса.',
        content: {
          blocks: [
            {
              id: 'hero-1',
              type: 'hero-block',
              props: {
                title: 'Запустите свой стартап с Стартапус',
                subtitle: 'Платформа предоставляет все необходимые инструменты для создания и развития успешного бизнеса',
                buttonText: 'Начать сейчас',
                image: '/images/hero-startup.jpg'
              }
            }
          ]
        }
      },
      {
        title: 'О нас',
        slug: 'about',
        metaTitle: 'О компании Стартапус - Наша миссия и команда',
        metaDescription: 'Узнайте больше о команде Стартапус, нашей миссии и подходе к развитию стартап-экосистемы.',
        content: {
          blocks: [
            {
              id: 'about-1',
              type: 'text-block',
              props: {
                title: 'О Стартапус',
                content: 'Мы помогаем предпринимателям превращать идеи в успешные бизнесы. Наша платформа предоставляет инструменты, знания и поддержку для каждого этапа развития стартапа.'
              }
            }
          ]
        }
      },
      {
        title: 'Услуги',
        slug: 'services',
        metaTitle: 'Услуги Стартапус - Консалтинг и поддержка стартапов',
        metaDescription: 'Полный спектр услуг для стартапов: от консультаций до технической поддержки и маркетинга.',
        content: {
          blocks: [
            {
              id: 'services-1',
              type: 'services-block',
              props: {
                title: 'Наши услуги',
                services: [
                  {
                    title: 'Бизнес-консалтинг',
                    description: 'Помощь в разработке бизнес-модели и стратегии',
                    icon: 'chart'
                  },
                  {
                    title: 'Техническая поддержка',
                    description: 'Разработка MVP и техническое консультирование',
                    icon: 'code'
                  },
                  {
                    title: 'Маркетинг',
                    description: 'Продвижение продукта и привлечение клиентов',
                    icon: 'megaphone'
                  }
                ]
              }
            }
          ]
        }
      },
      {
        title: 'Контакты',
        slug: 'contacts',
        metaTitle: 'Контакты Стартапус - Свяжитесь с нами',
        metaDescription: 'Свяжитесь с командой Стартапус для консультации или сотрудничества. Контактная информация и форма обратной связи.',
        content: {
          blocks: [
            {
              id: 'contacts-1',
              type: 'contact-block',
              props: {
                title: 'Свяжитесь с нами',
                email: 'hello@startapus.com',
                phone: '+7 (495) 123-45-67',
                address: 'Москва, ул. Инновационная, 1'
              }
            }
          ]
        }
      },
      {
        title: 'Прайсинг',
        slug: 'pricing',
        metaTitle: 'Тарифы Стартапус - Выберите подходящий план',
        metaDescription: 'Гибкие тарифные планы для стартапов любого размера. Выберите оптимальный план для вашего бизнеса.',
        content: {
          blocks: [
            {
              id: 'pricing-1',
              type: 'pricing-block',
              props: {
                title: 'Выберите свой план',
                plans: [
                  {
                    name: 'Стартер',
                    price: '9900',
                    period: 'месяц',
                    features: ['Базовая консультация', 'Доступ к материалам', 'Email поддержка']
                  },
                  {
                    name: 'Профи',
                    price: '29900',
                    period: 'месяц',
                    features: ['Персональный консультант', 'Техническая поддержка', 'Маркетинговые инструменты']
                  },
                  {
                    name: 'Энтерпрайз',
                    price: 'По запросу',
                    period: '',
                    features: ['Полный спектр услуг', 'Выделенная команда', 'Индивидуальные решения']
                  }
                ]
              }
            }
          ]
        }
      }
    ];

    console.log('📄 Создание страниц...');
    
    for (const pageData of pages) {
      // Проверяем, существует ли страница
      const existingPage = await prisma.page.findFirst({
        where: {
          slug: pageData.slug,
          projectId: project.id
        }
      });

      if (existingPage) {
        console.log(`📄 Страница "${pageData.title}" уже существует`);
        continue;
      }

      const page = await prisma.page.create({
        data: {
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content,
          projectId: project.id,
          isHomePage: pageData.isHomePage || false,
          metaTitle: pageData.metaTitle,
          metaDescription: pageData.metaDescription,
          status: 'DRAFT'
        }
      });

      console.log(`✅ Страница создана: ${page.title} (/${page.slug})`);
    }

    console.log('\n🎉 Проект "Стартапус" успешно создан!');
    console.log(`📱 ID проекта: ${project.id}`);
    console.log(`👤 Владелец: ${user.email}`);
    console.log(`🌐 Домен: ${project.domain}`);
    
    // Получаем статистику
    const stats = await prisma.page.groupBy({
      by: ['status'],
      where: { projectId: project.id },
      _count: { status: true }
    });

    const totalPages = await prisma.page.count({
      where: { projectId: project.id }
    });

    console.log(`📄 Всего страниц: ${totalPages}`);
    console.log(`📊 Статистика:`, stats);

    return {
      project,
      user,
      totalPages
    };

  } catch (error) {
    console.error('❌ Ошибка при создании проекта:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск скрипта
createStartapusProject()
  .then((result) => {
    console.log('\n✅ Скрипт выполнен успешно!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Ошибка выполнения скрипта:', error);
    process.exit(1);
  });
