type ProjectRow = { id: string; theme?: string | null; settings?: string | null; slug?: string; name?: string; ownerId?: string };

export class PrismaServiceMock {
  private projects = new Map<string, ProjectRow>();

  constructor() {
    // Инициализируем тестовый проект
    this.projects.set('e2e', { id: 'e2e', theme: null, settings: '{}', name: 'E2E', ownerId: 'owner-1' });
  }

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
      this.projects.set(String(id), row);
      return { id: row.id } as any;
    },
    count: async () => 1,
  } as any;
}

