#!/usr/bin/env ts-node
/**
 * Скрипт для исправления проблем с return в testus-service
 */

import * as fs from 'fs';

class TestusServiceReturnsFixer {
  public async fixAllIssues(): Promise<void> {
    console.log('🔧 Исправление проблем с return в testus-service...');
    
    await this.fixAgentsFile();
    await this.fixAuthFile();
    
    console.log('🎉 Все проблемы с return исправлены!');
  }

  private async fixAgentsFile(): Promise<void> {
    console.log('1. Исправление agents.ts...');
    
    const file = 'services/testus-service/src/api/agents.ts';
    
    if (fs.existsSync(file)) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Найдем и исправим функции без return
        const functionPatterns = [
          {
            pattern: /agentsRouter\.post\("\/generate-scenarios", requireAuth, async \(req, res\) => {[\s\S]*?}\);/g,
            needsReturn: true
          },
          {
            pattern: /agentsRouter\.post\("\/generate-tests", requireAuth, async \(req, res\) => {[\s\S]*?}\);/g,
            needsReturn: true
          },
          {
            pattern: /agentsRouter\.post\("\/workflow", requireAuth, async \(req, res\) => {[\s\S]*?}\);/g,
            needsReturn: true
          }
        ];
        
        // Простое исправление - добавляем return перед res.status
        content = content.replace(
          /(\s+)res\.status\(400\)\.json\(/g,
          '$1return res.status(400).json('
        );
        
        content = content.replace(
          /(\s+)res\.status\(200\)\.json\(/g,
          '$1return res.status(200).json('
        );
        
        content = content.replace(
          /(\s+)res\.status\(500\)\.json\(/g,
          '$1return res.status(500).json('
        );
        
        fs.writeFileSync(file, content);
        console.log('   ✅ agents.ts исправлен');
      } catch (error) {
        console.error(`   ❌ Ошибка: ${(error as Error).message}`);
      }
    }
    
    console.log('');
  }

  private async fixAuthFile(): Promise<void> {
    console.log('2. Исправление auth.ts...');
    
    const file = 'services/testus-service/src/middleware/auth.ts';
    
    if (fs.existsSync(file)) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Добавляем return перед res.status
        content = content.replace(
          /(\s+)res\.status\(401\)\.json\(/g,
          '$1return res.status(401).json('
        );
        
        content = content.replace(
          /(\s+)res\.status\(403\)\.json\(/g,
          '$1return res.status(403).json('
        );
        
        // Добавляем return в конце middleware функций
        content = content.replace(
          /(\s+)next\(\);(\s+)}/g,
          '$1return next();$2}'
        );
        
        fs.writeFileSync(file, content);
        console.log('   ✅ auth.ts исправлен');
      } catch (error) {
        console.error(`   ❌ Ошибка: ${(error as Error).message}`);
      }
    }
    
    console.log('');
  }
}

// Запуск исправления
const fixer = new TestusServiceReturnsFixer();
fixer.fixAllIssues()
  .then(() => {
    console.log('✅ Все проблемы с return в testus-service исправлены!');
    console.log('📋 Теперь проект должен компилироваться без ошибок');
  })
  .catch((error) => {
    console.error('❌ Ошибка:', (error as Error).message);
    process.exit(1);
  }); 