import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_BASE || 'http://localhost:3002';
const AUTH = { Authorization: `Bearer ${process.env.AUTH_TEST_TOKEN || 'test-token-12345'}` } as any;

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

describe('AgencyClient links', () => {
  it('link and unlink agency-client accounts', async () => {
    // Create agency and client accounts under one owner (test user)
    const ownerId = 'test-user-id';
    const agency = await post('/api/accounts', { name: `Agency ${Date.now()}`, type: 'AGENCY', ownerId }, AUTH);
    const client = await post('/api/accounts', { name: `Client ${Date.now()}`, type: 'BUSINESS', ownerId }, AUTH);
    if (!([200,201].includes(agency.status) && [200,201].includes(client.status))) {
      // policy restricted
      expect([401,403]).toContain(agency.status === 200 || agency.status === 201 ? client.status : agency.status);
      return;
    }
    const agencyAccountId = agency.json?.data?.id as string;
    const clientAccountId = client.json?.data?.id as string;

    // Link
    const link = await post('/api/agency-clients', { agencyAccountId, clientAccountId }, AUTH);
    expect([200,201]).toContain(link.status);
    const linkId = link.json?.data?.id as string;
    expect(linkId).toBeTruthy();

    // Unlink
    const removed = await del(`/api/agency-clients/${linkId}`, AUTH);
    expect([200,204]).toContain(removed.status);

    // Cleanup accounts
    await del(`/api/accounts/${agencyAccountId}`, AUTH);
    await del(`/api/accounts/${clientAccountId}`, AUTH);
  });
});


