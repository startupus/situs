import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:3002';

test.describe('System project protection', () => {
  test('cannot delete situs-admin and cannot change slug/ownerId', async ({ request }) => {
    // Получаем системный проект по slug
    const getResp = await request.get(`${API_BASE}/api/projects/check-slug/situs-admin`);
    expect(getResp.ok()).toBeTruthy();

    // Пробуем удалить по ID/slug — ожидаем 403
    const delResp = await request.delete(`${API_BASE}/api/projects/situs-admin`);
    expect(delResp.status()).toBe(403);

    // Пробуем изменить slug — ожидаем 403
    const patchSlug = await request.patch(`${API_BASE}/api/projects/situs-admin`, { data: { slug: 'admin-renamed' } });
    expect(patchSlug.status()).toBe(403);

    // Пробуем изменить ownerId — ожидаем 403
    const patchOwner = await request.patch(`${API_BASE}/api/projects/situs-admin`, { data: { ownerId: 'fake' } });
    expect(patchOwner.status()).toBe(403);
  });
});


