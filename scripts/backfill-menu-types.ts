import { PrismaClient } from '@prisma/client';

/**
 * Идемпотентный бэкфилл типов меню для всех проектов.
 * Создаёт main/footer/sidebar в проектах, где их нет.
 * Системный проект situs-admin пропускается.
 */
async function run() {
  const prisma = new PrismaClient();
  try {
    const projects = await prisma.project.findMany({ select: { id: true, slug: true } });
    for (const p of projects) {
      if (p.slug === 'situs-admin') continue;
      const need = async (name: string, title: string, description: string) => {
        const exists = await prisma.menuType.findUnique({ where: { projectId_name: { projectId: p.id, name } } });
        if (exists) return;
        await prisma.menuType.create({ data: { projectId: p.id, name, title, description, isActive: true } });
        // eslint-disable-next-line no-console
        console.log(`[backfill] ${p.slug}: created menu type ${name}`);
      };
      await need('main', 'Главное меню', 'Автоматически создано (backfill)');
      await need('footer', 'Меню подвала', 'Автоматически создано (backfill)');
      await need('sidebar', 'Боковое меню', 'Автоматически создано (backfill)');
    }
    // eslint-disable-next-line no-console
    console.log('[backfill] done');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[backfill] error', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
