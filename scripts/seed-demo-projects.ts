/* eslint-disable no-console */
import { PrismaClient, ProjectStatus, UserRole, UserStatus } from '@prisma/client';

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
      role: UserRole.BUSINESS,
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
        description: null, // требований нет — описания у проектов больше не используем
        ownerId: owner.id,
        status: ProjectStatus.ACTIVE,
        isPublished: false,
      },
      select: { id: true, name: true, slug: true },
    });
    console.log('created', created);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('seed failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });


