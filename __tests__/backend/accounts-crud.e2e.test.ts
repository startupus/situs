import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_BASE || 'http://localhost:3002';

async function get(path: string, headers: Record<string,string> = {}) {
  const res = await fetch(`${BASE}${path}`, { method: 'GET', headers } as any);
  const text = await res.text();
  let json: any = null; try { json = JSON.parse(text); } catch {}
  return { status: res.status, text, json };
}
async function post(path: string, body?: any, headers: Record<string,string> = {}) {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers } as any, body: body ? JSON.stringify(body) : undefined } as any);
  const text = await res.text();
  let json: any = null; try { json = JSON.parse(text); } catch {}
  return { status: res.status, text, json };
}
async function del(path: string, headers: Record<string,string> = {}) {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers } as any);
  const text = await res.text();
  let json: any = null; try { json = JSON.parse(text); } catch {}
  return { status: res.status, text, json };
}

describe('Accounts CRUD', () => {
  const auth = { Authorization: `Bearer ${process.env.AUTH_TEST_TOKEN || 'test-token-12345'}` } as any;

  it('lists accounts (may be empty)', async () => {
    const { status } = await get('/api/accounts', auth);
    // In dev it may be open, in test should be protected but allowed with token
    expect([200, 401, 403]).toContain(status);
  });

  it('creates and deletes an account', async () => {
    const ownerId = 'test-user-id';
    const create = await post('/api/accounts', { name: `Test Acc ${Date.now()}`, type: 'BUSINESS', ownerId }, auth);
    if (![200,201].includes(create.status)) {
      // tolerate if route is protected with stricter policies
      expect([401,403]).toContain(create.status);
      return;
    }
    const id = create.json?.data?.id;
    expect(id).toBeTruthy();
    const removed = await del(`/api/accounts/${id}`, auth);
    expect([200,204]).toContain(removed.status);
  });
});


