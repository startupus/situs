#!/usr/bin/env ts-node
/**
 * Скрипт для исправления проблем в testus-service
 * Исправляет устаревший API Faker.js и TypeScript ошибки
 */

import * as fs from 'fs';
import * as path from 'path';

interface FakerFix {
  pattern: RegExp;
  replacement: string;
  description: string;
}

class TestusServiceFixer {
  private readonly fakerFixes: FakerFix[] = [
    {
      pattern: /faker\.locale = 'ru';/g,
      replacement: 'faker.setLocale("ru");',
      description: 'Обновление API локали Faker.js'
    },
    {
      pattern: /faker\.datatype\.uuid\(\)/g,
      replacement: 'faker.string.uuid()',
      description: 'Обновление API uuid в Faker.js'
    },
    {
      pattern: /faker\.random\.words\((\d+)\)/g,
      replacement: 'faker.lorem.words($1)',
      description: 'Обновление API words в Faker.js'
    },
    {
      pattern: /faker\.datatype\.float\(([^)]+)\)/g,
      replacement: 'faker.number.float($1)',
      description: 'Обновление API float в Faker.js'
    },
    {
      pattern: /faker\.datatype\.number\(([^)]+)\)/g,
      replacement: 'faker.number.int($1)',
      description: 'Обновление API number в Faker.js'
    }
  ];

  private readonly typeScriptFixes: Array<{
    file: string;
    fixes: Array<{ pattern: RegExp; replacement: string; description: string }>;
  }> = [
    {
      file: 'services/testus-service/src/api/agents.ts',
      fixes: [
        {
          pattern: /agentsRouter\.post\('\/generate-scenarios', requireAuth, async \(req, res\) => {/g,
          replacement: 'agentsRouter.post("/generate-scenarios", requireAuth, async (req, res): Promise<void> => {',
          description: 'Добавление Promise<void> return type'
        },
        {
          pattern: /agentsRouter\.post\('\/generate-tests', requireAuth, async \(req, res\) => {/g,
          replacement: 'agentsRouter.post("/generate-tests", requireAuth, async (req, res): Promise<void> => {',
          description: 'Добавление Promise<void> return type'
        },
        {
          pattern: /agentsRouter\.get\('\/status', requireAuth, \(req, res\) => {/g,
          replacement: 'agentsRouter.get("/status", requireAuth, (_req, res) => {',
          description: 'Переименование неиспользуемого параметра'
        },
        {
          pattern: /agentsRouter\.get\('\/metrics', requireAuth, \(req, res\) => {/g,
          replacement: 'agentsRouter.get("/metrics", requireAuth, (_req, res) => {',
          description: 'Переименование неиспользуемого параметра'
        },
        {
          pattern: /agentsRouter\.post\('\/workflow', requireAuth, async \(req, res\) => {/g,
          replacement: 'agentsRouter.post("/workflow", requireAuth, async (req, res): Promise<void> => {',
          description: 'Добавление Promise<void> return type'
        },
        {
          pattern: /agentsRouter\.get\('\/capabilities', requireAuth, \(req, res\) => {/g,
          replacement: 'agentsRouter.get("/capabilities", requireAuth, (_req, res) => {',
          description: 'Переименование неиспользуемого параметра'
        }
      ]
    },
    {
      file: 'services/testus-service/src/api/auth.ts',
      fixes: [
        {
          pattern: /import { requireAuth, requireRole, requireScope } from/g,
          replacement: 'import { requireAuth, requireRole } from',
          description: 'Удаление неиспользуемого импорта requireScope'
        },
        {
          pattern: /import { requestLogger } from/g,
          replacement: '// import { requestLogger } from',
          description: 'Комментирование неиспользуемого импорта'
        },
        {
          pattern: /authRouter\.post\('\/refresh', requireAuth, \(req, res\) => {/g,
          replacement: 'authRouter.post("/refresh", requireAuth, (_req, res) => {',
          description: 'Переименование неиспользуемого параметра'
        }
      ]
    },
    {
      file: 'services/testus-service/src/middleware/auth.ts',
      fixes: [
        {
          pattern: /import { config } from/g,
          replacement: '// import { config } from',
          description: 'Комментирование неиспользуемого импорта'
        },
        {
          pattern: /return parts\[1\];/g,
          replacement: 'return parts[1] || null;',
          description: 'Исправление типа возвращаемого значения'
        },
        {
          pattern: /export const requireAuth = async \(req: Request, res: Response, next: NextFunction\) => {/g,
          replacement: 'export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {',
          description: 'Добавление Promise<void> return type'
        },
        {
          pattern: /return \(req: Request, res: Response, next: NextFunction\) => {/g,
          replacement: 'return (req: Request, res: Response, next: NextFunction): void => {',
          description: 'Добавление void return type'
        }
      ]
    },
    {
      file: 'services/testus-service/src/middleware/methodNotAllowed.ts',
      fixes: [
        {
          pattern: /return \(req: Request, res: Response, next: NextFunction\) => {/g,
          replacement: 'return (req: Request, res: Response, _next: NextFunction) => {',
          description: 'Переименование неиспользуемого параметра'
        }
      ]
    },
    {
      file: 'services/testus-service/src/testFactory.ts',
      fixes: [
        {
          pattern: /export async function createTestApp\(options: { isTest\?: boolean } = {}\) {/g,
          replacement: 'export async function createTestApp(_options: { isTest?: boolean } = {}) {',
          description: 'Переименование неиспользуемого параметра'
        }
      ]
    }
  ];

  public async fixAllIssues(): Promise<void> {
    console.log('🔧 Исправление проблем в testus-service...');
    
    await this.fixFakerApi();
    await this.fixTypeScriptErrors();
    
    console.log('🎉 Исправление testus-service завершено!');
  }

  private async fixFakerApi(): Promise<void> {
    console.log('1. Исправление устаревшего API Faker.js...');
    
    const testDataFile = 'services/testus-service/src/__tests__/fixtures/testData.ts';
    
    if (fs.existsSync(testDataFile)) {
      try {
        let content = fs.readFileSync(testDataFile, 'utf8');
        let changesCount = 0;
        
        for (const fix of this.fakerFixes) {
          const matches = content.match(fix.pattern);
          if (matches) {
            content = content.replace(fix.pattern, fix.replacement);
            changesCount += matches.length;
            console.log(`   ✅ ${fix.description}: ${matches.length} исправлений`);
          }
        }
        
        if (changesCount > 0) {
          fs.writeFileSync(testDataFile, content);
          console.log(`   📊 Всего исправлено: ${changesCount} проблем в Faker.js\n`);
        } else {
          console.log('   ⚪ Faker.js API уже актуален\n');
        }
      } catch (error) {
        console.error(`   ❌ Ошибка при исправлении Faker.js: ${(error as Error).message}\n`);
      }
    } else {
      console.log('   ⚠️  Файл testData.ts не найден\n');
    }
  }

  private async fixTypeScriptErrors(): Promise<void> {
    console.log('2. Исправление TypeScript ошибок...');
    
    for (const fileFix of this.typeScriptFixes) {
      if (fs.existsSync(fileFix.file)) {
        try {
          let content = fs.readFileSync(fileFix.file, 'utf8');
          let changesCount = 0;
          
          for (const fix of fileFix.fixes) {
            const matches = content.match(fix.pattern);
            if (matches) {
              content = content.replace(fix.pattern, fix.replacement);
              changesCount += matches.length;
            }
          }
          
          if (changesCount > 0) {
            fs.writeFileSync(fileFix.file, content);
            console.log(`   ✅ ${path.basename(fileFix.file)}: ${changesCount} исправлений`);
          } else {
            console.log(`   ⚪ ${path.basename(fileFix.file)}: уже корректен`);
          }
        } catch (error) {
          console.error(`   ❌ ${path.basename(fileFix.file)}: ${(error as Error).message}`);
        }
      } else {
        console.log(`   ⚠️  ${path.basename(fileFix.file)}: файл не найден`);
      }
    }
    
    console.log('');
  }
}

// Запуск исправления
const fixer = new TestusServiceFixer();
fixer.fixAllIssues()
  .then(() => {
    console.log('✅ Все проблемы в testus-service исправлены!');
    console.log('📋 Рекомендации:');
    console.log('   1. Обновите Faker.js до последней версии: npm install @faker-js/faker@latest');
    console.log('   2. Проверьте компиляцию: npx tsc --build');
    console.log('   3. Запустите тесты: npm test');
  })
  .catch((error) => {
    console.error('❌ Ошибка при исправлении:', (error as Error).message);
    process.exit(1);
  }); 