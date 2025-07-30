import express from 'express';

const router = express.Router();

// GET /api/users - получить список пользователей
router.get('/', async (req, res) => {
  try {
    const mockUsers = [
      {
        id: 'user_1',
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-01T10:00:00Z',
        lastLoginAt: '2024-12-23T15:30:00Z',
        projectsCount: 5,
        ordersCount: 12
      },
      {
        id: 'user_2',
        firstName: 'Мария',
        lastName: 'Петрова',
        email: 'maria@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-02-01T10:00:00Z',
        lastLoginAt: '2024-12-22T14:20:00Z',
        projectsCount: 3,
        ordersCount: 8
      }
    ];

    return res.json({
      success: true,
      data: {
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: mockUsers.length,
          totalPages: 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при загрузке пользователей'
    });
  }
});

// GET /api/users/:id - получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mockUser = {
      id: 'user_1',
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'ivan@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01T10:00:00Z',
      lastLoginAt: '2024-12-23T15:30:00Z',
      projectsCount: 5,
      ordersCount: 12
    };
    
    return res.json({
      success: true,
      data: mockUser
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при загрузке пользователя'
    });
  }
});

// POST /api/users - создать нового пользователя
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, role, status } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Имя, фамилия и email обязательны'
      });
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      role: role || 'user',
      status: status || 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      projectsCount: 0,
      ordersCount: 0
    };
    
    return res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при создании пользователя'
    });
  }
});

export default router; 