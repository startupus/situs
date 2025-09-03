/**
 * E2E тесты для полного флоу системы прав доступа
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PermissionsModule } from '../../permissions.module';
import { DatabaseModule } from '../../../../database/database.module';
import * as request from 'supertest';

describe('Permissions System E2E', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // Тестовые пользователи
  const testUsers = {
    superAdmin: {
      id: 'super-admin-123',
      email: 'superadmin@test.com',
      username: 'superadmin',
      password: 'password',
      globalRole: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
    staff: {
      id: 'staff-123',
      email: 'staff@test.com',
      username: 'staff',
      password: 'password',
      globalRole: 'STAFF',
      status: 'ACTIVE',
    },
    agency: {
      id: 'agency-123',
      email: 'agency@test.com',
      username: 'agency',
      password: 'password',
      globalRole: 'AGENCY',
      status: 'ACTIVE',
    },
    business: {
      id: 'business-123',
      email: 'business@test.com',
      username: 'business',
      password: 'password',
      globalRole: 'BUSINESS',
      status: 'ACTIVE',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, PermissionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    // Создаем тестовых пользователей
    await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await app.close();
  });

  describe('SUPER_ADMIN права', () => {
    it('должен иметь доступ ко всем эндпоинтам', async () => {
      const token = await getAuthToken('superadmin@test.com');

      // Тестируем доступ к различным эндпоинтам
      await request(app.getHttpServer()).get('/api/projects').set('Authorization', `Bearer ${token}`).expect(200);

      await request(app.getHttpServer()).get('/api/users').set('Authorization', `Bearer ${token}`).expect(200);

      await request(app.getHttpServer())
        .get('/api/analytics/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('STAFF права', () => {
    it('должен иметь доступ к административным функциям', async () => {
      const token = await getAuthToken('staff@test.com');

      // Должен иметь доступ к пользователям
      await request(app.getHttpServer()).get('/api/users').set('Authorization', `Bearer ${token}`).expect(200);

      // Должен иметь доступ ко всем проектам
      await request(app.getHttpServer()).get('/api/projects').set('Authorization', `Bearer ${token}`).expect(200);
    });

    it('не должен иметь доступ к супер-админским функциям', async () => {
      const token = await getAuthToken('staff@test.com');

      // Системные настройки только для SUPER_ADMIN
      await request(app.getHttpServer()).post('/api/system/config').set('Authorization', `Bearer ${token}`).expect(403);
    });
  });

  describe('AGENCY права', () => {
    it('должен иметь доступ к собственным проектам', async () => {
      const token = await getAuthToken('agency@test.com');

      // Создаем проект для агентства
      const project = await createTestProject(testUsers.agency.id);

      await request(app.getHttpServer())
        .get(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('должен иметь доступ к проектам клиентов', async () => {
      const token = await getAuthToken('agency@test.com');

      // Создаем клиента и устанавливаем агентские отношения
      const client = await createTestClient();
      await createAgencyClientRelation(testUsers.agency.id, client.id);
      const clientProject = await createTestProject(client.id);

      await request(app.getHttpServer())
        .get(`/api/projects/${clientProject.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('не должен иметь доступ к проектам других агентств', async () => {
      const token = await getAuthToken('agency@test.com');

      // Создаем проект другого пользователя
      const otherProject = await createTestProject(testUsers.business.id);

      await request(app.getHttpServer())
        .get(`/api/projects/${otherProject.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('BUSINESS права', () => {
    it('должен иметь доступ только к собственным проектам', async () => {
      const token = await getAuthToken('business@test.com');

      // Собственный проект - доступ разрешен
      const ownProject = await createTestProject(testUsers.business.id);

      await request(app.getHttpServer())
        .get(`/api/projects/${ownProject.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Чужой проект - доступ запрещен
      const otherProject = await createTestProject(testUsers.agency.id);

      await request(app.getHttpServer())
        .get(`/api/projects/${otherProject.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('не должен иметь доступ к административным функциям', async () => {
      const token = await getAuthToken('business@test.com');

      // Управление пользователями запрещено
      await request(app.getHttpServer()).get('/api/users').set('Authorization', `Bearer ${token}`).expect(403);

      // Системная аналитика запрещена
      await request(app.getHttpServer())
        .get('/api/analytics/system')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('Контекстные права', () => {
    it('должен проверять владение ресурсом', async () => {
      const businessToken = await getAuthToken('business@test.com');
      const agencyToken = await getAuthToken('agency@test.com');

      const businessProject = await createTestProject(testUsers.business.id);

      // Владелец может редактировать
      await request(app.getHttpServer())
        .patch(`/api/projects/${businessProject.id}`)
        .set('Authorization', `Bearer ${businessToken}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      // Не-владелец не может редактировать
      await request(app.getHttpServer())
        .patch(`/api/projects/${businessProject.id}`)
        .set('Authorization', `Bearer ${agencyToken}`)
        .send({ name: 'Hacked Name' })
        .expect(403);
    });

    it('должен проверять агентские отношения', async () => {
      const agencyToken = await getAuthToken('agency@test.com');

      // Создаем клиента и проект
      const client = await createTestClient();
      const clientProject = await createTestProject(client.id);

      // Без агентских отношений - доступ запрещен
      await request(app.getHttpServer())
        .get(`/api/projects/${clientProject.id}`)
        .set('Authorization', `Bearer ${agencyToken}`)
        .expect(403);

      // Устанавливаем агентские отношения
      await createAgencyClientRelation(testUsers.agency.id, client.id);

      // Теперь доступ разрешен
      await request(app.getHttpServer())
        .get(`/api/projects/${clientProject.id}`)
        .set('Authorization', `Bearer ${agencyToken}`)
        .expect(200);
    });
  });

  // Вспомогательные функции
  async function setupTestData() {
    // Создаем тестовых пользователей
    for (const user of Object.values(testUsers)) {
      await prismaService.user.upsert({
        where: { email: user.email },
        create: user,
        update: user,
      });
    }
  }

  async function cleanupTestData() {
    // Очищаем тестовые данные
    await prismaService.agencyClient.deleteMany({});
    await prismaService.projectAccess.deleteMany({});
    await prismaService.project.deleteMany({});
    await prismaService.account.deleteMany({});
    await prismaService.user.deleteMany({
      where: {
        email: { in: Object.values(testUsers).map((u) => u.email) },
      },
    });
  }

  async function getAuthToken(email: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'password' })
      .expect(200);

    return response.body.access_token;
  }

  async function createTestProject(ownerId: string) {
    return prismaService.project.create({
      data: {
        name: `Test Project ${Date.now()}`,
        slug: `test-project-${Date.now()}`,
        ownerId,
        status: 'ACTIVE',
      },
    });
  }

  async function createTestClient() {
    return prismaService.user.create({
      data: {
        email: `client-${Date.now()}@test.com`,
        username: `client-${Date.now()}`,
        password: 'password',
        globalRole: 'BUSINESS',
        status: 'ACTIVE',
      },
    });
  }

  async function createAgencyClientRelation(agencyUserId: string, clientUserId: string) {
    // Создаем аккаунты
    const agencyAccount = await prismaService.account.create({
      data: {
        name: 'Agency Account',
        type: 'AGENCY',
        ownerId: agencyUserId,
      },
    });

    const clientAccount = await prismaService.account.create({
      data: {
        name: 'Client Account',
        type: 'BUSINESS',
        ownerId: clientUserId,
      },
    });

    // Создаем связь
    return prismaService.agencyClient.create({
      data: {
        agencyAccountId: agencyAccount.id,
        clientAccountId: clientAccount.id,
      },
    });
  }
});
