#!/usr/bin/env ts-node

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

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function checkSystemProjectExists(): Promise<boolean> {
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

async function runSystemSeed(): Promise<boolean> {
  try {
    const seedPath = join(__dirname, '../prisma/seed-admin-system.ts');

    if (!existsSync(seedPath)) {
      console.error('❌ Seed file not found:', seedPath);
      return false;
    }

    console.log('🌱 Running system admin seed...');
    execSync(`npx ts-node "${seedPath}"`, {
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
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as autoSeed };
