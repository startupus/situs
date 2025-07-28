// Database API for Situs Platform using PostgreSQL and Prisma
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

export interface CreateProjectData {
  name: string;
  description?: string;
  type?: 'WEBSITE' | 'ECOMMERCE' | 'LANDING' | 'BLOG' | 'APP';
  ownerId: string;
}

export interface CreatePageData {
  title: string;
  slug: string;
  content?: any;
  projectId: string;
  isHomePage?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export class DatabaseAPI {
  // Projects
  static async getProjects(ownerId: string) {
    try {
      const projects = await prisma.project.findMany({
        where: { ownerId },
        include: {
          pages: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { pages: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type.toLowerCase(),
        status: project.status.toLowerCase(),
        domain: project.domain,
        subdomain: project.subdomain,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        pages: project.pages.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          content: page.content,
          isHomePage: page.isHomePage,
          isPublished: page.status === 'PUBLISHED',
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          createdAt: page.createdAt.toISOString(),
          updatedAt: page.updatedAt.toISOString(),
          siteId: page.projectId
        })),
        pageCount: project._count.pages
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  static async getProject(projectId: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          pages: {
            orderBy: { createdAt: 'desc' }
          },
          owner: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      if (!project) return null;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type.toLowerCase(),
        status: project.status.toLowerCase(),
        domain: project.domain,
        subdomain: project.subdomain,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        pages: project.pages.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          content: page.content,
          isHomePage: page.isHomePage,
          isPublished: page.status === 'PUBLISHED',
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          createdAt: page.createdAt.toISOString(),
          updatedAt: page.updatedAt.toISOString(),
          siteId: page.projectId
        })),
        owner: project.owner
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  static async createProject(data: CreateProjectData) {
    try {
      const project = await prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.type || 'WEBSITE',
          ownerId: data.ownerId,
          status: 'DRAFT'
        },
        include: {
          pages: true
        }
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type.toLowerCase(),
        status: project.status.toLowerCase(),
        domain: project.domain,
        subdomain: project.subdomain,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        pages: []
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  static async updateProject(projectId: string, data: Partial<CreateProjectData>) {
    try {
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          name: data.name,
          description: data.description,
          type: data.type as any
        },
        include: {
          pages: true
        }
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type.toLowerCase(),
        status: project.status.toLowerCase(),
        domain: project.domain,
        subdomain: project.subdomain,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        pages: project.pages.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          content: page.content,
          isHomePage: page.isHomePage,
          isPublished: page.status === 'PUBLISHED',
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          createdAt: page.createdAt.toISOString(),
          updatedAt: page.updatedAt.toISOString(),
          siteId: page.projectId
        }))
      };
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  static async deleteProject(projectId: string) {
    try {
      await prisma.project.delete({
        where: { id: projectId }
      });
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // Pages
  static async createPage(data: CreatePageData) {
    try {
      const page = await prisma.page.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content || { blocks: [] },
          projectId: data.projectId,
          isHomePage: data.isHomePage || false,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          status: 'DRAFT'
        }
      });

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        content: page.content,
        isHomePage: page.isHomePage,
        isPublished: page.status === 'PUBLISHED',
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString(),
        siteId: page.projectId
      };
    } catch (error) {
      console.error('Error creating page:', error);
      throw new Error('Failed to create page');
    }
  }

  static async updatePage(pageId: string, data: Partial<CreatePageData>) {
    try {
      const page = await prisma.page.update({
        where: { id: pageId },
        data: {
          title: data.title,
          content: data.content,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription
        }
      });

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        content: page.content,
        isHomePage: page.isHomePage,
        isPublished: page.status === 'PUBLISHED',
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString(),
        siteId: page.projectId
      };
    } catch (error) {
      console.error('Error updating page:', error);
      throw new Error('Failed to update page');
    }
  }

  static async deletePage(pageId: string) {
    try {
      await prisma.page.delete({
        where: { id: pageId }
      });
      return true;
    } catch (error) {
      console.error('Error deleting page:', error);
      return false;
    }
  }

  // Users and Authentication
  static async getUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          balances: {
            include: {
              currency: true
            }
          }
        }
      });

      if (!user) return null;

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        balances: user.balances.map(balance => ({
          amount: balance.amount,
          currency: balance.currency.code,
          symbol: balance.currency.symbol
        }))
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // Utility methods
  static async disconnect() {
    await prisma.$disconnect();
  }
}

export { prisma };
export default DatabaseAPI; 