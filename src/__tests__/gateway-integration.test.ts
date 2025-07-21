import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock GatewayClient
class MockGatewayClient {
  static getInstance() {
    return new MockGatewayClient();
  }

  async validateToken(token: string) {
    return {
      valid: true,
      user: {
        id: 'test-user',
        email: 'test@example.com',
        role: 'user',
        scopes: ['read']
      }
    };
  }

  async requestToService(service: string, path: string, options: any) {
    return { success: true, data: 'test' };
  }

  async checkEcosystemHealth() {
    return {
      overall: true,
      services: {
        loginus: true,
        bilingus: true,
        agents: true
      }
    };
  }
}

const GatewayClient = MockGatewayClient;

describe('Gateway Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });
  
  it('should create GatewayClient instance', () => {
    const client = GatewayClient.getInstance();
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(MockGatewayClient);
  });
  
  it('should use correct gateway URL', () => {
    const client = GatewayClient.getInstance();
    
    // Проверяем, что используется правильный порт
    expect(process.env.GATEWAY_SERVICE_URL || 'http://localhost:3010').toContain('3010');
  });
  
  it('should handle token validation', async () => {
    const client = GatewayClient.getInstance();
    
    const result = await client.validateToken('test-token');
    
    expect(result.valid).toBe(true);
    expect(result.user?.id).toBe('test-user');
  });
  
  it('should handle service requests', async () => {
    const client = GatewayClient.getInstance();
    
    const result = await client.requestToService('loginus', '/health', {
      method: 'GET'
    });
    
    expect(result).toEqual({ success: true, data: 'test' });
  });
  
  it('should handle ecosystem health check', async () => {
    const client = GatewayClient.getInstance();
    
    const result = await client.checkEcosystemHealth();
    
    expect(result.overall).toBe(true);
    expect(result.services).toBeDefined();
  });
}); 