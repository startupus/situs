#!/usr/bin/env node

import fs from 'fs';
import { glob } from 'glob';

async function fixRichTextFeatures() {
  console.log('🔧 Исправляю RichTextFeatures...');

  const files = await glob('src/components/redaktus/**/*.tsx');
  let fixedFiles = 0;

  const replacements = [
    // Исправляем неправильные имена заголовков
    ['types.RichTextFeatures.Heading2', 'types.RichTextFeatures.h2'],
    ['types.RichTextFeatures.Heading3', 'types.RichTextFeatures.h3'], 
    ['types.RichTextFeatures.Heading4', 'types.RichTextFeatures.h4'],
    ['types.RichTextFeatures.Heading5', 'types.RichTextFeatures.h5'],
    ['types.RichTextFeatures.Heading6', 'types.RichTextFeatures.h6'],
    
    // Исправляем остальные неправильные имена
    ['types.RichTextFeatures.Italic', 'types.RichTextFeatures.italic'],
    ['types.RichTextFeatures.Code', 'types.RichTextFeatures.code'],
    ['types.RichTextFeatures.UnorderedList', 'types.RichTextFeatures.ul'],
    ['types.RichTextFeatures.OrderedList', 'types.RichTextFeatures.ol'],
    ['types.RichTextFeatures.Quote', 'types.RichTextFeatures.quote'],
  ];

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    for (const [wrong, correct] of replacements) {
      if (content.includes(wrong)) {
        content = content.replace(new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
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

fixRichTextFeatures().catch(console.error); 