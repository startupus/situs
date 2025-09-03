#!/usr/bin/env node

/**
 * Скрипт для автоматического исправления ошибок markdown
 * JavaScript версия для совместимости с документацией
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Конфигурация
const config = {
  markdownFiles: ['**/*.md', '!node_modules/**', '!dist/**', '!coverage/**', '!.git/**'],
  maxLineLength: 120,
  fixMode: true,
};

/**
 * Находит все .md файлы в проекте
 */
async function findMarkdownFiles() {
  const files = [];

  for (const pattern of config.markdownFiles) {
    const found = await glob(pattern, {
      ignore: ['node_modules/**', 'dist/**', 'coverage/**', '.git/**'],
      absolute: true,
    });
    files.push(...found);
  }

  return [...new Set(files)]; // Убираем дубликаты
}

/**
 * Исправляет ошибки в markdown файле
 */
function fixMarkdownFile(filePath) {
  try {
    console.log(`🔧 Исправляю: ${path.relative(process.cwd(), filePath)}`);

    // Читаем файл
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Исправляем типичные ошибки
    content = fixCommonIssues(content);

    // Записываем исправленный контент
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Исправлен: ${path.relative(process.cwd(), filePath)}`);
      return true;
    } else {
      console.log(`ℹ️  Без изменений: ${path.relative(process.cwd(), filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Ошибка при исправлении ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Исправляет типичные ошибки markdown
 */
function fixCommonIssues(content) {
  // Убираем лишние пробелы в конце строк
  content = content.replace(/[ \t]+$/gm, '');

  // --- MD022: Пустые строки вокруг заголовков ---
  // Добавляем пустую строку перед каждым заголовком, если её нет
  content = content.replace(/([^\n])\n(#+ )/g, '$1\n\n$2');
  // Добавляем пустую строку после каждого заголовка, если её нет
  content = content.replace(/(#+ .+)(?!\n\n)(\n[^#\n])/g, '$1\n\n$2');

  // --- MD029: Сброс нумерации списков после кода ---
  // После блока кода сбрасываем нумерацию списков на 1.
  content = content.replace(/(```[\s\S]*?```)(\s*\n)(\d+\. )/g, '$1$2' + '1. ');
  // После других блоков (таблицы, цитаты, списки) — тоже сбрасываем
  content = content.replace(/(\n\n[-*+] .+\n)(\d+\. )/g, '$1' + '1. ');

  // --- MD034: Оборачиваем bare URLs в < > ---
  content = content.replace(/(^|\s)(https?:\/\/[^\s<>()]+)(?=\s|$)/gm, '$1<$2>');

  // --- MD038: Убираем пробелы внутри inline-кода ---
  content = content.replace(/` +([^`]+?) +`/g, '`$1`');

  // Исправляем заголовки без пробела после #
  content = content.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');

  // Исправляем списки без пробела после маркера
  content = content.replace(/^([*+-])([^\s])/gm, '$1 $2');
  content = content.replace(/^(\d+\.)([^\s])/gm, '$1 $2');

  // Убираем лишние пустые строки
  content = content.replace(/\n{3,}/g, '\n\n');

  // Убираем лишние пробелы в начале строк
  content = content.replace(/^[ \t]+$/gm, '');

  // Исправляем длинные строки
  content = fixLongLines(content);

  return content;
}

/**
 * Разбивает длинные строки
 */
function fixLongLines(content) {
  const lines = content.split('\n');
  const fixedLines = [];

  for (let line of lines) {
    if (line.length > config.maxLineLength && !line.startsWith('```') && !line.startsWith('#')) {
      // Разбиваем длинные строки на несколько
      const words = line.split(' ');
      let currentLine = '';
      const newLines = [];

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
 * Основная функция
 */
async function main() {
  console.log('🚀 Запуск автоматического исправления markdown файлов...\n');

  try {
    // Находим все .md файлы
    const files = await findMarkdownFiles();
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
    } else {
      console.log('\nℹ️  Все файлы уже в порядке');
    }
  } catch (error) {
    console.error('❌ Ошибка при выполнении скрипта:', error.message);
    process.exit(1);
  }
}

// Запускаем скрипт только если он вызван напрямую
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  findMarkdownFiles,
  fixMarkdownFile,
  fixCommonIssues,
  fixLongLines,
};
