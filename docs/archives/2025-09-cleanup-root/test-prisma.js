import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing prisma.project...');
    console.log('prisma.project exists:', !!prisma.project);

    if (prisma.project) {
      const projects = await prisma.project.findMany({ take: 2 });
      console.log('Projects found:', projects.length);
      console.log('First project:', projects[0]?.name);
    } else {
      console.log(
        'Available methods:',
        Object.keys(prisma).filter((k) => typeof prisma[k] === 'object'),
      );
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
