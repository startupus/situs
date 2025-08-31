/*
  One-off migration: SQLite prisma/dev.db -> Postgres (projects, users, products minimal set)
*/
import Database from 'better-sqlite3';
import { Client } from 'pg';

const SQLITE_PATH = process.env.SQLITE_PATH || 'prisma/dev.db';
const PG_URL = process.env.PG_URL || 'postgresql://situs:situs_password@localhost:55432/situs?schema=public';

function pick<T extends object>(row: any, keys: (keyof T)[]): Partial<T> {
  const out: any = {};
  for (const k of keys) out[k as string] = row[k as string];
  return out;
}

async function main() {
  const sqlite = new Database(SQLITE_PATH, { readonly: true });
  const pg = new Client({ connectionString: PG_URL });
  await pg.connect();

  // Ensure schema exists (Prisma migrations should have created it via API startup)

  // Users
  const users = sqlite.prepare('SELECT * FROM users').all();
  for (const u of users) {
    await pg.query(
      `INSERT INTO users (id, username, email, password, "globalRole", status, "subscriptionPlan", limits, profile, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO NOTHING`,
      [
        u.id, u.username, u.email, u.password, u.globalRole, u.status,
        u.subscriptionPlan, u.limits, u.profile, u.createdAt, u.updatedAt,
      ]
    );
  }

  // Projects
  const projects = sqlite.prepare('SELECT * FROM projects').all();
  for (const p of projects) {
    await pg.query(
      `INSERT INTO projects (id, name, description, slug, "isSystemAdmin", domain, "customDomain", "isPublished", settings, theme, "accessLevel", "customAccessLevelId", "ownerId", "accountId", status, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       ON CONFLICT (id) DO NOTHING`,
      [
        p.id, p.name, p.description, p.slug, p.isSystemAdmin, p.domain, p.customDomain, p.isPublished,
        p.settings, p.theme, p.accessLevel, p.customAccessLevelId, p.ownerId, p.accountId, p.status,
        p.createdAt, p.updatedAt,
      ]
    );
  }

  // Products
  const products = sqlite.prepare('SELECT * FROM products').all();
  for (const pr of products) {
    await pg.query(
      `INSERT INTO products (id, name, description, type, status, subdomain, "pathPrefix", settings, "pricingPlan", "accessLevel", "customAccessLevelId", "projectId", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO NOTHING`,
      [
        pr.id, pr.name, pr.description, pr.type, pr.status, pr.subdomain, pr.pathPrefix, pr.settings, pr.pricingPlan,
        pr.accessLevel, pr.customAccessLevelId, pr.projectId, pr.createdAt, pr.updatedAt,
      ]
    );
  }

  console.log(`Migrated: users=${users.length}, projects=${projects.length}, products=${products.length}`);
  await pg.end();
  sqlite.close();
}

main().catch((e) => { console.error(e); process.exit(1); });


