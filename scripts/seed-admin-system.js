'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('@prisma/client');
const bcrypt = require('bcryptjs');

/**
 * Сид системного проекта админки и базовых администраторов.
 * Исправлен под актуальную Prisma схему.
 */
async function main() {
  const prisma = new client_1.PrismaClient();
  try {
    console.log('🌱 Seeding system admin project...');
    
    // Хэш пароля Admin123!
    const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
    
    // 1) Создаём/обновляем основного админа
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@situs.local' },
      update: {
        globalRole: client_1.GlobalRole.SUPER_ADMIN,
        status: 'ACTIVE',
        password: adminPasswordHash,
      },
      create: {
        username: 'admin',
        email: 'admin@situs.local',
        password: adminPasswordHash,
        globalRole: client_1.GlobalRole.SUPER_ADMIN,
        status: 'ACTIVE',
        profile: JSON.stringify({ name: 'Администратор' }),
      },
    });
    
    // 2) Создаём/обновляем QA админа
    const qaAdmin = await prisma.user.upsert({
      where: { email: 'qa+admin2@situs.local' },
      update: {
        globalRole: client_1.GlobalRole.SUPER_ADMIN,
        status: 'ACTIVE',
        password: adminPasswordHash,
      },
      create: {
        username: 'qa_admin2',
        email: 'qa+admin2@situs.local',
        password: adminPasswordHash,
        globalRole: client_1.GlobalRole.SUPER_ADMIN,
        status: 'ACTIVE',
        profile: JSON.stringify({ name: 'QA Администратор' }),
      },
    });

    console.log('👤 Admins ready:', adminUser.email, qaAdmin.email);

    // 3) Проект situs-admin
    const project = await prisma.project.upsert({
      where: { slug: 'situs-admin' },
      update: {
        name: 'Situs Admin',
        description: 'Системный проект админки',
        status: client_1.ProjectStatus.ACTIVE,
        isSystemAdmin: true,
        settings: JSON.stringify({ isSystemAdmin: true, language: 'ru' }),
      },
      create: {
        name: 'Situs Admin',
        description: 'Системный проект админки',
        slug: 'situs-admin',
        ownerId: adminUser.id,
        status: client_1.ProjectStatus.ACTIVE,
        isSystemAdmin: true,
        settings: JSON.stringify({ isSystemAdmin: true, language: 'ru' }),
        theme: JSON.stringify({ primaryColor: '#3B82F6', secondaryColor: '#8B5CF6' }),
      },
    });
    
    console.log('📦 Project ready:', project.slug);

    // 4) Admin продукт (исправлен compound key)
    const adminProduct = await prisma.product.upsert({
      where: {
        projectId_name: {
          projectId: project.id,
          name: 'Админ-панель',
        },
      },
      update: {
        description: 'Системная админ-панель',
        status: client_1.ProductStatus.DRAFT,
      },
      create: {
        name: 'Админ-панель',
        description: 'Системная админ-панель',
        type: client_1.ProductType.ADMIN,
        projectId: project.id,
        status: client_1.ProductStatus.DRAFT,
        settings: '{}',
      },
    });

    console.log('🧩 Product ADMIN ready:', adminProduct.id);

    console.log('✅ System admin seed completed successfully');
  } catch (error) {
    console.error('❌ System admin seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
