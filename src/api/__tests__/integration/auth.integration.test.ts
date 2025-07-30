import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import apiRoutes from '../../routes';
import { errorHandler, notFoundHandler } from '../../middleware/error.middleware';

/**
 * Integration Tests для Auth API
 * Тестируют полный workflow аутентификации через HTTP запросы
 */

const prisma = new PrismaClient();
let app: Express;

// Тестовые пользователи
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Тест',
  lastName: 'Пользователь'
};

const adminUser = {
  email: 'admin@example.com',
  password: 'adminpass123',
  firstName: 'Админ',
  lastName: 'Пользователь'
};

beforeAll(async () => {
  // Настраиваем Express приложение для тестов
  app = express();
  app.use(express.json());
  app.use('/api', apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Очищаем базу данных перед тестами
  await prisma.user.deleteMany();
  await prisma.page.deleteMany();
  await prisma.project.deleteMany();

  // Создаем тестового админа
  const hashedPassword = await bcrypt.hash(adminUser.password, 12);
  await prisma.user.create({
    data: {
      email: adminUser.email,
      password: hashedPassword,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      role: 'ADMIN',
      isActive: true
    }
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
    where: { email: testUser.email }
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
          lastName: testUser.lastName
        })
        .expect(201);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: 'user',
        isActive: true
      });
      expect(response.body.user).not.toHaveProperty('password');

      // Проверяем что пользователь создан в базе данных
      const createdUser = await prisma.user.findUnique({
        where: { email: testUser.email }
      });
      expect(createdUser).toBeTruthy();
      expect(createdUser?.role).toBe('USER');
    });

    test('должен возвращать ошибку при попытке зарегистрировать пользователя с существующим email', async () => {
      // Сначала регистрируем пользователя
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Пытаемся зарегистрировать с тем же email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('уже существует');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123' // слишком короткий
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
          password: testUser.password
        })
        .expect(400);

      expect(response.body.error.message).toContain('Некорректный формат email');
    });

    test('должен валидировать минимальную длину пароля', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email,
          password: '123'
        })
        .expect(400);

      expect(response.body.error.message).toContain('минимум 6 символов');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя для каждого теста
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          email: testUser.email,
          password: hashedPassword,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: 'USER',
          isActive: true
        }
      });
    });

    test('должен успешно авторизовать пользователя с правильными данными', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: 'user'
      });
      expect(response.body.user).not.toHaveProperty('password');

      // Проверяем что время последнего входа обновилось
      const user = await prisma.user.findUnique({
        where: { email: testUser.email }
      });
      expect(user?.lastLoginAt).toBeTruthy();
    });

    test('должен возвращать ошибку при неправильном пароле', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.error.message).toContain('Неверный email или пароль');
    });

    test('должен возвращать ошибку при несуществующем email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(400);

      expect(response.body.error.message).toContain('Неверный email или пароль');
    });

    test('должен возвращать ошибку для деактивированного пользователя', async () => {
      // Деактивируем пользователя
      await prisma.user.update({
        where: { email: testUser.email },
        data: { isActive: false }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(400);

      expect(response.body.error.message).toContain('деактивирован');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
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
          email: testUser.email,
          password: hashedPassword,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: 'USER',
          isActive: true
        }
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
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
      const response = await request(app)
        .post('/api/auth/verify-token')
        .expect(401);

      expect(response.body.error.message).toContain('Токен не предоставлен');
    });

    test('должен возвращать ошибку для токена деактивированного пользователя', async () => {
      // Деактивируем пользователя
      await prisma.user.update({
        where: { email: testUser.email },
        data: { isActive: false }
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
          email: testUser.email,
          password: hashedPassword,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: 'USER',
          isActive: true
        }
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      validToken = loginResponse.body.jwt;
    });

    test('должен обновлять валидный токен', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
      expect(response.body.jwt).not.toBe(validToken); // Новый токен должен отличаться
      expect(response.body.user.email).toBe(testUser.email);
    });

    test('должен возвращать ошибку для невалидного токена', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error.message).toContain('Недействительный токен');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('должен успешно выполнять выход', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.message).toContain('Выход выполнен успешно');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      await prisma.user.create({
        data: {
          email: testUser.email,
          password: hashedPassword,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: 'USER',
          isActive: true
        }
      });
    });

    test('должен обрабатывать запрос восстановления пароля', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: testUser.email
        })
        .expect(200);

      expect(response.body.message).toContain('письмо с инструкциями');
    });

    test('должен возвращать тот же ответ для несуществующего email (безопасность)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(200);

      expect(response.body.message).toContain('письмо с инструкциями');
    });

    test('должен валидировать формат email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    test('должен возвращать ошибку что функция не реализована', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'some-token',
          newPassword: 'newpassword123'
        })
        .expect(501);

      expect(response.body.error.message).toContain('не реализована');
    });

    test('должен валидировать обязательные поля', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'some-token'
          // newPassword отсутствует
        })
        .expect(400);

      expect(response.body.error.name).toBe('VALIDATION_ERROR');
    });
  });
});