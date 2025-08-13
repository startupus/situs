import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_BASE || 'http://localhost:3002';

async function get(path: string, headers: Record<string,string> = {}) {
  const res = await fetch(`${BASE}${path}`, { method: 'GET', headers } as any);
  return { status: res.status, text: await res.text(), res };
}

describe('SEO endpoints', () => {
  it('robots.txt returns plain text', async () => {
    const { status, text } = await get('/robots.txt');
    expect(status).toBe(200);
    expect(text.toLowerCase()).toContain('user-agent');
  });
  it('sitemap.xml returns xml', async () => {
    const { status, text } = await get('/sitemap.xml');
    expect(status).toBe(200);
    expect(text).toContain('<urlset');
  });
});

describe('Domain redirect (simple)', () => {
  it('no redirect for unknown host', async () => {
    const { status, res } = await get('/health', { Host: 'unknown.local' });
    expect(status).toBe(200);
  });
});