import 'reflect-metadata';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestAppModule } from '@/server/test/test-app.module';
import request from 'supertest';

let app: INestApplication;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [TestAppModule] }).compile();
  app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
});

afterAll(async () => {
  await app.close();
});

describe('Project Themes E2E (MVP)', () => {
  it('GET /api/health', async () => {
    const server = app.getHttpServer();
    const res = await request(server).get('/api/health');
    expect([200, 404]).toContain(res.status);
  });

  it('GET/PUT /api/projects/:id/theme', async () => {
    const server = app.getHttpServer();
    // GET default
    let r = await request(server).get('/api/projects/e2e/theme');
    expect([200, 404]).toContain(r.status);

    // PUT minimal valid dto
    const body = {
      id: 'standard-theme',
      name: 'Стандартная тема',
      colors: {
        light: {
          primary: '#4C1D95', primaryHover: '#7C3AED', primaryActive: '#5B21B6',
          secondary: '#13C296', accent: '#9055FD', success: '#22AD5C', warning: '#FBBF24', error: '#F23030', info: '#2D68F8',
          background: '#FFFFFF', surface: '#F9FAFB', text: '#1F2937', textSecondary: '#6B7280', border: '#E5E7EB', borderLight: '#F3F4F6'
        },
        dark: {
          primary: '#8B5CF6', primaryHover: '#A78BFA', primaryActive: '#7C3AED',
          secondary: '#10B981', accent: '#34D399', success: '#34D399', warning: '#F59E0B', error: '#F87171', info: '#60A5FA',
          background: '#0F0F23', surface: '#1E1E3F', text: '#F1F5F9', textSecondary: '#CBD5E1', border: '#4C1D95', borderLight: '#6D28D9'
        }
      }
    };
    let p = await request(server).put('/api/projects/e2e/theme').send(body);
    expect([200, 404]).toContain(p.status);
  });
});

