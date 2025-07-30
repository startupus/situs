// Моковые данные для разработки системы сайтов и страниц

export interface Site {
  id: string;
  name: string;
  description: string;
  domain?: string;
  customDomain?: string;
  template?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  pages: Page[];
  settings?: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    favicon?: string;
    logo?: string;
  };
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
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface BlockContent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: BlockContent[];
}

// Моковые данные сайтов
export const mockSites: Site[] = [
  {
    id: 'startapus-ecosystem',
    name: 'Стартапус - Демо проект',
    description: 'Официальный сайт экосистемы Стартапус - инновационная платформа для создания и управления веб-проектами',
    domain: 'startapus.com',
    template: 'website',
    status: 'published',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-12-23T15:30:00Z',
    settings: {
      theme: 'auto',
      primaryColor: '#3B82F6',
      favicon: '/favicon.ico',
      logo: '/logo.svg'
    },
    pages: [
      {
        id: 'startapus-home',
        siteId: 'startapus-ecosystem',
        title: 'Главная',
        slug: '',
        content: [
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
          }
        ],
        metaTitle: 'Стартапус - Главная',
        metaDescription: 'Инновационная платформа для создания и управления веб-проектами',
        isHomePage: true,
        isPublished: true,
        status: 'published',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z'
      }
    ]
  },
  {
    id: 'site-1',
    name: 'Мой первый сайт',
    description: 'Тестовый сайт для разработки Redaktus',
    domain: 'site1.situs.com',
    template: 'website',
    status: 'draft',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-23T15:30:00Z',
    settings: {
      theme: 'auto',
      primaryColor: '#3B82F6'
    },
    pages: []
  },
  {
    id: 'site-2', 
    name: 'Портфолио дизайнера',
    description: 'Профессиональное портфолио с галереей работ',
    domain: 'portfolio.situs.com',
    customDomain: 'designer.com',
    template: 'portfolio',
    status: 'published',
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-12-20T12:15:00Z',
    settings: {
      theme: 'auto',
      primaryColor: '#8B5CF6'
    },
    pages: []
  },
  {
    id: 'site-3',
    name: 'Бизнес лендинг',
    description: 'Одностраничник для продвижения услуг',
    domain: 'business.situs.com',
    template: 'landing',
    status: 'draft',
    createdAt: '2024-12-10T14:20:00Z',
    updatedAt: '2024-12-22T16:45:00Z',
    settings: {
      theme: 'auto',
      primaryColor: '#10B981'
    },
    pages: []
  }
];

// Моковые данные страниц
export const mockPages: Page[] = [
  // Страницы для Стартапус
  {
    id: 'startapus-home',
    siteId: 'startapus-ecosystem',
    title: 'Главная',
    slug: '',
    content: [
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
            }
          ]
        }
      }
    ],
    metaTitle: 'Стартапус - Инновационная экосистема для веб-разработки',
    metaDescription: 'Создавайте профессиональные веб-сайты с экосистемой Стартапус. Визуальный редактор, AI-помощник и мощные инструменты.',
    isHomePage: true,
    isPublished: true,
    status: 'published',
    createdAt: '2024-01-01T10:30:00Z',
    updatedAt: '2024-12-23T15:45:00Z'
  },
  {
    id: 'startapus-about',
    siteId: 'startapus-ecosystem',
    title: 'О компании',
    slug: 'about',
    content: [
      {
        id: 'about-hero',
        type: 'text-section',
        props: {
          title: 'О компании Стартапус',
          content: 'Мы создаем инновационные инструменты для веб-разработки, которые делают создание сайтов простым и доступным для всех.',
          layout: 'centered'
        }
      }
    ],
    metaTitle: 'О компании Стартапус - Наша миссия и команда',
    metaDescription: 'Узнайте больше о команде Стартапус, нашей миссии и видении будущего веб-разработки.',
    isHomePage: false,
    isPublished: true,
    status: 'published',
    createdAt: '2024-01-01T11:00:00Z',
    updatedAt: '2024-12-20T14:20:00Z'
  },
  // Страницы для других сайтов
  {
    id: 'page-1',
    siteId: 'site-1',
    title: 'Главная страница',
    slug: '',
    content: [
      {
        id: 'block-1',
        type: 'hero-unit',
        props: {
          title: 'Добро пожаловать на мой сайт',
          text: 'Это тестовая страница для разработки Redaktus',
          imageUrl: '/images/hero-bg.jpg'
        }
      },
      {
        id: 'block-2', 
        type: 'text-content',
        props: {
          content: 'Здесь будет основной контент страницы...'
        }
      }
    ],
    metaTitle: 'Главная страница - Мой первый сайт',
    metaDescription: 'Описание главной страницы для SEO',
    isHomePage: true,
    isPublished: true,
    status: 'published',
    createdAt: '2024-12-01T10:30:00Z',
    updatedAt: '2024-12-23T15:45:00Z'
  },
  {
    id: 'page-2',
    siteId: 'site-1', 
    title: 'О нас',
    slug: 'about',
    content: [
      {
        id: 'block-3',
        type: 'text-content',
        props: {
          title: 'О нашей компании',
          content: 'Мы занимаемся разработкой современных веб-сайтов...'
        }
      }
    ],
    metaTitle: 'О нас - Мой первый сайт',
    metaDescription: 'Информация о нашей компании',
    isHomePage: false,
    isPublished: false,
    status: 'draft',
    createdAt: '2024-12-02T11:00:00Z',
    updatedAt: '2024-12-20T14:20:00Z'
  },
  {
    id: 'page-3',
    siteId: 'site-2',
    title: 'Портфолио',
    slug: '',
    content: [
      {
        id: 'block-4',
        type: 'gallery',
        props: {
          title: 'Мои работы',
          images: [
            '/images/work1.jpg',
            '/images/work2.jpg', 
            '/images/work3.jpg'
          ]
        }
      }
    ],
    metaTitle: 'Портфолио дизайнера',
    metaDescription: 'Галерея моих лучших работ',
    isHomePage: true,
    isPublished: true,
    status: 'published',
    createdAt: '2024-11-15T09:30:00Z',
    updatedAt: '2024-12-18T10:15:00Z'
  }
];

// Связываем страницы с сайтами
mockSites.forEach(site => {
  site.pages = mockPages.filter(page => page.siteId === site.id);
});

// Текущий активный сайт и страница для редактора
export const currentSite = mockSites[0];
export const currentPage = mockPages[0];

// API функции для работы с данными
export class MockAPI {
  static async getSites(): Promise<Site[]> {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSites;
  }

  static async getSite(id: string): Promise<Site | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSites.find(site => site.id === id) || null;
  }

  static async getPage(siteId: string, pageId: string): Promise<Page | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPages.find(page => page.siteId === siteId && page.id === pageId) || null;
  }

  static async createSite(data: Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'pages'>): Promise<Site> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newSite: Site = {
      ...data,
      id: `site-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [],
      settings: data.settings || {
        theme: 'auto',
        primaryColor: '#3B82F6'
      }
    };
    mockSites.push(newSite);
    return newSite;
  }

  static async createPage(siteId: string, data: Omit<Page, 'id' | 'siteId' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPage: Page = {
      ...data,
      id: `page-${Date.now()}`,
      siteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || 'draft'
    };
    mockPages.push(newPage);
    
    // Обновляем сайт
    const site = mockSites.find(s => s.id === siteId);
    if (site) {
      site.pages.push(newPage);
      site.updatedAt = new Date().toISOString();
    }
    
    return newPage;
  }

  static async updatePage(pageId: string, data: Partial<Page>): Promise<Page | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const pageIndex = mockPages.findIndex(page => page.id === pageId);
    if (pageIndex === -1) return null;

    mockPages[pageIndex] = {
      ...mockPages[pageIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Обновляем в сайте
    const site = mockSites.find(s => s.id === mockPages[pageIndex].siteId);
    if (site) {
      const sitePageIndex = site.pages.findIndex(p => p.id === pageId);
      if (sitePageIndex !== -1) {
        site.pages[sitePageIndex] = mockPages[pageIndex];
      }
      site.updatedAt = new Date().toISOString();
    }

    return mockPages[pageIndex];
  }

  static async deletePage(pageId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const pageIndex = mockPages.findIndex(page => page.id === pageId);
    if (pageIndex === -1) return false;

    const page = mockPages[pageIndex];
    mockPages.splice(pageIndex, 1);

    // Удаляем из сайта
    const site = mockSites.find(s => s.id === page.siteId);
    if (site) {
      const sitePageIndex = site.pages.findIndex(p => p.id === pageId);
      if (sitePageIndex !== -1) {
        site.pages.splice(sitePageIndex, 1);
      }
      site.updatedAt = new Date().toISOString();
    }

    return true;
  }
}

export default MockAPI; 