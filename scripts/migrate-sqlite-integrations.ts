import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';

/**
 * Миграция интеграций из локальной SQLite (prisma/dev.db) в Postgres.
 * Идемпотентная: upsert по (projectId, provider, instanceKey).
 * Выполнять внутри контейнера API, где Prisma указывает на Postgres, а prisma/dev.db смонтирована.
 */
async function run() {
  const prisma = new PrismaClient();
  const sqlitePath = 'prisma/dev.db';
  // eslint-disable-next-line no-console
  console.log('[integrations-migrate] reading from', sqlitePath);

  const db = new Database(sqlitePath, { readonly: true });
  const hasTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='integrations'").all().length > 0;
  if (!hasTable) {
    // eslint-disable-next-line no-console
    console.log('[integrations-migrate] integrations table not found in SQLite — nothing to do');
    return;
  }
  const rows = db.prepare('SELECT id, projectId, provider, instanceKey, title, version, isActive, status, config, secrets, createdAt, updatedAt FROM integrations').all();
  // eslint-disable-next-line no-console
  console.log(`[integrations-migrate] found ${rows.length} rows in SQLite`);

  let migrated = 0;
  for (const r of rows) {
    try {
      // Преобразование типов/форматов
      const provider = String(r.provider || '').toUpperCase();
      const status = String(r.status || 'DISABLED').toUpperCase();

      const config = typeof r.config === 'string' ? (r.config.trim() ? JSON.parse(r.config) : null) : r.config ?? null;
      const secrets = typeof r.secrets === 'string' ? (r.secrets.trim() ? JSON.parse(r.secrets) : null) : r.secrets ?? null;

      await prisma.integration.upsert({
        where: { projectId_provider_instanceKey: { projectId: r.projectId, provider: provider as any, instanceKey: r.instanceKey || 'default' } as any },
        update: {
          title: r.title ?? null,
          version: r.version ?? null,
          isActive: Boolean(r.isActive),
          status: status as any,
          config: config as any,
          secrets: secrets as any,
        },
        create: {
          projectId: r.projectId,
          provider: provider as any,
          instanceKey: r.instanceKey || 'default',
          title: r.title ?? null,
          version: r.version ?? null,
          isActive: Boolean(r.isActive),
          status: status as any,
          config: config as any,
          secrets: secrets as any,
        },
      });
      migrated += 1;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[integrations-migrate] failed row', r?.id || `${r.projectId}:${r.provider}:${r.instanceKey}`, e);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[integrations-migrate] migrated/upserted: ${migrated}`);
}

run()
  .catch((e) => { console.error('[integrations-migrate] error', e); process.exit(1); })
  .finally(() => process.exit(0));


