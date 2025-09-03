import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const devEmail = 'dev@situs.local';
    const dev = await prisma.user.upsert({
      where: { email: devEmail },
      update: {},
      create: { username: 'dev', email: devEmail, password: 'dev' },
    });
    console.log('dev user id:', dev.id);

    const name = 'CLI Project ' + Date.now();
    const project = await prisma.project.create({
      data: {
        name,
        description: 'created via script',
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-'),
        settings: '{}',
        ownerId: dev.id,
        status: 'ACTIVE',
      },
    });

    console.log('created project:', project);
  } catch (e) {
    console.error('script error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
