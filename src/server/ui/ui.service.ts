import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UiService {
  constructor(private readonly prisma: PrismaService) {}

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

      // Ищем пункт меню по точному совпадению externalUrl
      const item = await this.prisma.menuItem.findFirst({
        where: { menuTypeId: adminSidebar.id, isPublished: true, externalUrl: path },
        include: { parent: true },
      });
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
  private async resolveFromAdminScreens(path: string): Promise<{ title?: string; breadcrumbs?: Array<{ label: string; to?: string }> }> {
    try {
      const adminProject = await this.prisma.project.findUnique({ where: { slug: 'situs-admin' }, select: { id: true } });
      if (!adminProject) return {};
      const screen = await this.prisma.adminScreen.findFirst({ where: { projectId: adminProject.id, path } });
      if (!screen) return {};
      // Крошки: пока одноуровневые (можно расширить по category)
      const breadcrumbs: Array<{ label: string; to?: string }> = [];
      return { title: screen.title, breadcrumbs };
    } catch {
      return {};
    }
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
    const segs = safePath.split('/').filter(Boolean);
    let title = 'Раздел';
    const breadcrumbs: Array<{ label: string; to?: string }> = [];

    // 0) Сначала пробуем найти соответствие в системном меню админки
    if (!segs[0] || segs[0] !== 'projects') {
      const fromScreens = await this.resolveFromAdminScreens(safePath);
      if (fromScreens.title) return { title: fromScreens.title, breadcrumbs: fromScreens.breadcrumbs || [] };
      const fromAdmin = await this.resolveFromAdminMenu(safePath);
      if (fromAdmin.title) return { title: fromAdmin.title, breadcrumbs: fromAdmin.breadcrumbs || [] };
    }

    if (segs[0] === 'projects' && segs[1]) {
      const projectSlug = segs[1];
      const project = await this.prisma.project.findUnique({ where: { slug: projectSlug }, select: { name: true, slug: true } }).catch(() => null);
      const projectName = project?.name || 'Проект';
      const projectPath = `/projects/${projectSlug}`;

      // базовые крошки всегда
      breadcrumbs.push({ label: 'Проекты', to: '/projects' });
      breadcrumbs.push({ label: projectName, to: projectPath });

      // projects/:id only
      if (segs.length === 2) {
        title = projectName;
        return { title, breadcrumbs };
      }

      // Меню проекта
      if (segs[2] === 'menus') {
        title = 'Меню проекта';
        return { title, breadcrumbs };
      }

      // pages or pages/settings
      if (segs[2] === 'pages') {
        if (segs[3] === 'settings') {
          title = 'Настройки страниц';
          // В крошках показываем только путь до родителя (без текущего leaf)
          breadcrumbs.push({ label: 'Страницы', to: `${projectPath}/pages` });
          return { title, breadcrumbs };
        }
        title = 'Страницы';
        // В крошках текущий раздел не добавляем
        return { title, breadcrumbs };
      }

      // settings or settings/:sub
      if (segs[2] === 'settings') {
        const sub = segs[3];
        if (!sub) {
          title = 'Настройки проекта';
          // текущий раздел settings не включаем
          return { title, breadcrumbs };
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
        return { title, breadcrumbs };
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
          return { title, breadcrumbs };
        }
        title = map[sub] || 'Магазин';
        breadcrumbs.push({ label: 'Магазин', to: `${projectPath}/store` });
        return { title, breadcrumbs };
      }

      return { title, breadcrumbs };
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
      return { title, breadcrumbs };
    }

    return { title, breadcrumbs };
  }
}


