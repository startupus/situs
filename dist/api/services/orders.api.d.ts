/**
 * Orders API Service
 * Управление заказами, продуктами и услугами
 */
export interface Order {
    id: string;
    orderNumber: string;
    projectName: string;
    projectId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    type: 'product' | 'service' | 'form' | 'subscription';
    status: 'new' | 'processing' | 'completed' | 'cancelled' | 'refunded';
    amount: number;
    currency: string;
    date: string;
    description: string;
    items?: OrderItem[];
    metadata?: Record<string, any>;
    notes?: string;
    paymentMethod?: string;
    deliveryAddress?: string;
    createdAt: string;
    updatedAt: string;
}
export interface OrderItem {
    id?: string;
    name: string;
    quantity: number;
    price: number;
    discount?: number;
    description?: string;
}
export interface OrderFilters {
    search?: string;
    status?: string;
    type?: string;
    projectId?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: 'date' | 'amount' | 'status' | 'customer';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface OrdersListResponse {
    orders: Order[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    stats: {
        totalAmount: number;
        totalOrders: number;
        newOrders: number;
        processingOrders: number;
        completedOrders: number;
    };
}
export interface CreateOrderData {
    projectId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    type: Order['type'];
    amount: number;
    currency: string;
    description: string;
    items?: Omit<OrderItem, 'id'>[];
    metadata?: Record<string, any>;
    notes?: string;
    paymentMethod?: string;
    deliveryAddress?: string;
}
export interface UpdateOrderData {
    status?: Order['status'];
    amount?: number;
    description?: string;
    items?: OrderItem[];
    notes?: string;
    paymentMethod?: string;
    deliveryAddress?: string;
    metadata?: Record<string, any>;
}
export interface OrderStats {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    topProducts: {
        name: string;
        quantity: number;
        revenue: number;
    }[];
    revenueByPeriod: {
        date: string;
        revenue: number;
        orders: number;
    }[];
}
declare class OrdersApiService {
    private readonly baseEndpoint;
    /**
     * Получить список заказов
     */
    getOrders(filters?: OrderFilters): Promise<OrdersListResponse>;
    /**
     * Получить отдельный заказ
     */
    getOrder(orderId: string): Promise<Order>;
    /**
     * Создать новый заказ
     */
    createOrder(data: CreateOrderData): Promise<Order>;
    /**
     * Обновить заказ
     */
    updateOrder(orderId: string, data: UpdateOrderData): Promise<Order>;
    /**
     * Удалить заказ
     */
    deleteOrder(orderId: string): Promise<void>;
    /**
     * Изменить статус заказа
     */
    updateOrderStatus(orderId: string, status: Order['status']): Promise<Order>;
    /**
     * Получить статистику заказов
     */
    getOrderStats(filters?: {
        dateFrom?: string;
        dateTo?: string;
        projectId?: string;
    }): Promise<OrderStats>;
    /**
     * Получить заказы по проекту
     */
    getOrdersByProject(projectId: string, filters?: Omit<OrderFilters, 'projectId'>): Promise<OrdersListResponse>;
    /**
     * Экспорт заказов
     */
    exportOrders(format: 'csv' | 'xlsx' | 'json', filters?: OrderFilters): Promise<Blob>;
    /**
     * Создать refund для заказа
     */
    refundOrder(orderId: string, amount?: number, reason?: string): Promise<Order>;
}
export declare const ordersApi: OrdersApiService;
export default ordersApi;
//# sourceMappingURL=orders.api.d.ts.map