/**
 * Интеграционные тесты для API
 * Проверяют взаимодействие фронтенда с бэкендом
 */
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { vi, describe, it, expect, beforeEach } from 'vitest';
// Мокаем зависимости
vi.mock('@prisma/client');
vi.mock('bcryptjs');
vi.mock('jsonwebtoken');
// Импортируем после моков
import app from '../server';
import UserService from '../services/UserService';
const mockPrisma = {
    user: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn()
    },
    project: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn()
    }
};
PrismaClient.mockImplementation(() => mockPrisma);
describe('API Integration Tests', () => {
    let authToken;
    let testUserId;
    beforeEach(() => {
        vi.clearAllMocks();
        testUserId = 'test-user-id';
        authToken = 'mock-jwt-token';
    });
    describe('Auth Routes', () => {
        describe('POST /api/auth/register', () => {
            it('должен зарегистрировать нового пользователя', async () => {
                const mockUser = {
                    id: testUserId,
                    email: 'new@example.com',
                    firstName: 'New',
                    lastName: 'User',
                    role: 'USER',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                const hashedPassword = 'hashedPassword123';
                const mockToken = 'mock-jwt-token';
                const mockRefreshToken = 'mock-refresh-token';
                bcrypt.hash.mockResolvedValue(hashedPassword);
                jwt.sign.mockReturnValue(mockToken);
                mockPrisma.user.findUnique.mockResolvedValue(null); // Пользователь не существует
                mockPrisma.user.create.mockResolvedValue(mockUser);
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                    email: 'new@example.com',
                    password: 'password123',
                    firstName: 'New',
                    lastName: 'User'
                })
                    .expect(201);
                expect(response.body.success).toBe(true);
                expect(response.body.data.user.email).toBe('new@example.com');
                expect(response.body.data.token).toBe(mockToken);
                expect(response.body.data.refreshToken).toBe(mockRefreshToken);
            });
            it('должен вернуть ошибку при регистрации с существующим email', async () => {
                mockPrisma.user.findUnique.mockResolvedValue({
                    id: 'existing-user',
                    email: 'existing@example.com'
                });
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                    email: 'existing@example.com',
                    password: 'password123',
                    firstName: 'Test',
                    lastName: 'User'
                })
                    .expect(409);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('уже существует');
            });
            it('должен вернуть ошибку при отсутствии обязательных полей', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                    email: 'test@example.com'
                    // password отсутствует
                })
                    .expect(400);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('обязательны');
            });
        });
        describe('POST /api/auth/login', () => {
            it('должен успешно авторизовать пользователя', async () => {
                const mockUser = {
                    id: testUserId,
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'USER',
                    password: 'hashedPassword123',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                const mockToken = 'mock-jwt-token';
                const mockRefreshToken = 'mock-refresh-token';
                mockPrisma.user.findUnique.mockResolvedValue(mockUser);
                bcrypt.compare.mockResolvedValue(true);
                jwt.sign.mockReturnValue(mockToken);
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                    email: 'test@example.com',
                    password: 'password123'
                })
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.user.email).toBe('test@example.com');
                expect(response.body.data.token).toBe(mockToken);
                expect(response.body.data.refreshToken).toBe(mockRefreshToken);
            });
            it('должен вернуть ошибку при неверных учетных данных', async () => {
                mockPrisma.user.findUnique.mockResolvedValue(null);
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                })
                    .expect(401);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('Неверные учетные данные');
            });
        });
        describe('POST /api/auth/verify-token', () => {
            it('должен успешно проверить валидный токен', async () => {
                const mockUser = {
                    id: testUserId,
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'USER',
                    isActive: true
                };
                const mockDecoded = { userId: testUserId };
                jwt.verify.mockReturnValue(mockDecoded);
                mockPrisma.user.findUnique.mockResolvedValue(mockUser);
                const response = await request(app)
                    .post('/api/auth/verify-token')
                    .send({
                    token: 'valid-token'
                })
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.user.email).toBe('test@example.com');
            });
            it('должен вернуть ошибку при невалидном токене', async () => {
                jwt.verify.mockImplementation(() => {
                    throw new Error('Invalid token');
                });
                const response = await request(app)
                    .post('/api/auth/verify-token')
                    .send({
                    token: 'invalid-token'
                })
                    .expect(401);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('Невалидный токен');
            });
        });
    });
    describe('Projects Routes', () => {
        beforeEach(() => {
            // Мокаем middleware аутентификации
            vi.spyOn(UserService, 'verifyToken').mockResolvedValue({
                id: testUserId,
                email: 'test@example.com',
                role: 'USER',
                fullName: 'Test User'
            });
        });
        describe('GET /api/projects', () => {
            it('должен вернуть список проектов пользователя', async () => {
                const mockProjects = [
                    {
                        id: '1',
                        name: 'Test Project 1',
                        slug: 'test-project-1',
                        status: 'DRAFT',
                        userId: testUserId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: '2',
                        name: 'Test Project 2',
                        slug: 'test-project-2',
                        status: 'PUBLISHED',
                        userId: testUserId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ];
                mockPrisma.project.findMany.mockResolvedValue(mockProjects);
                mockPrisma.project.count.mockResolvedValue(2);
                const response = await request(app)
                    .get('/api/projects')
                    .set('Authorization', `Bearer ${authToken}`)
                    .query({ page: '1', limit: '10' })
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.projects).toHaveLength(2);
                expect(response.body.data.total).toBe(2);
            });
            it('должен вернуть пустой список если проекты не найдены', async () => {
                mockPrisma.project.findMany.mockResolvedValue([]);
                mockPrisma.project.count.mockResolvedValue(0);
                const response = await request(app)
                    .get('/api/projects')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.projects).toHaveLength(0);
                expect(response.body.data.total).toBe(0);
            });
        });
        describe('GET /api/projects/:id', () => {
            it('должен вернуть проект по ID', async () => {
                const mockProject = {
                    id: '1',
                    name: 'Test Project',
                    slug: 'test-project',
                    status: 'DRAFT',
                    userId: testUserId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockPrisma.project.findUnique.mockResolvedValue(mockProject);
                const response = await request(app)
                    .get('/api/projects/1')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.name).toBe('Test Project');
            });
            it('должен вернуть 404 если проект не найден', async () => {
                mockPrisma.project.findUnique.mockResolvedValue(null);
                const response = await request(app)
                    .get('/api/projects/999')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('не найден');
            });
        });
        describe('POST /api/projects', () => {
            it('должен создать новый проект', async () => {
                const mockProject = {
                    id: '1',
                    name: 'New Project',
                    slug: 'new-project',
                    status: 'DRAFT',
                    userId: testUserId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockPrisma.project.create.mockResolvedValue(mockProject);
                const response = await request(app)
                    .post('/api/projects')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                    name: 'New Project',
                    description: 'Test description',
                    type: 'WEBSITE'
                })
                    .expect(201);
                expect(response.body.success).toBe(true);
                expect(response.body.data.name).toBe('New Project');
                expect(response.body.data.slug).toBe('new-project');
            });
            it('должен вернуть ошибку при отсутствии названия', async () => {
                const response = await request(app)
                    .post('/api/projects')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                    description: 'Test description'
                    // name отсутствует
                })
                    .expect(400);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('обязательно');
            });
        });
        describe('PUT /api/projects/:id', () => {
            it('должен обновить проект', async () => {
                const mockProject = {
                    id: '1',
                    name: 'Updated Project',
                    slug: 'updated-project',
                    status: 'DRAFT',
                    userId: testUserId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockPrisma.project.update.mockResolvedValue(mockProject);
                const response = await request(app)
                    .put('/api/projects/1')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                    name: 'Updated Project',
                    description: 'Updated description'
                })
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.name).toBe('Updated Project');
            });
            it('должен вернуть 404 если проект не найден', async () => {
                mockPrisma.project.update.mockRejectedValue(new Error('Record not found'));
                const response = await request(app)
                    .put('/api/projects/999')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                    name: 'Updated Project'
                })
                    .expect(404);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('не найден');
            });
        });
        describe('DELETE /api/projects/:id', () => {
            it('должен удалить проект', async () => {
                mockPrisma.project.delete.mockResolvedValue({ id: '1' });
                const response = await request(app)
                    .delete('/api/projects/1')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toContain('успешно удален');
            });
            it('должен вернуть 404 если проект не найден', async () => {
                mockPrisma.project.delete.mockRejectedValue(new Error('Record not found'));
                const response = await request(app)
                    .delete('/api/projects/999')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('не найден');
            });
        });
        describe('PUT /api/projects/:id/publish', () => {
            it('должен опубликовать проект', async () => {
                const mockProject = {
                    id: '1',
                    name: 'Test Project',
                    slug: 'test-project',
                    status: 'PUBLISHED',
                    userId: testUserId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockPrisma.project.update.mockResolvedValue(mockProject);
                const response = await request(app)
                    .put('/api/projects/1/publish')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.status).toBe('PUBLISHED');
            });
        });
        describe('PUT /api/projects/:id/unpublish', () => {
            it('должен снять проект с публикации', async () => {
                const mockProject = {
                    id: '1',
                    name: 'Test Project',
                    slug: 'test-project',
                    status: 'DRAFT',
                    userId: testUserId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockPrisma.project.update.mockResolvedValue(mockProject);
                const response = await request(app)
                    .put('/api/projects/1/unpublish')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.status).toBe('DRAFT');
            });
        });
        describe('GET /api/projects/statistics', () => {
            it('должен вернуть статистику проектов', async () => {
                const mockStats = {
                    total: 10,
                    published: 5,
                    draft: 3,
                    archived: 2
                };
                const mockRecentProjects = [
                    {
                        id: '1',
                        name: 'Recent Project',
                        status: 'PUBLISHED',
                        updatedAt: new Date()
                    }
                ];
                mockPrisma.project.count.mockResolvedValueOnce(mockStats.total);
                mockPrisma.project.count.mockResolvedValueOnce(mockStats.published);
                mockPrisma.project.count.mockResolvedValueOnce(mockStats.draft);
                mockPrisma.project.count.mockResolvedValueOnce(mockStats.archived);
                mockPrisma.project.findMany.mockResolvedValue(mockRecentProjects);
                const response = await request(app)
                    .get('/api/projects/statistics')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.total).toBe(10);
                expect(response.body.data.published).toBe(5);
                expect(response.body.data.draft).toBe(3);
                expect(response.body.data.archived).toBe(2);
                expect(response.body.data.recentProjects).toHaveLength(1);
            });
        });
    });
    describe('Error Handling', () => {
        it('должен вернуть 404 для несуществующих маршрутов', async () => {
            const response = await request(app)
                .get('/api/nonexistent')
                .expect(404);
            expect(response.body.message).toContain('не найден');
        });
        it('должен обрабатывать внутренние ошибки сервера', async () => {
            mockPrisma.project.findMany.mockRejectedValue(new Error('Database error'));
            const response = await request(app)
                .get('/api/projects')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Ошибка базы данных');
        });
    });
});
//# sourceMappingURL=integration.test.js.map