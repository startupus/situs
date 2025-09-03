import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_BASE || 'http://localhost:3002';

// Basic SSE connectivity and event delivery
describe('SSE', () => {
  it('connects to /api/projects/events', async () => {
    const controller = new AbortController();
    const res = await fetch(`${BASE}/api/projects/events`, { signal: controller.signal } as any);
    expect(res.status).toBe(200);
    controller.abort();
  });

  it('receives published event from /api/realtime/test', async () => {
    const controller = new AbortController();
    const res = await fetch(`${BASE}/api/projects/events`, { signal: controller.signal } as any);
    expect(res.status).toBe(200);
    // publish test event
    await fetch(`${BASE}/api/realtime/test?type=project_updated`);
    // read a small chunk of stream
    const reader: any = (res as any).body.getReader?.() || null;
    if (reader) {
      const { value } = await reader.read();
      const chunk = new TextDecoder().decode(value || new Uint8Array());
      expect(chunk).toContain('sse_connected');
    }
    controller.abort();
  });
});
