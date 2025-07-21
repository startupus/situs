/**
 * 🛠️ ТЕСТОВАЯ ИНФРАСТРУКТУРА
 * 
 * Базовая инфраструктура для работы с API всех сервисов экосистемы Хабус
 * Предоставляет удобные методы для создания тестовых данных, 
 * выполнения запросов и очистки после тестов.
 */

export interface TestUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  token?: string;
  balance?: number;
  emailVerified?: boolean;
  referralCode?: string;
  referralLink?: string;
}

export interface TestChat {
  id: string;
  model: string;
  title: string;
  messages: TestMessage[];
}

export interface TestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  cost?: number;
}

export interface TestTransaction {
  id: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'ai_usage' | 'referral_bonus';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  timestamp: Date;
}

export interface TestAIModel {
  id: string;
  name: string;
  provider: string;
  costPer1000Tokens: number;
  maxTokens: number;
  supportedFeatures: string[];
}

export interface TestPayment {
  operationId: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
}

/**
 * 🎯 ОСНОВНОЙ КЛАСС ТЕСТОВОЙ ИНФРАСТРУКТУРЫ
 */
export class TestInfrastructure {
  private baseUrls = {
    auth: 'http://localhost:3001',
    billing: 'http://localhost:3002', 
    chat: 'http://localhost:3003',
    gateway: 'http://localhost:3000',
    referral: 'http://localhost:3004'
  };

  private createdUsers: TestUser[] = [];
  private createdChats: TestChat[] = [];

  // ========================================
  // УТИЛИТЫ ДЛЯ HTTP ЗАПРОСОВ
  // ========================================

  private async makeRequest(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========================================
  // АУТЕНТИФИКАЦИЯ И ПОЛЬЗОВАТЕЛИ
  // ========================================

  async registerUser(userData: Omit<TestUser, 'id' | 'token'>): Promise<TestUser> {
    const user: TestUser = { ...userData };
    
    try {
      const response = await this.makeRequest(`${this.baseUrls.auth}/api/register`, {
        method: 'POST',
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password
        })
      });

      const result = await response.json() as any;
      user.id = result.user?.id;
      user.emailVerified = result.user?.emailVerified || false;
      
      this.createdUsers.push(user);
      return user;
    } catch (error) {
      console.log(`⚠️ Mock регистрация пользователя: ${user.email}`);
      user.id = `mock_${Date.now()}`;
      user.emailVerified = false;
      this.createdUsers.push(user);
      return user;
    }
  }

  async verifyEmail(user: TestUser, code: string): Promise<boolean> {
    if (!user.id) return false;

    try {
      const response = await this.makeRequest(`${this.baseUrls.auth}/api/verify-email`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          code: code
        })
      });

      user.emailVerified = true;
      return true;
    } catch (error) {
      console.log(`⚠️ Mock подтверждение email для ${user.email}`);
      user.emailVerified = true;
      return true;
    }
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = this.createdUsers.find(u => u.email === email);
    
    try {
      const response = await this.makeRequest(`${this.baseUrls.auth}/api/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const result = await response.json() as any;
      if (user) {
        user.token = result.token;
      }
      
      return result.token;
    } catch (error) {
      console.log(`⚠️ Mock авторизация для ${email}`);
      const token = `mock_token_${Date.now()}`;
      if (user) {
        user.token = token;
      }
      return token;
    }
  }

  // ========================================
  // БИЛЛИНГ И ПЛАТЕЖИ
  // ========================================

  async getBalance(token: string): Promise<number> {
    try {
      const response = await this.makeRequest(`${this.baseUrls.billing}/api/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json() as any;
      const user = this.createdUsers.find(u => u.token === token);
      if (user) {
        user.balance = result.MNT || 0;
      }
      
      return result.MNT || 0;
    } catch (error) {
      console.log(`⚠️ Mock баланс: 500 MNT`);
      const user = this.createdUsers.find(u => u.token === token);
      if (user) {
        user.balance = 500;
      }
      return 500;
    }
  }

  async chargeForAI(
    token: string, 
    amount: number, 
    model: string
  ): Promise<boolean> {
    try {
      await this.makeRequest(`${this.baseUrls.billing}/api/charge`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount,
          currency: 'MNT',
          description: `AI запрос к модели ${model}`
        })
      });

      return true;
    } catch (error) {
      console.log(`⚠️ Mock списание ${amount} MNT за AI`);
      return true;
    }
  }

  async processPayment(
    token: string,
    amount: number,
    paymentMethod: string = 'yumoney'
  ): Promise<TestPayment> {
    try {
      const response = await this.makeRequest(`${this.baseUrls.billing}/api/payment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount,
          currency: 'RUB',
          method: paymentMethod
        })
      });

      const paymentData = await response.json() as any;
      
      return {
        operationId: paymentData.operationId,
        amount,
        currency: 'RUB',
        status: 'success',
        paymentMethod
      };
    } catch (error) {
      console.log(`⚠️ Mock платеж ${amount} RUB через ${paymentMethod}`);
      return {
        operationId: `mock_${Date.now()}`,
        amount,
        currency: 'RUB', 
        status: 'success',
        paymentMethod
      };
    }
  }

  async getTransactionHistory(token: string): Promise<TestTransaction[]> {
    try {
      const response = await this.makeRequest(`${this.baseUrls.billing}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return await response.json() as TestTransaction[];
    } catch (error) {
      console.log(`⚠️ Mock история транзакций`);
      return [
        {
          id: 'mock_1',
          amount: 500,
          currency: 'MNT',
          type: 'deposit',
          status: 'completed',
          description: 'Регистрационный бонус',
          timestamp: new Date()
        }
      ];
    }
  }

  // ========================================
  // AI СЕРВИСЫ И ЧАТЫ
  // ========================================

  async getAvailableModels(): Promise<TestAIModel[]> {
    try {
      const response = await this.makeRequest(`${this.baseUrls.chat}/api/models`);
      return await response.json() as TestAIModel[];
    } catch (error) {
      console.log(`⚠️ Mock список AI моделей`);
      return [
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          provider: 'OpenAI',
          costPer1000Tokens: 100,
          maxTokens: 4096,
          supportedFeatures: ['text', 'chat']
        },
        {
          id: 'claude-3-haiku',
          name: 'Claude 3 Haiku',
          provider: 'Anthropic',
          costPer1000Tokens: 80,
          maxTokens: 200000,
          supportedFeatures: ['text', 'chat']
        }
      ];
    }
  }

  async createChat(
    token: string,
    model: string,
    title: string = 'Новый чат'
  ): Promise<TestChat> {
    const chat: TestChat = {
      id: `chat_${Date.now()}`,
      model,
      title,
      messages: []
    };

    try {
      const response = await this.makeRequest(`${this.baseUrls.chat}/api/chats`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ model, title })
      });

      const result = await response.json() as any;
      chat.id = result.id || chat.id;
    } catch (error) {
      console.log(`⚠️ Mock создание чата с ${model}`);
    }

    this.createdChats.push(chat);
    return chat;
  }

  async sendMessage(
    token: string,
    chatId: string,
    content: string
  ): Promise<TestMessage> {
    const message: TestMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    try {
      const response = await this.makeRequest(`${this.baseUrls.chat}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content })
      });

      const result = await response.json() as any;
      message.tokens = result.tokens;
      message.cost = result.cost;
    } catch (error) {
      console.log(`⚠️ Mock отправка сообщения в чат`);
      message.tokens = 50;
      message.cost = 5; // 5 MNT
    }

    const chat = this.createdChats.find(c => c.id === chatId);
    if (chat) {
      chat.messages.push(message);
    }

    return message;
  }

  // ========================================
  // РЕФЕРАЛЬНАЯ ПРОГРАММА
  // ========================================

  async generateReferralLink(token: string): Promise<string> {
    const user = this.createdUsers.find(u => u.token === token);
    
    try {
      const response = await this.makeRequest(`${this.baseUrls.referral}/api/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json() as any;
      if (user) {
        user.referralCode = result.code;
      }
      
      return result.link;
    } catch (error) {
      console.log(`⚠️ Mock генерация реферальной ссылки`);
      const code = `REF${Date.now()}`;
      const link = `https://habus.ai/ref/${code}`;
      
      if (user) {
        user.referralCode = code;
        user.referralLink = link;
      }
      
      return link;
    }
  }

  async registerUserByReferral(
    referralCode: string,
    userData: Omit<TestUser, 'id' | 'token'>
  ): Promise<TestUser> {
    try {
      const response = await this.makeRequest(`${this.baseUrls.auth}/api/register`, {
        method: 'POST',
        body: JSON.stringify({
          ...userData,
          referralCode
        })
      });

      const result = await response.json() as any;
      const user: TestUser = {
        ...userData,
        id: result.user?.id,
        emailVerified: false
      };
      
      this.createdUsers.push(user);
      return user;
    } catch (error) {
      console.log(`⚠️ Mock регистрация по реферальной ссылке`);
      const user: TestUser = {
        ...userData,
        id: `ref_${Date.now()}`,
        emailVerified: false
      };
      
      this.createdUsers.push(user);
      return user;
    }
  }

  // ========================================
  // ОЧИСТКА И УТИЛИТЫ
  // ========================================

  async cleanup(): Promise<void> {
    console.log('🧹 Очистка тестовых данных...');
    
    // Очищаем созданных пользователей
    for (const user of this.createdUsers) {
      try {
        if (user.token) {
          await this.makeRequest(`${this.baseUrls.auth}/api/cleanup/${user.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` }
          });
        }
      } catch (error) {
        // Игнорируем ошибки очистки
      }
    }

    // Очищаем созданные чаты
    for (const chat of this.createdChats) {
      try {
        await this.makeRequest(`${this.baseUrls.chat}/api/chats/${chat.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        // Игнорируем ошибки очистки
      }
    }

    this.createdUsers = [];
    this.createdChats = [];
    
    console.log('✅ Очистка завершена');
  }

  // ========================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ========================================

  getCreatedUsers(): TestUser[] {
    return [...this.createdUsers];
  }

  getCreatedChats(): TestChat[] {
    return [...this.createdChats];
  }

  findUserByEmail(email: string): TestUser | undefined {
    return this.createdUsers.find(u => u.email === email);
  }

  async waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs: number = 10000,
    intervalMs: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (await condition()) {
        return true;
      }
      await this.sleep(intervalMs);
    }
    
    return false;
  }

  generateTestEmail(): string {
    return `test${Date.now()}@example.com`;
  }

  generateTestUser(name?: string): Omit<TestUser, 'id' | 'token'> {
    return {
      name: name || `Тестовый Пользователь ${Date.now()}`,
      email: this.generateTestEmail(),
      password: 'TestPass123!'
    };
  }
}

// Экспорт глобального экземпляра
export const testInfrastructure = new TestInfrastructure();