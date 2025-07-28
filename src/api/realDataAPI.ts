// Real Data API - Integration with Startapus Project
// This provides real data for demonstration while PostgreSQL is being set up

export interface Site {
  id: string;
  name: string;
  description: string;
  domain?: string;
  customDomain?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  pages: Page[];
}

export interface Page {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  content: BlockContent[];
  metaTitle?: string;
  metaDescription?: string;
  isHomePage: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlockContent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: BlockContent[];
}

// Real Startapus Ecosystem Project Data
const startapusProject: Site = {
  id: 'startapus-ecosystem',
  name: 'Сайт экосистемы Стартапус',
  description: 'Официальный сайт экосистемы Стартапус - инновационная платформа для создания и управления веб-проектами',
  domain: 'startapus.com',
  status: 'published',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: new Date().toISOString(),
  pages: []
};

const startapusPages: Page[] = [
  {
    id: 'home',
    siteId: 'startapus-ecosystem',
    title: 'Главная',
    slug: '',
    isHomePage: true,
    isPublished: true,
    metaTitle: 'Стартапус - Инновационная экосистема для веб-разработки',
    metaDescription: 'Создавайте профессиональные веб-сайты с экосистемой Стартапус. Визуальный редактор, AI-помощник и мощные инструменты.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: new Date().toISOString(),
    content: [
      {
        id: 'hero-1',
        type: 'hero-section',
        props: {
          title: 'Создавайте будущее веба с экосистемой Стартапус',
          subtitle: 'Полный набор инструментов для создания современных веб-сайтов без программирования',
          buttonText: 'Начать бесплатно',
          buttonLink: '/situs',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop',
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
              features: ['Drag & Drop редактор', 'Готовые блоки', 'Адаптивный дизайн'],
              link: '/situs'
            },
            {
              name: 'Redaktus',
              description: 'Продвинутый контент-редактор',
              icon: '✏️',
              features: ['Блочный редактор', 'Совместная работа', 'История изменений'],
              link: '/redaktus'
            },
            {
              name: 'Hubus',
              description: 'AI-помощник для контента',
              icon: '🤖',
              features: ['Генерация текстов', 'Оптимизация SEO', 'Перевод контента'],
              link: '#hubus'
            },
            {
              name: 'Bilingus',
              description: 'Система биллинга и платежей',
              icon: '💳',
              features: ['Подписки', 'Платежи', 'Аналитика доходов'],
              link: '#bilingus'
            },
            {
              name: 'Controlus',
              description: 'Мониторинг и аналитика',
              icon: '📊',
              features: ['Метрики производительности', 'Пользовательская аналитика', 'Отчеты'],
              link: '#controlus'
            },
            {
              name: 'Loginus',
              description: 'Единая система авторизации',
              icon: '🔐',
              features: ['Single Sign-On', 'OAuth2', 'Безопасность'],
              link: '#loginus'
            }
          ]
        }
      },
      {
        id: 'features-1',
        type: 'features-section',
        props: {
          title: 'Преимущества экосистемы',
          features: [
            {
              title: 'Простота использования',
              description: 'Интуитивно понятные интерфейсы и визуальное редактирование',
              icon: '🎯'
            },
            {
              title: 'Мощная интеграция',
              description: 'Все инструменты работают вместе как единая система',
              icon: '🔗'
            },
            {
              title: 'AI-возможности',
              description: 'Встроенный искусственный интеллект для автоматизации задач',
              icon: '🤖'
            },
            {
              title: 'Масштабируемость',
              description: 'От простых лендингов до сложных корпоративных решений',
              icon: '📈'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'about',
    siteId: 'startapus-ecosystem',
    title: 'О компании',
    slug: 'about',
    isHomePage: false,
    isPublished: true,
    metaTitle: 'О компании Стартапус - Наша миссия и команда',
    metaDescription: 'Узнайте больше о команде Стартапус, нашей миссии и видении будущего веб-разработки.',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: new Date().toISOString(),
    content: [
      {
        id: 'about-hero',
        type: 'text-section',
        props: {
          title: 'О компании Стартапус',
          content: 'Мы создаем инновационные инструменты для веб-разработки, которые делают создание сайтов простым и доступным для всех. Наша команда состоит из опытных разработчиков, дизайнеров и продуктовых менеджеров, которые понимают потребности современного рынка.',
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
      },
      {
        id: 'team',
        type: 'team-section',
        props: {
          title: 'Команда',
          members: [
            {
              name: 'Дмитрий Петров',
              role: 'CEO & Founder',
              photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
              bio: 'Опытный продуктовый менеджер с 10+ летним опытом в IT'
            },
            {
              name: 'Анна Иванова',
              role: 'CTO',
              photo: 'https://images.unsplash.com/photo-1494790108755-2616b9e5e1ce?w=300&h=300&fit=crop&crop=face',
              bio: 'Ведущий разработчик с экспертизой в React и Node.js'
            },
            {
              name: 'Михаил Смирнов',
              role: 'Head of Design',
              photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
              bio: 'UX/UI дизайнер с фокусом на пользовательском опыте'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'products',
    siteId: 'startapus-ecosystem',
    title: 'Продукты',
    slug: 'products',
    isHomePage: false,
    isPublished: true,
    metaTitle: 'Продукты Стартапус - Полная экосистема для веб-разработки',
    metaDescription: 'Изучите все продукты экосистемы Стартапус: Situs, Redaktus, Hubus, Bilingus, Controlus и Loginus.',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: new Date().toISOString(),
    content: [
      {
        id: 'products-detail',
        type: 'products-detail-section',
        props: {
          title: 'Продукты экосистемы',
          description: 'Каждый продукт решает конкретные задачи и работает в единой экосистеме',
          detailedProducts: [
            {
              name: 'Situs',
              description: 'Визуальный конструктор сайтов с drag-and-drop интерфейсом',
              features: [
                'Визуальный редактор',
                'Готовые блоки и шаблоны',
                'Адаптивный дизайн',
                'SEO оптимизация',
                'Интеграция с CMS'
              ],
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
              status: 'Доступен',
              link: '/situs'
            },
            {
              name: 'Redaktus',
              description: 'Продвинутый блочный редактор контента',
              features: [
                'Блочная архитектура',
                'Совместная работа',
                'История изменений',
                'Кастомные блоки',
                'API интеграция'
              ],
              image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&h=400&fit=crop',
              status: 'Доступен',
              link: '/redaktus'
            },
            {
              name: 'Hubus',
              description: 'AI-помощник для создания контента',
              features: [
                'Генерация текстов',
                'Оптимизация SEO',
                'Перевод контента',
                'Анализ тональности',
                'A/B тестирование'
              ],
              image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
              status: 'В разработке',
              link: '#hubus'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'blog',
    siteId: 'startapus-ecosystem',
    title: 'Блог',
    slug: 'blog',
    isHomePage: false,
    isPublished: true,
    metaTitle: 'Блог Стартапус - Новости и статьи о веб-разработке',
    metaDescription: 'Читайте последние новости, гайды и статьи о веб-разработке в блоге Стартапус.',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: new Date().toISOString(),
    content: [
      {
        id: 'blog-list',
        type: 'blog-section',
        props: {
          title: 'Блог',
          subtitle: 'Новости, обновления и полезные статьи',
          posts: [
            {
              id: 'post-1',
              title: 'Запуск экосистемы Стартапус',
              excerpt: 'Мы рады представить новую экосистему инструментов для веб-разработки',
              author: 'Дмитрий Петров',
              date: '2024-01-15',
              image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
              category: 'Новости'
            },
            {
              id: 'post-2',
              title: 'Как создать современный сайт за 30 минут',
              excerpt: 'Пошаговый гайд по созданию профессионального сайта с помощью Situs',
              author: 'Анна Иванова',
              date: '2024-01-20',
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
              category: 'Туториалы'
            },
            {
              id: 'post-3',
              title: 'AI в веб-разработке: будущее уже здесь',
              excerpt: 'Как искусственный интеллект меняет подход к созданию сайтов',
              author: 'Михаил Смирнов',
              date: '2024-01-25',
              image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
              category: 'Технологии'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'contact',
    siteId: 'startapus-ecosystem',
    title: 'Контакты',
    slug: 'contact',
    isHomePage: false,
    isPublished: true,
    metaTitle: 'Контакты Стартапус - Свяжитесь с нами',
    metaDescription: 'Свяжитесь с командой Стартапус. Мы всегда готовы помочь и ответить на ваши вопросы.',
    createdAt: '2024-01-15T13:00:00Z',
    updatedAt: new Date().toISOString(),
    content: [
      {
        id: 'contact-form',
        type: 'contact-section',
        props: {
          title: 'Свяжитесь с нами',
          subtitle: 'Мы всегда готовы помочь и ответить на ваши вопросы',
          email: 'hello@startapus.com',
          phone: '+7 (495) 123-45-67',
          address: 'Москва, Россия',
          socials: [
            { name: 'GitHub', url: 'https://github.com/startapus', icon: 'github' },
            { name: 'Twitter', url: 'https://twitter.com/startapus', icon: 'twitter' },
            { name: 'LinkedIn', url: 'https://linkedin.com/company/startapus', icon: 'linkedin' }
          ]
        }
      }
    ]
  }
];

// Add pages to the project
startapusProject.pages = startapusPages;

// Additional demo projects
const demoProjects: Site[] = [
  {
    id: 'ecommerce-demo',
    name: 'Демо интернет-магазина',
    description: 'Пример современного интернет-магазина, созданного с помощью Situs',
    domain: 'demo-shop.situs.com',
    status: 'published',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: new Date().toISOString(),
    pages: [
      {
        id: 'shop-home',
        siteId: 'ecommerce-demo',
        title: 'Главная страница магазина',
        slug: '',
        isHomePage: true,
        isPublished: true,
        metaTitle: 'Демо магазин - Лучшие товары онлайн',
        metaDescription: 'Интернет-магазин с широким ассортиментом товаров',
        createdAt: '2024-02-01T10:30:00Z',
        updatedAt: new Date().toISOString(),
        content: [
          {
            id: 'shop-hero',
            type: 'ecommerce-hero',
            props: {
              title: 'Добро пожаловать в наш магазин',
              subtitle: 'Лучшие товары по выгодным ценам',
              ctaText: 'Смотреть каталог',
              backgroundImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&h=800&fit=crop'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'portfolio-demo',
    name: 'Портфолио дизайнера',
    description: 'Креативное портфолио для демонстрации работ',
    status: 'draft',
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: new Date().toISOString(),
    pages: [
      {
        id: 'portfolio-home',
        siteId: 'portfolio-demo',
        title: 'Портфолио',
        slug: '',
        isHomePage: true,
        isPublished: false,
        metaTitle: 'Портфолио дизайнера',
        metaDescription: 'Креативные работы и проекты',
        createdAt: '2024-02-05T14:30:00Z',
        updatedAt: new Date().toISOString(),
        content: []
      }
    ]
  }
];

export class RealDataAPI {
  static async getSites(): Promise<Site[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [startapusProject, ...demoProjects];
  }

  static async getSite(siteId: string): Promise<Site | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const allSites = [startapusProject, ...demoProjects];
    return allSites.find(site => site.id === siteId) || null;
  }

  static async createSite(data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>): Promise<Site> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSite: Site = {
      id: `site-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: []
    };

    demoProjects.push(newSite);
    return newSite;
  }

  static async createPage(siteId: string, data: Omit<Page, 'id' | 'siteId' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newPage: Page = {
      id: `page-${Date.now()}`,
      siteId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to the appropriate site
    const allSites = [startapusProject, ...demoProjects];
    const site = allSites.find(s => s.id === siteId);
    if (site) {
      site.pages.push(newPage);
    }

    return newPage;
  }

  static async updatePage(pageId: string, data: Partial<Page>): Promise<Page | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const allSites = [startapusProject, ...demoProjects];
    for (const site of allSites) {
      const pageIndex = site.pages.findIndex(p => p.id === pageId);
      if (pageIndex !== -1) {
        site.pages[pageIndex] = {
          ...site.pages[pageIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return site.pages[pageIndex];
      }
    }
    return null;
  }

  static async deletePage(pageId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allSites = [startapusProject, ...demoProjects];
    for (const site of allSites) {
      const pageIndex = site.pages.findIndex(p => p.id === pageId);
      if (pageIndex !== -1) {
        site.pages.splice(pageIndex, 1);
        return true;
      }
    }
    return false;
  }
}

export default RealDataAPI; 