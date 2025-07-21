/**
 * 🧠 ИНТЕЛЛЕКТУАЛЬНАЯ СИСТЕМА УПРАВЛЕНИЯ ПОКРЫТИЕМ
 * 
 * Отслеживает покрытие всех микро-функций экосистемы,
 * генерирует оптимальные сценарии и предоставляет
 * детальные рекомендации по доработке
 */

export interface MicroFunction {
  id: string;
  category: 'auth' | 'billing' | 'ai' | 'referral' | 'corporate' | 'admin';
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
  estimatedDuration: number; // в секундах
}

export interface FunctionCoverage {
  tested: boolean;
  testCount: number;
  lastTested: Date | null;
  scenarios: string[];
  issues: string[];
  performance: {
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
  };
  implementation: {
    exists: boolean;
    quality: 'excellent' | 'good' | 'poor' | 'missing';
    issues: string[];
  };
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  functions: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration: number;
  prerequisites: string[];
  expectedOutcome: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'partial';
  coverage: number;
  gaps: string[];
  createdAt: Date;
  executedAt: Date | null;
}

/**
 * 🎯 ОСНОВНОЙ КЛАСС УПРАВЛЕНИЯ ПОКРЫТИЕМ
 */
export class CoverageManager {
  private functions: Map<string, MicroFunction> = new Map();
  private coverage: Map<string, FunctionCoverage> = new Map();
  private scenarios: Map<string, TestScenario> = new Map();
  private executionHistory: string[] = [];

  constructor() {
    this.initializeFunctions();
    this.initializeCoverage();
  }

  // ========================================
  // ИНИЦИАЛИЗАЦИЯ МИКРО-ФУНКЦИЙ
  // ========================================

  private initializeFunctions(): void {
    // АУТЕНТИФИКАЦИЯ (25 функций)
    const authFunctions: MicroFunction[] = [
      {
        id: 'AUTH_001',
        category: 'auth',
        name: 'Регистрация через email + пароль',
        description: 'Базовая регистрация пользователя с email и паролем',
        priority: 'critical',
        dependencies: [],
        estimatedDuration: 15
      },
      {
        id: 'AUTH_002',
        category: 'auth',
        name: 'Регистрация через Google OAuth',
        description: 'OAuth регистрация через Google аккаунт',
        priority: 'high',
        dependencies: [],
        estimatedDuration: 20
      },
      {
        id: 'AUTH_003',
        category: 'auth',
        name: 'Регистрация через Яндекс OAuth',
        description: 'OAuth регистрация через Яндекс аккаунт',
        priority: 'medium',
        dependencies: [],
        estimatedDuration: 20
      },
      {
        id: 'AUTH_004',
        category: 'auth',
        name: 'Регистрация через VK OAuth',
        description: 'OAuth регистрация через VK аккаунт',
        priority: 'medium',
        dependencies: [],
        estimatedDuration: 20
      },
      {
        id: 'AUTH_005',
        category: 'auth',
        name: 'Регистрация через Telegram',
        description: 'Регистрация через Telegram бота',
        priority: 'medium',
        dependencies: [],
        estimatedDuration: 25
      },
      {
        id: 'AUTH_006',
        category: 'auth',
        name: 'Регистрация через телефон + SMS',
        description: 'Регистрация с верификацией через SMS',
        priority: 'high',
        dependencies: [],
        estimatedDuration: 30
      },
      {
        id: 'AUTH_007',
        category: 'auth',
        name: 'Вход через email + пароль',
        description: 'Стандартная авторизация с email и паролем',
        priority: 'critical',
        dependencies: ['AUTH_001'],
        estimatedDuration: 10
      },
      {
        id: 'AUTH_008',
        category: 'auth',
        name: 'Вход через социальные сети',
        description: 'OAuth авторизация через соцсети',
        priority: 'high',
        dependencies: ['AUTH_002', 'AUTH_003', 'AUTH_004'],
        estimatedDuration: 15
      },
      {
        id: 'AUTH_009',
        category: 'auth',
        name: 'Вход через телефон + SMS',
        description: 'Авторизация с SMS подтверждением',
        priority: 'high',
        dependencies: ['AUTH_006'],
        estimatedDuration: 20
      },
      {
        id: 'AUTH_010',
        category: 'auth',
        name: 'Автологин через "Запомнить меня"',
        description: 'Автоматическая авторизация с сохраненными данными',
        priority: 'medium',
        dependencies: ['AUTH_007'],
        estimatedDuration: 5
      },
      {
        id: 'AUTH_011',
        category: 'auth',
        name: 'Отправка кода подтверждения',
        description: 'Email отправка кода верификации',
        priority: 'critical',
        dependencies: ['AUTH_001'],
        estimatedDuration: 10
      },
      {
        id: 'AUTH_012',
        category: 'auth',
        name: 'Ввод корректного кода',
        description: 'Успешная верификация email кода',
        priority: 'critical',
        dependencies: ['AUTH_011'],
        estimatedDuration: 5
      },
      {
        id: 'AUTH_013',
        category: 'auth',
        name: 'Ввод неверного кода',
        description: 'Обработка некорректного кода верификации',
        priority: 'high',
        dependencies: ['AUTH_011'],
        estimatedDuration: 5
      },
      {
        id: 'AUTH_014',
        category: 'auth',
        name: 'Повторная отправка кода',
        description: 'Повторный запрос кода верификации',
        priority: 'medium',
        dependencies: ['AUTH_011'],
        estimatedDuration: 10
      },
      {
        id: 'AUTH_015',
        category: 'auth',
        name: 'Истечение срока действия кода',
        description: 'Обработка истекшего кода верификации',
        priority: 'medium',
        dependencies: ['AUTH_011'],
        estimatedDuration: 5
      },
      {
        id: 'AUTH_016',
        category: 'auth',
        name: 'Смена email до подтверждения',
        description: 'Изменение email адреса до верификации',
        priority: 'medium',
        dependencies: ['AUTH_001'],
        estimatedDuration: 15
      },
      {
        id: 'AUTH_017',
        category: 'auth',
        name: 'Смена email после подтверждения',
        description: 'Изменение email у верифицированного пользователя',
        priority: 'medium',
        dependencies: ['AUTH_012'],
        estimatedDuration: 20
      },
      {
        id: 'AUTH_018',
        category: 'auth',
        name: 'Смена пароля в профиле',
        description: 'Изменение пароля через настройки профиля',
        priority: 'high',
        dependencies: ['AUTH_007'],
        estimatedDuration: 15
      },
      {
        id: 'AUTH_019',
        category: 'auth',
        name: 'Восстановление пароля через email',
        description: 'Процедура сброса пароля через email',
        priority: 'high',
        dependencies: ['AUTH_001'],
        estimatedDuration: 25
      },
      {
        id: 'AUTH_020',
        category: 'auth',
        name: 'Восстановление пароля через SMS',
        description: 'Процедура сброса пароля через SMS',
        priority: 'medium',
        dependencies: ['AUTH_006'],
        estimatedDuration: 30
      },
      {
        id: 'AUTH_021',
        category: 'auth',
        name: 'Валидация силы пароля',
        description: 'Проверка требований к безопасности пароля',
        priority: 'high',
        dependencies: [],
        estimatedDuration: 5
      },
      {
        id: 'AUTH_022',
        category: 'auth',
        name: 'Блокировка после неудачных попыток',
        description: 'Временная блокировка при множественных неудачных входах',
        priority: 'high',
        dependencies: ['AUTH_007'],
        estimatedDuration: 10
      },
      {
        id: 'AUTH_023',
        category: 'auth',
        name: 'Разблокировка аккаунта',
        description: 'Процедура разблокировки заблокированного аккаунта',
        priority: 'medium',
        dependencies: ['AUTH_022'],
        estimatedDuration: 15
      },
      {
        id: 'AUTH_024',
        category: 'auth',
        name: 'Двухфакторная аутентификация',
        description: '2FA с использованием TOTP или SMS',
        priority: 'high',
        dependencies: ['AUTH_007'],
        estimatedDuration: 30
      },
      {
        id: 'AUTH_025',
        category: 'auth',
        name: 'Выход из всех устройств',
        description: 'Глобальный выход со всех авторизованных устройств',
        priority: 'medium',
        dependencies: ['AUTH_007'],
        estimatedDuration: 10
      }
    ];

    // БИЛЛИНГ (35 функций) - добавим основные
    const billingFunctions: MicroFunction[] = [
      {
        id: 'BILL_001',
        category: 'billing',
        name: 'Просмотр текущего баланса',
        description: 'Отображение актуального баланса пользователя',
        priority: 'critical',
        dependencies: ['AUTH_007'],
        estimatedDuration: 5
      },
      {
        id: 'BILL_002',
        category: 'billing',
        name: 'Начисление регистрационного бонуса (500 МНТ)',
        description: 'Автоматическое начисление бонуса при регистрации',
        priority: 'critical',
        dependencies: ['AUTH_012'],
        estimatedDuration: 10
      },
      {
        id: 'BILL_003',
        category: 'billing',
        name: 'Списание за AI запрос',
        description: 'Автоматическое списание средств за использование AI',
        priority: 'critical',
        dependencies: ['BILL_001'],
        estimatedDuration: 8
      },
      {
        id: 'BILL_009',
        category: 'billing',
        name: 'Пополнение через ЮMoney',
        description: 'Интеграция с платежной системой ЮMoney',
        priority: 'critical',
        dependencies: ['BILL_001'],
        estimatedDuration: 45
      },
      {
        id: 'BILL_016',
        category: 'billing',
        name: 'Успешная обработка webhook',
        description: 'Обработка успешного webhook от платежной системы',
        priority: 'critical',
        dependencies: ['BILL_009'],
        estimatedDuration: 15
      }
    ];

    // AI СЕРВИСЫ (основные функции)
    const aiFunctions: MicroFunction[] = [
      {
        id: 'AI_001',
        category: 'ai',
        name: 'Просмотр доступных моделей',
        description: 'Отображение каталога AI моделей',
        priority: 'critical',
        dependencies: ['AUTH_007'],
        estimatedDuration: 10
      },
      {
        id: 'AI_011',
        category: 'ai',
        name: 'Создание нового чата',
        description: 'Инициализация нового чата с AI',
        priority: 'critical',
        dependencies: ['AI_001'],
        estimatedDuration: 5
      },
      {
        id: 'AI_012',
        category: 'ai',
        name: 'Отправка текстового сообщения',
        description: 'Отправка текстового запроса к AI модели',
        priority: 'critical',
        dependencies: ['AI_011', 'BILL_003'],
        estimatedDuration: 30
      },
      {
        id: 'AI_021',
        category: 'ai',
        name: 'Создание API ключа',
        description: 'Генерация API ключа для пользователя',
        priority: 'high',
        dependencies: ['AUTH_007'],
        estimatedDuration: 10
      }
    ];

    // РЕФЕРАЛЬНАЯ ПРОГРАММА (основные функции)
    const referralFunctions: MicroFunction[] = [
      {
        id: 'REF_001',
        category: 'referral',
        name: 'Генерация реферальной ссылки',
        description: 'Создание персональной реферальной ссылки',
        priority: 'high',
        dependencies: ['AUTH_007'],
        estimatedDuration: 10
      },
      {
        id: 'REF_006',
        category: 'referral',
        name: 'Регистрация по ссылке',
        description: 'Регистрация нового пользователя по реферальной ссылке',
        priority: 'high',
        dependencies: ['REF_001'],
        estimatedDuration: 20
      },
      {
        id: 'REF_008',
        category: 'referral',
        name: 'Начисление бонуса',
        description: 'Автоматическое начисление реферального бонуса',
        priority: 'high',
        dependencies: ['REF_006', 'BILL_002'],
        estimatedDuration: 15
      }
    ];

    // Добавляем все функции в Map
    [...authFunctions, ...billingFunctions, ...aiFunctions, ...referralFunctions].forEach(func => {
      this.functions.set(func.id, func);
    });

    console.log(`🧩 Инициализировано ${this.functions.size} микро-функций`);
  }

  private initializeCoverage(): void {
    this.functions.forEach((func, id) => {
      this.coverage.set(id, {
        tested: false,
        testCount: 0,
        lastTested: null,
        scenarios: [],
        issues: [],
        performance: {
          averageResponseTime: 0,
          successRate: 0,
          errorRate: 0
        },
        implementation: {
          exists: false,
          quality: 'missing',
          issues: []
        }
      });
    });

    console.log(`📊 Инициализировано покрытие для ${this.coverage.size} функций`);
  }

  // ========================================
  // ИНТЕЛЛЕКТУАЛЬНОЕ ПЛАНИРОВАНИЕ СЦЕНАРИЕВ
  // ========================================

  /**
   * Генерирует следующий оптимальный сценарий
   */
  generateNextScenario(): TestScenario {
    const untestedFunctions = this.getUntestedFunctions();
    const priorityFunctions = this.getPriorityFunctions(untestedFunctions);
    
    if (priorityFunctions.length === 0) {
      return this.generateAdvancedScenario();
    }

    const scenarioFunctions = this.selectOptimalFunctionSet(priorityFunctions);
    const scenario = this.createScenario(scenarioFunctions);
    
    this.scenarios.set(scenario.id, scenario);
    
    console.log(`🎯 Сгенерирован сценарий: ${scenario.name}`);
    console.log(`📋 Функции: ${scenario.functions.join(', ')}`);
    
    return scenario;
  }

  private getUntestedFunctions(): string[] {
    const untested: string[] = [];
    this.coverage.forEach((coverage, id) => {
      if (!coverage.tested) {
        untested.push(id);
      }
    });
    return untested;
  }

  private getPriorityFunctions(functionIds: string[]): string[] {
    const priorityOrder = ['critical', 'high', 'medium', 'low'];
    
    return functionIds.sort((a, b) => {
      const funcA = this.functions.get(a)!;
      const funcB = this.functions.get(b)!;
      
      const priorityA = priorityOrder.indexOf(funcA.priority);
      const priorityB = priorityOrder.indexOf(funcB.priority);
      
      return priorityA - priorityB;
    });
  }

  private selectOptimalFunctionSet(functions: string[]): string[] {
    const selected: string[] = [];
    const maxDuration = 300; // 5 минут максимум на сценарий
    let currentDuration = 0;

    // Начинаем с самой приоритетной функции
    for (const funcId of functions) {
      const func = this.functions.get(funcId)!;
      
      // Проверяем зависимости
      const canAdd = this.canAddFunction(funcId, selected);
      
      if (canAdd && currentDuration + func.estimatedDuration <= maxDuration) {
        selected.push(funcId);
        currentDuration += func.estimatedDuration;
        
        // Добавляем зависимости если они еще не протестированы
        this.addDependencies(funcId, selected);
        
        if (selected.length >= 8) break; // Максимум 8 функций в сценарии
      }
    }

    return selected;
  }

  private canAddFunction(funcId: string, selectedFunctions: string[]): boolean {
    const func = this.functions.get(funcId)!;
    
    // Проверяем все зависимости
    for (const depId of func.dependencies) {
      const depCoverage = this.coverage.get(depId)!;
      
      // Если зависимость не протестирована и не в текущем наборе
      if (!depCoverage.tested && !selectedFunctions.includes(depId)) {
        return false;
      }
    }
    
    return true;
  }

  private addDependencies(funcId: string, selected: string[]): void {
    const func = this.functions.get(funcId)!;
    
    for (const depId of func.dependencies) {
      const depCoverage = this.coverage.get(depId)!;
      
      if (!depCoverage.tested && !selected.includes(depId)) {
        selected.unshift(depId); // Добавляем в начало
      }
    }
  }

  private createScenario(functionIds: string[]): TestScenario {
    const id = `SCENARIO_${Date.now()}`;
    const functions = functionIds.map(id => this.functions.get(id)!);
    
    // Определяем приоритет сценария
    const hasCritical = functions.some(f => f.priority === 'critical');
    const hasHigh = functions.some(f => f.priority === 'high');
    
    let priority: 'critical' | 'high' | 'medium' | 'low';
    if (hasCritical) priority = 'critical';
    else if (hasHigh) priority = 'high';
    else priority = 'medium';

    // Генерируем название
    const categories = [...new Set(functions.map(f => f.category))];
    const categoryNames = categories.map(cat => this.getCategoryDisplayName(cat));
    const name = `${categoryNames.join(' + ')} - Комплексное тестирование`;

    // Рассчитываем длительность
    const estimatedDuration = functions.reduce((sum, f) => sum + f.estimatedDuration, 0);

    // Определяем предварительные условия
    const prerequisites = this.getPrerequisites(functionIds);

    return {
      id,
      name,
      description: `Комплексный сценарий покрывающий ${functions.length} функций: ${functions.map(f => f.name).join(', ')}`,
      functions: functionIds,
      priority,
      estimatedDuration,
      prerequisites,
      expectedOutcome: 'Все функции должны работать корректно в рамках единой пользовательской сессии',
      status: 'pending',
      coverage: 0,
      gaps: [],
      createdAt: new Date(),
      executedAt: null
    };
  }

  private generateAdvancedScenario(): TestScenario {
    // Генерируем сценарий для повторного тестирования или интеграционный
    const testedFunctions = Array.from(this.coverage.entries())
      .filter(([_, coverage]) => coverage.tested)
      .map(([id, _]) => id);

    // Выбираем функции которые давно не тестировались
    const oldFunctions = testedFunctions
      .filter(id => {
        const coverage = this.coverage.get(id)!;
        const daysSinceTest = coverage.lastTested ? 
          (Date.now() - coverage.lastTested.getTime()) / (1000 * 60 * 60 * 24) : 
          999;
        return daysSinceTest > 7; // Больше недели назад
      })
      .slice(0, 5);

    if (oldFunctions.length === 0) {
      // Создаем интеграционный сценарий
      return this.createIntegrationScenario();
    }

    return this.createScenario(oldFunctions);
  }

  private createIntegrationScenario(): TestScenario {
    // Выбираем функции из разных категорий для интеграционного тестирования
    const categories = ['auth', 'billing', 'ai', 'referral'] as const;
    const integrationFunctions: string[] = [];

    categories.forEach(category => {
      const categoryFunctions = Array.from(this.functions.values())
        .filter(f => f.category === category && this.coverage.get(f.id)!.tested)
        .slice(0, 2);
      
      integrationFunctions.push(...categoryFunctions.map(f => f.id));
    });

    const scenario = this.createScenario(integrationFunctions);
    scenario.name = 'Интеграционное тестирование - Межсервисная совместимость';
    scenario.priority = 'high';
    
    return scenario;
  }

  private getPrerequisites(functionIds: string[]): string[] {
    const allDeps = new Set<string>();
    
    functionIds.forEach(id => {
      const func = this.functions.get(id)!;
      func.dependencies.forEach(dep => allDeps.add(dep));
    });

    // Убираем зависимости которые уже в сценарии
    functionIds.forEach(id => allDeps.delete(id));
    
    return Array.from(allDeps);
  }

  private getCategoryDisplayName(category: string): string {
    const names = {
      auth: 'Аутентификация',
      billing: 'Биллинг',
      ai: 'AI Сервисы',
      referral: 'Рефералы',
      corporate: 'Корпоративные',
      admin: 'Администрирование'
    };
    return names[category as keyof typeof names] || category;
  }

  // ========================================
  // ВЫПОЛНЕНИЕ И ОТСЛЕЖИВАНИЕ
  // ========================================

  /**
   * Отмечает начало выполнения сценария
   */
  startScenario(scenarioId: string): void {
    const scenario = this.scenarios.get(scenarioId);
    if (scenario) {
      scenario.status = 'running';
      scenario.executedAt = new Date();
      this.executionHistory.push(scenarioId);
      console.log(`🚀 Начато выполнение сценария: ${scenario.name}`);
    }
  }

  /**
   * Отмечает функцию как протестированную
   */
  markFunctionTested(
    functionId: string, 
    scenarioId: string, 
    success: boolean,
    responseTime?: number,
    issues?: string[]
  ): void {
    const coverage = this.coverage.get(functionId);
    if (!coverage) return;

    coverage.tested = true;
    coverage.testCount++;
    coverage.lastTested = new Date();
    
    if (!coverage.scenarios.includes(scenarioId)) {
      coverage.scenarios.push(scenarioId);
    }

    if (issues) {
      coverage.issues.push(...issues);
    }

    // Обновляем метрики производительности
    if (responseTime) {
      const prevAvg = coverage.performance.averageResponseTime;
      const count = coverage.testCount;
      coverage.performance.averageResponseTime = 
        (prevAvg * (count - 1) + responseTime) / count;
    }

    if (success) {
      coverage.performance.successRate = 
        (coverage.performance.successRate * (coverage.testCount - 1) + 1) / coverage.testCount;
    } else {
      coverage.performance.errorRate = 
        (coverage.performance.errorRate * (coverage.testCount - 1) + 1) / coverage.testCount;
    }

    console.log(`✅ Функция ${functionId} протестирована (${success ? 'SUCCESS' : 'FAILED'})`);
  }

  /**
   * Завершает выполнение сценария
   */
  completeScenario(
    scenarioId: string, 
    status: 'passed' | 'failed' | 'partial',
    gaps?: string[]
  ): void {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return;

    scenario.status = status;
    scenario.gaps = gaps || [];
    
    // Рассчитываем покрытие сценария
    const testedCount = scenario.functions.filter(id => 
      this.coverage.get(id)?.tested
    ).length;
    
    scenario.coverage = (testedCount / scenario.functions.length) * 100;

    console.log(`🏁 Сценарий завершен: ${scenario.name} (${status.toUpperCase()})`);
    console.log(`📊 Покрытие: ${scenario.coverage.toFixed(1)}%`);
  }

  // ========================================
  // АНАЛИТИКА И ОТЧЕТЫ
  // ========================================

  /**
   * Получает общую статистику покрытия
   */
  getCoverageStats(): {
    totalFunctions: number;
    testedFunctions: number;
    coveragePercentage: number;
    categoryCoverage: Record<string, number>;
    untested: string[];
    recentlyTested: string[];
  } {
    const totalFunctions = this.functions.size;
    const testedCount = Array.from(this.coverage.values())
      .filter(c => c.tested).length;
    
    const coveragePercentage = (testedCount / totalFunctions) * 100;

    // Покрытие по категориям
    const categoryCoverage: Record<string, number> = {};
    const categoryFunctions: Record<string, number> = {};
    const categoryTested: Record<string, number> = {};

    this.functions.forEach((func, id) => {
      const category = func.category;
      categoryFunctions[category] = (categoryFunctions[category] || 0) + 1;
      
      if (this.coverage.get(id)!.tested) {
        categoryTested[category] = (categoryTested[category] || 0) + 1;
      }
    });

    Object.keys(categoryFunctions).forEach(category => {
      const tested = categoryTested[category] || 0;
      const total = categoryFunctions[category];
      categoryCoverage[category] = (tested / total) * 100;
    });

    // Непротестированные функции
    const untested = Array.from(this.coverage.entries())
      .filter(([_, coverage]) => !coverage.tested)
      .map(([id, _]) => id);

    // Недавно протестированные (за последние 24 часа)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentlyTested = Array.from(this.coverage.entries())
      .filter(([_, coverage]) => 
        coverage.lastTested && coverage.lastTested > oneDayAgo
      )
      .map(([id, _]) => id);

    return {
      totalFunctions,
      testedFunctions: testedCount,
      coveragePercentage,
      categoryCoverage,
      untested,
      recentlyTested
    };
  }

  /**
   * Генерирует рекомендации по доработке
   */
  generateRecommendations(): {
    missing: Array<{
      function: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      recommendation: string;
    }>;
    performance: Array<{
      function: string;
      issue: string;
      impact: string;
    }>;
    quality: Array<{
      function: string;
      issues: string[];
      suggestion: string;
    }>;
  } {
    const missing: any[] = [];
    const performance: any[] = [];
    const quality: any[] = [];

    this.coverage.forEach((coverage, id) => {
      const func = this.functions.get(id)!;

      // Отсутствующие функции
      if (!coverage.tested) {
        missing.push({
          function: id,
          severity: func.priority,
          recommendation: `Функция "${func.name}" не протестирована. ${func.description}`
        });
      }

      // Проблемы производительности
      if (coverage.performance.averageResponseTime > 5000) { // > 5 секунд
        performance.push({
          function: id,
          issue: `Медленный отклик: ${coverage.performance.averageResponseTime}ms`,
          impact: 'Ухудшение пользовательского опыта'
        });
      }

      if (coverage.performance.errorRate > 0.1) { // > 10% ошибок
        performance.push({
          function: id,
          issue: `Высокий уровень ошибок: ${(coverage.performance.errorRate * 100).toFixed(1)}%`,
          impact: 'Нестабильность системы'
        });
      }

      // Проблемы качества
      if (coverage.issues.length > 0) {
        quality.push({
          function: id,
          issues: coverage.issues,
          suggestion: `Требуется исправление найденных проблем в функции "${func.name}"`
        });
      }
    });

    return { missing, performance, quality };
  }

  /**
   * Генерирует детальный отчет
   */
  generateDetailedReport(): string {
    const stats = this.getCoverageStats();
    const recommendations = this.generateRecommendations();
    
    let report = '# 📊 ДЕТАЛЬНЫЙ ОТЧЕТ ПО ПОКРЫТИЮ ЭКОСИСТЕМЫ ХАБУС\n\n';
    
    report += `## 📈 Общая статистика\n`;
    report += `- **Всего функций**: ${stats.totalFunctions}\n`;
    report += `- **Протестировано**: ${stats.testedFunctions}\n`;
    report += `- **Покрытие**: ${stats.coveragePercentage.toFixed(1)}%\n\n`;

    report += `## 📊 Покрытие по категориям\n`;
    Object.entries(stats.categoryCoverage).forEach(([category, coverage]) => {
      const displayName = this.getCategoryDisplayName(category);
      const progress = '█'.repeat(Math.floor(coverage / 5)) + '░'.repeat(20 - Math.floor(coverage / 5));
      report += `- **${displayName}**: ${coverage.toFixed(1)}% ${progress}\n`;
    });

    report += `\n## ⚠️ Критические рекомендации\n`;
    recommendations.missing
      .filter(r => r.severity === 'critical')
      .forEach(r => {
        report += `- **${r.function}**: ${r.recommendation}\n`;
      });

    report += `\n## 📋 Производительность\n`;
    recommendations.performance.forEach(p => {
      report += `- **${p.function}**: ${p.issue} - ${p.impact}\n`;
    });

    report += `\n## 🔧 Качество кода\n`;
    recommendations.quality.slice(0, 10).forEach(q => {
      report += `- **${q.function}**: ${q.suggestion}\n`;
    });

    report += `\n## 📋 Следующие шаги\n`;
    const nextScenario = this.generateNextScenario();
    report += `- **Следующий сценарий**: ${nextScenario.name}\n`;
    report += `- **Функции**: ${nextScenario.functions.join(', ')}\n`;
    report += `- **Приоритет**: ${nextScenario.priority}\n`;
    report += `- **Длительность**: ${nextScenario.estimatedDuration} сек\n`;

    return report;
  }

  // ========================================
  // УТИЛИТЫ
  // ========================================

  getFunction(id: string): MicroFunction | undefined {
    return this.functions.get(id);
  }

  getFunctionCoverage(id: string): FunctionCoverage | undefined {
    return this.coverage.get(id);
  }

  getScenario(id: string): TestScenario | undefined {
    return this.scenarios.get(id);
  }

  getAllScenarios(): TestScenario[] {
    return Array.from(this.scenarios.values());
  }

  getExecutionHistory(): string[] {
    return [...this.executionHistory];
  }
}

// Экспорт глобального экземпляра
export const coverageManager = new CoverageManager();