import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import app from '../../server';

const prisma = new PrismaClient();

// Тестовые данные
const adminUser = {
  email: 'admin@example.com',
  password: 'admin123',
  firstName: 'Админ',
  lastName: 'Пользователь',
};

const testUser = {
  email: 'test@example.com',
  password: 'test123',
  firstName: 'Тест',
  lastName: 'Пользователь',
};

beforeAll(async () => {
  // Очищаем базу данных перед тестами
  await prisma.user.deleteMany();
  await prisma.page.deleteMany();
  await prisma.project.deleteMany();

  // Создаем тестового админа
  const hashedPassword = await bcrypt.hash(adminUser.password, 12);
  await prisma.user.create({
    data: {
      username: 'admin',
      email: adminUser.email,
      password: hashedPassword,
      profile: JSON.stringify({
        name: `${adminUser.firstName} ${adminUser.lastName}`,
        avatar: '',
        bio: '',
      }),
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
});

afterAll(async () => {
  // Очищаем базу данных после тестов
  await prisma.user.deleteMany();
  await prisma.page.deleteMany();
  await prisma.project.deleteMany();
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Удаляем тестового пользователя перед каждым тестом (если существует)
  await prisma.user.deleteMany({
    where: { email: testUser.email },
  });
});

describe('Auth API Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    test('должен успешно зарегистрировать нового пользователя', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email,
          password: testUser.password,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        })
        .expect(201);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: 'user',
        isActive: true,
      });
      expect(response.body.user).not.toHaveProperty('password');

      // Проверяем что пользователь создан в базе данных
      const createdUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(createdUser).toBeTruthy();
      expect(createdUser?.role).toBe('USER');
    });

    test('должен возвращать ошибку при попытке зарегистрировать пользователя с существующим email', async () => {
      // Сначала регистрируем пользователя
      await request(app).post('/api/auth/register').send(testUser).expect(201);

      // Пытаемся зарегистрировать с тем же email
      const response = await request(app).post('/api/auth/register').send(testUser).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('уже существует');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // слишком короткий
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });

    test('должен валидировать формат email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'validpassword123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('Некорректный формат email');
    });

    test('должен валидировать длину пароля', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'valid@example.com',
          password: '123', // слишком короткий
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('минимум 6 символов');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя для каждого теста
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          username: 'testuser',
          email: testUser.email,
          password: hashedPassword,
          profile: JSON.stringify({
            name: `${testUser.firstName} ${testUser.lastName}`,
            avatar: '',
            bio: '',
          }),
          role: 'USER',
          status: 'ACTIVE',
        },
      });
    });

    test('должен успешно авторизовать пользователя с правильными данными', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: 'user',
      });
      expect(response.body.user).not.toHaveProperty('password');

      // Проверяем что пользователь существует в базе данных
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user).toBeTruthy();
    });

    test('должен возвращать ошибку при неправильном пароле', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(400);

      expect(response.body.error.message).toContain('Неверный email или пароль');
    });

    test('должен возвращать ошибку при несуществующем email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect(400);

      expect(response.body.error.message).toContain('Неверный email или пароль');
    });

    test('должен возвращать ошибку для деактивированного пользователя', async () => {
      // Деактивируем пользователя
      await prisma.user.update({
        where: { email: testUser.email },
        data: { status: 'INACTIVE' },
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(400);

      expect(response.body.error.message).toContain('деактивирован');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          // password отсутствует
        })
        .expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/verify-token', () => {
    let validToken: string;

    beforeEach(async () => {
      // Создаем пользователя и получаем токен
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          username: 'testuser',
          email: testUser.email,
          password: hashedPassword,
          profile: JSON.stringify({
            name: `${testUser.firstName} ${testUser.lastName}`,
            avatar: '',
            bio: '',
          }),
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      validToken = loginResponse.body.jwt;
    });

    test('должен подтверждать валидный токен', async () => {
      const response = await request(app)
        .post('/api/auth/verify-token')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body.user.email).toBe(testUser.email);
    });

    test('должен возвращать ошибку для невалидного токена', async () => {
      const response = await request(app)
        .post('/api/auth/verify-token')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error.message).toContain('Недействительный токен');
    });

    test('должен возвращать ошибку при отсутствии токена', async () => {
      const response = await request(app).post('/api/auth/verify-token').expect(401);

      expect(response.body.error.message).toContain('Токен не предоставлен');
    });

    test('должен возвращать ошибку для токена деактивированного пользователя', async () => {
      // Деактивируем пользователя
      await prisma.user.update({
        where: { email: testUser.email },
        data: { status: 'INACTIVE' },
      });

      const response = await request(app)
        .post('/api/auth/verify-token')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(401);

      expect(response.body.error.message).toContain('Недействительный токен');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    let validToken: string;

    beforeEach(async () => {
      // Создаем пользователя и получаем токен
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          username: 'testuser',
          email: testUser.email,
          password: hashedPassword,
          profile: JSON.stringify({
            name: `${testUser.firstName} ${testUser.lastName}`,
            avatar: '',
            bio: '',
          }),
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      validToken = loginResponse.body.jwt;
    });

    test('должен обновлять валидный токен', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken: validToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.jwt).not.toBe(validToken); // Новый токен должен отличаться
    });

    test('должен возвращать ошибку для невалидного токена', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401);

      expect(response.body.error.message).toContain('Недействительный токен');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app).post('/api/auth/refresh-token').send({}).expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/logout', () => {
    let validToken: string;

    beforeEach(async () => {
      // Создаем пользователя и получаем токен
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          username: 'testuser',
          email: testUser.email,
          password: hashedPassword,
          profile: JSON.stringify({
            name: `${testUser.firstName} ${testUser.lastName}`,
            avatar: '',
            bio: '',
          }),
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      validToken = loginResponse.body.jwt;
    });

    test('должен успешно выполнить выход', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken: validToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('успешно');
    });

    test('должен возвращать ошибку для невалидного токена', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401);

      expect(response.body.error.message).toContain('Недействительный токен');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app).post('/api/auth/logout').send({}).expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          username: 'testuser',
          email: testUser.email,
          password: hashedPassword,
          profile: JSON.stringify({
            name: `${testUser.firstName} ${testUser.lastName}`,
            avatar: '',
            bio: '',
          }),
          role: 'USER',
          status: 'ACTIVE',
        },
      });
    });

    test('должен успешно отправить email для сброса пароля', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: testUser.email,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('отправлены');
    });

    test('должен возвращать ошибку для несуществующего email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(400);

      expect(response.body.error.message).toContain('не найден');
    });

    test('должен валидировать формат email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app).post('/api/auth/forgot-password').send({}).expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    let resetToken: string;

    beforeEach(async () => {
      // Создаем тестового пользователя
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          username: 'testuser',
          email: testUser.email,
          password: hashedPassword,
          profile: JSON.stringify({
            name: `${testUser.firstName} ${testUser.lastName}`,
            avatar: '',
            bio: '',
          }),
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      // Получаем токен для сброса пароля
      const forgotResponse = await request(app).post('/api/auth/forgot-password').send({
        email: testUser.email,
      });

      resetToken = forgotResponse.body.resetToken;
    });

    test('должен успешно сбросить пароль', async () => {
      const newPassword = 'newpassword123';

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: newPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('успешно');

      // Проверяем что пароль действительно изменился
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('jwt');
    });

    test('должен возвращать ошибку для невалидного токена', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'newpassword123',
        })
        .expect(400);

      expect(response.body.error.message).toContain('Недействительный токен');
    });

    test('должен валидировать длину нового пароля', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: '123', // слишком короткий
        })
        .expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          // password отсутствует
        })
        .expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });
  });
});
