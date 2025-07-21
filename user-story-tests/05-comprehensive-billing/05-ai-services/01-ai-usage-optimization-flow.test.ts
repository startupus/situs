import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserStoryTest } from '../../helpers/UserStoryTest';

/**
 * 🤖 Пользовательская история: Оптимизация использования AI сервисов
 *
 * Сценарий:
 * 1. Пользователь регистрируется и получает AI кредиты
 * 2. Тестирует разные AI модели с разной стоимостью
 * 3. Система предлагает оптимизацию на основе использования
 * 4. Пользователь покупает AI пакет со скидкой
 * 5. Активируется динамическое ценообразование
 * 6. Пользователь превышает лимиты и получает уведомление
 * 7. Автоматически применяется volume discount
 * 8. Пользователь приглашает коллегу для совместного использования
 * 9. Активируется team pooling для AI кредитов
 * 10. Генерируется отчет по оптимизации расходов
 */

class AiUsageOptimizationFlowTest extends UserStoryTest {
  private mainUser: any;
  private colleague: any;
  private aiPackage: any;
  private usageStats: any;
  private team: any;

  async runTest(): Promise<void> {
    await this.step1_RegistrationWithAiCredits();
    await this.step2_TestDifferentAiModels();
    await this.step3_SystemOptimizationSuggestions();
    await this.step4_PurchaseAiPackageWithDiscount();
    await this.step5_DynamicPricingActivation();
    await this.step6_UsageLimitNotification();
    await this.step7_VolumeDiscountApplication();
    await this.step8_InviteColleagueForSharing();
    await this.step9_TeamPoolingActivation();
    await this.step10_CostOptimizationReport();
  }

  private async step1_RegistrationWithAiCredits(): Promise<void> {
    this.mainUser = await this.userService.registerUser({
      email: 'ai-user@example.com',
      password: 'AiUser123!',
      plan: 'developer',
    });

    // Новые пользователи получают стартовые AI кредиты
    const aiCredits = await this.billingService.grantAiCredits({
      userId: this.mainUser.id,
      amount: 1000, // 1000 AI кредитов
      type: 'welcome_bonus',
      validFor: 30, // дней
    });

    expect(aiCredits.amount).toBe(1000);
    expect(aiCredits.type).toBe('welcome_bonus');
    expect(aiCredits.validFor).toBe(30);

    // Проверяем баланс AI кредитов
    const aiBalance = await this.billingService.getAiCreditsBalance(this.mainUser.id);
    expect(aiBalance.total).toBe(1000);
    expect(aiBalance.available).toBe(1000);

    this.logStep('✅ Пользователь зарегистрирован с 1000 AI кредитами');
  }

  private async step2_TestDifferentAiModels(): Promise<void> {
    // Тестируем разные AI модели с разной стоимостью
    const modelTests = [
      { model: 'gpt-3.5-turbo', tokens: 1000, cost: 2 }, // 2 кредита за 1000 токенов
      { model: 'gpt-4', tokens: 1000, cost: 30 }, // 30 кредитов за 1000 токенов
      { model: 'claude-3-haiku', tokens: 1000, cost: 1 }, // 1 кредит за 1000 токенов
      { model: 'claude-3-sonnet', tokens: 1000, cost: 15 }, // 15 кредитов за 1000 токенов
      { model: 'claude-3-opus', tokens: 1000, cost: 75 }, // 75 кредитов за 1000 токенов
      { model: 'gemini-pro', tokens: 1000, cost: 3 }, // 3 кредита за 1000 токенов
    ];

    let totalCreditsUsed = 0;
    const modelUsageStats = [];

    for (const test of modelTests) {
      const usage = await this.aiService.processAiRequest({
        userId: this.mainUser.id,
        model: test.model,
        tokens: test.tokens,
        creditsRequired: test.cost,
      });

      totalCreditsUsed += test.cost;
      modelUsageStats.push({
        model: test.model,
        tokens: test.tokens,
        credits: test.cost,
        responseTime: usage.responseTime,
        quality: usage.qualityScore,
      });

      expect(usage.success).toBe(true);
      expect(usage.creditsCharged).toBe(test.cost);
    }

    // Проверяем обновленный баланс
    const updatedBalance = await this.billingService.getAiCreditsBalance(this.mainUser.id);
    expect(updatedBalance.available).toBe(1000 - totalCreditsUsed);

    this.usageStats = modelUsageStats;
    this.logStep(`✅ Протестировано 6 AI моделей, использовано ${totalCreditsUsed} кредитов`);
  }

  private async step3_SystemOptimizationSuggestions(): Promise<void> {
    // Система анализирует использование и предлагает оптимизацию
    const optimization = await this.aiService.analyzeUsageAndOptimize({
      userId: this.mainUser.id,
      usageHistory: this.usageStats,
    });

    expect(optimization.suggestions).toBeDefined();
    expect(optimization.potentialSavings).toBeGreaterThan(0);

    // Проверяем конкретные рекомендации
    expect(optimization.suggestions).toContain('use_claude_haiku_for_simple_tasks');
    expect(optimization.suggestions).toContain('batch_requests_for_discounts');
    expect(optimization.recommendations.alternativeModels).toBeDefined();

    // Система предлагает оптимальную модель для каждого типа задач
    expect(optimization.recommendations.simpleQueries).toBe('claude-3-haiku');
    expect(optimization.recommendations.complexAnalysis).toBe('claude-3-sonnet');
    expect(optimization.recommendations.creativeTasks).toBe('gpt-4');

    this.logStep('✅ Система проанализировала использование и предложила оптимизацию');
  }

  private async step4_PurchaseAiPackageWithDiscount(): Promise<void> {
    // Пользователь покупает AI пакет со скидкой на основе рекомендаций
    this.aiPackage = await this.billingService.purchaseAiPackage({
      userId: this.mainUser.id,
      packageType: 'smart_optimization',
      credits: 5000,
      basePrice: 2500, // 2500₽
      optimizationDiscount: 20, // 20% скидка за принятие рекомендаций
      currency: 'RUB',
    });

    expect(this.aiPackage.credits).toBe(5000);
    expect(this.aiPackage.basePrice).toBe(2500);
    expect(this.aiPackage.discount).toBe(500); // 20% от 2500₽
    expect(this.aiPackage.finalPrice).toBe(2000);

    // Проверяем пополнение AI кредитов
    const updatedBalance = await this.billingService.getAiCreditsBalance(this.mainUser.id);
    expect(updatedBalance.total).toBe(5000 + (1000 - 126)); // Новые кредиты + остаток

    this.logStep('✅ Куплен AI пакет со скидкой 20% (2000₽ за 5000 кредитов)');
  }

  private async step5_DynamicPricingActivation(): Promise<void> {
    // Активируется динамическое ценообразование на основе использования
    const dynamicPricing = await this.aiService.activateDynamicPricing({
      userId: this.mainUser.id,
      packageId: this.aiPackage.id,
      rules: {
        volumeDiscounts: true,
        timeBasedPricing: true,
        modelOptimization: true,
      },
    });

    expect(dynamicPricing.active).toBe(true);
    expect(dynamicPricing.rules.volumeDiscounts).toBe(true);
    expect(dynamicPricing.rules.timeBasedPricing).toBe(true);

    // Проверяем применение динамических правил
    const pricingRules = await this.aiService.getDynamicPricingRules(this.mainUser.id);
    expect(pricingRules.volumeTiers).toBeDefined();
    expect(pricingRules.offPeakDiscount).toBe(15); // 15% скидка в нерабочее время
    expect(pricingRules.bulkRequestDiscount).toBe(10); // 10% скидка за пакетные запросы

    this.logStep('✅ Активировано динамическое ценообразование');
  }

  private async step6_UsageLimitNotification(): Promise<void> {
    // Симулируем интенсивное использование до 80% лимита
    const intensiveUsage = await this.aiService.simulateIntensiveUsage({
      userId: this.mainUser.id,
      targetUsage: 0.8, // 80% от доступных кредитов
      duration: 'hours',
      models: ['gpt-4', 'claude-3-opus'], // Дорогие модели
    });

    expect(intensiveUsage.creditsUsed).toBeGreaterThan(4000); // 80% от ~5000

    // Система отправляет уведомление о приближении к лимиту
    const notification = await this.notificationService.sendUsageLimitWarning({
      userId: this.mainUser.id,
      currentUsage: intensiveUsage.creditsUsed,
      totalCredits: 5874, // Общий баланс
      warningThreshold: 0.8,
    });

    expect(notification.sent).toBe(true);
    expect(notification.type).toBe('usage_limit_warning');
    expect(notification.recommendations).toBeDefined();

    this.logStep('✅ Отправлено уведомление о приближении к лимиту использования');
  }

  private async step7_VolumeDiscountApplication(): Promise<void> {
    // Автоматически применяется volume discount за высокое использование
    const volumeDiscount = await this.billingService.applyVolumeDiscount({
      userId: this.mainUser.id,
      monthlyUsage: 4500, // кредитов за месяц
      tier: 'high_volume',
    });

    expect(volumeDiscount.applied).toBe(true);
    expect(volumeDiscount.discountRate).toBe(15); // 15% скидка за высокий объем
    expect(volumeDiscount.creditsBonus).toBe(675); // 15% бонус кредитов

    // Проверяем, что бонусные кредиты зачислены
    const balance = await this.billingService.getAiCreditsBalance(this.mainUser.id);
    expect(balance.bonus).toBe(675);

    this.logStep('✅ Применена volume скидка 15% и зачислено 675 бонусных кредитов');
  }

  private async step8_InviteColleagueForSharing(): Promise<void> {
    // Приглашаем коллегу для совместного использования AI кредитов
    const invitation = await this.userService.inviteColleague({
      inviterId: this.mainUser.id,
      email: 'colleague@example.com',
      role: 'ai_collaborator',
      sharedResources: ['ai_credits', 'usage_analytics'],
    });

    // Коллега регистрируется
    this.colleague = await this.userService.registerUser({
      email: 'colleague@example.com',
      password: 'Colleague123!',
      invitationCode: invitation.code,
    });

    expect(this.colleague.invitedBy).toBe(this.mainUser.id);
    expect(this.colleague.role).toBe('ai_collaborator');

    this.logStep('✅ Коллега приглашен для совместного использования AI кредитов');
  }

  private async step9_TeamPoolingActivation(): Promise<void> {
    // Создаем команду и активируем pooling AI кредитов
    this.team = await this.userService.createTeam({
      ownerId: this.mainUser.id,
      name: 'AI Development Team',
      members: [this.mainUser.id, this.colleague.id],
      sharedResources: ['ai_credits'],
    });

    const pooling = await this.aiService.activateTeamPooling({
      teamId: this.team.id,
      poolingRules: {
        shareCredits: true,
        sharedLimits: true,
        collaborativeDiscounts: true,
      },
    });

    expect(pooling.active).toBe(true);
    expect(pooling.sharedCredits).toBeGreaterThan(0);

    // Проверяем, что коллега может использовать общие кредиты
    const colleagueUsage = await this.aiService.processAiRequest({
      userId: this.colleague.id,
      model: 'gpt-3.5-turbo',
      tokens: 1000,
      useTeamCredits: true,
    });

    expect(colleagueUsage.success).toBe(true);
    expect(colleagueUsage.creditsSource).toBe('team_pool');

    this.logStep('✅ Активирован team pooling для совместного использования AI кредитов');
  }

  private async step10_CostOptimizationReport(): Promise<void> {
    // Генерируем отчет по оптимизации расходов
    const report = await this.reportingService.generateCostOptimizationReport({
      userId: this.mainUser.id,
      teamId: this.team.id,
      period: 'current_month',
    });

    expect(report.totalSavings).toBeGreaterThan(0);
    expect(report.optimizationScore).toBeGreaterThan(70); // Хорошая оптимизация

    // Проверяем детали отчета
    expect(report.breakdown.volumeDiscounts).toBeDefined();
    expect(report.breakdown.modelOptimization).toBeDefined();
    expect(report.breakdown.teamPoolingBenefits).toBeDefined();

    // Рекомендации для дальнейшей оптимизации
    expect(report.recommendations).toContain('increase_batch_processing');
    expect(report.recommendations).toContain('use_off_peak_hours');
    expect(report.futureProjections.monthlySavings).toBeGreaterThan(500);

    this.logStep('✅ Отчет по оптимизации расходов сгенерирован');
  }
}

describe('🤖 AI Usage Optimization Flow', () => {
  let test: AiUsageOptimizationFlowTest;

  beforeEach(async () => {
    test = new AiUsageOptimizationFlowTest();
    await test.setup();
  });

  afterEach(async () => {
    await test.cleanup();
  });

  it('should complete AI usage optimization flow with team pooling', async () => {
    await test.runTest();

    // Проверяем финальную оптимизацию
    const finalReport = await test.reportingService.generateCostOptimizationReport({
      userId: test.mainUser.id,
      teamId: test.team.id,
      period: 'current_month',
    });

    expect(finalReport.totalSavings).toBeGreaterThan(1000); // Значительная экономия
    expect(finalReport.optimizationScore).toBeGreaterThan(80); // Высокий балл оптимизации
  });

  it('should track AI model performance and costs', async () => {
    await test.runTest();

    const modelAnalytics = await test.analyticsService.getModelPerformanceAnalytics(
      test.mainUser.id,
    );
    expect(modelAnalytics.mostEfficientModel).toBe('claude-3-haiku');
    expect(modelAnalytics.bestValueModel).toBe('gpt-3.5-turbo');
    expect(modelAnalytics.totalCreditsUsed).toBeGreaterThan(4000);
  });

  it('should handle team credit sharing correctly', async () => {
    await test.runTest();

    // Проверяем правильность распределения кредитов в команде
    const teamBalance = await test.billingService.getTeamAiCreditsBalance(test.team.id);
    expect(teamBalance.totalShared).toBeGreaterThan(0);
    expect(teamBalance.memberUsage).toHaveLength(2);

    // Проверяем, что оба участника могут использовать общие кредиты
    const mainUserAccess = teamBalance.memberUsage.find((m) => m.userId === test.mainUser.id);
    const colleagueAccess = teamBalance.memberUsage.find((m) => m.userId === test.colleague.id);

    expect(mainUserAccess.canUseSharedCredits).toBe(true);
    expect(colleagueAccess.canUseSharedCredits).toBe(true);
  });

  it('should calculate ROI from AI optimization', async () => {
    await test.runTest();

    const roi = await test.analyticsService.calculateAiOptimizationROI(test.mainUser.id);
    expect(roi.totalInvestment).toBe(2000); // Стоимость AI пакета
    expect(roi.totalSavings).toBeGreaterThan(500); // Экономия от оптимизации
    expect(roi.roiPercentage).toBeGreaterThan(25); // 25%+ ROI
    expect(roi.paybackPeriod).toBeLessThan(4); // Окупаемость менее 4 месяцев
  });
});
