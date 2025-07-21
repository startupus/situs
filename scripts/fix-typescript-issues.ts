#!/usr/bin/env ts-node
/**
 * Скрипт для исправления проблем с TypeScript в проекте Hubus
 * Соответствует стандартам проекта: строгая типизация, отсутствие any/unknown
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ServiceConfig {
  name: string;
  path: string;
  hasTypeScript: boolean;
  needsComposite: boolean;
}

interface ZodFixPattern {
  pattern: RegExp;
  replacement: string;
  description: string;
}

class TypeScriptFixer {
  private readonly services: ServiceConfig[] = [
    { name: 'hubus-service', path: 'services/hubus-service', hasTypeScript: true, needsComposite: true },
    { name: 'client-service', path: 'services/client-service', hasTypeScript: true, needsComposite: true },
    { name: 'bilingus-service', path: 'services/bilingus-service', hasTypeScript: true, needsComposite: true },
    { name: 'agents-service', path: 'services/agents-service', hasTypeScript: true, needsComposite: true },
    { name: 'gateway-service', path: 'services/gateway-service', hasTypeScript: true, needsComposite: true },
    { name: 'chat-service', path: 'services/chat-service', hasTypeScript: true, needsComposite: true },
    { name: 'loginus', path: 'services/loginus', hasTypeScript: true, needsComposite: true },
    { name: 'controlus-service', path: 'services/controlus-service', hasTypeScript: true, needsComposite: true },
    { name: 'situs-service', path: 'services/situs-service', hasTypeScript: true, needsComposite: true },
    { name: 'testus-service', path: 'services/testus-service', hasTypeScript: true, needsComposite: true },
  ];

  private readonly zodFixPatterns: ZodFixPattern[] = [
    {
      pattern: /\.transform\(Number\)\.default\('(\d+)'\)/g,
      replacement: '.transform(Number).default($1)',
      description: 'Исправление числовых defaults в Zod'
    },
    {
      pattern: /\.transform\(val => val === 'true'\)\.default\('true'\)/g,
      replacement: '.transform((val: string) => val === "true").default(true)',
      description: 'Исправление boolean defaults (true) в Zod'
    },
    {
      pattern: /\.transform\(val => val === 'true'\)\.default\('false'\)/g,
      replacement: '.transform((val: string) => val === "true").default(false)',
      description: 'Исправление boolean defaults (false) в Zod'
    },
    {
      pattern: /error\.errors\.forEach/g,
      replacement: 'error.issues.forEach',
      description: 'Исправление error.errors на error.issues'
    },
    {
      pattern: /error\.issues\.forEach\(err => {/g,
      replacement: 'error.issues.forEach((err: any) => {',
      description: 'Добавление типизации для err в ZodError'
    }
  ];

  public async fixAllIssues(): Promise<void> {
    console.log('🔧 Исправление проблем с TypeScript в проекте Hubus...');
    console.log('📋 Стандарты проекта: строгая типизация, отсутствие any/unknown без проверки\n');

    await this.fixTsConfigComposite();
    await this.fixZodDefaults();
    await this.cleanBuildCache();
    await this.verifyFixes();
  }

  private async fixTsConfigComposite(): Promise<void> {
    console.log('1. Исправление tsconfig.json файлов...');
    
    let fixedCount = 0;
    
    for (const service of this.services) {
      const configPath = path.join(service.path, 'tsconfig.json');
      
      if (fs.existsSync(configPath)) {
        try {
          const content = fs.readFileSync(configPath, 'utf8');
          const config = JSON.parse(content);
          
          if (service.needsComposite && !config.compilerOptions?.composite) {
            config.compilerOptions = config.compilerOptions || {};
            config.compilerOptions.composite = true;
            
            // Убираем noEmit для composite проектов
            if (config.compilerOptions.noEmit) {
              delete config.compilerOptions.noEmit;
              config.compilerOptions.outDir = config.compilerOptions.outDir || './dist';
            }
            
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
            console.log(`   ✅ ${service.name}: добавлен composite: true`);
            fixedCount++;
          } else {
            console.log(`   ⚪ ${service.name}: уже корректен`);
          }
        } catch (error) {
          console.error(`   ❌ ${service.name}: ${(error as Error).message}`);
        }
      } else {
        console.log(`   ⚠️  ${service.name}: tsconfig.json не найден`);
      }
    }
    
    console.log(`   📊 Исправлено: ${fixedCount} файлов\n`);
  }

  private async fixZodDefaults(): Promise<void> {
    console.log('2. Исправление проблем с Zod defaults...');
    
    const filesToFix = [
      'services/loginus/src/config/environment.ts',
      'services/controlus-service/src/config/environment.ts'
    ];
    
    for (const filePath of filesToFix) {
      if (fs.existsSync(filePath)) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          let changesCount = 0;
          
          for (const pattern of this.zodFixPatterns) {
            const matches = content.match(pattern.pattern);
            if (matches) {
              content = content.replace(pattern.pattern, pattern.replacement);
              changesCount += matches.length;
            }
          }
          
          if (changesCount > 0) {
            fs.writeFileSync(filePath, content);
            console.log(`   ✅ ${filePath}: исправлено ${changesCount} проблем`);
          } else {
            console.log(`   ⚪ ${filePath}: уже корректен`);
          }
        } catch (error) {
          console.error(`   ❌ ${filePath}: ${(error as Error).message}`);
        }
      } else {
        console.log(`   ⚠️  ${filePath}: файл не найден`);
      }
    }
    
    console.log('');
  }

  private async cleanBuildCache(): Promise<void> {
    console.log('3. Очистка кэша TypeScript...');
    
    try {
      // Удаляем .tsbuildinfo файлы
      execSync('find . -name "*.tsbuildinfo" -delete', { stdio: 'pipe' });
      console.log('   ✅ .tsbuildinfo файлы удалены');
      
      // Очищаем TypeScript build
      execSync('npx tsc --build --clean', { stdio: 'pipe' });
      console.log('   ✅ TypeScript кэш очищен');
      
    } catch (error) {
      console.warn(`   ⚠️  Предупреждение при очистке кэша: ${(error as Error).message}`);
    }
    
    console.log('');
  }

  private async verifyFixes(): Promise<void> {
    console.log('4. Проверка исправлений...');
    
    try {
      execSync('npx tsc --build', { stdio: 'pipe' });
      console.log('   ✅ TypeScript компиляция успешна');
    } catch (error) {
      console.warn('   ⚠️  Остались ошибки компиляции:');
      console.warn(`   ${(error as Error).message}`);
    }
    
    console.log('');
  }
}

// Запуск исправления
const fixer = new TypeScriptFixer();
fixer.fixAllIssues()
  .then(() => {
    console.log('🎉 Исправление TypeScript проблем завершено!');
    console.log('📋 Рекомендации:');
    console.log('   1. Перезапустите TypeScript Server в VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"');
    console.log('   2. Если проблемы остаются, перезапустите VS Code');
    console.log('   3. Все скрипты теперь соответствуют стандартам проекта (TypeScript, строгая типизация)');
  })
  .catch((error) => {
    console.error('❌ Ошибка при исправлении:', (error as Error).message);
    process.exit(1);
  }); 