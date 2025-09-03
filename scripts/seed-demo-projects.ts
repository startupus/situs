/* eslint-disable no-console */
import { PrismaClient, ProjectStatus, GlobalRole, UserStatus, ProductType, ProductStatus, PageStatus, PageType } from '@prisma/client';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureDemoOwner() {
  const username = 'demo-owner';
  const email = 'demo-owner@example.com';
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      username,
      email,
      password: 'dev-password',
      globalRole: GlobalRole.BUSINESS,
      status: UserStatus.ACTIVE,
    },
  });
}

async function main() {
  const owner = await ensureDemoOwner();
  const baseNames = [
    'Demo Project 1',
    'Demo Project 2',
    'Demo Project 3',
    'Demo Project 4',
    'Demo Project 5',
  ];

  for (const name of baseNames) {
    const s = slugify(name);
    const slug = s || `project-${Date.now()}`;
    const exists = await prisma.project.findUnique({ where: { slug } });
    if (exists) {
      console.log('skip existing', slug);
      continue;
    }
    const created = await prisma.project.create({
      data: {
        name,
        slug,
        description: null, // описания здесь опциональны
        ownerId: owner.id,
        status: ProjectStatus.ACTIVE,
        isPublished: false,
      },
      select: { id: true, name: true, slug: true },
    });
    console.log('created', created);

    // Создаём подключаемый продукт WEBSITE для проекта
    const website = await prisma.product.create({
      data: {
        name: 'Website',
        description: 'Корпоративный сайт проекта',
        type: ProductType.WEBSITE,
        status: ProductStatus.ACTIVE,
        projectId: created.id,
        settings: '{}',
      },
      select: { id: true },
    });

    // Создаём базовые страницы для WEBSITE
    const pages = [
      { title: 'Главная', slug: 'home', isHomePage: true, orderIndex: 0 },
      { title: 'О компании', slug: 'about', isHomePage: false, orderIndex: 1 },
      { title: 'Контакты', slug: 'contacts', isHomePage: false, orderIndex: 2 },
    ];
    for (const p of pages) {
      await prisma.page.upsert({
        where: { productId_slug: { productId: website.id, slug: p.slug } },
        update: {},
        create: {
          title: p.title,
          slug: p.slug,
          content: '{}',
          pageType: PageType.PAGE,
          status: PageStatus.DRAFT,
          isHomePage: p.isHomePage,
          orderIndex: p.orderIndex,
          productId: website.id,
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('seed failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });


