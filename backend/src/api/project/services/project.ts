import { prisma } from '../../../index';

export interface ProjectFilters {
  search?: string;
  status?: string;
  template?: string;
  owner?: string;
  isPublic?: boolean;
}

export interface ProjectSort {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectPagination {
  page?: number;
  limit?: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  domain?: string;
  template?: string;
  settings?: any;
  owner?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  domain?: string;
  template?: string;
  settings?: any;
  isPublic?: boolean;
  status?: string;
}

export default {
  async find(params: { filters?: ProjectFilters; sort?: ProjectSort; pagination?: ProjectPagination }) {
    try {
      const { filters = {}, sort = {}, pagination = {} } = params;
      const { page = 1, limit = 10 } = pagination;
      
      // В реальном приложении здесь был бы запрос к Prisma
      // const projects = await prisma.project.findMany({
      //   where: buildWhereClause(filters),
      //   orderBy: buildOrderByClause(sort),
      //   skip: (page - 1) * limit,
      //   take: limit,
      //   include: {
      //     owner: true,
      //     collaborators: true,
      //     pages: true,
      //   },
      // });
      
      // Моковые данные для демонстрации
      const mockProjects = [
        {
          id: 'startapus-ecosystem',
          name: 'Стартапус - Демо проект',
          description: 'Официальный сайт экосистемы Стартапус',
          domain: 'startapus.com',
          template: 'website',
          settings: {
            theme: 'auto',
            primaryColor: '#3B82F6',
            favicon: '/favicon.ico',
            logo: '/logo.svg'
          },
          isPublic: false,
          status: 'published',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-23T15:30:00Z',
          publishedAt: '2024-01-01T10:00:00Z',
          owner: 'default-user',
          collaborators: [],
          pages: []
        }
      ];

      let filteredProjects = [...mockProjects];
      
      // Применяем фильтры
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          project.name.toLowerCase().includes(searchLower) ||
          project.description?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.template) {
        filteredProjects = filteredProjects.filter(project => 
          project.template === filters.template
        );
      }
      
      if (filters.status) {
        filteredProjects = filteredProjects.filter(project => 
          project.status === filters.status
        );
      }
      
      // Применяем сортировку
      if (sort.sortBy) {
        filteredProjects.sort((a, b) => {
          let aValue, bValue;
          
          switch (sort.sortBy) {
            case 'name':
              aValue = a.name;
              bValue = b.name;
              break;
            case 'updatedAt':
              aValue = new Date(a.updatedAt);
              bValue = new Date(b.updatedAt);
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
            default:
              return 0;
          }
          
          if (sort.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          } else {
            return aValue > bValue ? 1 : -1;
          }
        });
      }
      
      // Применяем пагинацию
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
      
      return {
        data: paginatedProjects,
        meta: {
          pagination: {
            page,
            limit,
            total: filteredProjects.length,
            totalPages: Math.ceil(filteredProjects.length / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error in project service find:', error);
      throw new Error('Failed to fetch projects');
    }
  },

  async findOne(id: string) {
    try {
      // В реальном приложении здесь был бы запрос к Prisma
      // const project = await prisma.project.findUnique({
      //   where: { id },
      //   include: {
      //     owner: true,
      //     collaborators: true,
      //     pages: true,
      //   },
      // });
      
      const mockProject = {
        id: 'startapus-ecosystem',
        name: 'Стартапус - Демо проект',
        description: 'Официальный сайт экосистемы Стартапус',
        domain: 'startapus.com',
        template: 'website',
        settings: {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg'
        },
        isPublic: false,
        status: 'published',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z',
        publishedAt: '2024-01-01T10:00:00Z',
        owner: 'default-user',
        collaborators: [],
        pages: []
      };
      
      if (mockProject.id !== id) {
        throw new Error('Project not found');
      }
      
      return mockProject;
    } catch (error) {
      console.error('Error in project service findOne:', error);
      throw error;
    }
  },

  async create(data: CreateProjectData) {
    try {
      if (!data.name) {
        throw new Error('Project name is required');
      }
      
      const newProject = {
        id: `project_${Date.now()}`,
        name: data.name,
        description: data.description || '',
        domain: data.domain || `${data.name.toLowerCase().replace(/\s+/g, '-')}.situs.com`,
        template: data.template || 'website',
        settings: data.settings || {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg'
        },
        isPublic: false,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: data.owner || 'default-user',
        collaborators: [],
        pages: []
      };
      
      // В реальном приложении здесь был бы запрос к Prisma
      // const project = await prisma.project.create({
      //   data: newProject,
      //   include: {
      //     owner: true,
      //     collaborators: true,
      //     pages: true,
      //   },
      // });
      
      return newProject;
    } catch (error) {
      console.error('Error in project service create:', error);
      throw error;
    }
  },

  async update(id: string, data: UpdateProjectData) {
    try {
      // В реальном приложении здесь был бы запрос к Prisma
      // const project = await prisma.project.update({
      //   where: { id },
      //   data: {
      //     ...data,
      //     updatedAt: new Date(),
      //   },
      //   include: {
      //     owner: true,
      //     collaborators: true,
      //     pages: true,
      //   },
      // });
      
      const updatedProject = {
        id,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return updatedProject;
    } catch (error) {
      console.error('Error in project service update:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      // В реальном приложении здесь был бы запрос к Prisma
      // await prisma.project.delete({
      //   where: { id },
      // });
      
      return { success: true };
    } catch (error) {
      console.error('Error in project service delete:', error);
      throw error;
    }
  }
}; 