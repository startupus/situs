#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

console.log('🔧 Исправление ошибок TypeScript...');

// Исправляем BillingService
const billingServicePath = 'services/client-service/src/services/BillingService.ts';
if (fs.existsSync(billingServicePath)) {
  let content = fs.readFileSync(billingServicePath, 'utf8');
  
  // Убираем timeout из fetch options
  content = content.replace(/\s+timeout: this\.timeout,?\n/g, '');
  content = content.replace(/\s+timeout: 5000,.*\n/g, '');
  
  // Исправляем типизацию data
  content = content.replace(/return data\.(\w+) \|\| data\.data/g, 'return (data as any).$1 || (data as any).data');
  content = content.replace(/return data\.(\w+) \|\|/g, 'return (data as any).$1 ||');
  content = content.replace(/errorData\.message/g, '(errorData as any).message');
  
  fs.writeFileSync(billingServicePath, content);
  console.log('✅ Исправлен BillingService.ts');
}

// Исправляем контроллеры TSOA
const controllers: string[] = [
  'services/client-service/src/controllers/BillingController.ts',
  'services/client-service/src/controllers/SubscriptionController.ts', 
  'services/client-service/src/controllers/TariffController.ts'
];

controllers.forEach((controllerPath: string) => {
  if (fs.existsSync(controllerPath)) {
    let content = fs.readFileSync(controllerPath, 'utf8');
    
    // Добавляем extends Controller
    if (!content.includes('extends Controller')) {
      content = content.replace(/export class (\w+Controller) {/, 'export class $1 extends Controller {');
    }
    
    fs.writeFileSync(controllerPath, content);
    console.log(`✅ Исправлен ${path.basename(controllerPath)}`);
  }
});

console.log('🎉 Исправления завершены!'); 