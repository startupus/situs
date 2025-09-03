import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const testFiles = glob.sync('src/api/__tests__/**/*.test.ts');

testFiles.forEach((file) => {
  let content = readFileSync(file, 'utf-8');

  // Заменяем jest на vi
  content = content.replace(/jest\./g, 'vi.');
  content = content.replace(/jest\.Mocked</g, 'any');
  content = content.replace(/jest\.fn\(\)/g, 'vi.fn()');
  content = content.replace(/jest\.mock\(/g, 'vi.mock(');
  content = content.replace(/jest\.clearAllMocks\(\)/g, 'vi.clearAllMocks()');
  content = content.replace(/jest\.restoreAllMocks\(\)/g, 'vi.restoreAllMocks()');

  // Обновляем типы
  content = content.replace(/jest\.Mocked<[^>]+>/g, 'any');

  writeFileSync(file, content);
  console.log(`Updated: ${file}`);
});

console.log('All test files updated for Vitest!');
