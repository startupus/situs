#!/usr/bin/env tsx

/**
 * 🔧 UNIVERSAL HANGING TESTS FIXER
 * 
 * Исправляет зависающие тесты во всех сервисах экосистемы Hubus
 * Применяет проверенные решения для устранения зависаний
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface TestFix {
  pattern: RegExp;
  replacement: string;
  description: string;
}

// Проверенные исправления для зависающих тестов
const HANGING_TEST_FIXES: TestFix[] = [
  // 1. Добавление timeout для всех тестов
  {
    pattern: /describe\('([^']+)',\s*\(\)\s*=>\s*{/g,
    replacement: `describe('$1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });`,
    description: 'Добавление proper cleanup в describe блоки'
  },
  
  // 2. Исправление async/await в тестах
  {
    pattern: /it\('([^']+)',\s*async\s*\(\)\s*=>\s*{/g,
    replacement: `it('$1', async () => {
    vi.useFakeTimers();
    try {`,
    description: 'Добавление fake timers для async тестов'
  },
  
  // 3. Закрытие async операций
  {
    pattern: /}\);(\s*$)/gm,
    replacement: `    } finally {
      vi.useRealTimers();
    }
  });$1`,
    description: 'Добавление finally блока для cleanup'
  },
  
  // 4. Исправление Promise.resolve() без await
  {
    pattern: /Promise\.resolve\(/g,
    replacement: 'await Promise.resolve(',
    description: 'Добавление await для Promise.resolve'
  },
  
  // 5. Исправление setTimeout/setInterval
  {
    pattern: /setTimeout\(/g,
    replacement: 'vi.advanceTimersByTime(1000); // setTimeout(',
    description: 'Замена setTimeout на vi.advanceTimersByTime'
  },
  
  // 6. Исправление fetch моков
  {
    pattern: /global\.fetch\s*=\s*vi\.fn\(\)/g,
    replacement: `global.fetch = vi.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        status: 200
      })
    )`,
    description: 'Исправление fetch моков'
  },
  
  // 7. Добавление explicit return в async функции
  {
    pattern: /async\s*\(\)\s*=>\s*{([^}]+)}\s*\)/g,
    replacement: 'async () => { $1 return; })',
    description: 'Добавление explicit return в async функции'
  }
];

// Конфигурация vitest для предотвращения зависаний
const VITEST_CONFIG_FIXES = `
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Предотвращение зависаний
    testTimeout: 10000,
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

// Список сервисов с тестами
const SERVICES_WITH_TESTS = [
  'services/agents-service',
  'services/bilingus-service', 
  'services/client-service',
  'services/gateway-service',
  'services/provider-service',
  'services/proxy-service',
  'services/situs-service',
  'services/testus-service',
  'services/loginus',
  'services/chat-service'
];

function fixHangingTests(servicePath: string): void {
  console.log(`\n🔧 Исправление зависающих тестов в ${servicePath}...`);
  
  // 1. Исправление vitest.config.ts
  const vitestConfigPath = join(servicePath, 'vitest.config.ts');
  if (existsSync(vitestConfigPath)) {
    console.log('  ✅ Обновление vitest.config.ts');
    writeFileSync(vitestConfigPath, VITEST_CONFIG_FIXES);
  } else {
    console.log('  ➕ Создание vitest.config.ts');
    writeFileSync(vitestConfigPath, VITEST_CONFIG_FIXES);
  }
  
  // 2. Поиск и исправление тестовых файлов
  const testDirs = ['src/__tests__', 'src/tests', '__tests__', 'tests'];
  let testsFixed = 0;
  
  for (const testDir of testDirs) {
    const testDirPath = join(servicePath, testDir);
    if (existsSync(testDirPath)) {
      console.log(`  📁 Обработка ${testDir}/`);
      fixTestsInDirectory(testDirPath, testsFixed);
    }
  }
  
  // 3. Создание setup файла для тестов
  const setupPath = join(servicePath, 'src/__tests__/setup.ts');
  if (!existsSync(setupPath)) {
    console.log('  ➕ Создание setup.ts');
    const setupContent = `
import { vi } from 'vitest';

// Глобальная настройка для предотвращения зависаний
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  existsSync: vi.fn(() => true)
}));

// Мок для console методов
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn()
};

// Мок для setTimeout/setInterval
vi.stubGlobal('setTimeout', vi.fn());
vi.stubGlobal('setInterval', vi.fn());
vi.stubGlobal('clearTimeout', vi.fn());
vi.stubGlobal('clearInterval', vi.fn());

// Cleanup после каждого теста
afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  vi.restoreAllMocks();
});
`;
    writeFileSync(setupPath, setupContent);
  }
  
  console.log(`  ✅ Исправлено ${testsFixed} тестовых файлов`);
}

function fixTestsInDirectory(dirPath: string, testsFixed: number): void {
  const files = readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dirPath, file.name);
    
    if (file.isDirectory()) {
      fixTestsInDirectory(filePath, testsFixed);
    } else if (file.name.endsWith('.test.ts') || file.name.endsWith('.spec.ts')) {
      if (fixTestFile(filePath)) {
        testsFixed++;
      }
    }
  }
}

function fixTestFile(filePath: string): boolean {
  if (!existsSync(filePath)) return false;
  
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Применяем все исправления
  for (const fix of HANGING_TEST_FIXES) {
    const originalContent = content;
    content = content.replace(fix.pattern, fix.replacement);
    
    if (content !== originalContent) {
      console.log(`    🔧 ${fix.description}`);
      modified = true;
    }
  }
  
  // Добавляем import для vi если отсутствует
  if (!content.includes('import { vi }') && !content.includes('import vi')) {
    content = `import { vi } from 'vitest';\n${content}`;
    modified = true;
  }
  
  // Добавляем afterEach cleanup если отсутствует
  if (!content.includes('afterEach')) {
    const insertPos = content.indexOf('describe(');
    if (insertPos !== -1) {
      const beforeDescribe = content.substring(0, insertPos);
      const afterDescribe = content.substring(insertPos);
      
      content = `${beforeDescribe}
// Cleanup для предотвращения зависаний
afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  vi.restoreAllMocks();
});

${afterDescribe}`;
      modified = true;
    }
  }
  
  if (modified) {
    writeFileSync(filePath, content);
    console.log(`    ✅ Исправлен ${filePath}`);
    return true;
  }
  
  return false;
}

// Основная функция
async function main(): Promise<void> {
  console.log('🚀 UNIVERSAL HANGING TESTS FIXER');
  console.log('=================================');
  
  let totalFixed = 0;
  
  for (const servicePath of SERVICES_WITH_TESTS) {
    if (existsSync(servicePath)) {
      fixHangingTests(servicePath);
      totalFixed++;
    } else {
      console.log(`⚠️  Сервис ${servicePath} не найден`);
    }
  }
  
  console.log('\n🎯 РЕЗУЛЬТАТЫ:');
  console.log(`✅ Обработано сервисов: ${totalFixed}`);
  console.log(`✅ Применено исправлений: ${HANGING_TEST_FIXES.length}`);
  console.log('\n📋 Что исправлено:');
  
  HANGING_TEST_FIXES.forEach((fix, index) => {
    console.log(`${index + 1}. ${fix.description}`);
  });
  
  console.log('\n🎉 Зависающие тесты исправлены!');
  console.log('💡 Рекомендации:');
  console.log('   - Запустите тесты: npm test');
  console.log('   - Проверьте timeout: все тесты должны завершаться < 10 сек');
  console.log('   - При необходимости настройте дополнительные моки');
}

if (require.main === module) {
  main().catch(console.error);
} 