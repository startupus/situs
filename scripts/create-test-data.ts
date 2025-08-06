import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('🚀 Создание тестовых данных...');

    // Создаем тестового пользователя
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'USER',
        status: 'ACTIVE',
        profile: JSON.stringify({
          name: 'Тестовый пользователь',
          avatar: '',
          bio: 'Тестовый аккаунт для разработки'
        })
      }
    });

    console.log('✅ Пользователь создан:', user.username);

    // Создаем тестовый проект
    const project = await prisma.project.upsert({
      where: { slug: 'startapus-demo' },
      update: {},
      create: {
        name: 'Стартапус - Демо проект',
        description: 'Демонстрационный проект экосистемы Стартапус',
        slug: 'startapus-demo',
        type: 'WEBSITE',
        status: 'PUBLISHED',
        domain: 'startapus-demo.situs.com',
        isPublished: true,
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        fontFamily: 'Inter',
        settings: JSON.stringify({
          theme: 'auto',
          language: 'ru',
          creationType: 'manual'
        }),
        ownerId: user.id
      }
    });

    console.log('✅ Проект создан:', project.name);

    // Создаем тестовый продукт
    const product = await prisma.product.upsert({
      where: { 
        projectId_name: {
          projectId: project.id,
          name: 'Стартапус - Демо проект'
        }
      },
      update: {},
      create: {
        name: 'Стартапус - Демо проект',
        description: 'Демонстрационный проект экосистемы Стартапус',
        type: 'WEBSITE',
        status: 'PUBLISHED',
        url: 'https://startapus-demo.situs.com',
        editorUrl: '/redaktus?project=' + project.id + '&product=',
        settings: JSON.stringify({
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg',
          domain: 'startapus-demo.situs.com'
        }),
        projectId: project.id
      }
    });

    console.log('✅ Продукт создан:', product.name);

    // Создаем тестовые страницы
    const homePage = await prisma.page.upsert({
      where: { 
        projectId_slug: {
          projectId: project.id,
          slug: 'home'
        }
      },
      update: {},
      create: {
        title: 'Главная страница',
        slug: 'home',
        content: JSON.stringify({
          blocks: [
            {
              id: 'hero-block-1',
              type: 'hero-block',
              props: {
                title: 'Добро пожаловать в Стартапус',
                subtitle: 'Инновационная платформа для создания и развития стартапов',
                primaryButtonText: 'Начать проект',
                primaryButtonUrl: '/projects',
                secondaryButtonText: 'Узнать больше',
                secondaryButtonUrl: '/about',
                heroImage: 'https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Стартапус'
              }
            },
            {
              id: 'features-block-1',
              type: 'features-block',
              props: {
                title: 'Наши возможности',
                subtitle: 'Все что нужно для успешного стартапа',
                features: [
                  {
                    title: 'Быстрый старт',
                    description: 'Создайте проект за несколько минут',
                    icon: '🚀'
                  },
                  {
                    title: 'Гибкая настройка',
                    description: 'Настройте все под свои нужды',
                    icon: '⚙️'
                  },
                  {
                    title: 'Аналитика',
                    description: 'Отслеживайте прогресс и метрики',
                    icon: '📊'
                  }
                ]
              }
            }
          ]
        }),
        pageType: 'PAGE',
        status: 'PUBLISHED',
        isHomePage: true,
        metaTitle: 'Стартапус - Главная страница',
        metaDescription: 'Инновационная платформа для создания и развития стартапов',
        metaKeywords: 'стартап, платформа, инновации, развитие',
        projectId: project.id
      }
    });

    console.log('✅ Главная страница создана:', homePage.title);

    const aboutPage = await prisma.page.upsert({
      where: { 
        projectId_slug: {
          projectId: project.id,
          slug: 'about'
        }
      },
      update: {},
      create: {
        title: 'О нас',
        slug: 'about',
        content: JSON.stringify({
          blocks: [
            {
              id: 'about-block-1',
              type: 'about-block',
              props: {
                title: 'О платформе Стартапус',
                subtitle: 'Мы помогаем предпринимателям создавать успешные проекты',
                description: 'Стартапус - это комплексная платформа для создания, развития и масштабирования стартапов. Мы предоставляем все необходимые инструменты и ресурсы для успешного запуска вашего бизнеса.',
                image: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=О нас'
              }
            }
          ]
        }),
        pageType: 'PAGE',
        status: 'PUBLISHED',
        isHomePage: false,
        metaTitle: 'О нас - Стартапус',
        metaDescription: 'Узнайте больше о платформе Стартапус и нашей миссии',
        metaKeywords: 'о нас, миссия, команда, платформа',
        projectId: project.id
      }
    });

    console.log('✅ Страница "О нас" создана:', aboutPage.title);

    console.log('🎉 Все тестовые данные успешно созданы!');
    console.log('📊 Проект ID:', project.id);
    console.log('🛍️ Продукт ID:', product.id);
    console.log('📄 Страницы:', [homePage.id, aboutPage.id]);

  } catch (error) {
    console.error('❌ Ошибка при создании тестовых данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
