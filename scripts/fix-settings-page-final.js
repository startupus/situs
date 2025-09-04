#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Финальное исправление SettingsPage...');

const filePath = 'src/components/ui/dashboard/SettingsPage/Preview.tsx';
const content = fs.readFileSync(filePath, 'utf8');

let fixed = content
  .replace(/<div>NavItem<\/div>\}\s+menu="([^"]*)"\s*\/>/g, '<div>NavItem $1</div>')
  .replace(/<div>NavItem<\/div>\}\s+menu="([^"]*)"\s+submenu>/g, '<div>NavItem $1</div>')
  .replace(/<Divider\s*\/>/g, '<div>Divider</div>');

fs.writeFileSync(filePath, fixed, 'utf8');
console.log('✅ SettingsPage исправлен!');
