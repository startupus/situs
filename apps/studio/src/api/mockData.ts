// Моковые данные для разработки системы сайтов и страниц

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

// Моковые данные сайтов
export const mockSites: Site[] = [
  {
    id: 'site-1',
    name: 'Мой первый сайт',
    description: 'Тестовый сайт для разработки Redaktus',
    domain: 'site1.situs.com',
    status: 'draft',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-23T15:30:00Z',
    pages: []
  },
  {
    id: 'site-2', 
    name: 'Портфолио дизайнера',
    description: 'Профессиональное портфолио с галереей работ',
    domain: 'portfolio.situs.com',
    customDomain: 'designer.com',
    status: 'published',
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-12-20T12:15:00Z',
    pages: []
  },
  {
    id: 'site-3',
    name: 'Бизнес лендинг',
    description: 'Одностраничник для продвижения услуг',
    domain: 'business.situs.com',
    status: 'draft',
    createdAt: '2024-12-10T14:20:00Z',
    updatedAt: '2024-12-22T16:45:00Z',
    pages: []
  }
];

// Моковые данные страниц
export const mockPages: Page[] = [
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
      pages: []
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
      updatedAt: new Date().toISOString()
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