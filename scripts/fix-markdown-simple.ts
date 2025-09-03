#!/usr/bin/env node

/**
 * Простой скрипт для автоматического исправления ошибок markdown
 * Работает без внешних зависимостей
 */

import * as fs from 'fs';
import * as path from 'path';

// Конфигурация
interface Config {
  maxLineLength: number;
  ignorePatterns: string[];
}

const config: Config = {
  maxLineLength: 120,
  ignorePatterns: ['node_modules', 'dist', 'coverage', '.git', 'vendor'],
};

/**
 * Рекурсивно находит все .md файлы
 */
function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    // Пропускаем игнорируемые папки
    if (stat.isDirectory()) {
      if (!config.ignorePatterns.some((pattern) => item.includes(pattern))) {
        findMarkdownFiles(fullPath, files);
      }
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Исправляет типичные ошибки markdown
 */
function fixMarkdownContent(content: string): string {
  let fixed = content;

  // 1. Убираем лишние пробелы в конце строк
  fixed = fixed.replace(/[ \t]+$/gm, '');

  // 2. Исправляем нумерацию списков после блоков кода
  fixed = fixed.replace(/(```[\s\S]*?```)\s*\n(\d+\.)/g, '$1\n\n$2');

  // 3. Убираем лишние пустые строки (больше 2 подряд)
  fixed = fixed.replace(/\n{3,}/g, '\n\n');

  // 4. Исправляем заголовки без пробела после #
  fixed = fixed.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');

  // 5. Исправляем списки без пробела после маркера
  fixed = fixed.replace(/^([*+-])([^\s])/gm, '$1 $2');
  fixed = fixed.replace(/^(\d+\.)([^\s])/gm, '$1 $2');

  // 6. Убираем лишние пробелы в начале пустых строк
  fixed = fixed.replace(/^[ \t]+$/gm, '');

  // 7. Исправляем MD022 - пустые строки вокруг заголовков
  fixed = fixHeadingsSpacing(fixed);

  // 8. Исправляем MD004 - стиль неупорядоченных списков (заменяем * на -)
  fixed = fixed.replace(/^(\s*)\*(\s)/gm, '$1-$2');

  // 9. Исправляем MD026 - знаки препинания в заголовках
  fixed = fixHeadingPunctuation(fixed);

  // 10. Исправляем MD034 - голые URL
  fixed = fixBareUrls(fixed);

  // 11. Исправляем длинные строки
  fixed = fixLongLines(fixed);

  // 12. Исправляем MD029 (нумерация списков)
  fixed = fixListNumbering(fixed);

  // 13. Исправляем MD025 (один H1 на файл)
  fixed = fixMultipleH1(fixed);

  // 14. Исправляем MD012 (лишние пустые строки)
  fixed = fixMultipleBlankLines(fixed);

  return fixed;
}

/**
 * Исправляет знаки препинания в заголовках (MD026)
 */
function fixHeadingPunctuation(content: string): string {
  const lines = content.split('\n');
  const fixedLines: string[] = [];

  for (let line of lines) {
    // Проверяем, является ли строка заголовком
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1];
      let title = headingMatch[2];

      // Убираем знаки препинания в конце заголовка (кроме ! и ?)
      title = title.replace(/[.,;:]$/, '');

      // Собираем заголовок обратно
      line = `${level} ${title}`;
    }

    fixedLines.push(line);
  }

  return fixedLines.join('\n');
}

/**
 * Исправляет голые URL (MD034)
 */
function fixBareUrls(content: string): string {
  // Находим голые URL и оборачиваем их в угловые скобки
  // Исключаем URL внутри кода и ссылок
  const lines = content.split('\n');
  const fixedLines: string[] = [];

  for (let line of lines) {
    // Пропускаем строки с кодом
    if (line.startsWith('```') || line.startsWith('    ') || line.startsWith('\t')) {
      fixedLines.push(line);
      continue;
    }

    // Находим голые URL (http/https) и оборачиваем в угловые скобки
    line = line.replace(/(?<!<|\[)(https?:\/\/[^\s<>\[\]]+)(?!>|\])/g, '<$1>');

    fixedLines.push(line);
  }

  return fixedLines.join('\n');
}

/**
 * Исправляет пустые строки вокруг заголовков (MD022)
 */
function fixHeadingsSpacing(content: string): string {
  const lines = content.split('\n');
  const fixedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeading = line.match(/^#{1,6}\s/);

    if (isHeading) {
      // Добавляем пустую строку перед заголовком (если это не первый элемент)
      if (i > 0 && lines[i - 1].trim() !== '') {
        fixedLines.push('');
      }

      fixedLines.push(line);

      // Добавляем пустую строку после заголовка (если это не последний элемент)
      if (i < lines.length - 1 && lines[i + 1].trim() !== '') {
        fixedLines.push('');
      }
    } else {
      fixedLines.push(line);
    }
  }

  return fixedLines.join('\n');
}

/**
 * Разбивает длинные строки
 */
function fixLongLines(content: string): string {
  const lines = content.split('\n');
  const fixedLines: string[] = [];

  for (let line of lines) {
    if (
      line.length > config.maxLineLength &&
      !line.startsWith('```') &&
      !line.startsWith('#') &&
      !line.startsWith('|') &&
      !line.match(/^[*-+]\s/)
    ) {
      // Разбиваем длинные строки на несколько
      const words = line.split(' ');
      let currentLine = '';
      const newLines: string[] = [];

      for (const word of words) {
        if ((currentLine + word).length > config.maxLineLength) {
          if (currentLine) {
            newLines.push(currentLine.trim());
            currentLine = word;
          } else {
            newLines.push(word);
          }
        } else {
          currentLine += (currentLine ? ' ' : '') + word;
        }
      }

      if (currentLine) {
        newLines.push(currentLine.trim());
      }

      fixedLines.push(...newLines);
    } else {
      fixedLines.push(line);
    }
  }

  return fixedLines.join('\n');
}

/**
 * Исправляет нумерацию списков (MD029)
 */
function fixListNumbering(content: string): string {
  const lines = content.split('\n');
  const fixedLines: string[] = [];
  let listCounter = 1;
  let inList = false;
  let listIndent = 0;

  for (let line of lines) {
    const listMatch = line.match(/^(\s*)(\d+)\.\s/);

    if (listMatch) {
      const indent = listMatch[1];
      const currentIndent = indent.length;

      // Если это новый список или изменился отступ
      if (!inList || currentIndent !== listIndent) {
        inList = true;
        listCounter = 1;
        listIndent = currentIndent;
      }

      // Заменяем номер на правильный
      line = line.replace(/^(\s*)\d+\./, `${indent}${listCounter}.`);
      listCounter++;
    } else {
      // Если строка не является списком, сбрасываем счетчик
      if (inList && line.trim() !== '' && !line.match(/^\s*[-*+]\s/)) {
        inList = false;
      }
    }

    fixedLines.push(line);
  }

  return fixedLines.join('\n');
}

/**
 * Исправляет множественные H1 (MD025)
 */
function fixMultipleH1(content: string): string {
  const lines = content.split('\n');
  const fixedLines: string[] = [];
  let h1Count = 0;

  for (let line of lines) {
    if (line.match(/^#\s/)) {
      h1Count++;
      if (h1Count > 1) {
        // Заменяем дополнительные H1 на H2
        line = line.replace(/^#\s/, '## ');
      }
    }
    fixedLines.push(line);
  }

  return fixedLines.join('\n');
}

/**
 * Исправляет множественные пустые строки (MD012)
 */
function fixMultipleBlankLines(content: string): string {
  // Убираем больше одной пустой строки подряд
  return content.replace(/\n{3,}/g, '\n\n');
}

/**
 * Исправляет markdown файл
 */
function fixMarkdownFile(filePath: string): boolean {
  try {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`🔧 Проверяю: ${relativePath}`);

    // Читаем файл
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Исправляем ошибки
    const fixedContent = fixMarkdownContent(content);

    // Записываем исправленный контент
    if (fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Исправлен: ${relativePath}`);
      return true;
    } else {
      console.log(`ℹ️  Без изменений: ${relativePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, (error as Error).message);
    return false;
  }
}

/**
 * Основная функция
 */
function main(): void {
  console.log('🚀 Запуск автоматического исправления markdown файлов...\n');

  try {
    // Находим все .md файлы
    const files = findMarkdownFiles(process.cwd());
    console.log(`📁 Найдено ${files.length} markdown файлов\n`);

    if (files.length === 0) {
      console.log('ℹ️  Markdown файлы не найдены');
      return;
    }

    // Исправляем каждый файл
    let fixedCount = 0;
    for (const file of files) {
      if (fixMarkdownFile(file)) {
        fixedCount++;
      }
    }

    console.log(`\n📊 Результат:`);
    console.log(`   Всего файлов: ${files.length}`);
    console.log(`   Исправлено: ${fixedCount}`);
    console.log(`   Без изменений: ${files.length - fixedCount}`);

    if (fixedCount > 0) {
      console.log('\n✅ Автоматическое исправление завершено успешно!');
      console.log('\n💡 Для проверки ошибок используйте:');
      console.log('   npm run lint:markdown');
    } else {
      console.log('\nℹ️  Все файлы уже в порядке');
    }
  } catch (error) {
    console.error('❌ Ошибка при выполнении скрипта:', (error as Error).message);
    process.exit(1);
  }
}

// Запускаем скрипт
if (require.main === module) {
  main();
}

export { findMarkdownFiles, fixMarkdownContent, fixMarkdownFile };
