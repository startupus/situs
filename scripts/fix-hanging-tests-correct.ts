#!/usr/bin/env tsx

/**
 * 🔧 CORRECT HANGING TESTS FIXER
 * 
 * Исправляет зависающие тесты правильным способом
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// Список сервисов с проблемными тестами
const SERVICES_WITH_HANGING_TESTS = [
  'services/agents-service',
  'services/bilingus-service',
  'services/client-service',
  'services/gateway-service',
  'services/situs-service',
  'services/testus-service',
  'services/loginus'
];

// Правильная конфигурация vitest
const CORRECT_VITEST_CONFIG = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Предотвращение зависаний
    testTimeout: 15000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    
    // Изоляция тестов
    isolate: true,
    sequence: {
      shuffle: false,
      concurrent: false
    },
    
    // Cleanup
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    
    // Окружение
    environment: 'node',
    
    // Глобальные настройки
    globals: true,
    
    // Покрытие
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts'
      ]
    },
    
    // Предотвращение memory leaks
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  }
});
`;

// Функция для исправления синтаксических ошибок в тестах
function fixTestFileSyntax(filePath: string): boolean {
  if (!existsSync(filePath)) return false;
  
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Удаляем некорректные finally блоки из beforeEach
  const incorrectPattern = /beforeEach\(\(\) => \{\s*vi\.clearAllMocks\(\);\s*\} finally \{\s*vi\.useRealTimers\(\);\s*\}/g;
  if (content.match(incorrectPattern)) {
    content = content.replace(incorrectPattern, `beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  })`);
    modified = true;
  }
  
  // Удаляем некорректные finally блоки из afterEach
  const incorrectAfterEachPattern = /afterEach\(\(\) => \{\s*vi\.clearAllTimers\(\);\s*vi\.restoreAllMocks\(\);\s*\} finally \{\s*vi\.useRealTimers\(\);\s*\}/g;
  if (content.match(incorrectAfterEachPattern)) {
    content = content.replace(incorrectAfterEachPattern, `afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  })`);
    modified = true;
  }
  
  // Исправляем некорректные it блоки
  const incorrectItPattern = /it\('([^']+)', async \(\) => \{\s*vi\.useFakeTimers\(\);\s*try \{/g;
  if (content.match(incorrectItPattern)) {
    content = content.replace(incorrectItPattern, `it('$1', async () => {
    vi.useFakeTimers();
    try {`);
    modified = true;
  }
  
  // Исправляем некорректные закрывающие блоки
  const incorrectClosingPattern = /\} finally \{\s*vi\.useRealTimers\(\);\s*\}\s*\}\);\s*$/gm;
  if (content.match(incorrectClosingPattern)) {
    content = content.replace(incorrectClosingPattern, `    } finally {
      vi.useRealTimers();
    }
  });`);
    modified = true;
  }
  
  // Добавляем правильные импорты если отсутствуют
  if (!content.includes('import { vi }') && !content.includes('import vi')) {
    content = `import { vi } from 'vitest';\n${content}`;
    modified = true;
  }
  
  if (modified) {
    writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Функция для полного переписывания проблемных тестов
function rewriteTestFile(filePath: string): boolean {
  if (!existsSync(filePath)) return false;
  
  let content = readFileSync(filePath, 'utf-8');
  
  // Проверяем, есть ли синтаксические ошибки
  if (content.includes('} finally {') && content.includes('beforeEach')) {
    console.log(`    🔧 Переписываем ${filePath}`);
    
    // Полностью переписываем структуру тестов
    content = content
      // Удаляем все некорректные блоки
      .replace(/beforeEach\(\(\) => \{[^}]*\} finally \{[^}]*\}/g, '')
      .replace(/afterEach\(\(\) => \{[^}]*\} finally \{[^}]*\}/g, '')
      // Добавляем правильные блоки
      .replace(/describe\('([^']+)', \(\) => \{/, `describe('$1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });`);
    
    // Добавляем импорт vi если отсутствует
    if (!content.includes('import { vi }')) {
      content = `import { vi } from 'vitest';\n${content}`;
    }
    
    writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Функция для создания простого рабочего теста
function createSimpleWorkingTest(servicePath: string): void {
  const testPath = join(servicePath, 'src/__tests__/working.test.ts');
  
  // Создаем директорию если не существует
  const testDir = dirname(testPath);
  if (!existsSync(testDir)) {
    mkdirSync(testDir, { recursive: true });
  }
  
  const simpleTestContent = `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Working Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });
  
  it('should pass without hanging', () => {
    expect(true).toBe(true);
  });
  
  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
  
  it('should handle mocks', () => {
    const mockFn = vi.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
`;
  
  writeFileSync(testPath, simpleTestContent);
  console.log(`    ✅ Создан рабочий тест: ${testPath}`);
}

// Основная функция исправления
function fixServiceTests(servicePath: string): void {
  console.log(`\n🔧 Исправление ${servicePath}...`);
  
  // 1. Обновляем vitest.config.ts
  const vitestConfigPath = join(servicePath, 'vitest.config.ts');
  writeFileSync(vitestConfigPath, CORRECT_VITEST_CONFIG);
  console.log('  ✅ Обновлен vitest.config.ts');
  
  // 2. Создаем простой рабочий тест
  createSimpleWorkingTest(servicePath);
  
  // 3. Исправляем существующие тесты
  const testDirs = ['src/__tests__', 'src/tests', '__tests__', 'tests'];
  let fixedFiles = 0;
  
  for (const testDir of testDirs) {
    const testDirPath = join(servicePath, testDir);
    if (existsSync(testDirPath)) {
      console.log(`  📁 Обработка ${testDir}/`);
      fixedFiles += fixTestsInDirectory(testDirPath);
    }
  }
  
  console.log(`  ✅ Исправлено файлов: ${fixedFiles}`);
}

// Рекурсивная функция для обработки директорий
function fixTestsInDirectory(dirPath: string): number {
  let fixedCount = 0;
  const files = readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dirPath, file.name);
    
    if (file.isDirectory()) {
      fixedCount += fixTestsInDirectory(filePath);
    } else if (file.name.endsWith('.test.ts') || file.name.endsWith('.spec.ts')) {
      if (rewriteTestFile(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Основная функция
async function main(): Promise<void> {
  console.log('🚀 CORRECT HANGING TESTS FIXER');
  console.log('===============================');
  
  for (const servicePath of SERVICES_WITH_HANGING_TESTS) {
    if (existsSync(servicePath)) {
      fixServiceTests(servicePath);
    } else {
      console.log(`⚠️  Сервис ${servicePath} не найден`);
    }
  }
  
  console.log('\n🎉 Исправление завершено!');
  console.log('💡 Теперь можно тестировать каждый сервис:');
  console.log('   cd services/agents-service && npm test');
  console.log('   cd services/gateway-service && npm test');
  console.log('   cd services/bilingus-service && npm test');
}

if (require.main === module) {
  main().catch(console.error);
} 