#!/usr/bin/env ts-node

/**
 * Автоматическая конвертация JavaScript файлов в TypeScript
 * Соответствует критическим стандартам TypeScript проекта Hubus
 */

import * as fs from 'fs';
import * as path from 'path';

interface ConversionResult {
  converted: string[];
  failed: string[];
  skipped: string[];
}

/**
 * Конвертирует JavaScript код в TypeScript
 */
function convertJSToTS(content: string, filePath: string): string {
  let tsContent = content;

  // 1. Заменяем CommonJS импорты на ES6
  tsContent = tsContent.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, "import $1 from '$2'");
  tsContent = tsContent.replace(
    /const\s+\{\s*([^}]+)\s*\}\s*=\s*require\(['"]([^'"]+)['"]\)/g,
    "import { $1 } from '$2'",
  );
  tsContent = tsContent.replace(
    /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)\.(\w+)/g,
    "import { $3 as $1 } from '$2'",
  );

  // 2. Заменяем module.exports на export
  tsContent = tsContent.replace(/module\.exports\s*=\s*\{([^}]+)\}/g, 'export { $1 }');
  tsContent = tsContent.replace(/module\.exports\s*=\s*(\w+)/g, 'export default $1');

  // 3. Добавляем типизацию для функций
  tsContent = tsContent.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, (match, name, params) => {
    const typedParams = params
      .split(',')
      .map((param: string) => {
        const trimmed = param.trim();
        if (trimmed && !trimmed.includes(':')) {
          return `${trimmed}: any`;
        }
        return trimmed;
      })
      .join(', ');
    return `function ${name}(${typedParams}): any {`;
  });

  // 4. Добавляем типизацию для стрелочных функций
  tsContent = tsContent.replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g, (match, name, params) => {
    const typedParams = params
      .split(',')
      .map((param: string) => {
        const trimmed = param.trim();
        if (trimmed && !trimmed.includes(':')) {
          return `${trimmed}: any`;
        }
        return trimmed;
      })
      .join(', ');
    return `const ${name} = (${typedParams}): any =>`;
  });

  // 5. Исправляем экспорты классов
  tsContent = tsContent.replace(/class\s+(\w+)\s*\{/g, 'export class $1 {');

  // 6. Добавляем типизацию для переменных
  tsContent = tsContent.replace(/let\s+(\w+)\s*=\s*\[\]/g, 'let $1: any[] = []');
  tsContent = tsContent.replace(/let\s+(\w+)\s*=\s*\{\}/g, 'let $1: any = {}');

  // 7. Исправляем console.log (добавляем void для избежания предупреждений)
  if (filePath.includes('test') || filePath.includes('spec')) {
    // В тестах оставляем console.log
  } else {
    tsContent = tsContent.replace(/console\.log\(/g, 'void console.log(');
  }

  // 8. Добавляем заголовок для TypeScript
  if (!tsContent.includes('#!/usr/bin/env')) {
    tsContent = `// Автоматически конвертировано из JavaScript в TypeScript\n// Требует дополнительной типизации для соответствия стандартам Hubus\n\n${tsContent}`;
  }

  return tsContent;
}

/**
 * Конвертирует один файл
 */
function convertFile(jsFilePath: string): boolean {
  try {
    console.log(`🔄 Конвертирую: ${path.relative(process.cwd(), jsFilePath)}`);

    // Читаем исходный файл
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');

    // Конвертируем в TypeScript
    const tsContent = convertJSToTS(jsContent, jsFilePath);

    // Создаем путь для TypeScript файла
    const tsFilePath = jsFilePath.replace(/\.js$/, '.ts');

    // Записываем TypeScript файл
    fs.writeFileSync(tsFilePath, tsContent, 'utf8');

    // Удаляем исходный JavaScript файл
    fs.unlinkSync(jsFilePath);

    console.log(
      `✅ Конвертирован: ${path.relative(process.cwd(), jsFilePath)} -> ${path.relative(process.cwd(), tsFilePath)}`,
    );
    return true;
  } catch (error) {
    console.error(`❌ Ошибка конвертации ${jsFilePath}:`, (error as Error).message);
    return false;
  }
}

/**
 * Конвертирует все найденные JavaScript файлы
 */
function convertAllJSFiles(): ConversionResult {
  const result: ConversionResult = {
    converted: [],
    failed: [],
    skipped: [],
  };

  // Список файлов для конвертации (исключая системные)
  const jsFiles = [
    'prisma/seed.js',
    'scripts/security/env-audit.js',
    'scripts/security/sql-audit.js',
    'services/bilingus-service/index.js',
    'services/bilingus-service/load-tests/k6-load-test.js',
    'services/bilingus-service/prisma/seed.js',
    'services/controlus-service/index.js',
    'services/gateway-service/index.js',
    'services/hubus-service/src/__tests__/ai-integration.test.js',
    'services/hubus-service/src/__tests__/basic.test.js',
    'services/hubus-service/src/__tests__/integration.test.js',
    'services/hubus-service/src/__tests__/streaming.test.js',
    'services/hubus-service/src/controllers/HubusController.js',
    'services/hubus-service/src/index.js',
    'services/hubus-service/src/middleware/authMiddleware.js',
    'services/hubus-service/src/middleware/errorHandler.js',
    'services/hubus-service/src/services/AIProviderService.js',
    'services/hubus-service/src/services/AIStreamingService.js',
    'services/hubus-service/src/services/BilingusClient.js',
    'services/hubus-service/src/services/HubusService.js',
    'services/hubus-service/src/services/LoginusClient.js',
    'services/hubus-service/src/types/HubusTypes.js',
    'services/hubus-service/src/utils/Logger.js',
    'services/testus-service/prisma/seed.js',
  ];

  console.log(`🚀 Начинаю конвертацию ${jsFiles.length} JavaScript файлов...\n`);

  for (const filePath of jsFiles) {
    if (fs.existsSync(filePath)) {
      if (convertFile(filePath)) {
        result.converted.push(filePath);
      } else {
        result.failed.push(filePath);
      }
    } else {
      console.log(`⏭️  Пропущен (не найден): ${filePath}`);
      result.skipped.push(filePath);
    }
  }

  return result;
}

/**
 * Основная функция
 */
function main(): void {
  console.log('🔧 Автоматическая конвертация JavaScript файлов в TypeScript\n');
  console.log('🚨 КРИТИЧЕСКОЕ исправление нарушений стандартов TypeScript\n');

  const result = convertAllJSFiles();

  console.log('\n📊 Результат конвертации:');
  console.log(`   ✅ Конвертировано: ${result.converted.length}`);
  console.log(`   ❌ Ошибки: ${result.failed.length}`);
  console.log(`   ⏭️  Пропущено: ${result.skipped.length}`);

  if (result.failed.length > 0) {
    console.log('\n❌ Файлы с ошибками:');
    result.failed.forEach((file) => console.log(`   - ${file}`));
  }

  if (result.converted.length > 0) {
    console.log('\n✅ Успешно конвертированы:');
    result.converted.forEach((file) => console.log(`   - ${file}`));

    console.log('\n💡 Следующие шаги:');
    console.log('   1. Проверить TypeScript ошибки: npx tsc --build');
    console.log('   2. Исправить типизацию вручную');
    console.log('   3. Запустить тесты: npm test');
    console.log('   4. Проверить отсутствие JS файлов: npx ts-node scripts/check-no-js-files.ts');
  }

  console.log('\n🎯 Цель: 100% соответствие стандартам TypeScript проекта Hubus');
}

// Запускаем скрипт
if (require.main === module) {
  main();
}

export { convertJSToTS, convertFile, convertAllJSFiles };
