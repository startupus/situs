import { Module } from '@nestjs/common';
import { HealthController } from '../health/health.controller';
import { ProjectsController } from '../projects/projects.controller';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaServiceMock } from './prisma.service.mock';

@Module({
  imports: [],
  controllers: [HealthController, ProjectsController],
  providers: [
    ProjectsService,
    { provide: PrismaService, useClass: PrismaServiceMock },
  ],
})
export class TestAppModule {}

