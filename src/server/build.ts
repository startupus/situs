#!/usr/bin/env node
/**
 * Скрипт компиляции NestJS backend
 * Правильно компилирует декораторы для DI
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const DIST_DIR = join(__dirname, 'dist');
const SRC_DIR = __dirname;

console.log('🏗️  Компиляция NestJS backend...');

// Очищаем dist
if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true });
  console.log('🧹 Очистка dist/');
}

try {
  // Компилируем TypeScript с правильными декораторами
  execSync('npx tsc --project tsconfig.json', { 
    cwd: SRC_DIR,
    stdio: 'inherit'
  });
  
  console.log('✅ Компиляция завершена');
  console.log('🚀 Запуск: node dist/main.js');
  
} catch (error) {
  console.error('❌ Ошибка компиляции:', error);
  process.exit(1);
}
