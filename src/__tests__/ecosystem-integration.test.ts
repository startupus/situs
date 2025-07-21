import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

// Настройка для интеграционных тестов экосистемы
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-ecosystem';

describe('Ecosystem Integration Tests: Gateway + Agents', () => {
  let authToken: string;
  let testUserId: string;
  let gatewayUrl: string;
  let agentsUrl: string;

  beforeAll(async () => {
    testUserId = 'ecosystem-test-user';
    gatewayUrl = process.env.GATEWAY_SERVICE_URL || 'http://localhost:3010';
    agentsUrl = process.env.AGENTS_SERVICE_URL || 'http://localhost:3007';
    
    // Создаем JWT токен для аутентификации
    authToken = jwt.sign(
      {
        userId: testUserId,
        email: 'ecosystem-test@example.com',
        scopes: ['agents:read', 'agents:write', 'agents:execute', 'gateway:access'],
      },
      process.env.JWT_SECRET || 'test-secret-ecosystem',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Очистка после тестов
    console.log('🧹 Ecosystem integration tests completed');
  });

  describe('Gateway Health Check', () => {
    it('должен проверить здоровье Gateway Service', async () => {
      const response = await request(gatewayUrl)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('gateway-service');
    });

    it('должен проверить детальное здоровье экосистемы через Gateway', async () => {
      const response = await request(gatewayUrl)
        .get('/health/detailed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('checks');
      expect(response.body.checks).toHaveProperty('agents');
      expect(response.body.checks).toHaveProperty('loginus');
      expect(response.body.checks).toHaveProperty('bilingus');
    });
  });

  describe('Gateway → Agents Integration', () => {
    it('должен создать агента через Gateway', async () => {
      const agentData = {
        name: 'Ecosystem Test Agent',
        description: 'Агент для тестирования интеграции экосистемы',
        type: 'CUSTOMER_SERVICE',
        config: {
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: 'Вы - агент для тестирования интеграции экосистемы.',
          capabilities: ['customer_support', 'ecosystem_testing'],
        },
      };

      const response = await request(gatewayUrl)
        .post('/api/v1/hubus/agents/agents')
        .set('Authorization', `Bearer ${authToken}`)
        .send(agentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(agentData.name);
      expect(response.body.type).toBe(agentData.type);
      expect(response.body.status).toBe('INACTIVE');
      
      // Сохраняем ID для последующих тестов
      (global as any).ecosystemTestAgentId = response.body.id;
    });

    it('должен получить агента через Gateway', async () => {
      const agentId = (global as any).ecosystemTestAgentId;
      
      const response = await request(gatewayUrl)
        .get(`/api/v1/hubus/agents/agents/${agentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(agentId);
      expect(response.body.name).toBe('Ecosystem Test Agent');
    });

    it('должен активировать агента через Gateway', async () => {
      const agentId = (global as any).ecosystemTestAgentId;
      
      const response = await request(gatewayUrl)
        .patch(`/api/v1/hubus/agents/agents/${agentId}/activate`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('ACTIVE');
    });

    it('должен выполнить оркестрацию агента через Gateway', async () => {
      const agentId = (global as any).ecosystemTestAgentId;
      
      const orchestrationRequest = {
        message: 'Привет! Это тест интеграции экосистемы.',
        agentId: agentId,
        context: {
          source: 'ecosystem_integration_test',
          testId: randomUUID(),
        },
        metadata: {
          testType: 'ecosystem_integration',
          timestamp: new Date().toISOString(),
        },
      };

      const response = await request(gatewayUrl)
        .post('/api/v1/hubus/agents/orchestration/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orchestrationRequest)
        .expect(200);

      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('agentId');
      expect(response.body).toHaveProperty('sessionId');
      expect(response.body).toHaveProperty('confidence');
      expect(response.body.agentId).toBe(agentId);
      expect(response.body.confidence).toBeGreaterThan(0);
      
      // Сохраняем session ID для последующих тестов
      (global as any).ecosystemTestSessionId = response.body.sessionId;
    });

    it('должен получить рекомендацию агента через Gateway', async () => {
      const recommendationRequest = {
        message: 'Хочу забронировать стол на завтра в ресторане',
        context: {
          source: 'ecosystem_integration_test',
          testId: randomUUID(),
        },
      };

      const response = await request(gatewayUrl)
        .post('/api/v1/hubus/agents/orchestration/recommend')
        .set('Authorization', `Bearer ${authToken}`)
        .send(recommendationRequest)
        .expect(200);

      expect(response.body).toHaveProperty('agentId');
      expect(response.body).toHaveProperty('agentName');
      expect(response.body).toHaveProperty('agentType');
      expect(response.body).toHaveProperty('confidence');
      expect(response.body).toHaveProperty('reasoning');
      expect(response.body.confidence).toBeGreaterThan(0);
    });

    it('должен получить сессии пользователя через Gateway', async () => {
      const response = await request(gatewayUrl)
        .get('/api/v1/hubus/agents/orchestration/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sessions');
      expect(response.body).toHaveProperty('total');
      expect(response.body.sessions).toBeInstanceOf(Array);
      expect(response.body.sessions.length).toBeGreaterThan(0);
    });
  });

  describe('Gateway → Loginus Integration', () => {
    it('должен проверить статус Loginus через Gateway', async () => {
      const response = await request(gatewayUrl)
        .get('/api/v1/ecosystem/loginus/health')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.service).toBe('loginus');
    });

    it('должен валидировать токен через Gateway → Loginus', async () => {
      const response = await request(gatewayUrl)
        .post('/api/v1/auth/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('valid');
      expect(response.body.valid).toBe(true);
      expect(response.body).toHaveProperty('userId');
      expect(response.body.userId).toBe(testUserId);
    });
  });

  describe('Gateway → Bilingus Integration', () => {
    it('должен проверить статус Bilingus через Gateway', async () => {
      const response = await request(gatewayUrl)
        .get('/api/v1/ecosystem/bilingus/health')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.service).toBe('bilingus-service');
    });

    it('должен получить информацию о биллинге через Gateway', async () => {
      const response = await request(gatewayUrl)
        .get('/api/v1/billing/balance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('currency');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.userId).toBe(testUserId);
    });
  });

  describe('End-to-End Flow: Full Ecosystem', () => {
    it('должен выполнить полный цикл: аутентификация → создание агента → выполнение → биллинг', async () => {
      // 1. Валидация аутентификации
      const authResponse = await request(gatewayUrl)
        .post('/api/v1/auth/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(authResponse.body.valid).toBe(true);

      // 2. Создание агента
      const agentData = {
        name: 'E2E Test Agent',
        description: 'Агент для полного E2E тестирования',
        type: 'CUSTOMER_SERVICE',
        config: {
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: 'Вы - агент для E2E тестирования экосистемы.',
          capabilities: ['customer_support', 'e2e_testing'],
        },
      };

      const agentResponse = await request(gatewayUrl)
        .post('/api/v1/hubus/agents/agents')
        .set('Authorization', `Bearer ${authToken}`)
        .send(agentData)
        .expect(201);

      const agentId = agentResponse.body.id;

      // 3. Активация агента
      await request(gatewayUrl)
        .patch(`/api/v1/hubus/agents/agents/${agentId}/activate`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // 4. Выполнение агента
      const orchestrationRequest = {
        message: 'Полный E2E тест экосистемы Hubus',
        agentId: agentId,
        context: {
          source: 'e2e_ecosystem_test',
          testId: randomUUID(),
        },
      };

      const orchestrationResponse = await request(gatewayUrl)
        .post('/api/v1/hubus/agents/orchestration/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orchestrationRequest)
        .expect(200);

      expect(orchestrationResponse.body.response).toBeDefined();
      expect(orchestrationResponse.body.sessionId).toBeDefined();

      // 5. Проверка биллинга
      const billingResponse = await request(gatewayUrl)
        .get('/api/v1/billing/balance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(billingResponse.body.balance).toBeDefined();
      expect(billingResponse.body.userId).toBe(testUserId);

      // 6. Получение сессий
      const sessionsResponse = await request(gatewayUrl)
        .get('/api/v1/hubus/agents/orchestration/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(sessionsResponse.body.sessions.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Resilience', () => {
    it('должен корректно обрабатывать недоступность сервиса', async () => {
      // Тестируем запрос к несуществующему сервису
      const response = await request(gatewayUrl)
        .get('/api/v1/ecosystem/nonexistent/health')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Service not found');
    });

    it('должен корректно обрабатывать неверные токены', async () => {
      await request(gatewayUrl)
        .get('/api/v1/hubus/agents/agents')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('должен корректно обрабатывать отсутствие прав доступа', async () => {
      // Создаем токен с ограниченными правами
      const limitedToken = jwt.sign(
        {
          userId: testUserId,
          email: 'limited@example.com',
          scopes: ['agents:read'], // Только чтение
        },
        process.env.JWT_SECRET || 'test-secret-ecosystem',
        { expiresIn: '1h' }
      );

      await request(gatewayUrl)
        .post('/api/v1/hubus/agents/agents')
        .set('Authorization', `Bearer ${limitedToken}`)
        .send({
          name: 'Test Agent',
          type: 'CUSTOMER_SERVICE',
          config: { model: 'gpt-4', capabilities: ['test'] },
        })
        .expect(403);
    });
  });

  describe('Performance and Load Testing', () => {
    it('должен обрабатывать множественные параллельные запросы', async () => {
      const startTime = Date.now();
      
      const requests = Array.from({ length: 10 }, (_, i) =>
        request(gatewayUrl)
          .get('/health')
          .expect(200)
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Все запросы должны быть успешными
      responses.forEach(response => {
        expect(response.body.status).toBe('healthy');
      });

      // Время выполнения должно быть разумным (менее 5 секунд)
      expect(duration).toBeLessThan(5000);
    });

    it('должен обрабатывать параллельные запросы к разным сервисам', async () => {
      const requests = [
        request(gatewayUrl)
          .get('/api/v1/ecosystem/loginus/health')
          .set('Authorization', `Bearer ${authToken}`),
        request(gatewayUrl)
          .get('/api/v1/ecosystem/bilingus/health')
          .set('Authorization', `Bearer ${authToken}`),
        request(gatewayUrl)
          .get('/health/detailed')
          .set('Authorization', `Bearer ${authToken}`),
      ];

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
      });
    });
  });
}); 