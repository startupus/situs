// Скрипт запускает NestJS сервер в тестовом окружении на отдельном порту
// и прогоняет Vitest e2e тесты из каталога `__tests__/` с TEST_BASE указывающим на этот сервер.

import { spawn } from 'node:child_process';
import process from 'node:process';

const TEST_PORT = process.env.TEST_PORT ? Number(process.env.TEST_PORT) : 3003;
const TEST_BASE = process.env.TEST_BASE || `http://localhost:${TEST_PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth(url, timeoutMs = 45000) {
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
  // Минимальный набор переменных окружения для прохождения валидации
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/db';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-1234567890abcd';

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
  // Для тестов запускаем через tsx, чтобы не зависеть от dist
  const server = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['tsx', '--tsconfig', 'tsconfig.server.json', 'src/server/main.ts'],
    {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test', PORT: String(TEST_PORT) },
    },
  );

  const ok = await waitForHealth(`${TEST_BASE}/api/health`, 45000);
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


