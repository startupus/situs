import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';

/**
 * API Tests - Базовые тесты для проверки работоспособности API
 * Инспирированы тестами Strapi
 */

describe('API Server Tests', () => {
  
  describe('Core API Endpoints', () => {
    it('should return API info on GET /', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Situs API Server');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('status', 'active');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('health');
      expect(response.body.endpoints).toHaveProperty('auth');
      expect(response.body.endpoints).toHaveProperty('users');
      expect(response.body.endpoints).toHaveProperty('projects');
      expect(response.body.endpoints).toHaveProperty('analytics');
    });

    it('should return health status on GET /health', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('version');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('CORS and Security Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // Helmet should add security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status', 404);
    });

    it('should handle invalid JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow reasonable number of requests', async () => {
      // Делаем 5 быстрых запросов
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/health')
          .expect(200);
      }
    });
  });

  describe('Authentication Endpoints', () => {
    it('should have auth endpoints available', async () => {
      // Проверяем, что auth эндпоинты существуют
      await request(app)
        .post('/api/auth/login')
        .expect(400); // Ожидаем 400 из-за отсутствия данных, но не 404

      await request(app)
        .post('/api/auth/register')
        .expect(400); // Ожидаем 400 из-за отсутствия данных, но не 404
    });
  });

  describe('Protected Endpoints', () => {
    it('should require authentication for users endpoint', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status', 401);
    });

    it('should require authentication for projects endpoint', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status', 401);
    });

    it('should require authentication for analytics endpoint', async () => {
      const response = await request(app)
        .get('/api/analytics/user-growth')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status', 401);
    });
  });

  describe('Content-Type Headers', () => {
    it('should return JSON content-type for API responses', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});