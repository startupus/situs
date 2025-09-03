/**
 * E-commerce API Service
 * Управление магазинами, продуктами и продажами
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';

export interface Store {
  id: string;
  name: string;
  description: string;
  url: string;
  domain?: string;
  customDomain?: string;
  status: 'active' | 'inactive' | 'development' | 'maintenance';
  ownerId: string;
  settings: StoreSettings;
  stats: StoreStats;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  currency: string;
  language: string;
  timezone: string;
  theme: string;
  enableInventoryTracking: boolean;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableCoupons: boolean;
  taxRate: number;
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
}

export interface StoreStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  visitors: number;
  categories: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  storeId: string;
  categoryId?: string;
  category?: ProductCategory;
  price: number;
  comparePrice?: number;
  cost?: number;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold?: number;
  status: 'active' | 'draft' | 'archived';
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  requiresShipping: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  storeId: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  isMain: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  barcode?: string;
  quantity: number;
  weight?: number;
  position: number;
  options: VariantOption[];
  image?: ProductImage;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
  isFilter: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  freeShippingThreshold?: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank_transfer' | 'cash_on_delivery' | 'digital_wallet';
  isActive: boolean;
  settings: Record<string, any>;
}

export interface CreateStoreData {
  name: string;
  description: string;
  url: string;
  customDomain?: string;
  settings?: Partial<StoreSettings>;
}

export interface UpdateStoreData {
  name?: string;
  description?: string;
  url?: string;
  customDomain?: string;
  status?: Store['status'];
  settings?: Partial<StoreSettings>;
}

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  categoryId?: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  trackQuantity?: boolean;
  quantity?: number;
  lowStockThreshold?: number;
  status?: Product['status'];
  images?: Omit<ProductImage, 'id' | 'productId'>[];
  variants?: Omit<ProductVariant, 'id' | 'productId'>[];
  attributes?: ProductAttribute[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  dimensions?: Product['dimensions'];
  requiresShipping?: boolean;
  isFeatured?: boolean;
}

export interface StoreFilters {
  search?: string;
  status?: string;
  sortBy?: 'name' | 'created' | 'updated' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'created' | 'updated' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

class EcommerceApiService {
  private readonly baseEndpoint = '/api/ecommerce';

  /**
   * Получить список магазинов
   */
  async getStores(filters?: StoreFilters): Promise<{
    stores: Store[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          stores: Store[];
          pagination: any;
        }>
      >(`${this.baseEndpoint}/stores`, filters);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке магазинов');
    } catch (error) {
      console.error('Stores API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельный магазин
   */
  async getStore(storeId: string): Promise<Store> {
    try {
      const response = await apiClient.get<ApiResponse<Store>>(`${this.baseEndpoint}/stores/${storeId}`);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Магазин не найден');
    } catch (error) {
      console.error('Get Store API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать новый магазин
   */
  async createStore(data: CreateStoreData): Promise<Store> {
    try {
      const response = await apiClient.post<ApiResponse<Store>>(`${this.baseEndpoint}/stores`, data);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании магазина');
    } catch (error) {
      console.error('Create Store API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить магазин
   */
  async updateStore(storeId: string, data: UpdateStoreData): Promise<Store> {
    try {
      const response = await apiClient.put<ApiResponse<Store>>(`${this.baseEndpoint}/stores/${storeId}`, data);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении магазина');
    } catch (error) {
      console.error('Update Store API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить продукты магазина
   */
  async getProducts(
    storeId: string,
    filters?: ProductFilters,
  ): Promise<{
    products: Product[];
    pagination: any;
  }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          products: Product[];
          pagination: any;
        }>
      >(`${this.baseEndpoint}/stores/${storeId}/products`, filters);

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
   * Получить отдельный продукт
   */
  async getProduct(storeId: string, productId: string): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `${this.baseEndpoint}/stores/${storeId}/products/${productId}`,
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
  async createProduct(storeId: string, data: CreateProductData): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        `${this.baseEndpoint}/stores/${storeId}/products`,
        data,
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
  async updateProduct(storeId: string, productId: string, data: Partial<CreateProductData>): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(
        `${this.baseEndpoint}/stores/${storeId}/products/${productId}`,
        data,
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
  async deleteProduct(storeId: string, productId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `${this.baseEndpoint}/stores/${storeId}/products/${productId}`,
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
   * Получить категории магазина
   */
  async getCategories(storeId: string): Promise<ProductCategory[]> {
    try {
      const response = await apiClient.get<ApiResponse<ProductCategory[]>>(
        `${this.baseEndpoint}/stores/${storeId}/categories`,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке категорий');
    } catch (error) {
      console.error('Categories API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать категорию
   */
  async createCategory(
    storeId: string,
    data: Omit<ProductCategory, 'id' | 'storeId' | 'productCount'>,
  ): Promise<ProductCategory> {
    try {
      const response = await apiClient.post<ApiResponse<ProductCategory>>(
        `${this.baseEndpoint}/stores/${storeId}/categories`,
        data,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании категории');
    } catch (error) {
      console.error('Create Category API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить статистику магазина
   */
  async getStoreAnalytics(
    storeId: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<{
    revenue: { date: string; amount: number }[];
    orders: { date: string; count: number }[];
    topProducts: { product: Product; revenue: number; sales: number }[];
    topCategories: { category: ProductCategory; revenue: number; sales: number }[];
  }> {
    try {
      const params = { dateFrom, dateTo };
      const response = await apiClient.get<ApiResponse<any>>(
        `${this.baseEndpoint}/stores/${storeId}/analytics`,
        params,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке аналитики');
    } catch (error) {
      console.error('Store Analytics API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Загрузить изображения продукта
   */
  async uploadProductImages(storeId: string, productId: string, files: File[]): Promise<ProductImage[]> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });

      const response = await apiClient.upload<ApiResponse<ProductImage[]>>(
        `${this.baseEndpoint}/stores/${storeId}/products/${productId}/images`,
        formData,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке изображений');
    } catch (error) {
      console.error('Upload Product Images API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }
}

export const ecommerceApi = new EcommerceApiService();
export default ecommerceApi;
