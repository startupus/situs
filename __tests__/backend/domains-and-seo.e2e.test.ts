import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_BASE || 'http://localhost:3002';

async function get(path: string, headers: Record<string,string> = {}) {
  const res = await fetch(`${BASE}${path}`, { method: 'GET', headers } as any);
  return { status: res.status, text: await res.text(), res };
}

// SEO endpoints basic behaviour
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

// Domain redirect behaviour depends on publication+verification
describe('Domain redirect (simple)', () => {
  it('no redirect for unknown host', async () => {
    const { status } = await get('/health', { Host: 'unknown.local' });
    expect(status).toBe(200);
  });
  it('no redirect without verification/publication (placeholder)', async () => {
    // For now we just verify that /health still OK even with Host header simulating project domain
    const { status } = await get('/health', { Host: 'project.situs.local' });
    expect(status).toBe(200);
  });
});