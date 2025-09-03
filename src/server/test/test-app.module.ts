import { Module } from '@nestjs/common';
import { HealthController } from '../health/health.controller';
import { TestProjectsController } from './test-projects.controller';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaServiceMock } from './prisma.service.mock';

@Module({
  imports: [],
  controllers: [HealthController, TestProjectsController],
  providers: [
    { provide: ProjectsService, useFactory: (prisma: PrismaService) => new ProjectsService(prisma), inject: [PrismaService] },
    { provide: PrismaService, useClass: PrismaServiceMock },
  ],
})
export class TestAppModule {}

