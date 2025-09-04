import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const templates = [
    { id: 'tpl-business-pro', name: 'Business Pro', category: 'business', isBuiltIn: true },
    { id: 'tpl-creative-agency', name: 'Creative Agency', category: 'creative', isBuiltIn: true },
    { id: 'tpl-ecommerce', name: 'E-commerce', category: 'ecommerce', isBuiltIn: true },
  ];
  for (const t of templates) {
    await prisma.themeTemplate.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        category: t.category,
        isBuiltIn: t.isBuiltIn,
        isPublic: true,
        config: {},
      },
    });
  }
  console.log('✅ Seeded theme_templates');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

