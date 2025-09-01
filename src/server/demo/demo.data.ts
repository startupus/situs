// Демонстрационные данные для фронтенда, отдаваемые через API
// Источник: ранее использовавшиеся мок‑массивы в React компонентах

export const demoWebsites = [
  {
    id: 1,
    name: "Корпоративный сайт ООО 'ТехноСтрой'",
    status: 'active',
    url: 'https://technostroy.ru',
    createdAt: '2024-01-15',
    visitors: 1250,
    orders: 45,
    revenue: 125000,
    template: 'Корпоративный',
    pages: 12,
  },
  {
    id: 4,
    name: "Лендинг 'Курсы программирования'",
    status: 'active',
    url: 'https://coding-courses.ru',
    createdAt: '2024-01-30',
    visitors: 2100,
    orders: 89,
    revenue: 267000,
    template: 'Лендинг',
    pages: 1,
  },
  {
    id: 7,
    name: "Блог 'Технологии будущего'",
    status: 'development',
    url: 'https://tech-future.ru',
    createdAt: '2024-03-15',
    visitors: 0,
    orders: 0,
    revenue: 0,
    template: 'Блог',
    pages: 5,
  },
];

export const demoStores = [
  {
    id: 2,
    name: "Интернет-магазин 'МодаСтиль'",
    status: 'active',
    url: 'https://modastyle.ru',
    createdAt: '2024-02-20',
    visitors: 3200,
    orders: 180,
    revenue: 450000,
    products: 1250,
    categories: 15,
  },
  {
    id: 5,
    name: "Магазин электроники 'ТехноМир'",
    status: 'active',
    url: 'https://technomir.ru',
    createdAt: '2024-02-05',
    visitors: 4500,
    orders: 320,
    revenue: 890000,
    products: 850,
    categories: 8,
  },
  {
    id: 8,
    name: "Магазин книг 'ЧитайГород'",
    status: 'development',
    url: 'https://chitaygorod.ru',
    createdAt: '2024-03-20',
    visitors: 0,
    orders: 0,
    revenue: 0,
    products: 0,
    categories: 0,
  },
];

export const demoOrders = [
  {
    id: 'ORD-001',
    type: 'ecommerce',
    status: 'new',
    customerName: 'Анна Петрова',
    customerEmail: 'anna@example.com',
    customerPhone: '+7 (912) 345-67-89',
    amount: 3500,
    currency: 'RUB',
    items: [
      { id: '1', name: 'Футболка базовая', quantity: 2, price: 1200 },
      { id: '2', name: 'Джинсы классические', quantity: 1, price: 3500 },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
  },
  {
    id: 'ORD-002',
    type: 'contact',
    status: 'new',
    customerName: 'Михаил Иванов',
    customerEmail: 'mikhail@company.ru',
    customerPhone: '+7 (495) 123-45-67',
    message:
      'Интересует разработка корпоративного сайта для нашей компании. Нужна консультация по функционалу и стоимости.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
  },
];

export const demoProducts = [
  {
    id: '1',
    name: 'Футболка базовая',
    price: 1200,
    category: 'Одежда',
    stock: 50,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    status: 'active',
  },
  {
    id: '2',
    name: 'Джинсы классические',
    price: 3500,
    category: 'Одежда',
    stock: 25,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
    status: 'active',
  },
  {
    id: '3',
    name: 'Кроссовки спортивные',
    price: 5000,
    category: 'Обувь',
    stock: 12,
    image:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop',
    status: 'draft',
  },
];

export const demoSupportTickets = [
  {
    id: 'TICK-001',
    title: 'Проблема с подключением API',
    description: 'Не могу подключиться к API компонентов. Получаю ошибку 401',
    status: 'open',
    priority: 'high',
    category: 'technical',
    createdAt: new Date('2024-01-15T10:30:00').toISOString(),
    updatedAt: new Date('2024-01-15T10:30:00').toISOString(),
    responses: 0,
  },
  {
    id: 'TICK-002', 
    title: 'Вопрос по тарифам',
    description: 'Хотел бы узнать подробности о корпоративном тарифе',
    status: 'in_progress',
    priority: 'medium',
    category: 'billing',
    createdAt: new Date('2024-01-14T14:20:00').toISOString(),
    updatedAt: new Date('2024-01-15T09:15:00').toISOString(),
    responses: 2,
  },
  {
    id: 'TICK-003',
    title: 'Предложение новой функции',
    description: 'Было бы здорово добавить поддержку dark mode для всех компонентов',
    status: 'closed',
    priority: 'low',
    category: 'feature',
    createdAt: new Date('2024-01-12T16:45:00').toISOString(),
    updatedAt: new Date('2024-01-14T11:30:00').toISOString(),
    responses: 4,
  },
  {
    id: 'TICK-004',
    title: 'Ошибка в компоненте Modal',
    description: 'Модальное окно не закрывается при нажатии на overlay',
    status: 'open',
    priority: 'urgent',
    category: 'bug',
    createdAt: new Date('2024-01-15T12:00:00').toISOString(),
    updatedAt: new Date('2024-01-15T12:00:00').toISOString(),
    responses: 0,
  },
  {
    id: 'TICK-005',
    title: 'Помощь с интеграцией',
    description: 'Нужна консультация по интеграции TailGrids в существующий проект',
    status: 'in_progress',
    priority: 'medium',
    category: 'other',
    createdAt: new Date('2024-01-13T09:30:00').toISOString(),
    updatedAt: new Date('2024-01-15T08:45:00').toISOString(),
    responses: 3,
  },
];

export const demoChatbots = [
  {
    id: 3,
    name: "Чат-бот поддержки 'Помощник24'",
    status: "development",
    url: "https://t.me/helper24_bot",
    createdAt: "2024-03-10",
    visitors: 850,
    orders: 120,
    revenue: 85000,
    platform: "Telegram",
    messages: 1250
  },
  {
    id: 6,
    name: "Чат-бот заказа пиццы 'ПиццаБот'",
    status: "active",
    url: "https://t.me/pizzabot",
    createdAt: "2024-02-15",
    visitors: 1800,
    orders: 450,
    revenue: 225000,
    platform: "Telegram",
    messages: 3200
  },
  {
    id: 9,
    name: "Чат-бот консультаций 'ЮристБот'",
    status: "active",
    url: "https://t.me/lawyer_bot",
    createdAt: "2024-01-25",
    visitors: 950,
    orders: 75,
    revenue: 150000,
    platform: "Telegram",
    messages: 2100
  }
];


