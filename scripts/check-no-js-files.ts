#!/usr/bin/env ts-node

/**
 * Скрипт для проверки отсутствия JavaScript файлов в проекте
 * Соответствует строгим стандартам TypeScript проекта Hubus
 */

import * as fs from 'fs';
import * as path from 'path';

// Разрешенные директории с JS файлами
const ALLOWED_DIRECTORIES: string[] = [
  'node_modules',
  'dist',
  'coverage',
  '.git',
  'vendor',
  'build',
  'out',
  'generated',
];

// Разрешенные файлы
const ALLOWED_FILES: string[] = [
  'tailwind.config.js',
  'next.config.js',
  'jest.config.js',
  'webpack.config.js',
  'rollup.config.js',
  'vite.config.js',
  'prettier.config.js',
  'postcss.config.js',
  '.eslintrc.js',
];

interface CheckResult {
  foundFiles: string[];
  isValid: boolean;
}

/**
 * Проверяет, разрешен ли файл
 */
function isAllowedFile(filePath: string): boolean {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);

  // Проверяем разрешенные файлы
  if (ALLOWED_FILES.includes(fileName)) {
    return true;
  }

  // Проверяем разрешенные директории
  const pathParts = dirName.split(path.sep);
  return ALLOWED_DIRECTORIES.some((allowedDir) => pathParts.includes(allowedDir));
}

/**
 * Рекурсивно ищет все JS файлы
 */
function findJavaScriptFiles(dir: string, files: string[] = []): string[] {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      try {
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Пропускаем системные директории
          if (!ALLOWED_DIRECTORIES.includes(item)) {
            findJavaScriptFiles(fullPath, files);
          }
        } else if (item.endsWith('.js')) {
          // Проверяем, разрешен ли этот файл
          if (!isAllowedFile(fullPath)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Пропускаем файлы/директории с ошибками доступа
        console.warn(`⚠️  Не удалось проверить: ${fullPath}`);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Не удалось прочитать директорию: ${dir}`);
  }

  return files;
}

/**
 * Основная функция проверки
 */
function checkNoJavaScriptFiles(): CheckResult {
  console.log('🔍 Проверка отсутствия JavaScript файлов...\n');

  const foundFiles = findJavaScriptFiles(process.cwd());

  const result: CheckResult = {
    foundFiles,
    isValid: foundFiles.length === 0,
  };

  if (result.isValid) {
    console.log('✅ Проверка пройдена: JavaScript файлы не найдены');
    console.log('🎯 Проект соответствует строгим стандартам TypeScript');
  } else {
    console.log('❌ Найдены недопустимые JavaScript файлы:');
    foundFiles.forEach((file) => {
      console.log(`   - ${path.relative(process.cwd(), file)}`);
    });

    console.log('\n💡 Действия для исправления:');
    console.log('   1. Конвертируйте .js файлы в .ts');
    console.log('   2. Добавьте строгую типизацию');
    console.log('   3. Удалите оригинальные .js файлы');
    console.log('   4. Обновите импорты в других файлах');
  }

  return result;
}

/**
 * Основная функция
 */
function main(): void {
  const result = checkNoJavaScriptFiles();

  console.log(`\n📊 Результат проверки:`);
  console.log(`   Найдено JS файлов: ${result.foundFiles.length}`);
  console.log(`   Статус: ${result.isValid ? '✅ ПРОЙДЕНО' : '❌ НЕ ПРОЙДЕНО'}`);

  if (!result.isValid) {
    console.log('\n🚨 КРИТИЧЕСКОЕ НАРУШЕНИЕ стандартов TypeScript!');
    console.log('📖 См. TYPESCRIPT_STANDARDS.md для подробностей');
    process.exit(1);
  }

  console.log('\n🎉 Все проверки пройдены успешно!');
}

// Запускаем скрипт
if (require.main === module) {
  main();
}

export { checkNoJavaScriptFiles, findJavaScriptFiles, isAllowedFile };
