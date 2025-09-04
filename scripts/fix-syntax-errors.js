#!/usr/bin/env node

/**
 * Fix syntax errors in TypeScript files
 */

const fs = require('fs');

console.log('🔧 Fixing syntax errors...');

// Fix UserService syntax errors
const userServicePath = 'src/api/services/UserService.ts';
if (fs.existsSync(userServicePath)) {
  console.log('📝 Fixing UserService syntax...');
  let content = fs.readFileSync(userServicePath, 'utf8');

  // Fix the problematic lines
  content = content.replace(/data: \{ \/\/ lastLoginAt: new Date\(\) \},/g, 'data: { updatedAt: new Date() },');

  content = content.replace(
    /prisma\.user\.count\(\{ where: \{ globalRole: "ADMIN" \} \}\),/g,
    'prisma.user.count({ where: { globalRole: "ADMIN" } }),',
  );

  content = content.replace(
    /prisma\.user\.count\(\{ where: \{ globalRole: "USER" \} \}\),/g,
    'prisma.user.count({ where: { globalRole: "USER" } }),',
  );

  fs.writeFileSync(userServicePath, content);
  console.log('✅ Fixed UserService syntax');
}

// Fix CreateMenuItemModal syntax errors
const createMenuItemPath = 'src/components/admin/menu/CreateMenuItemModal.tsx';
if (fs.existsSync(createMenuItemPath)) {
  console.log('📝 Fixing CreateMenuItemModal syntax...');
  let content = fs.readFileSync(createMenuItemPath, 'utf8');

  // Fix the component type definition
  content = content.replace(/component: "string" as any;/g, 'component: "string" as any,');

  // Fix the function parameter
  content = content.replace(
    /const getComponentDefaults = \(component: "string" as any\) => \{/g,
    'const getComponentDefaults = (component: any) => {',
  );

  fs.writeFileSync(createMenuItemPath, content);
  console.log('✅ Fixed CreateMenuItemModal syntax');
}

console.log('✅ Syntax errors fixed!');
console.log('🚀 Run "npm run build:safe" to verify fixes');
