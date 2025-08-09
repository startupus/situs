/**
 * Products API Service
 * Управление продуктами в проектах
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';

export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'WEBSITE' | 'STORE' | 'BLOG' | 'APP' | 'LANDING';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  projectId: string;
  settings: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    favicon: string;
    logo: string;
    domain?: string;
  };
  pages?: ProductPage[];
  analytics: {
    visitors: number;
    pageViews: number;
    conversionRate: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductPage {
  id: string;
  title: string;
  slug: string;
  content: any[];
  meta: {
    description: string;
    keywords: string[];
    ogImage: string;
  };
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  type: Product['type'];
  projectId: string;
  settings?: Partial<Product['settings']>;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  type?: Product['type'];
  status?: Product['status'];
  settings?: Partial<Product['settings']>;
}

export interface ProductFilters {
  projectId?: string;
  type?: Product['type'];
  status?: Product['status'];
  page?: number;
  limit?: number;
}

export interface ProductsListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ProductsApiService {
  private readonly baseEndpoint = '/products';

  /**
   * Получить список продуктов
   */
  async getProducts(filters?: ProductFilters): Promise<ProductsListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ProductsListResponse>>(
        this.baseEndpoint,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке продуктов');
    } catch (error) {
      console.error('Products API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить продукты проекта
   */
  async getProjectProducts(projectId: string): Promise<{ products: Product[]; project: any }> {
    try {
      const response = await apiClient.get<ApiResponse<{ products: Product[]; project: any }>>(
        `/projects/${projectId}/products`
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке продуктов проекта');
    } catch (error) {
      console.error('Get Project Products API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать продукт в проекте
   */
  async createProjectProduct(projectId: string, data: Omit<CreateProductData, 'projectId'>): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        `/projects/${projectId}/products`,
        data
      );
      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }
      throw new Error(response.error || 'Ошибка при создании продукта');
    } catch (error) {
      console.error('Create Project Product API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельный продукт
   */
  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `${this.baseEndpoint}/${productId}`
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Продукт не найден');
    } catch (error) {
      console.error('Get Product API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать новый продукт
   */
  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        this.baseEndpoint,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании продукта');
    } catch (error) {
      console.error('Create Product API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить продукт
   */
  async updateProduct(productId: string, data: UpdateProductData): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(
        `${this.baseEndpoint}/${productId}`,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении продукта');
    } catch (error) {
      console.error('Update Product API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Удалить продукт
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `${this.baseEndpoint}/${productId}`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при удалении продукта');
      }
    } catch (error) {
      console.error('Delete Product API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Опубликовать продукт
   */
  async publishProduct(productId: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${productId}/publish`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при публикации продукта');
      }
    } catch (error) {
      console.error('Publish Product API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Снять с публикации продукт
   */
  async unpublishProduct(productId: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${productId}/unpublish`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при снятии с публикации');
      }
    } catch (error) {
      console.error('Unpublish Product API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }
  /** Каталог доступных типов продуктов */
  async getAvailableProductTypes(): Promise<Array<{ key: string; title: string; type: string; icon: string }>> {
    try {
      const response = await apiClient.get<ApiResponse<Array<{ key: string; title: string; type: string; icon: string }>>>(
        `${this.baseEndpoint}/catalog/types`
      );
      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Get Product Types API Error:', error);
      return [];
    }
  }
}

export const productsApi = new ProductsApiService();
export default productsApi;
