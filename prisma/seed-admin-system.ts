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
        settings: JSON.stringify({ isSystemAdmin: true, language: 'ru' }),
      },
      create: {
        name: 'Situs Admin',
        description: 'Системный проект админки',
        slug: 'situs-admin',
        ownerId: owner.id,
        status: ProjectStatus.ACTIVE,
        isPublished: false,
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

    // 4) Пункты меню admin-sidebar
    await prisma.menuItem.upsert({
      where: { menuTypeId_alias: { menuTypeId: adminSidebar.id, alias: 'projects' } },
      update: {
        title: 'Проекты',
        type: MenuItemType.URL,
        externalUrl: '/projects',
        orderIndex: 0,
        level: 1,
        isPublished: true,
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
      },
    });

    // 5) admin-top (пока без элементов — опционально)
    console.log('✅ System admin project seeded with menu types:', adminSidebar.name, adminTop.name);
  } catch (e) {
    console.error('❌ Error seeding system admin project:', e);
    process.exit(1);
  }
}

main().finally(async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect();
});


