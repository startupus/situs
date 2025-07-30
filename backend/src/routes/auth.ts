import express from 'express';

const router = express.Router();

// POST /api/auth/login - вход в систему
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email и пароль обязательны'
      });
    }
    
    // Моковая аутентификация
    if (email === 'admin@situs.com' && password === 'password') {
      const user = {
        id: 'user_1',
        firstName: 'Админ',
        lastName: 'Ситус',
        email: 'admin@situs.com',
        role: 'admin',
        status: 'active'
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      return res.json({
        success: true,
        data: {
          user,
          token,
          expiresIn: '24h'
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при входе в систему'
    });
  }
});

// POST /api/auth/register - регистрация
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Все поля обязательны'
      });
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    const token = 'mock-jwt-token-' + Date.now();
    
    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token,
        expiresIn: '24h'
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при регистрации'
    });
  }
});

// GET /api/auth/me - получить текущего пользователя
router.get('/me', async (req, res) => {
  try {
    // В реальном приложении здесь была бы проверка JWT токена
    const user = {
      id: 'user_1',
      firstName: 'Админ',
      lastName: 'Ситус',
      email: 'admin@situs.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01T10:00:00Z',
      lastLoginAt: '2024-12-23T15:30:00Z'
    };
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при получении данных пользователя'
    });
  }
});

// POST /api/auth/logout - выход из системы
router.post('/logout', async (req, res) => {
  try {
    return res.json({
      success: true,
      message: 'Успешный выход из системы'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при выходе из системы'
    });
  }
});

export default router; 