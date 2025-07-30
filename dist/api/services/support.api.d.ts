/**
 * Support API Service
 * Система поддержки, тикеты и FAQ
 */
export interface SupportTicket {
    id: string;
    title: string;
    description: string;
    status: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    userId: string;
    userName: string;
    userEmail: string;
    assignedTo?: string;
    assignedToName?: string;
    tags: string[];
    attachments: TicketAttachment[];
    messages: TicketMessage[];
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    closedAt?: string;
}
export interface TicketAttachment {
    id: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
    uploadedAt: string;
}
export interface TicketMessage {
    id: string;
    ticketId: string;
    authorId: string;
    authorName: string;
    authorType: 'user' | 'support' | 'system';
    content: string;
    isInternal: boolean;
    attachments: TicketAttachment[];
    createdAt: string;
}
export interface CreateTicketData {
    title: string;
    description: string;
    category: string;
    priority?: SupportTicket['priority'];
    tags?: string[];
    attachments?: File[];
}
export interface UpdateTicketData {
    title?: string;
    description?: string;
    status?: SupportTicket['status'];
    priority?: SupportTicket['priority'];
    category?: string;
    assignedTo?: string;
    tags?: string[];
}
export interface TicketFilters {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    tags?: string[];
    sortBy?: 'created' | 'updated' | 'priority' | 'status';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface TicketsListResponse {
    tickets: SupportTicket[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    stats: {
        totalTickets: number;
        newTickets: number;
        openTickets: number;
        pendingTickets: number;
        resolvedTickets: number;
        closedTickets: number;
    };
}
export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    tags: string[];
    isPublished: boolean;
    viewCount: number;
    order: number;
    createdAt: string;
    updatedAt: string;
}
export interface FAQCategory {
    id: string;
    name: string;
    description: string;
    icon?: string;
    order: number;
    faqCount: number;
}
export interface SupportStats {
    totalTickets: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    satisfactionRating: number;
    ticketsByStatus: {
        status: string;
        count: number;
    }[];
    ticketsByCategory: {
        category: string;
        count: number;
    }[];
    responseTimeByPeriod: {
        date: string;
        averageTime: number;
    }[];
}
declare class SupportApiService {
    private readonly baseEndpoint;
    /**
     * Получить список тикетов
     */
    getTickets(filters?: TicketFilters): Promise<TicketsListResponse>;
    /**
     * Получить отдельный тикет
     */
    getTicket(ticketId: string): Promise<SupportTicket>;
    /**
     * Создать новый тикет
     */
    createTicket(data: CreateTicketData): Promise<SupportTicket>;
    /**
     * Обновить тикет
     */
    updateTicket(ticketId: string, data: UpdateTicketData): Promise<SupportTicket>;
    /**
     * Добавить сообщение к тикету
     */
    addMessage(ticketId: string, content: string, isInternal?: boolean, attachments?: File[]): Promise<TicketMessage>;
    /**
     * Назначить тикет агенту
     */
    assignTicket(ticketId: string, agentId: string): Promise<SupportTicket>;
    /**
     * Изменить статус тикета
     */
    updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<SupportTicket>;
    /**
     * Получить FAQ
     */
    getFAQ(category?: string): Promise<FAQ[]>;
    /**
     * Получить категории FAQ
     */
    getFAQCategories(): Promise<FAQCategory[]>;
    /**
     * Поиск в FAQ
     */
    searchFAQ(query: string): Promise<FAQ[]>;
    /**
     * Получить статистику поддержки
     */
    getSupportStats(dateFrom?: string, dateTo?: string): Promise<SupportStats>;
    /**
     * Получить мои тикеты (для текущего пользователя)
     */
    getMyTickets(filters?: Omit<TicketFilters, 'userId'>): Promise<TicketsListResponse>;
    /**
     * Отправить отзыв о качестве поддержки
     */
    submitFeedback(ticketId: string, rating: number, comment?: string): Promise<void>;
}
export declare const supportApi: SupportApiService;
export default supportApi;
//# sourceMappingURL=support.api.d.ts.map