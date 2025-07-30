/**
 * E-commerce API Service
 * Управление магазинами, продуктами и продажами
 */
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
declare class EcommerceApiService {
    private readonly baseEndpoint;
    /**
     * Получить список магазинов
     */
    getStores(filters?: StoreFilters): Promise<{
        stores: Store[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Получить отдельный магазин
     */
    getStore(storeId: string): Promise<Store>;
    /**
     * Создать новый магазин
     */
    createStore(data: CreateStoreData): Promise<Store>;
    /**
     * Обновить магазин
     */
    updateStore(storeId: string, data: UpdateStoreData): Promise<Store>;
    /**
     * Получить продукты магазина
     */
    getProducts(storeId: string, filters?: ProductFilters): Promise<{
        products: Product[];
        pagination: any;
    }>;
    /**
     * Получить отдельный продукт
     */
    getProduct(storeId: string, productId: string): Promise<Product>;
    /**
     * Создать новый продукт
     */
    createProduct(storeId: string, data: CreateProductData): Promise<Product>;
    /**
     * Обновить продукт
     */
    updateProduct(storeId: string, productId: string, data: Partial<CreateProductData>): Promise<Product>;
    /**
     * Удалить продукт
     */
    deleteProduct(storeId: string, productId: string): Promise<void>;
    /**
     * Получить категории магазина
     */
    getCategories(storeId: string): Promise<ProductCategory[]>;
    /**
     * Создать категорию
     */
    createCategory(storeId: string, data: Omit<ProductCategory, 'id' | 'storeId' | 'productCount'>): Promise<ProductCategory>;
    /**
     * Получить статистику магазина
     */
    getStoreAnalytics(storeId: string, dateFrom?: string, dateTo?: string): Promise<{
        revenue: {
            date: string;
            amount: number;
        }[];
        orders: {
            date: string;
            count: number;
        }[];
        topProducts: {
            product: Product;
            revenue: number;
            sales: number;
        }[];
        topCategories: {
            category: ProductCategory;
            revenue: number;
            sales: number;
        }[];
    }>;
    /**
     * Загрузить изображения продукта
     */
    uploadProductImages(storeId: string, productId: string, files: File[]): Promise<ProductImage[]>;
}
export declare const ecommerceApi: EcommerceApiService;
export default ecommerceApi;
//# sourceMappingURL=ecommerce.api.d.ts.map