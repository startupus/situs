import { Request, Response } from 'express';
import projectService from '../services/project';

export default {
  async find(ctx: { query: any }) {
    try {
      const { search, status, template, sortBy, sortOrder, page, limit } = ctx.query;
      
      const params = {
        filters: {
          search: search as string,
          status: status as string,
          template: template as string,
        },
        sort: {
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc',
        },
        pagination: {
          page: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 10,
        },
      };
      
      const result = await projectService.find(params);
      
      return {
        data: result.data,
        meta: result.meta,
      };
    } catch (error) {
      console.error('Error in project controller find:', error);
      throw error;
    }
  },

  async findOne(ctx: { params: { id: string } }) {
    try {
      const { id } = ctx.params;
      const project = await projectService.findOne(id);
      
      return {
        data: project,
      };
    } catch (error) {
      console.error('Error in project controller findOne:', error);
      throw error;
    }
  },

  async create(ctx: { request: { body: any } }) {
    try {
      const { name, description, domain, template, settings } = ctx.request.body;
      
      if (!name) {
        throw new Error('Project name is required');
      }
      
      const projectData = {
        name,
        description,
        domain,
        template,
        settings,
      };
      
      const project = await projectService.create(projectData);
      
      return {
        data: project,
      };
    } catch (error) {
      console.error('Error in project controller create:', error);
      throw error;
    }
  },

  async update(ctx: { params: { id: string }; request: { body: any } }) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;
      
      const project = await projectService.update(id, updateData);
      
      return {
        data: project,
      };
    } catch (error) {
      console.error('Error in project controller update:', error);
      throw error;
    }
  },

  async delete(ctx: { params: { id: string } }) {
    try {
      const { id } = ctx.params;
      await projectService.delete(id);
      
      return {
        data: { success: true },
      };
    } catch (error) {
      console.error('Error in project controller delete:', error);
      throw error;
    }
  },
}; 