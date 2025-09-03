#!/usr/bin/env ts-node

/**
 * Скрипт для быстрого исправления простых TypeScript ошибок
 * Исправляет:
 * - Отсутствующие типы для параметров функций
 * - Простые импорты
 * - Базовые типы any
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface FixResult {
  file: string;
  fixes: number;
  errors: string[];
}

class TypeScriptQuickFixer {
  private fixes: FixResult[] = [];

  async fixAll(): Promise<void> {
    console.log('🔧 Начинаем быстрое исправление TypeScript ошибок...\n');

    // Находим все TypeScript файлы
    const files = await glob('src/**/*.{ts,tsx}', {
      ignore: ['**/*.d.ts', '**/node_modules/**', '**/dist/**'],
    });

    console.log(`📁 Найдено ${files.length} TypeScript файлов\n`);

    for (const file of files) {
      await this.fixFile(file);
    }

    this.printResults();
  }

  private async fixFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;
      let fixedContent = content;
      let fixes = 0;

      // Исправление 1: Добавление типов для параметров функций
      fixedContent = this.fixFunctionParameters(fixedContent);
      if (fixedContent !== content) {
        fixes += (content.match(/\(\s*\{\s*[^}]*\}\s*\)\s*=>/g) || []).length;
        content = fixedContent;
      }

      // Исправление 2: Исправление простых any типов
      fixedContent = this.fixAnyTypes(fixedContent);
      if (fixedContent !== content) {
        fixes += (content.match(/:\s*any/g) || []).length;
        content = fixedContent;
      }

      // Исправление 3: Добавление типов для React компонентов
      fixedContent = this.fixReactComponentTypes(fixedContent);
      if (fixedContent !== content) {
        fixes += (content.match(/React\.FC/g) || []).length;
        content = fixedContent;
      }

      if (fixedContent !== originalContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf-8');
        this.fixes.push({
          file: filePath,
          fixes: fixes,
          errors: [],
        });
        console.log(`✅ ${filePath} - исправлено ${fixes} ошибок`);
      }
    } catch (error) {
      this.fixes.push({
        file: filePath,
        fixes: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
      console.log(`❌ ${filePath} - ошибка: ${error}`);
    }
  }

  private fixFunctionParameters(content: string): string {
    // Исправляем функции с деструктуризацией без типов
    return content.replace(/const\s+(\w+)\s*=\s*\(\s*\{\s*([^}]+)\s*\}\s*\)\s*=>/g, (match, funcName, params) => {
      // Извлекаем имена параметров
      const paramNames = params.split(',').map((p: string) => p.trim().split(':')[0].trim());

      // Создаем типы (по умолчанию string)
      const types = paramNames.map((name: string) => `${name}: string`).join('; ');

      return `const ${funcName} = ({ ${types} }: { ${types} }) =>`;
    });
  }

  private fixAnyTypes(content: string): string {
    // Заменяем простые any типы на более конкретные
    return content
      .replace(/:\s*any\b/g, ': unknown')
      .replace(/Array<any>/g, 'Array<unknown>')
      .replace(/Record<string,\s*any>/g, 'Record<string, unknown>');
  }

  private fixReactComponentTypes(content: string): string {
    // Добавляем типы для React компонентов
    return content.replace(/const\s+(\w+)\s*=\s*\(\s*\)\s*=>/g, 'const $1 = (): JSX.Element =>');
  }

  private printResults(): void {
    console.log('\n📊 Результаты исправления:');
    console.log('='.repeat(50));

    const totalFiles = this.fixes.length;
    const totalFixes = this.fixes.reduce((sum, fix) => sum + fix.fixes, 0);
    const filesWithErrors = this.fixes.filter((fix) => fix.errors.length > 0).length;

    console.log(`📁 Обработано файлов: ${totalFiles}`);
    console.log(`🔧 Всего исправлений: ${totalFixes}`);
    console.log(`❌ Файлов с ошибками: ${filesWithErrors}`);

    if (filesWithErrors > 0) {
      console.log('\n❌ Файлы с ошибками:');
      this.fixes
        .filter((fix) => fix.errors.length > 0)
        .forEach((fix) => {
          console.log(`  - ${fix.file}: ${fix.errors.join(', ')}`);
        });
    }

    console.log('\n✅ Быстрое исправление TypeScript завершено!');
    console.log('💡 Для более сложных исправлений используйте PLAN mode');
  }
}

// Запуск скрипта
if (require.main === module) {
  const fixer = new TypeScriptQuickFixer();
  fixer.fixAll().catch(console.error);
}

export default TypeScriptQuickFixer;
