import { describe, it, expect, beforeAll } from 'vitest';

const BASE = process.env.TEST_BASE || 'http://localhost:3002';

async function get(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, { ...opts, method: 'GET' });
  return { status: res.status, text: await res.text(), json: await safeJson(res) };
}
async function post(path: string, body?: any, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, { ...opts, method: 'POST', headers: { 'Content-Type': 'application/json', ...(opts.headers||{}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, text: await res.text(), json: await safeJson(res) };
}
async function safeJson(res: Response) { try { return await res.json(); } catch { return null as any; } }

describe('Public endpoints', () => {
  it('GET /health is public', async () => {
    const { status, json } = await get('/health');
    expect(status).toBe(200);
    expect(json?.status).toBe('ok');
  });
  it('GET /robots.txt is public', async () => {
    const { status, text } = await get('/robots.txt');
    expect(status).toBe(200);
    expect(text.toLowerCase()).toContain('user-agent');
  });
  it('GET /sitemap.xml is public', async () => {
    const { status, text } = await get('/sitemap.xml');
    expect(status).toBe(200);
    expect(text).toContain('<urlset');
  });
  it('GET /api/projects/events (SSE) is reachable', async () => {
    const controller = new AbortController();
    const res = await fetch(`${BASE}/api/projects/events`, { signal: controller.signal } as any);
    expect(res.status).toBe(200);
    controller.abort();
  });
});

describe('Auth & scopes', () => {
  let token: string | null = null;
  it('login/register public endpoints allow flow or fail gracefully', async () => {
    const email = `test_${Date.now()}@example.com`;
    const reg = await post('/auth/register', { email, name: 'Test', password: 'StrongPass123' });
    expect(reg.status).toBe(201);
    token = reg.json?.tokens?.accessToken || null;
    expect(token).toBeTruthy();
  });
  it('protected route denied without token', async () => {
    const { status } = await get('/api/projects');
    expect([401, 403]).toContain(status);
  });
  it('protected route allowed with token', async () => {
    const { status, json } = await get('/api/projects', { headers: { Authorization: `Bearer ${token}` } as any });
    expect(status).toBe(200);
    expect(json?.success).toBe(true);
  });
});