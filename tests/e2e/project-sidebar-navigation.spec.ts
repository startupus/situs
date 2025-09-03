import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:3002';
const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5177';

async function pickAnyProject(request: any): Promise<{ id: string; slug: string; name: string }> {
  const resp = await request.get(`${API_BASE}/api/projects`, { params: { limit: 1 } });
  expect(resp.ok()).toBeTruthy();
  const json = await resp.json();
  const first = json?.data?.projects?.[0];
  expect(first).toBeTruthy();
  return { id: first.id, slug: first.slug, name: first.name };
}

test.describe('Project sidebar navigation from system menu', () => {
  test('renders project sidebar links from system-project-sidebar mapping', async ({ page, request }) => {
    const project = await pickAnyProject(request);

    // 1) Получаем шаблон навигации из системного проекта
    const tplResp = await request.get(`${API_BASE}/api/ui/system-project-sidebar`);
    expect(tplResp.ok()).toBeTruthy();
    const tplJson = await tplResp.json();
    expect(tplJson.success).toBe(true);
    const tplItems: Array<{ title: string; to: string }> = tplJson.data;
    expect(Array.isArray(tplItems)).toBe(true);
    expect(tplItems.length).toBeGreaterThan(0);

    // 2) Маппим префикс /project → /projects/:id
    const mapped = tplItems.map((it) => {
      const to =
        !it.to || it.to === '/project'
          ? `/projects/${project.id}`
          : it.to.replace(/^\/project(\/|$)/, `/projects/${project.id}$1`);
      return { title: it.title, to };
    });

    // 3) Открываем страницу проекта
    await page.goto(`${FRONTEND_BASE}/projects/${project.id}`);

    // 4) Находим сайдбар и собираем ссылки
    const sidebar = page.locator('div.fixed.left-0 nav ul li a');
    await expect(sidebar.first()).toBeVisible();
    const hrefs = await sidebar.evaluateAll((anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).getAttribute('href')),
    );

    // 5) Каждая ожидаемая ссылка присутствует в DOM
    for (const it of mapped) {
      expect(hrefs).toContain(it.to);
    }

    // 6) Кликаем по 1-2 ссылкам и проверяем смену URL
    // Первая не-"обзор" ссылка, если есть
    const firstNav = mapped.find((x) => x.to !== `/projects/${project.id}`) || mapped[0];
    await page.click(`a[href="${firstNav.to}"]`);
    await expect(page).toHaveURL(new RegExp(firstNav.to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});
