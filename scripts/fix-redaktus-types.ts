#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// Скрипт для исправления массовых ошибок типизации в redaktus компонентах

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixRedaktusTypes() {
  console.log('🔧 Начинаю исправление ошибок типизации в redaktus компонентах...');

  // Находим все tsx файлы в папке redaktus
  const files = await glob('src/components/redaktus/**/*.tsx', {
    ignore: ['**/node_modules/**', '**/dist/**'],
  });

  let fixedFiles = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // 1. Исправляем RepeaterItem - добавляем label если отсутствует
    const repeaterItemRegex = /{\s*name:\s*'([^']+)',\s*itemType:\s*([^,]+),\s*itemLabel:\s*'([^']+)',/g;
    content = content.replace(repeaterItemRegex, (match, name, itemType, itemLabel) => {
      if (!match.includes('label:')) {
        const label = name.charAt(0).toUpperCase() + name.slice(1);
        hasChanges = true;
        return `{
      name: '${name}',
      label: '${label}',
      itemType: ${itemType},
      itemLabel: '${itemLabel}',`;
      }
      return match;
    });

    // 2. Исправляем RichTextFeatures
    if (content.includes('types.RichTextFeatures.Bold')) {
      content = content.replace(/types\.RichTextFeatures\.Bold/g, 'types.RichTextFeatures.bold');
      hasChanges = true;
    }
    if (content.includes('types.RichTextFeatures.Link')) {
      content = content.replace(/types\.RichTextFeatures\.Link/g, 'types.RichTextFeatures.link');
      hasChanges = true;
    }
    if (content.includes('types.RichTextFeatures.Highlight')) {
      content = content.replace(/types\.RichTextFeatures\.Highlight/g, 'types.RichTextFeatures.highlight');
      hasChanges = true;
    }

    // 3. Добавляем типы для параметров функций
    if (content.includes('renderBlock={(props) =>')) {
      content = content.replace(/renderBlock=\{\(props\) =>/g, 'renderBlock={(props: any) =>');
      hasChanges = true;
    }
    if (content.includes('renderWrapper={({ children }) =>')) {
      content = content.replace(/renderWrapper=\{\(\{ children \}\) =>/g, 'renderWrapper={({ children }: any) =>');
      hasChanges = true;
    }
    if (content.includes('renderHighlight={(props) =>')) {
      content = content.replace(/renderHighlight=\{\(props\) =>/g, 'renderHighlight={(props: any) =>');
      hasChanges = true;
    }
    if (content.includes('renderLink={(props) =>')) {
      content = content.replace(/renderLink=\{\(props\) =>/g, 'renderLink={(props: any) =>');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(file, content);
      fixedFiles++;
      console.log(`✅ Исправлен файл: ${file}`);
    }
  }

  console.log(`🎉 Исправлено файлов: ${fixedFiles}`);
}

// Запускаем
fixRedaktusTypes().catch(console.error);
