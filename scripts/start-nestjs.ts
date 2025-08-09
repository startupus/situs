#!/usr/bin/env tsx

import { spawn } from 'child_process';

console.log('🚀 Запуск NestJS сервера...');

const server = spawn('npx', ['tsx', '--tsconfig', 'tsconfig.nestjs.json', 'src/server/main.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

// Корректное завершение при сигналах
process.on('SIGINT', () => {
  console.log('\n🛑 Завершение NestJS сервера...');
  server.kill('SIGTERM');
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

server.on('close', (code) => {
  console.log(`NestJS сервер завершен с кодом: ${code}`);
  process.exit(code || 0);
});

server.on('error', (error) => {
  console.error('❌ Ошибка запуска NestJS сервера:', error);
  process.exit(1);
});
