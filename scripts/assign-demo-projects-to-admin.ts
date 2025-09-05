/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmailCandidates = ['admin@situs.local', 'admin@startapus.com'];
  let admin = null as any;
  for (const email of adminEmailCandidates) {
    admin = await prisma.user.findUnique({ where: { email } });
    if (admin) break;
  }
  if (!admin) {
    console.error('Admin user not found by emails:', adminEmailCandidates.join(', '));
    process.exit(1);
  }

  const demoProjects = await prisma.project.findMany({
    where: {
      OR: [{ slug: { startsWith: 'demo-project-' } as any }, { name: { startsWith: 'Demo Project' } as any }],
    },
    select: { id: true, name: true, slug: true, ownerId: true },
  });

  if (demoProjects.length === 0) {
    console.log('No demo projects found to assign');
    return;
  }

  let updated = 0;
  for (const p of demoProjects) {
    if (p.ownerId === admin.id) continue;
    await prisma.project.update({ where: { id: p.id }, data: { ownerId: admin.id } });
    updated += 1;
    console.log('Assigned project to admin:', { id: p.id, slug: p.slug, name: p.name });
  }

  console.log(`Done. Updated ${updated}/${demoProjects.length} demo projects to owner=${admin.email}`);
}

main()
  .catch((e) => {
    console.error('Failed to assign demo projects:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
