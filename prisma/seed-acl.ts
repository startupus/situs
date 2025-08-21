import { PrismaClient, AccessLevel, GlobalRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ACL demo data...');

  // Минимальный пользователь и проект, если отсутствуют
  const user = await prisma.user.upsert({
    where: { email: 'acl-demo@local' },
    update: {},
    create: {
      username: 'acl-demo',
      email: 'acl-demo@local',
      password: 'x',
      globalRole: 'BUSINESS',
      status: 'ACTIVE'
    }
  });

  const account = await prisma.account.upsert({
    where: { id: 'acl-demo-account' },
    update: {},
    create: {
      id: 'acl-demo-account',
      name: 'ACL Demo Account',
      type: 'BUSINESS',
      ownerId: user.id
    }
  });

  const project = await prisma.project.upsert({
    where: { slug: 'acl-demo-project' },
    update: {},
    create: {
      name: 'ACL Demo Project',
      slug: 'acl-demo-project',
      ownerId: user.id,
      accountId: account.id,
      accessLevel: 'PUBLIC'
    }
  });

  // Пример пользовательского уровня доступа
  const customLevel = await prisma.customAccessLevel.upsert({
    where: { projectId_name: { projectId: project.id, name: 'VIP' } },
    update: { isActive: true },
    create: {
      projectId: project.id,
      name: 'VIP',
      title: 'VIP пользователи',
      description: 'Доступ только для VIP',
      allowedRoles: JSON.stringify(['BUSINESS', 'AGENCY'] satisfies GlobalRole[]),
      conditions: JSON.stringify({ requireProjectAccess: false }),
      isSystem: false,
      isActive: true,
    }
  });

  // Пример MenuType / MenuItem c различными уровнями доступа
  const mainMenu = await prisma.menuType.upsert({
    where: { projectId_name: { projectId: project.id, name: 'main' } },
    update: {},
    create: {
      projectId: project.id,
      name: 'main',
      title: 'Main Menu'
    }
  });

  await prisma.menuItem.upsert({
    where: { menuTypeId_alias: { menuTypeId: mainMenu.id, alias: 'home' } },
    update: {},
    create: {
      menuTypeId: mainMenu.id,
      title: 'Home',
      alias: 'home',
      component: 'Website',
      view: 'page',
      targetId: 'home',
      accessLevel: 'PUBLIC',
      language: '*',
      orderIndex: 0,
    }
  });

  await prisma.menuItem.upsert({
    where: { menuTypeId_alias: { menuTypeId: mainMenu.id, alias: 'vip' } },
    update: {},
    create: {
      menuTypeId: mainMenu.id,
      title: 'VIP Area',
      alias: 'vip',
      component: 'Website',
      view: 'page',
      targetId: 'vip',
      accessLevel: 'CUSTOM',
      language: '*',
      orderIndex: 1,
    }
  });

  console.log('✅ ACL demo data seeded');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});


