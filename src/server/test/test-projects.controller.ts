import { Controller, Get, Put, Param, Body, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { ThemeConfigDto } from '../projects/dto/theme-config.dto';

@Controller('projects')
export class TestProjectsController {
  constructor(@Inject(ProjectsService) private readonly projectsService: ProjectsService) {}

  @Get(':id/theme')
  async getTheme(@Param('id') id: string) {
    const theme = await this.projectsService.getProjectThemeConfig(id);
    return { success: true, data: theme } as const;
  }

  @Put(':id/theme')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async putTheme(@Param('id') id: string, @Body() body: ThemeConfigDto) {
    const safe = this.projectsService.sanitizeThemeConfig(body);
    const result = await this.projectsService.updateProjectThemeConfig(id, safe);
    return { success: result.success } as const;
  }

  @Get(':id/theme/usage')
  async getThemeUsage(@Param('id') id: string) {
    const usage = await this.projectsService.getProjectThemeUsage(id);
    return { success: true, data: usage } as const;
  }
}

