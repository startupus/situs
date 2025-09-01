import { PrismaClient, ProjectStatus, MenuItemType, GlobalRole } from '@prisma/client';

/**
 * Сид системного проекта админки и базовой навигации.
 * - Создаёт проект со slug "situs-admin" (в settings помечаем isSystemAdmin=true)
 * - Создаёт типы меню admin-sidebar и admin-top
 * - Создаёт минимальные пункты меню (Проекты, Пользователи)
 */
async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('🌱 Seeding system admin project...');

    // 1) Владелец — берём SUPER_ADMIN, иначе первого пользователя
    let owner =
      (await prisma.user.findFirst({ where: { globalRole: GlobalRole.SUPER_ADMIN }, orderBy: { createdAt: 'asc' } })) ||
      (await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } }));

    // Если нет ни одного пользователя — создаём системного администратора
    if (!owner) {
      owner = await prisma.user.upsert({
        where: { email: 'admin@situs.local' },
        update: { globalRole: GlobalRole.SUPER_ADMIN, status: 'ACTIVE' },
        create: {
          username: 'admin',
          email: 'admin@situs.local',
          password: 'admin',
          globalRole: GlobalRole.SUPER_ADMIN,
          status: 'ACTIVE',
        },
      });
    }

    // 2) Проект situs-admin
    const project = await prisma.project.upsert({
      where: { slug: 'situs-admin' },
      update: {
        name: 'Situs Admin',
        description: 'Системный проект админки',
        status: ProjectStatus.ACTIVE,
        isSystemAdmin: true,
        settings: JSON.stringify({ isSystemAdmin: true, language: 'ru' }),
      },
      create: {
        name: 'Situs Admin',
        description: 'Системный проект админки',
        slug: 'situs-admin',
        ownerId: owner.id,
        status: ProjectStatus.ACTIVE,
        isPublished: false,
        isSystemAdmin: true,
        settings: JSON.stringify({ isSystemAdmin: true, language: 'ru' }),
      },
    });
    console.log('📦 Project ready:', project.id);

    // 3) Типы меню
    const adminSidebar = await prisma.menuType.upsert({
      where: { projectId_name: { projectId: project.id, name: 'admin-sidebar' } },
      update: { title: 'Admin Sidebar' },
      create: { projectId: project.id, name: 'admin-sidebar', title: 'Admin Sidebar' },
    });

    const adminTop = await prisma.menuType.upsert({
      where: { projectId_name: { projectId: project.id, name: 'admin-top' } },
      update: { title: 'Admin Top' },
      create: { projectId: project.id, name: 'admin-top', title: 'Admin Top' },
    });

    // Меню пользователя (дропдаун в интерфейсе админки)
    const adminUser = await prisma.menuType.upsert({
      where: { projectId_name: { projectId: project.id, name: 'admin-user' } },
      update: { title: 'Admin User Menu' },
      create: { projectId: project.id, name: 'admin-user', title: 'Admin User Menu' },
    });

    // Шаблон проектной навигации для всех проектов системы (используется в сайдбаре проекта)
    const projectSidebar = await prisma.menuType.upsert({
      where: { projectId_name: { projectId: project.id, name: 'project-sidebar' } },
      update: { title: 'Project Sidebar' },
      create: { projectId: project.id, name: 'project-sidebar', title: 'Project Sidebar' },
    });

    // 4) Пункты меню admin-sidebar
    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'dashboard' } },
      update: {
        title: 'Дашборд',
        type: MenuItemType.URL,
        externalUrl: '/',
        orderIndex: 0,
        level: 1,
        isPublished: true,
        icon: 'FiGrid',
        iconLibrary: 'fi',
      },
      create: {
        menuTypeId: adminSidebar.id,
        title: 'Дашборд',
        alias: 'dashboard',
        type: MenuItemType.URL,
        externalUrl: '/',
        orderIndex: 0,
        level: 1,
        isPublished: true,
        icon: 'FiGrid',
        iconLibrary: 'fi',
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'projects' } },
      update: {
        title: 'Проекты',
        type: MenuItemType.URL,
        externalUrl: '/projects',
        orderIndex: 0,
        level: 1,
        isPublished: true,
        icon: 'FiFolder',
        iconLibrary: 'fi',
      },
      create: {
        menuTypeId: adminSidebar.id,
        title: 'Проекты',
        alias: 'projects',
        type: MenuItemType.URL,
        externalUrl: '/projects',
        orderIndex: 0,
        level: 1,
        isPublished: true,
        icon: 'FiFolder',
        iconLibrary: 'fi',
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'orders' } },
      update: {
        title: 'Заказы',
        type: MenuItemType.URL,
        externalUrl: '/orders',
        orderIndex: 2,
        level: 1,
        isPublished: true,
        icon: 'FiShoppingCart',
        iconLibrary: 'fi',
      },
      create: {
        menuTypeId: adminSidebar.id,
        title: 'Заказы',
        alias: 'orders',
        type: MenuItemType.URL,
        externalUrl: '/orders',
        orderIndex: 2,
        level: 1,
        isPublished: true,
        icon: 'FiShoppingCart',
        iconLibrary: 'fi',
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'marketing' } },
      update: {
        title: 'Маркетинг',
        type: MenuItemType.URL,
        externalUrl: '/marketing',
        orderIndex: 3,
        level: 1,
        isPublished: true,
        icon: 'FiTrendingUp',
        iconLibrary: 'fi',
      },
      create: {
        menuTypeId: adminSidebar.id,
        title: 'Маркетинг',
        alias: 'marketing',
        type: MenuItemType.URL,
        externalUrl: '/marketing',
        orderIndex: 3,
        level: 1,
        isPublished: true,
        icon: 'FiTrendingUp',
        iconLibrary: 'fi',
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'users' } },
      update: {
        title: 'Пользователи',
        type: MenuItemType.URL,
        externalUrl: '/users',
        orderIndex: 1,
        level: 1,
        isPublished: true,
        icon: 'FiUsers',
        iconLibrary: 'fi',
      },
      create: {
        menuTypeId: adminSidebar.id,
        title: 'Пользователи',
        alias: 'users',
        type: MenuItemType.URL,
        externalUrl: '/users',
        orderIndex: 1,
        level: 1,
        isPublished: true,
        icon: 'FiUsers',
        iconLibrary: 'fi',
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'support' } },
      update: {
        title: 'Поддержка',
        type: MenuItemType.URL,
        externalUrl: '/support',
        orderIndex: 4,
        level: 1,
        isPublished: true,
        icon: 'FiLifeBuoy',
        iconLibrary: 'fi',
      },
      create: {
        menuTypeId: adminSidebar.id,
        title: 'Поддержка',
        alias: 'support',
        type: MenuItemType.URL,
        externalUrl: '/support',
        orderIndex: 4,
        level: 1,
        isPublished: true,
        icon: 'FiLifeBuoy',
        iconLibrary: 'fi',
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'settings' } },
      update: {
        title: 'Настройки',
        type: MenuItemType.URL,
        externalUrl: '/profile-settings',
        orderIndex: 5,
        level: 1,
        isPublished: true,
        icon: 'FiSettings',
        iconLibrary: 'fi',
      },
      create: {
        menuTypeId: adminSidebar.id,
        title: 'Настройки',
        alias: 'settings',
        type: MenuItemType.URL,
        externalUrl: '/profile-settings',
        orderIndex: 5,
        level: 1,
        isPublished: true,
        icon: 'FiSettings',
        iconLibrary: 'fi',
      },
    });

    // Пункты меню project-sidebar (шаблон): пути начинаются с /project и маппятся на /projects/:id/**
    const projectSidebarItems: Array<{ alias: string; title: string; path: string; orderIndex: number; icon?: string; iconLibrary?: string }>= [
      { alias: 'overview', title: 'Обзор', path: '/project', orderIndex: 0, icon: 'FiGrid', iconLibrary: 'fi' },
      { alias: 'pages', title: 'Страницы', path: '/project/pages', orderIndex: 1, icon: 'FiFileText', iconLibrary: 'fi' },
      { alias: 'store', title: 'Магазин', path: '/project/store', orderIndex: 2, icon: 'FiShoppingCart', iconLibrary: 'fi' },
      { alias: 'seo', title: 'SEO', path: '/project/settings/seo', orderIndex: 3, icon: 'FiTarget', iconLibrary: 'fi' },
      { alias: 'integrations', title: 'Интеграции', path: '/project/settings/integrations', orderIndex: 4, icon: 'FiTool', iconLibrary: 'fi' },
      { alias: 'team', title: 'Команда', path: '/project/settings/team', orderIndex: 5, icon: 'FiUsers', iconLibrary: 'fi' },
      { alias: 'access', title: 'Доступ', path: '/project/settings/access', orderIndex: 6, icon: 'FiLock', iconLibrary: 'fi' },
    ];
    for (const it of projectSidebarItems) {
      await prisma.menuItem.upsert({
        where: { menuTypeId_alias: { menuTypeId: projectSidebar.id, alias: it.alias } },
        update: {
          title: it.title,
          type: MenuItemType.URL,
          externalUrl: it.path,
          orderIndex: it.orderIndex,
          level: 1,
          isPublished: true,
          icon: it.icon,
          iconLibrary: it.iconLibrary as any,
        },
        create: {
          menuTypeId: projectSidebar.id,
          title: it.title,
          alias: it.alias,
          type: MenuItemType.URL,
          externalUrl: it.path,
          orderIndex: it.orderIndex,
          level: 1,
          isPublished: true,
          icon: it.icon,
          iconLibrary: it.iconLibrary as any,
        },
      });
    }

    // 5) admin-top (пока без элементов — опционально)

    // 5.1) admin-user — элементы дропдауна пользователя
    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminUser.id, alias: 'notifications' } },
      update: {
        title: 'Уведомления',
        type: MenuItemType.URL,
        externalUrl: '/profile-settings?tab=notifications',
        orderIndex: 0,
        level: 1,
        isPublished: true,
      },
      create: {
        menuTypeId: adminUser.id,
        title: 'Уведомления',
        alias: 'notifications',
        type: MenuItemType.URL,
        externalUrl: '/profile-settings?tab=notifications',
        orderIndex: 0,
        level: 1,
        isPublished: true,
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminUser.id, alias: 'profile-settings' } },
      update: {
        title: 'Настройки профиля',
        type: MenuItemType.URL,
        externalUrl: '/profile-settings',
        orderIndex: 1,
        level: 1,
        isPublished: true,
      },
      create: {
        menuTypeId: adminUser.id,
        title: 'Настройки профиля',
        alias: 'profile-settings',
        type: MenuItemType.URL,
        externalUrl: '/profile-settings',
        orderIndex: 1,
        level: 1,
        isPublished: true,
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminUser.id, alias: 'dashboard' } },
      update: {
        title: 'Дашборд',
        type: MenuItemType.URL,
        externalUrl: '/',
        orderIndex: 2,
        level: 1,
        isPublished: true,
      },
      create: {
        menuTypeId: adminUser.id,
        title: 'Дашборд',
        alias: 'dashboard',
        type: MenuItemType.URL,
        externalUrl: '/',
        orderIndex: 2,
        level: 1,
        isPublished: true,
      },
    });

    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminUser.id, alias: 'logout' } },
      update: {
        title: 'Выйти',
        type: MenuItemType.URL,
        externalUrl: '/auth/logout',
        orderIndex: 3,
        level: 1,
        isPublished: true,
        parameters: JSON.stringify({ action: 'logout' }),
      },
      create: {
        menuTypeId: adminUser.id,
        title: 'Выйти',
        alias: 'logout',
        type: MenuItemType.URL,
        externalUrl: '/auth/logout',
        orderIndex: 3,
        level: 1,
        isPublished: true,
        parameters: JSON.stringify({ action: 'logout' }),
      },
    });
    // 6) Продукт ADMIN и базовые экраны
    const adminProduct = await prisma.product.upsert({
      where: { projectId_name: { projectId: project.id, name: 'Admin' } },
      update: { type: 'ADMIN' as any },
      create: {
        projectId: project.id,
        name: 'Admin',
        description: 'Системный компонент админки',
        type: 'ADMIN' as any,
        settings: '{}',
      },
    });

    const screens = [
      { title: 'Дашборд', alias: 'dashboard', path: '/', orderIndex: 0, icon: 'Grid' },
      { title: 'Проекты', alias: 'projects', path: '/projects', orderIndex: 1, icon: 'Folder' },
      { title: 'Заказы', alias: 'orders', path: '/orders', orderIndex: 2, icon: 'ShoppingCart' },
      { title: 'Маркетинг', alias: 'marketing', path: '/marketing', orderIndex: 3, icon: 'Megaphone' },
      { title: 'Пользователи', alias: 'users', path: '/users', orderIndex: 4, icon: 'Users' },
      { title: 'Поддержка', alias: 'support', path: '/support', orderIndex: 5, icon: 'LifeBuoy' },
      { title: 'Настройки', alias: 'settings', path: '/profile-settings', orderIndex: 6, icon: 'Settings' },
    ];
    for (const s of screens) {
      await prisma.adminScreen.upsert({
        where: { projectId_alias: { projectId: project.id, alias: s.alias } as any },
        update: { title: s.title, path: s.path, orderIndex: s.orderIndex, icon: s.icon, isActive: true },
        create: { ...s, projectId: project.id, productId: adminProduct.id, isActive: true },
      });
    }

    console.log('✅ System admin project seeded with menu types and admin screens:', adminSidebar.name, adminTop.name);

    // 7) Communication settings: enable EMAIL with a dev SMTP stub
    try {
      await prisma.communicationSettings.upsert({
        where: { channel: 'EMAIL' as any },
        update: {
          enabled: true,
          config: {
            host: process.env.SMTP_HOST || 'localhost',
            port: Number(process.env.SMTP_PORT || 1025),
            secure: false,
            auth: {
              user: process.env.SMTP_USER || '',
              pass: process.env.SMTP_PASS || ''
            },
            from: process.env.SMTP_FROM || 'Situs <no-reply@situs.local>'
          },
          inviteTemplate: undefined,
          reminderTemplate: undefined,
        },
        create: {
          channel: 'EMAIL' as any,
          enabled: true,
          config: {
            host: process.env.SMTP_HOST || 'localhost',
            port: Number(process.env.SMTP_PORT || 1025),
            secure: false,
            auth: {
              user: process.env.SMTP_USER || '',
              pass: process.env.SMTP_PASS || ''
            },
            from: process.env.SMTP_FROM || 'Situs <no-reply@situs.local>'
          },
        },
      });
      console.log('📮 Communication EMAIL settings ensured');
    } catch (e) {
      console.warn('⚠️ Failed to seed communication settings:', (e as any)?.message || e);
    }

    // 8) Integrations: ensure EMAIL_SMTP and N8N placeholders for situs-admin
    try {
      // EMAIL_SMTP (placeholder, not active)
      await prisma.integration.upsert({
        where: { projectId_provider_instanceKey: { projectId: project.id, provider: 'EMAIL_SMTP' as any, instanceKey: 'default' } as any },
        update: {},
        create: {
          projectId: project.id,
          provider: 'EMAIL_SMTP' as any,
          instanceKey: 'default',
          title: 'Email (SMTP)',
          isActive: false,
          status: 'DISABLED' as any,
          config: {},
        },
      });

      // N8N (placeholder, not active)
      await prisma.integration.upsert({
        where: { projectId_provider_instanceKey: { projectId: project.id, provider: 'N8N' as any, instanceKey: 'default' } as any },
        update: {},
        create: {
          projectId: project.id,
          provider: 'N8N' as any,
          instanceKey: 'default',
          title: 'n8n (external)',
          isActive: false,
          status: 'DISABLED' as any,
          config: { baseUrl: process.env.N8N_BASE_URL || '' },
        },
      });
      console.log('🔌 Integrations placeholders ensured (EMAIL_SMTP, N8N)');
    } catch (e) {
      console.warn('⚠️ Failed to seed integrations:', (e as any)?.message || e);
    }
  } catch (e) {
    console.error('❌ Error seeding system admin project:', e);
    process.exit(1);
  }
}

main().finally(async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect();
});


