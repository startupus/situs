import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';

// Типы данных
export interface User {
  id: string;
  email: string;
  phone?: string;
  balance: number;
  bonusBalance: number;
  referralCode?: string;
  referredBy?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  markup: number; // например, 30 = 30%
  clients: string[]; // список clientId
  isActive: boolean;
  createdAt: Date;
}

export interface AIRequest {
  id: string;
  userId: string;
  projectId?: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  baseCost: number; // базовая стоимость провайдера
  serviceCost: number; // с надценкой сервиса
  finalCost: number; // итоговая стоимость с клиентской надценкой
  timestamp: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'topup' | 'spend' | 'bonus' | 'referral' | 'commission';
  amount: number;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface Commission {
  id: string;
  userId: string; // кому начислена
  fromUserId: string; // от кого
  type: 'referral' | 'client_markup' | 'platform';
  amount: number;
  rate: number; // процент
  sourceTransactionId: string;
  timestamp: Date;
}

// Фабрики для создания тестовых данных
export class TestDataFactory {
  static createUser(data?: Partial<User>): User {
    return {
      id: randomUUID(),
      email: `user-${Date.now()}@test.com`,
      balance: 0,
      bonusBalance: 0,
      isActive: true,
      createdAt: new Date(),
      ...data,
    };
  }

  static createProject(ownerId: string, data?: Partial<Project>): Project {
    return {
      id: randomUUID(),
      ownerId,
      name: `Project ${Date.now()}`,
      markup: 30, // 30% по умолчанию
      clients: [],
      isActive: true,
      createdAt: new Date(),
      ...data,
    };
  }

  static createAIRequest(userId: string, data?: Partial<AIRequest>): AIRequest {
    const inputTokens = data?.inputTokens || 100;
    const outputTokens = data?.outputTokens || 50;
    const baseCost = inputTokens * 0.001 + outputTokens * 0.002; // примерная стоимость

    return {
      id: randomUUID(),
      userId,
      provider: 'openai',
      model: 'gpt-4',
      inputTokens,
      outputTokens,
      baseCost,
      serviceCost: baseCost * 1.2, // +20% надценка сервиса
      finalCost: baseCost * 1.2, // без клиентской надценки
      timestamp: new Date(),
      ...data,
    };
  }

  static createTransaction(userId: string, data?: Partial<Transaction>): Transaction {
    return {
      id: randomUUID(),
      userId,
      type: 'topup',
      amount: 1000,
      description: 'Test transaction',
      timestamp: new Date(),
      ...data,
    };
  }

  static createCommission(
    userId: string,
    fromUserId: string,
    data?: Partial<Commission>,
  ): Commission {
    return {
      id: randomUUID(),
      userId,
      fromUserId,
      type: 'referral',
      amount: 100,
      rate: 10,
      sourceTransactionId: randomUUID(),
      timestamp: new Date(),
      ...data,
    };
  }
}

// API клиенты для сервисов
export class ServiceClients {
  // Loginus (пользователи и авторизация)
  static async registerUser(userData: Partial<User>): Promise<User> {
    // Эмуляция API запроса
    return TestDataFactory.createUser(userData);
  }

  static async loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = TestDataFactory.createUser({ email });
    return {
      token: `jwt-token-${Date.now()}`,
      user,
    };
  }

  static async createReferralLink(userId: string): Promise<string> {
    return `https://platform.com/ref/${randomUUID()}`;
  }

  static async registerByReferral(referralCode: string, userData: Partial<User>): Promise<User> {
    return TestDataFactory.createUser({
      ...userData,
      referredBy: referralCode,
      bonusBalance: 500, // бонус за регистрацию
    });
  }

  // Client Service (проекты и клиенты)
  static async createProject(ownerId: string, projectData: Partial<Project>): Promise<Project> {
    return TestDataFactory.createProject(ownerId, projectData);
  }

  static async addClientToProject(
    projectId: string,
    clientEmail: string,
  ): Promise<{ inviteLink: string }> {
    return {
      inviteLink: `https://platform.com/invite/${randomUUID()}`,
    };
  }

  static async acceptProjectInvite(inviteLink: string, userId: string): Promise<void> {
    // Эмуляция принятия приглашения
  }

  // Billing Service (биллинг)
  static async topupBalance(
    userId: string,
    amount: number,
    paymentMethod: string,
  ): Promise<Transaction> {
    return TestDataFactory.createTransaction(userId, {
      type: 'topup',
      amount,
      description: `Top-up via ${paymentMethod}`,
    });
  }

  static async getBalance(userId: string): Promise<{ balance: number; bonusBalance: number }> {
    return { balance: 1000, bonusBalance: 500 };
  }

  static async getTransactionHistory(userId: string): Promise<Transaction[]> {
    return [];
  }

  // Proxy Service (AI запросы)
  static async makeAIRequest(
    userId: string,
    model: string,
    prompt: string,
    projectId?: string,
  ): Promise<AIRequest> {
    return TestDataFactory.createAIRequest(userId, {
      projectId,
      model,
    });
  }

  // Accounting Service (учет и комиссии)
  static async calculateCommissions(transactionId: string): Promise<Commission[]> {
    return [];
  }

  static async getCommissionHistory(userId: string): Promise<Commission[]> {
    return [];
  }

  static async generateReport(
    userId: string,
    type: 'user' | 'project' | 'admin',
    period: { from: Date; to: Date },
  ): Promise<any> {
    return {
      revenue: 10000,
      commissions: 1000,
      users: 50,
      transactions: 200,
    };
  }
}

// Утилиты для валидации
export class ValidationHelpers {
  static validateBalance(
    actualBalance: number,
    expectedBalance: number,
    tolerance: number = 0.01,
  ): void {
    expect(Math.abs(actualBalance - expectedBalance)).toBeLessThan(tolerance);
  }

  static validateCommission(actual: Commission, expected: Partial<Commission>): void {
    Object.keys(expected).forEach((key) => {
      expect(actual[key as keyof Commission]).toEqual(expected[key as keyof Commission]);
    });
  }

  static validateTransaction(actual: Transaction, expected: Partial<Transaction>): void {
    Object.keys(expected).forEach((key) => {
      expect(actual[key as keyof Transaction]).toEqual(expected[key as keyof Transaction]);
    });
  }

  static async waitForTransactionProcessing(timeout: number = 5000): Promise<void> {
    // В реальности здесь была бы проверка обработки транзакций
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Утилиты для очистки данных
export class CleanupHelpers {
  private static createdUsers: string[] = [];
  private static createdProjects: string[] = [];

  static trackUser(userId: string): void {
    this.createdUsers.push(userId);
  }

  static trackProject(projectId: string): void {
    this.createdProjects.push(projectId);
  }

  static async cleanupAll(): Promise<void> {
    // Очистка пользователей
    for (const userId of this.createdUsers) {
      await this.deleteUser(userId);
    }
    this.createdUsers = [];

    // Очистка проектов
    for (const projectId of this.createdProjects) {
      await this.deleteProject(projectId);
    }
    this.createdProjects = [];
  }

  private static async deleteUser(userId: string): Promise<void> {
    // Эмуляция удаления пользователя
  }

  private static async deleteProject(projectId: string): Promise<void> {
    // Эмуляция удаления проекта
  }
}

// Константы для тестов
export const TEST_CONSTANTS = {
  REGISTRATION_BONUS: 500,
  REFERRAL_COMMISSION_RATE: 10, // 10%
  DEFAULT_PROJECT_MARKUP: 30, // 30%
  PROJECT_OWNER_SHARE: 70, // 70% от надценки
  SERVICE_COMMISSION: 30, // 30% от надценки
  CLIENT_BONUS_RATE: 10, // 10% от базовой стоимости
  SERVICE_MARKUP: 20, // 20% надценка сервиса на AI
} as const;

// Базовый класс для user story тестов
export abstract class UserStoryTest {
  protected users: Map<string, User> = new Map();
  protected projects: Map<string, Project> = new Map();

  protected async setup(): Promise<void> {
    // Базовая настройка для каждого теста
  }

  protected async cleanup(): Promise<void> {
    await CleanupHelpers.cleanupAll();
    this.users.clear();
    this.projects.clear();
  }

  protected async createTestUser(name: string, data?: Partial<User>): Promise<User> {
    const user = await ServiceClients.registerUser({
      email: `${name}@test.com`,
      ...data,
    });
    this.users.set(name, user);
    CleanupHelpers.trackUser(user.id);
    return user;
  }

  protected async createTestProject(
    ownerName: string,
    projectData?: Partial<Project>,
  ): Promise<Project> {
    const owner = this.users.get(ownerName);
    if (!owner) throw new Error(`User ${ownerName} not found`);

    const project = await ServiceClients.createProject(owner.id, projectData || {});
    this.projects.set(`${ownerName}_project`, project);
    CleanupHelpers.trackProject(project.id);
    return project;
  }

  protected getUser(name: string): User {
    const user = this.users.get(name);
    if (!user) throw new Error(`User ${name} not found`);
    return user;
  }

  protected getProject(key: string): Project {
    const project = this.projects.get(key);
    if (!project) throw new Error(`Project ${key} not found`);
    return project;
  }
}
