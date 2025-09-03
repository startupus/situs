#!/usr/bin/env tsx

/**
 * Скрипт для запуска MCP (Model Context Protocol) сервера
 *
 * Этот сервер предоставляет AI инструменты, ресурсы и промпты
 * для интеграции с внешними AI системами через MCP протокол.
 */

import { spawn } from 'child_process';
import { join } from 'path';

const MCP_SERVER_PATH = join(process.cwd(), 'src', 'mcp', 'server.ts');

console.log('🚀 Запуск Situs MCP Server...');
console.log(`📁 Путь к серверу: ${MCP_SERVER_PATH}`);

// Запуск MCP сервера с помощью tsx
const mcpProcess = spawn('npx', ['tsx', MCP_SERVER_PATH], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: 'development',
  },
});

// Обработка завершения процесса
mcpProcess.on('close', (code) => {
  console.log(`\n📡 MCP сервер завершен с кодом: ${code}`);
  process.exit(code || 0);
});

// Обработка ошибок
mcpProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска MCP сервера:', error);
  process.exit(1);
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал SIGINT, завершение MCP сервера...');
  mcpProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал SIGTERM, завершение MCP сервера...');
  mcpProcess.kill('SIGTERM');
});
