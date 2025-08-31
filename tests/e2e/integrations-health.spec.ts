import { test, expect } from '@playwright/test';

test.describe('Integrations Health Check API', () => {
  let projectId: string;
  let emailIntegrationId: string;

  test.beforeAll(async ({ request }) => {
    // Get first project
    const projectsResponse = await request.get('http://localhost:3002/api/projects');
    const body = await projectsResponse.json();
    const projects = Array.isArray(body?.data?.projects) ? body.data.projects : Array.isArray(body) ? body : [];
    expect(projects.length).toBeGreaterThan(0);
    projectId = projects[0].id;

    // Create EMAIL_SMTP integration for testing
    const createResponse = await request.post('http://localhost:3002/api/integrations', {
      data: {
        projectId,
        provider: 'EMAIL_SMTP',
        instanceKey: 'test-email-health',
        title: 'Test Email Integration',
        config: {}
      }
    });
    expect(createResponse.ok()).toBe(true);
    const created = await createResponse.json();
    emailIntegrationId = created.id;
  });

  test.afterAll(async ({ request }) => {
    // Clean up test integration
    if (emailIntegrationId) {
      await request.delete(`http://localhost:3002/api/integrations/${emailIntegrationId}`);
    }
  });

  test('EMAIL_SMTP health check returns proper status', async ({ request }) => {
    const response = await request.post(`http://localhost:3002/api/integrations/${emailIntegrationId}/test`);
    expect(response.ok()).toBe(true);
    
    const result = await response.json();
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('status');
    expect(['READY', 'ERROR', 'DISABLED']).toContain(result.status);
    
    if (!result.success) {
      expect(result).toHaveProperty('detail');
    }
  });

  test('N8N health check with invalid config', async ({ request }) => {
    // Create N8N integration with invalid config
    const createResponse = await request.post('http://localhost:3002/api/integrations', {
      data: {
        projectId,
        provider: 'N8N',
        instanceKey: 'test-n8n-invalid',
        title: 'Test N8N Invalid',
        config: { baseUrl: 'invalid-url' }
      }
    });
    expect(createResponse.ok()).toBe(true);
    const created = await createResponse.json();

    // Test health check
    const testResponse = await request.post(`http://localhost:3002/api/integrations/${created.id}/test`);
    expect(testResponse.ok()).toBe(true);
    
    const result = await testResponse.json();
    expect(result.success).toBe(false);
    expect(result.status).toBe('ERROR');
    expect(result.detail).toBeTruthy();

    // Clean up
    await request.delete(`http://localhost:3002/api/integrations/${created.id}`);
  });

  test('N8N health check with valid config but unreachable URL', async ({ request }) => {
    // Create N8N integration with unreachable but valid URL
    const createResponse = await request.post('http://localhost:3002/api/integrations', {
      data: {
        projectId,
        provider: 'N8N',
        instanceKey: 'test-n8n-unreachable',
        title: 'Test N8N Unreachable',
        config: { 
          baseUrl: 'https://unreachable.n8n.example.com',
          auth: { apiKey: 'test-key' }
        }
      }
    });
    expect(createResponse.ok()).toBe(true);
    const created = await createResponse.json();

    // Test health check
    const testResponse = await request.post(`http://localhost:3002/api/integrations/${created.id}/test`);
    expect(testResponse.ok()).toBe(true);
    
    const result = await testResponse.json();
    expect(result.success).toBe(false);
    expect(result.status).toBe('ERROR');
    expect(result.detail).toContain('Network error');

    // Clean up
    await request.delete(`http://localhost:3002/api/integrations/${created.id}`);
  });

  test('rate limiting on health check', async ({ request }) => {
    // Make multiple rapid requests to trigger rate limit
    const promises = Array.from({ length: 12 }, () => 
      request.post(`http://localhost:3002/api/integrations/${emailIntegrationId}/test`)
    );

    const responses = await Promise.all(promises);
    
    // Some responses should be rate limited (status 400)
    const rateLimitedResponses = responses.filter(r => !r.ok() && r.status() === 400);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('email preview for EMAIL_SMTP integration', async ({ request }) => {
    const response = await request.post(`http://localhost:3002/api/integrations/${emailIntegrationId}/email/preview`, {
      data: {
        template: 'Привет {{userName}}! Ссылка: {{inviteLink}}',
        variables: {
          userName: 'Тест Пользователь',
          inviteLink: 'https://test.com/invite/123'
        }
      }
    });
    
    expect(response.ok()).toBe(true);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.preview).toContain('Тест Пользователь');
    expect(result.preview).toContain('https://test.com/invite/123');
  });
});