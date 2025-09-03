#!/usr/bin/env node

import fs from 'fs';
import { glob } from 'glob';

async function addAnyTypes() {
  console.log('🔧 Добавляю типы any к параметрам функций...');

  const files = await glob('src/components/redaktus/**/*.tsx');
  let fixedFiles = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Список замен для добавления типов any
    const patterns = [
      // renderWrapper с children
      [/renderWrapper=\{\(\{ children \)\) =>/g, 'renderWrapper={({ children }: any) =>'],

      // renderBlock с props
      [/renderBlock=\{\(([a-zA-Z_]+)\) =>/g, 'renderBlock={($1: any) =>'],

      // renderHighlight с props
      [/renderHighlight=\{\(([a-zA-Z_]+)\) =>/g, 'renderHighlight={($1: any) =>'],

      // renderLink с props
      [/renderLink=\{\(([a-zA-Z_]+)\) =>/g, 'renderLink={($1: any) =>'],

      // renderPlaceholder с children
      [/renderPlaceholder=\{\(\{ children \)\) =>/g, 'renderPlaceholder={({ children }: any) =>'],

      // renderItemWrapper с item
      [/renderItemWrapper=\{\(([a-zA-Z_]+)\) =>/g, 'renderItemWrapper={($1: any) =>'],
    ];

    for (const [pattern, replacement] of patterns) {
      if ((pattern as RegExp).test(content)) {
        content = content.replace(pattern as RegExp, replacement as string);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content);
      fixedFiles++;
      console.log(`✅ Исправлен: ${file}`);
    }
  }

  console.log(`🎉 Исправлено файлов: ${fixedFiles}`);
}

addAnyTypes().catch(console.error);
