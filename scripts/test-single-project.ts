#!/usr/bin/env tsx
import {
  PrismaClient,
  ProductType,
  PageStatus,
  PageType,
  ProjectStatus,
  GlobalRole,
  UserStatus,
  ProductStatus,
} from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

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
  console.log('🚀 Тестирование создания одного проекта...');

  const owner = await ensureDemoOwner();
  console.log(`👤 Владелец готов: ${owner.username}`);

  const name = 'Test Project Simple';
  const slug = slugify(name);

  // Проверяем существование проекта
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    console.log(`📦 Проект "${name}" уже существует, удаляем`);
    await prisma.project.delete({ where: { id: existing.id } });
  }

  // Создаем проект
  console.log('📦 Создаем проект...');
  const project = await prisma.project.create({
    data: {
      name,
      slug,
      description: 'Простой тестовый проект',
      ownerId: owner.id,
      status: ProjectStatus.ACTIVE,
      isPublished: true,
      settings: JSON.stringify({ theme: 'auto' }),
    },
  });
  console.log(`📦 Проект создан: ${project.name} (${project.id})`);

  // Проверяем что проект сохранился
  const check1 = await prisma.project.findUnique({ where: { id: project.id } });
  console.log(`✅ Проверка 1: проект ${check1 ? 'найден' : 'НЕ НАЙДЕН'}`);

  // Создаем простой продукт
  console.log('🌐 Создаем продукт...');
  const website = await prisma.product.create({
    data: {
      name: 'Сайт',
      description: 'Простой сайт',
      type: ProductType.WEBSITE,
      status: ProductStatus.ACTIVE,
      projectId: project.id,
      settings: '{}',
    },
  });
  console.log(`🌐 Продукт создан: ${website.id}`);

  // Проверяем что проект все еще существует
  const check2 = await prisma.project.findUnique({ where: { id: project.id } });
  console.log(`✅ Проверка 2: проект ${check2 ? 'найден' : 'НЕ НАЙДЕН'}`);

  // Создаем простую страницу
  console.log('📄 Создаем страницу...');
  const page = await prisma.page.create({
    data: {
      title: 'Главная',
      slug: 'home',
      content: JSON.stringify({ blocks: [] }),
      status: PageStatus.PUBLISHED,
      pageType: PageType.PAGE,
      isHomePage: true,
      orderIndex: 0,
      productId: website.id,
    },
  });
  console.log(`📄 Страница создана: ${page.id}`);

  // Финальная проверка
  const finalCheck = await prisma.project.findUnique({ where: { id: project.id } });
  console.log(`✅ Финальная проверка: проект ${finalCheck ? 'найден' : 'НЕ НАЙДЕН'}`);

  // Проверяем все проекты в базе
  const allProjects = await prisma.project.findMany();
  console.log(`📊 Всего проектов в базе: ${allProjects.length}`);
  allProjects.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

  console.log('✅ Тест завершен');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Ошибка:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
