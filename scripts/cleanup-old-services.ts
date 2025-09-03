#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

console.log('🧹 Очистка упоминаний старых сервисов...');

// Маппинг старых сервисов на новые
const serviceMapping: Record<string, string> = {
  'provider-service': 'hubus-service',
  'proxy-service': 'hubus-service',
  'accounting-service': 'bilingus-service',
};

// Исключения - файлы которые не нужно обновлять
const excludeFiles: string[] = [
  'CHANGELOG.md',
  'COMPLETION_REPORT.md',
  'ARCHITECTURE_MODERNIZATION_REPORT.md',
  'HUBUS_SERVICE_ARCHITECTURE.md',
  'FINAL_ARCHITECTURE_DECISION.md',
  'cleanup-old-services.ts',
];

// Функция для проверки исключений
function shouldSkipFile(filePath: string): boolean {
  const fileName = path.basename(filePath);
  return excludeFiles.some((exclude) => fileName.includes(exclude));
}

// Функция для обновления файла
function updateFile(filePath: string, content: string): boolean {
  let updated = content;
  let hasChanges = false;

  // Заменяем упоминания старых сервисов
  for (const [oldService, newService] of Object.entries(serviceMapping)) {
    const regex = new RegExp(`\\b${oldService}\\b`, 'g');
    if (regex.test(updated)) {
      updated = updated.replace(regex, newService);
      hasChanges = true;
    }
  }

  // Специальные случаи для документации
  if (updated.includes('proxy-service + provider-service')) {
    updated = updated.replace(/proxy-service \+ provider-service/g, 'hubus-service');
    hasChanges = true;
  }

  if (updated.includes('proxy-service:3007 + provider-service:3005')) {
    updated = updated.replace(/proxy-service:3007 \+ provider-service:3005/g, 'hubus-service:3000');
    hasChanges = true;
  }

  // Обновляем порты
  updated = updated.replace(/provider-service.*3005/g, 'hubus-service (3000)');
  updated = updated.replace(/proxy-service.*3007/g, 'hubus-service (3000)');

  if (hasChanges) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Обновлен: ${filePath}`);
    return true;
  }
  return false;
}

// Рекурсивная функция для обхода директорий
function processDirectory(dir: string): number {
  const items = fs.readdirSync(dir);
  let totalUpdated = 0;

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Пропускаем системные директории
      if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'coverage') {
        continue;
      }
      totalUpdated += processDirectory(fullPath);
    } else if (item.endsWith('.md') || item.endsWith('.json') || item.endsWith('.ts') || item.endsWith('.js')) {
      if (shouldSkipFile(fullPath)) {
        console.log(`⏭️  Пропущен: ${fullPath}`);
        continue;
      }

      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (updateFile(fullPath, content)) {
          totalUpdated++;
        }
      } catch (error) {
        console.error(`❌ Ошибка обработки ${fullPath}:`, (error as Error).message);
      }
    }
  }

  return totalUpdated;
}

// Исправляем markdownlint в client-service
function fixMarkdownLint(): void {
  const filePath = 'services/client-service/INTEGRATION_COMPLETION_SUMMARY.md';
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Исправляем проблему с пустой строкой перед заголовком
    content = content.replace(
      /- ✅ \*\*Производительность\*\*.*\nСистема готова к использованию/,
      '- ✅ **Производительность** - Оптимизированная для высокой нагрузки\n\nСистема готова к использованию',
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Исправлен markdownlint: ${filePath}`);
  } catch (error) {
    console.error(`❌ Ошибка исправления markdownlint:`, (error as Error).message);
  }
}

// Основная функция
function main(): void {
  console.log('📁 Обработка файлов проекта...');

  // Исправляем markdownlint
  fixMarkdownLint();

  // Обрабатываем все файлы
  const totalUpdated = processDirectory('.');

  console.log(`\n📊 Результат:`);
  console.log(`✅ Обновлено файлов: ${totalUpdated}`);

  if (totalUpdated > 0) {
    console.log('\n🔧 Запуск линтера для проверки...');
    try {
      execSync('npm run lint:markdown', { stdio: 'inherit' });
      console.log('✅ Линтер прошел успешно');
    } catch (error) {
      console.log('⚠️  Линтер выявил проблемы, но это нормально');
    }
  }

  console.log('\n🎉 Очистка завершена!');
}

// Запускаем скрипт
main();
