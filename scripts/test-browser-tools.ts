#!/usr/bin/env tsx

/**
 * Простой тест BrowserTools
 */

import { spawn } from 'child_process';

async function testBrowserTools() {
  console.log('🧪 Тестирование BrowserTools...');

  // Очищаем существующие процессы
  console.log('🧹 Очистка существующих процессов...');
  await execCommand('pkill -f browser-tools-server');
  await execCommand('pkill -f browser-tools-mcp');

  // Ждем немного
  await sleep(2000);

  // Запускаем сервер
  console.log('🚀 Запуск BrowserTools сервера...');
  const child = spawn('npx', ['@agentdeskai/browser-tools-server@latest'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '3025' }
  });

  // Ждем запуска
  await sleep(5000);

  // Проверяем доступность
  console.log('🔍 Проверка доступности сервера...');
  try {
    const response = await fetch('http://localhost:3025/capture-screenshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    if (response.ok) {
      console.log('✅ Сервер отвечает');
    } else {
      const error = await response.text();
      console.log(`⚠️  Сервер отвечает с ошибкой: ${error}`);
    }
  } catch (error) {
    console.log(`❌ Ошибка подключения: ${error}`);
  }

  // Останавливаем процесс
  console.log('🛑 Остановка сервера...');
  child.kill('SIGTERM');

  console.log('✅ Тест завершен');
}

function execCommand(command: string): Promise<void> {
  return new Promise((resolve) => {
    const child = spawn(command, [], { shell: true, stdio: 'ignore' });
    child.on('close', () => resolve());
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Запуск теста
testBrowserTools().catch(console.error); 