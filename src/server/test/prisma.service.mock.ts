type ProjectRow = { id: string; theme?: string | null; settings?: string | null; slug?: string; name?: string; ownerId?: string };

enum ProjectStatus { ACTIVE = 'ACTIVE' }

export class PrismaServiceMock {
  private projects = new Map<string, ProjectRow>();
  private users = new Map<string, { id: string; email?: string; username?: string }>();

  constructor() {
    // Инициализируем тестовый проект и dev-пользователя
    this.projects.set('e2e', { id: 'e2e', theme: null, settings: '{}', name: 'E2E', ownerId: 'owner-1' });
    this.users.set('owner-1', { id: 'owner-1', email: 'owner@example.com', username: 'owner' });
  }

  user = {
    findUnique: async (args: any) => {
      const where = args?.where || {};
      if (where.id) return this.users.get(String(where.id)) || null;
      if (where.email) {
        const u = [...this.users.values()].find((x) => x.email === String(where.email));
        return u || null;
      }
      return null;
    },
    upsert: async (args: any) => {
      const where = args?.where || {};
      const existing = where.email ? [...this.users.values()].find((x) => x.email === String(where.email)) : undefined;
      if (existing) return existing;
      const id = `u_${Date.now()}`;
      const created = { id, email: args?.create?.email, username: args?.create?.username };
      this.users.set(id, created);
      return created;
    },
  } as any;

  project = {
    findUnique: async (args: any) => {
      const where = args?.where || {};
      const id = where.id ?? null;
      const slug = where.slug ?? null;
      let row: ProjectRow | undefined;
      if (id) row = this.projects.get(String(id));
      if (!row && slug) {
        row = [...this.projects.values()].find((p) => p.slug === String(slug));
      }
      if (!row) return null as any;
      if (args?.select) {
        const out: any = {};
        for (const k of Object.keys(args.select)) {
          if (args.select[k]) out[k] = (row as any)[k];
        }
        return out;
      }
      return row as any;
    },
    findFirst: async (args: any) => {
      const where = args?.where || {};
      const list = [...this.projects.values()].filter((p) => {
        let ok = true;
        for (const [k, v] of Object.entries(where)) {
          if (typeof v === 'object' && v && 'not' in (v as any)) {
            ok = ok && (p as any)[k] !== (v as any).not;
          } else if (typeof v === 'object' && v && 'contains' in (v as any)) {
            ok = ok && String((p as any)[k] || '').includes(String((v as any).contains));
          } else {
            ok = ok && (p as any)[k] === v;
          }
        }
        return ok;
      });
      return list[0] || null;
    },
    update: async (args: any) => {
      const id = args?.where?.id;
      const row = this.projects.get(String(id));
      if (!row) throw new Error('Not found');
      const data = args?.data || {};
      if (data.theme !== undefined) row.theme = String(data.theme);
      if (data.settings !== undefined) row.settings = String(data.settings);
      if (data.name !== undefined) row.name = String(data.name);
      if (data.status !== undefined) (row as any).status = String(data.status);
      this.projects.set(String(id), row);
      return { id: row.id } as any;
    },
    count: async () => 1,
    create: async (args: any) => {
      const id = `p_${Date.now()}`;
      const data = args?.data || {};
      const row: ProjectRow = { id, name: String(data.name || 'New'), settings: String(data.settings || '{}'), ownerId: String(data.ownerId || 'owner-1') };
      this.projects.set(id, row);
      return row as any;
    },
  } as any;
}

