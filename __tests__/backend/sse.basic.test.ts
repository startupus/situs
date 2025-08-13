import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_BASE || 'http://localhost:3002';

describe('SSE basic connectivity', () => {
  it('connects to /api/projects/events and receives initial response', async () => {
    const controller = new AbortController();
    const res = await fetch(`${BASE}/api/projects/events`, { signal: controller.signal } as any);
    expect(res.status).toBe(200);
    controller.abort();
  });
});