#!/usr/bin/env node

/**
 * Авто-сид системного проекта при старте API
 *
 * Идемпотентный скрипт, который:
 * 1. Проверяет наличие системного проекта situs-admin
 * 2. Если нет - запускает seed-admin-system.ts
 * 3. Логирует результат
 *
 * Используется в Docker entrypoint для гарантированного наличия системных данных
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');

const prisma = new PrismaClient();

async function checkSystemProjectExists() {
  try {
    const systemProject = await prisma.project.findFirst({
      where: {
        OR: [{ slug: 'situs-admin' }, { isSystemAdmin: true }],
      },
    });
    return !!systemProject;
  } catch (error) {
    console.warn('⚠️ Failed to check system project:', error);
    return false;
  }
}

async function runSystemSeed() {
  try {
    const seedPath = join(__dirname, 'seed-admin-system.js');

    if (!existsSync(seedPath)) {
      console.error('❌ Seed file not found:', seedPath);
      return false;
    }

    console.log('🌱 Running system admin seed...');
    execSync(`node "${seedPath}"`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log('✅ System admin seed completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to run system seed:', error);
    return false;
  }
}

async function main() {
  try {
    console.log('🔍 Checking system project existence...');

    const systemProjectExists = await checkSystemProjectExists();

    if (systemProjectExists) {
      console.log('✅ System project already exists, skipping seed');
      return;
    }

    console.log('📦 System project not found, running seed...');
    const seedSuccess = await runSystemSeed();

    if (seedSuccess) {
      console.log('🎉 Auto-seed completed successfully');
    } else {
      console.error('💥 Auto-seed failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Auto-seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
  main();
}

module.exports = { main };
