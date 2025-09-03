import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectsService } from '@/server/projects/projects.service';

function mockPrisma() {
  return {
    user: { findUnique: vi.fn(), upsert: vi.fn() },
    project: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  } as any;
}

function mockRealtime() {
  return {
    publishProjectStatus: vi.fn(),
    publish: vi.fn(),
  } as any;
}

describe('ProjectsService.update', () => {
  let prisma: any;
  let realtime: any;
  let service: ProjectsService;

  beforeEach(() => {
    prisma = mockPrisma();
    realtime = mockRealtime();
    service = new ProjectsService(prisma, realtime);
  });

  it('throws NotFound when project not found for owner and by id', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'owner-1' });
    prisma.project.findFirst.mockResolvedValue(null);
    prisma.project.findUnique.mockResolvedValue(null);
    await expect(service.update('p1', { name: 'X' } as any, 'owner-1')).rejects.toThrow('Проект не найден');
  });

  it('throws BadRequest on duplicate name for same owner', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'owner-1' });
    // target by id
    prisma.project.findUnique
      .mockResolvedValueOnce({ id: 'p1', name: 'A', ownerId: 'owner-1' }) // target
      .mockResolvedValueOnce({ id: 'p1', name: 'A', ownerId: 'owner-1' }); // existingProject by id
    prisma.project.findFirst
      .mockResolvedValueOnce(null) // target by slug fallback
      .mockResolvedValueOnce({ id: 'p2', name: 'B', ownerId: 'owner-1' }); // duplicate name
    await expect(service.update('p1', { name: 'B' } as any, 'owner-1')).rejects.toThrow('уже существует');
  });

  it('updates customDomain with uniqueness check', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'owner-1' });
    prisma.project.findUnique
      .mockResolvedValueOnce({ id: 'p1', name: 'A', ownerId: 'owner-1' }) // target
      .mockResolvedValueOnce({ id: 'p1', name: 'A', ownerId: 'owner-1' }); // existingProject
    prisma.project.findFirst
      .mockResolvedValueOnce(null) // target by slug fallback
      .mockResolvedValueOnce(null); // duplicate customDomain
    prisma.project.update.mockResolvedValue({ id: 'p1', name: 'A', status: 'ACTIVE', updatedAt: new Date(), isPublished: false });
    const res = await service.update('p1', { customDomain: 'example.com' } as any, 'owner-1');
    expect(res.id).toBe('p1');
    expect(prisma.project.update).toHaveBeenCalled();
  });

  it('maps status and publishes SSE events', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'owner-1' });
    prisma.project.findUnique
      .mockResolvedValueOnce({ id: 'p1', name: 'A', ownerId: 'owner-1' }) // target
      .mockResolvedValueOnce({ id: 'p1', name: 'A', ownerId: 'owner-1' }); // existingProject
    prisma.project.findFirst.mockResolvedValueOnce(null); // slug fallback
    prisma.project.update.mockResolvedValue({ id: 'p1', name: 'A', status: 'ACTIVE', updatedAt: new Date(), isPublished: true });
    await service.update('p1', { status: 'ACTIVE', isPublished: true } as any, 'owner-1');
    expect(realtime.publishProjectStatus).toHaveBeenCalledWith('p1', 'ACTIVE');
    expect(realtime.publish).toHaveBeenCalledWith('project_updated', expect.objectContaining({ id: 'p1' }));
  });
});


