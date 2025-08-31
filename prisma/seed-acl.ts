import { PrismaClient, AccessLevel, GlobalRole, ProductType, PageStatus, PageType } from '@prisma/client';

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

  // 0.3) Продукты демо‑проекта: WEBSITE + ECOMMERCE с базовыми данными
  // WEBSITE
  const websiteProduct = await prisma.product.upsert({
    where: { projectId_name: { projectId: project.id, name: 'Сайт' } as any },
    update: { type: ProductType.WEBSITE, status: 'ACTIVE' as any },
    create: {
      projectId: project.id,
      name: 'Сайт',
      description: 'Управление страницами проекта (демо)',
      type: ProductType.WEBSITE,
      status: 'ACTIVE' as any,
      settings: '{}',
    },
  });
  // Базовые страницы
  const basePages: Array<{ title: string; slug: string; isHomePage?: boolean }> = [
    { title: 'Главная', slug: 'home', isHomePage: true },
    { title: 'О компании', slug: 'about' },
    { title: 'Контакты', slug: 'contacts' },
  ];
  for (const p of basePages) {
    await prisma.page.upsert({
      where: { productId_slug: { productId: websiteProduct.id, slug: p.slug } as any },
      update: { title: p.title, isHomePage: !!p.isHomePage, status: PageStatus.DRAFT, pageType: PageType.PAGE },
      create: {
        productId: websiteProduct.id,
        title: p.title,
        slug: p.slug,
        content: '{}',
        status: PageStatus.DRAFT,
        pageType: PageType.PAGE,
        isHomePage: !!p.isHomePage,
      },
    });
  }

  // ECOMMERCE (STORE)
  const storeProduct = await prisma.product.upsert({
    where: { projectId_name: { projectId: project.id, name: 'Магазин' } as any },
    update: { type: ProductType.ECOMMERCE, status: 'ACTIVE' as any },
    create: {
      projectId: project.id,
      name: 'Магазин',
      description: 'Демо-магазин с категориями и товарами',
      type: ProductType.ECOMMERCE,
      status: 'ACTIVE' as any,
      settings: '{}',
    },
  });
  const rootCategory = await prisma.category.upsert({
    where: { productId_slug: { productId: storeProduct.id, slug: 'catalog' } as any },
    update: { name: 'Каталог', alias: 'catalog', level: 1, isPublished: true },
    create: {
      productId: storeProduct.id,
      name: 'Каталог',
      description: 'Основной каталог товаров',
      slug: 'catalog',
      alias: 'catalog',
      level: 1,
      orderIndex: 0,
      isPublished: true,
      language: '*',
      accessLevel: AccessLevel.PUBLIC,
    },
  });
  await prisma.item.upsert({
    where: { productId_slug: { productId: storeProduct.id, slug: 'demo-item' } as any },
    update: { name: 'Демо товар', status: 'ACTIVE' as any, price: '1990' as any, categoryId: rootCategory.id },
    create: {
      productId: storeProduct.id,
      categoryId: rootCategory.id,
      name: 'Демо товар',
      slug: 'demo-item',
      description: 'Пример товара для демонстрации',
      price: '1990' as any,
      status: 'ACTIVE' as any,
      quantity: 10,
      images: '[]',
    },
  });

  // 0) Демонстрационные пользователи под все глобальные роли
  // Создаём, если не существуют, для демонстрации ACL в админке и UI
  const demoUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'superadmin@situs.local' },
      update: { globalRole: 'SUPER_ADMIN', status: 'ACTIVE' },
      create: { username: 'superadmin', email: 'superadmin@situs.local', password: 'x', globalRole: 'SUPER_ADMIN', status: 'ACTIVE' }
    }),
    prisma.user.upsert({
      where: { email: 'staff@situs.local' },
      update: { globalRole: 'STAFF', status: 'ACTIVE' },
      create: { username: 'staff', email: 'staff@situs.local', password: 'x', globalRole: 'STAFF', status: 'ACTIVE' }
    }),
    prisma.user.upsert({
      where: { email: 'agency@situs.local' },
      update: { globalRole: 'AGENCY', status: 'ACTIVE' },
      create: { username: 'agency', email: 'agency@situs.local', password: 'x', globalRole: 'AGENCY', status: 'ACTIVE' }
    }),
    prisma.user.upsert({
      where: { email: 'business@situs.local' },
      update: { globalRole: 'BUSINESS', status: 'ACTIVE' },
      create: { username: 'business', email: 'business@situs.local', password: 'x', globalRole: 'BUSINESS', status: 'ACTIVE' }
    }),
  ]);

  // 0.1) Демонстрационные группы пользователей (Joomla-like)
  const groups = await Promise.all([
    prisma.userGroup.upsert({ where: { title: 'Admins' }, update: {}, create: { title: 'Admins', isCore: true } }),
    prisma.userGroup.upsert({ where: { title: 'Managers' }, update: {}, create: { title: 'Managers', isCore: true } }),
    prisma.userGroup.upsert({ where: { title: 'Editors' }, update: {}, create: { title: 'Editors', isCore: false } }),
    prisma.userGroup.upsert({ where: { title: 'Viewers' }, update: {}, create: { title: 'Viewers', isCore: false } }),
  ]);

  // 0.2) Назначения пользователей в группы (демо)
  const byTitle = (t: string) => groups.find((g) => g.title === t)!;
  const [uSuper, uStaff, uAgency, uBusiness] = demoUsers;
  const ensureMap = async (userId: string, title: string) => {
    const g = byTitle(title);
    await prisma.userGroupMap.upsert({
      where: { userId_groupId: { userId, groupId: g.id } as any },
      update: {},
      create: { userId, groupId: g.id },
    });
  };
  await ensureMap(uSuper.id, 'Admins');
  await ensureMap(uStaff.id, 'Managers');
  await ensureMap(uAgency.id, 'Editors');
  await ensureMap(uBusiness.id, 'Viewers');

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


