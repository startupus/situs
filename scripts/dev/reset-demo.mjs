import { PrismaClient, ProductType, ProductStatus, PageStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDemo() {
  console.log('🔄 Reset demo data...');
  try {
    // Clean existing demo data by deleting all projects (cascade to products/pages)
    await prisma.page.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.project.deleteMany({});

    // Ensure dev owner
    const dev = await prisma.user.upsert({
      where: { email: 'dev@situs.local' },
      update: {},
      create: { username: 'dev', email: 'dev@situs.local', password: 'dev', status: 'ACTIVE' },
    });
    console.log('👤 Owner:', dev.id);

    // Create project "Стартапус"
    const project = await prisma.project.create({
      data: {
        name: 'Стартапус',
        description: 'Демо проект платформы Стартапус',
        slug: 'startapus',
        ownerId: dev.id,
        status: 'ACTIVE',
        settings: '{"theme":"auto","language":"ru"}',
      },
    });
    console.log('📁 Project:', project.id);

    // Create site (product) inside project
    const site = await prisma.product.create({
      data: {
        name: 'Сайт Стартапус',
        description: 'Демо сайт',
        type: ProductType.WEBSITE,
        status: ProductStatus.ACTIVE,
        settings: '{}',
        projectId: project.id,
      },
    });
    console.log('🌐 Site product:', site.id);

    // Create 5 typical pages
    const pages = [
      { title: 'Главная', slug: '', status: PageStatus.DRAFT },
      { title: 'О компании', slug: 'about', status: PageStatus.DRAFT },
      { title: 'Продукты', slug: 'products', status: PageStatus.DRAFT },
      { title: 'Блог', slug: 'blog', status: PageStatus.DRAFT },
      { title: 'Контакты', slug: 'contact', status: PageStatus.DRAFT },
    ];
    for (const p of pages) {
      const created = await prisma.page.create({
        data: {
          title: p.title,
          slug: p.slug,
          content: null,
          pageType: 'PAGE',
          status: p.status,
          productId: site.id,
        },
      });
      console.log('📝 Page:', created.slug || '(home)');
    }

    console.log('✅ Demo data reset complete');
  } catch (e) {
    console.error('❌ Reset demo failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDemo();
