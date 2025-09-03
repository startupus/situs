#!/usr/bin/env node

import fs from 'fs';
import { glob } from 'glob';

async function fixSideEditProps() {
  console.log('🔧 Исправляю ошибки с props в sideEditProps...');

  const files = await glob('src/components/redaktus/**/*.tsx');
  let fixedFiles = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Исправляем структуру sideEditProps - убираем неправильные группировки с props
    const propsPattern = /sideEditProps:\s*\[([\s\S]*?)\]/;
    const match = content.match(propsPattern);

    if (match) {
      const sideEditPropsContent = match[1];

      // Проверяем есть ли проблемные объекты с props
      if (sideEditPropsContent.includes('props:')) {
        console.log(`Исправляю ${file}`);

        // Более точный паттерн для группированных объектов
        let newContent = content.replace(
          /{\s*groupName:\s*'[^']*',\s*defaultOpen:\s*(true|false),\s*props:\s*\[([^\]]+)\],?\s*}/g,
          (match, defaultOpen, props) => {
            // Возвращаем только содержимое props без обертки
            return props.trim();
          },
        );

        // Убираем лишние запятые
        newContent = newContent.replace(/,\s*,/g, ',');
        newContent = newContent.replace(/\[\s*,/g, '[');
        newContent = newContent.replace(/,\s*\]/g, ']');

        if (newContent !== content) {
          fs.writeFileSync(file, newContent);
          hasChanges = true;
          fixedFiles++;
        }
      }
    }

    if (hasChanges) {
      console.log(`✅ Исправлен: ${file}`);
    }
  }

  console.log(`🎉 Исправлено файлов: ${fixedFiles}`);
}

fixSideEditProps().catch(console.error);
