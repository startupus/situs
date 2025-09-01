import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectsService } from '@/server/projects/projects.service';

function mockPrisma() {
  return {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  } as any;
}

describe('ProjectsService theme config', () => {
  let prisma: any;
  let service: ProjectsService;

  beforeEach(() => {
    prisma = mockPrisma();
    service = new ProjectsService(prisma);
  });

  it('returns default theme if project.theme is empty', async () => {
    prisma.project.findUnique.mockResolvedValue({ id: 'p1', theme: null });
    const cfg = await service.getProjectThemeConfig('p1');
    expect(cfg?.colors?.light?.primary).toBeTruthy();
  });

  it('updates theme and increments usage counter', async () => {
    prisma.project.findUnique.mockResolvedValueOnce({ id: 'p1', settings: '{}' });
    prisma.project.update.mockResolvedValue({ id: 'p1' });
    const input = { id: 'standard-theme', colors: { light: { primary: '#000000' }, dark: { primary: '#ffffff' } } } as any;
    const res = await service.updateProjectThemeConfig('p1', input);
    expect(res.success).toBe(true);
    expect(prisma.project.update).toHaveBeenCalled();
  });
});

