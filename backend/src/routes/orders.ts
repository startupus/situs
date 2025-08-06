import express from 'express';

const router = express.Router();

// Моковые данные для заказов
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    projectName: 'Веб-сайт компании',
    projectId: '1',
    customerName: 'Иван Петров',
    customerEmail: 'ivan@example.com',
    customerPhone: '+7 (999) 123-45-67',
    type: 'product',
    amount: 15000,
    currency: 'RUB',
    status: 'completed',
    date: '2024-01-15T10:30:00Z',
    description: 'Разработка корпоративного веб-сайта',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    items: [
      {
        id: '1',
        name: 'Веб-сайт компании',
        quantity: 1,
        price: 15000
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    projectName: 'SEO оптимизация',
    projectId: '2',
    customerName: 'Мария Сидорова',
    customerEmail: 'maria@example.com',
    customerPhone: '+7 (999) 234-56-78',
    type: 'service',
    amount: 25000,
    currency: 'RUB',
    status: 'processing',
    date: '2024-01-16T09:15:00Z',
    description: 'SEO оптимизация сайта',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T11:45:00Z',
    items: [
      {
        id: '2',
        name: 'SEO оптимизация',
        quantity: 1,
        price: 25000
      }
    ]
  }
];

// GET /api/orders - получить все заказы с фильтрацией
router.get('/', (req, res) => {
  const { search, status, type, page = 1, limit = 20 } = req.query;
  
  let filteredOrders = [...mockOrders];
  
  if (search) {
    filteredOrders = filteredOrders.filter(order => 
      order.orderNumber.toLowerCase().includes(String(search).toLowerCase()) ||
      order.customerName.toLowerCase().includes(String(search).toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(String(search).toLowerCase())
    );
  }
  
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  if (type) {
    filteredOrders = filteredOrders.filter(order => order.type === type);
  }
  
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      orders: paginatedOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / Number(limit))
      },
      stats: {
        totalAmount: filteredOrders.reduce((sum, order) => sum + order.amount, 0),
        totalOrders: filteredOrders.length,
        newOrders: filteredOrders.filter(o => o.status === 'new').length,
        processingOrders: filteredOrders.filter(o => o.status === 'processing').length,
        completedOrders: filteredOrders.filter(o => o.status === 'completed').length
      }
    }
  });
});

// GET /api/orders/:id - получить заказ по ID
router.get('/:id', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (order) {
    res.json({
      success: true,
      data: order
    });
  } else {
    res.status(404).json({ 
      success: false,
      error: 'Заказ не найден' 
    });
  }
});

export default router;
