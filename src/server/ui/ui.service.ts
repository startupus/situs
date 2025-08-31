import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UiService {
  constructor(private readonly prisma: PrismaService) {}

  // Простой in-memory кэш для /api/ui/meta
  private metaCache: Map<string, { data: any; expiresAt: number }> = new Map();
  private readonly metaTtlMs: number = 5 * 60 * 1000; // 5 минут

  private getFromCache(key: string): any | null {
    const rec = this.metaCache.get(key);
    if (!rec) return null;
    if (rec.expiresAt < Date.now()) {
      this.metaCache.delete(key);
      return null;
    }
    return rec.data;
  }

  private setToCache(key: string, data: any): void {
    this.metaCache.set(key, { data, expiresAt: Date.now() + this.metaTtlMs });
  }

  /**
   * Сопоставление динамических сегментов с шаблоном пути
   */
  private matchDynamicPath(template: string, actualPath: string): boolean {
    const templateSegments = template.split('/').filter(Boolean);
    const actualSegments = actualPath.split('/').filter(Boolean);
    
    if (templateSegments.length !== actualSegments.length) return false;
    
    for (let i = 0; i < templateSegments.length; i++) {
      const templateSeg = templateSegments[i];
      const actualSeg = actualSegments[i];
      
      // Если сегмент шаблона начинается с :, это динамический параметр
      if (templateSeg.startsWith(':')) {
        continue; // Любое значение подходит
      }
      
      // Иначе должно быть точное совпадение
      if (templateSeg !== actualSeg) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Резолв заголовка и крошек из системного меню админки (situs-admin → admin-sidebar)
   */
  private async resolveFromAdminMenu(path: string): Promise<{ title?: string; breadcrumbs?: Array<{ label: string; to?: string }> }> {
    try {
      const adminProject = await this.prisma.project.findUnique({ where: { slug: 'situs-admin' }, select: { id: true } });
      if (!adminProject) return {};

      const adminSidebar = await this.prisma.menuType.findUnique({
        where: { projectId_name: { projectId: adminProject.id, name: 'admin-sidebar' } },
        select: { id: true },
      });
      if (!adminSidebar) return {};

      // Получаем все пункты меню для сопоставления с динамическими сегментами
      const menuItems = await this.prisma.menuItem.findMany({
        where: { menuTypeId: adminSidebar.id, isPublished: true },
        include: { parent: true },
        orderBy: { orderIndex: 'asc' },
      });

      // Сначала пробуем точное совпадение
      let item = menuItems.find(item => item.externalUrl === path);
      
      // Если не найдено, пробуем динамические сегменты
      if (!item) {
        item = menuItems.find(item => 
          item.externalUrl && this.matchDynamicPath(item.externalUrl, path)
        );
      }
      
      if (!item) return {};

      const breadcrumbs: Array<{ label: string; to?: string }> = [];
      // Построим крошки из родителей, лист (item) не включаем
      let current = item.parentId
        ? await this.prisma.menuItem.findUnique({ where: { id: item.parentId }, include: { parent: true } })
        : null;
      const stack: Array<{ label: string; to?: string }> = [];
      while (current) {
        const to = current.externalUrl || undefined;
        stack.push({ label: current.title, to });
        current = current.parentId
          ? await this.prisma.menuItem.findUnique({ where: { id: current.parentId }, include: { parent: true } })
          : null;
      }
      // Родители от корня к листу
      stack.reverse().forEach((c) => breadcrumbs.push(c));

      return { title: item.title, breadcrumbs };
    } catch {
      return {};
    }
  }

  /**
   * Резолв из AdminScreen (системный продукт ADMIN в системном проекте)
   */
  private async resolveFromAdminScreens(path: string): Promise<{ 
    title?: string; 
    breadcrumbs?: Array<{ label: string; to?: string }>; 
    seo?: { title?: string; description?: string; keywords?: string } 
  }> {
    try {
      const adminProject = await this.prisma.project.findUnique({ where: { slug: 'situs-admin' }, select: { id: true } });
      if (!adminProject) return {};
      
      // Сначала пробуем точное совпадение
      let screen = await this.prisma.adminScreen.findFirst({ 
        where: { projectId: adminProject.id, path, isActive: true }
      });
      
      // Если не найдено, пробуем динамические сегменты
      if (!screen) {
        const allScreens = await this.prisma.adminScreen.findMany({
          where: { projectId: adminProject.id, isActive: true }
        });
        
        screen = allScreens.find(s => s.path && this.matchDynamicPath(s.path, path)) || null;
      }
      
      if (!screen) return {};
      
      // Крошки: пока одноуровневые (можно расширить по category)
      const breadcrumbs: Array<{ label: string; to?: string }> = [];
      
      // SEO поля из AdminScreen
      const seo: { title?: string; description?: string; keywords?: string } = {};
      if ((screen as any).metaTitle) seo.title = (screen as any).metaTitle;
      if ((screen as any).metaDescription) seo.description = (screen as any).metaDescription;
      if ((screen as any).metaKeywords) seo.keywords = (screen as any).metaKeywords;
      
      return { 
        title: screen.title, 
        breadcrumbs,
        seo: Object.keys(seo).length > 0 ? seo : undefined
      };
    } catch {
      return {};
    }
  }

  // Admin sidebar для глобальной админки (верхний уровень)
  async getAdminSidebar(): Promise<Array<{ title: string; to: string }>> {
    const adminProject = await this.prisma.project.findUnique({ where: { slug: 'situs-admin' }, select: { id: true } });
    if (!adminProject) return [];
    const adminSidebar = await this.prisma.menuType.findUnique({
      where: { projectId_name: { projectId: adminProject.id, name: 'admin-sidebar' } },
      select: { id: true },
    });
    if (!adminSidebar) return [];
    const items = await this.prisma.menuItem.findMany({
      where: { menuTypeId: adminSidebar.id, isPublished: true, parentId: null },
      orderBy: { orderIndex: 'asc' },
      select: { title: true, externalUrl: true, parameters: true, icon: true, iconLibrary: true },
    });
    if (!items || items.length === 0) {
      // Диагностический лог: пустой admin-sidebar — проверьте сиды системного проекта
      // eslint-disable-next-line no-console
      console.warn('[UI] admin-sidebar is empty. Ensure situs-admin seeds are applied');
    }
    return items.map(i => ({
      title: i.title,
      to: i.externalUrl || '#',
      params: i.parameters ? JSON.parse(i.parameters) : undefined,
      icon: i.icon || undefined,
      iconLibrary: i.iconLibrary || undefined,
    }));
  }

  // Project navigation шаблон из системного проекта (единый для всех проектов)
  async getSystemProjectSidebar(): Promise<Array<{ title: string; to: string }>> {
    const adminProject = await this.prisma.project.findUnique({ where: { slug: 'situs-admin' }, select: { id: true } });
    if (!adminProject) return [];
    const projectSidebar = await this.prisma.menuType.findUnique({
      where: { projectId_name: { projectId: adminProject.id, name: 'project-sidebar' } },
      select: { id: true },
    });
    if (!projectSidebar) return [];
    const items = await this.prisma.menuItem.findMany({
      where: { menuTypeId: projectSidebar.id, isPublished: true, parentId: null },
      orderBy: { orderIndex: 'asc' },
      select: { title: true, externalUrl: true, parameters: true, icon: true, iconLibrary: true },
    });
    return items.map(i => ({
      title: i.title,
      to: i.externalUrl || '#',
      params: i.parameters ? JSON.parse(i.parameters) : undefined,
      icon: i.icon || undefined,
      iconLibrary: i.iconLibrary || undefined,
    }));
  }

  // Admin user dropdown (меню пользователя в верхней панели)
  async getAdminUserMenu(): Promise<Array<{ title: string; to: string; params?: any }>> {
    const adminProject = await this.prisma.project.findUnique({ where: { slug: 'situs-admin' }, select: { id: true } });
    if (!adminProject) return [];
    const adminUser = await this.prisma.menuType.findUnique({
      where: { projectId_name: { projectId: adminProject.id, name: 'admin-user' } },
      select: { id: true },
    });
    if (!adminUser) return [];
    const items = await this.prisma.menuItem.findMany({
      where: { menuTypeId: adminUser.id, isPublished: true, parentId: null },
      orderBy: { orderIndex: 'asc' },
      select: { title: true, externalUrl: true, parameters: true },
    });
    return items.map(i => ({ title: i.title, to: i.externalUrl || '#', params: i.parameters ? JSON.parse(i.parameters) : undefined }));
  }

  // Project sidebar для конкретного проекта (тип: admin-sidebar | project-sidebar)
  async getProjectSidebar(projectId: string, type: string = 'admin-sidebar'): Promise<Array<{ title: string; to: string }>> {
    if (!projectId) return [];
    // projectId может быть id или slug
    let project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } }).catch(() => null);
    if (!project) {
      project = await this.prisma.project.findUnique({ where: { slug: projectId }, select: { id: true } }).catch(() => null);
    }
    if (!project) return [];

    const menuType = await this.prisma.menuType.findUnique({
      where: { projectId_name: { projectId: project.id, name: type } },
      select: { id: true },
    });
    if (!menuType) return [];
    const items = await this.prisma.menuItem.findMany({
      where: { menuTypeId: menuType.id, isPublished: true, parentId: null },
      orderBy: { orderIndex: 'asc' },
      select: { title: true, externalUrl: true, parameters: true, icon: true, iconLibrary: true },
    });
    return items.map(i => ({
      title: i.title,
      to: i.externalUrl || '#',
      params: i.parameters ? JSON.parse(i.parameters) : undefined,
      icon: i.icon || undefined,
      iconLibrary: i.iconLibrary || undefined,
    }));
  }

  buildBreadcrumbs(projectId: string) {
    // Заглушка для будущей логики: вернём базовые элементы.
    return {
      projectId,
      items: [
        { label: 'Проекты', to: '/projects' },
        { label: 'Проект', to: `/projects/${projectId}` },
      ],
    };
  }

  async getMeta(path: string) {
    const safePath = path?.split('?')[0].split('#')[0] || '/';
    const cacheKey = `meta:${safePath}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const segs = safePath.split('/').filter(Boolean);
    let title = 'Раздел';
    const breadcrumbs: Array<{ label: string; to?: string }> = [];

    // 0) Сначала пробуем найти соответствие в системном меню админки
    if (!segs[0] || segs[0] !== 'projects') {
      const fromScreens = await this.resolveFromAdminScreens(safePath);
      if (fromScreens.title) {
        const result = { 
          title: fromScreens.title, 
          breadcrumbs: fromScreens.breadcrumbs || [],
          seo: fromScreens.seo
        };
        this.setToCache(cacheKey, result);
        return result;
      }
      const fromAdmin = await this.resolveFromAdminMenu(safePath);
      if (fromAdmin.title) {
        const result = { title: fromAdmin.title, breadcrumbs: fromAdmin.breadcrumbs || [] };
        this.setToCache(cacheKey, result);
        return result;
      }
    }

    if (segs[0] === 'projects' && segs[1]) {
      const idOrSlug = segs[1];
      // Надёжно резолвим проект по id или slug
      let project = await this.prisma.project.findUnique({ where: { id: idOrSlug }, select: { name: true, slug: true, id: true } }).catch(() => null);
      if (!project) {
        project = await this.prisma.project.findUnique({ where: { slug: idOrSlug }, select: { name: true, slug: true, id: true } }).catch(() => null);
      }
      const projectName = project?.name || 'Проект';
      const projectSlug = project?.slug || idOrSlug;
      const projectPath = `/projects/${projectSlug}`;

      // базовые крошки всегда: показываем только "Проекты"; текущий раздел (leaf) не добавляем
      breadcrumbs.push({ label: 'Проекты', to: '/projects' });

      // projects/:id only
      if (segs.length === 2) {
        title = projectName;
        const result = { title, breadcrumbs };
        this.setToCache(cacheKey, result);
        return result;
      }

      // Меню проекта
      if (segs[2] === 'menus') {
        title = 'Меню проекта';
        const result = { title, breadcrumbs };
        this.setToCache(cacheKey, result);
        return result;
      }

      // pages or pages/settings
      if (segs[2] === 'pages') {
        if (segs[3] === 'settings') {
          title = 'Настройки страниц';
          // В крошках показываем только путь до родителя (без текущего leaf)
          breadcrumbs.push({ label: 'Страницы', to: `${projectPath}/pages` });
          const result = { title, breadcrumbs };
          this.setToCache(cacheKey, result);
          return result;
        }
        title = 'Страницы';
        // В крошках текущий раздел не добавляем
        const result = { title, breadcrumbs };
        this.setToCache(cacheKey, result);
        return result;
      }

      // settings or settings/:sub
      if (segs[2] === 'settings') {
        const sub = segs[3];
        if (!sub) {
          title = 'Настройки проекта';
          // текущий раздел settings не включаем
          const result = { title, breadcrumbs };
          this.setToCache(cacheKey, result);
          return result;
        }
        const map: Record<string, string> = {
          domain: 'Домен и публикация',
          seo: 'SEO',
          theme: 'Тема',
          team: 'Команда',
          integrations: 'Интеграции',
          access: 'Доступ и роли',
          menu: 'Меню',
        };
        title = map[sub] || sub;
        // В крошках показываем родителя, но не текущий sub
        breadcrumbs.push({ label: 'Настройки', to: `${projectPath}/settings` });
        const result = { title, breadcrumbs };
        this.setToCache(cacheKey, result);
        return result;
      }
      // store and nested
      if (segs[2] === 'store') {
        const sub = segs[3];
        const map: Record<string, string> = {
          orders: 'Заказы',
          catalog: 'Каталог',
          categories: 'Категории',
          products: 'Товары',
        };
        if (!sub) {
          title = 'Магазин';
          const result = { title, breadcrumbs };
          this.setToCache(cacheKey, result);
          return result;
        }
        title = map[sub] || 'Магазин';
        breadcrumbs.push({ label: 'Магазин', to: `${projectPath}/store` });
        const result = { title, breadcrumbs };
        this.setToCache(cacheKey, result);
        return result;
      }

      const result = { title, breadcrumbs };
      this.setToCache(cacheKey, result);
      return result;
    }

    // Глобальные верхние разделы (вне проекта)
    const topMap: Record<string, string> = {
      projects: 'Проекты',
      orders: 'Заказы',
      marketing: 'Маркетинг',
      users: 'Пользователи',
      support: 'Поддержка',
    };
    if (segs[0] && topMap[segs[0]]) {
      title = topMap[segs[0]];
      const result = { title, breadcrumbs };
      this.setToCache(cacheKey, result);
      return result;
    }

    const result = { title, breadcrumbs };
    this.setToCache(cacheKey, result);
    return result;
  }
}


