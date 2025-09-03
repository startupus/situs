#!/usr/bin/env node

import fs from 'fs';
import { glob } from 'glob';

async function fixSideEditSyntax() {
  console.log('🔧 Исправляю синтаксические ошибки в sideEditProps...');

  // Список файлов с синтаксическими ошибками
  const problematicFiles = ['src/components/redaktus/website/TextImage/TextImage.tsx'];

  for (const file of problematicFiles) {
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');
    console.log(`Исправляю ${file}`);

    // Ищем и исправляем неправильную структуру sideEditProps
    // Паттерн неправильной структуры с незакрытыми массивами и объектами
    content = content.replace(
      /(\s+)(options:\s*\[\s*[\s\S]*?\s*),\s*},(\s*[\s\S]*?)],\s*}],/g,
      (match, indent, options, rest) => {
        // Правильно закрываем массив options
        const fixedOptions = options.trim();
        const fixedRest = rest.trim();

        return `${indent}${fixedOptions}
${indent}    ],
${indent}  },
${indent}  ${fixedRest}
${indent}],`;
      },
    );

    // Исправляем проблемы с неправильными скобками
    content = content.replace(/}\],\s*\}],/g, '}],\n  ],');
    content = content.replace(/],\s*\}],/g, '],\n    },\n  ],');

    fs.writeFileSync(file, content);
    console.log(`✅ Исправлен: ${file}`);
  }

  console.log('🎉 Синтаксические ошибки исправлены');
}

fixSideEditSyntax().catch(console.error);
