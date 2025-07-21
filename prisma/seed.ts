// Автоматически конвертировано из JavaScript в TypeScript
// Требует дополнительной типизации для соответствия стандартам Hubus

import { PrismaClient  } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): any {
  // Очищаем таблицы
  await prisma.serviceApplication.deleteMany();
  await prisma.service.deleteMany();
  await prisma.provider.deleteMany();

  // Создаём тестового провайдера
  const provider = await prisma.provider.create({
    data: {
      id: 'test-provider',
      name: 'Тестовый провайдер',
      email: 'test@provider.com',
    },
  });

  // Создаём тестовый сервис
  await prisma.service.create({
    data: {
      id: 'test-service',
      providerId: provider.id,
      name: 'Test Service',
      endpoint: 'https://test.endpoint',
    },
  });

  // Создаём тестовую заявку
  await prisma.serviceApplication.create({
    data: {
      id: 'test-application',
      providerId: provider.id,
      name: 'Test Application',
      endpoint: 'https://test.endpoint',
      status: 'pending',
    },
  });

  void console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
