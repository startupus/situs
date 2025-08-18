// Скрипт запускает NestJS сервер в тестовом окружении на отдельном порту
// и прогоняет Vitest e2e тесты из каталога `__tests__/` с TEST_BASE указывающим на этот сервер.

import { spawn } from 'node:child_process';
import process from 'node:process';

const TEST_PORT = process.env.TEST_PORT ? Number(process.env.TEST_PORT) : 3003;
const TEST_BASE = process.env.TEST_BASE || `http://localhost:${TEST_PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await wait(500);
  }
  return false;
}

async function main() {
  process.env.NODE_ENV = 'test';
  process.env.PORT = String(TEST_PORT);
  process.env.AUTH_TEST_TOKEN = process.env.AUTH_TEST_TOKEN || 'test-token-12345';

  // Сначала соберем backend
  console.log('🔨 Собираем backend...');
  const build = spawn('npm', ['run', 'nestjs:build'], { stdio: 'inherit' });
  await new Promise((resolve, reject) => {
    build.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Build failed with code ${code}`));
    });
  });

  console.log('🚀 Запускаем тестовый сервер...');
  const server = spawn(
    'node',
    ['dist/server/main.js'],
    {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test', PORT: String(TEST_PORT) },
    },
  );

  const ok = await waitForHealth(`${TEST_BASE}/health`, 30000);
  if (!ok) {
    try { server.kill('SIGTERM'); } catch {}
    console.error('❌ Не удалось дождаться /health от тестового сервера');
    process.exit(1);
  }

  const vitest = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vitest', 'run'],
    {
      stdio: 'inherit',
      env: { ...process.env, TEST_BASE: TEST_BASE, NODE_ENV: 'test' },
    },
  );

  vitest.on('exit', (code) => {
    try { server.kill('SIGTERM'); } catch {}
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


