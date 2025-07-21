import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserStoryTest } from '../../helpers/UserStoryTest';

/**
 * 💳 Пользовательская история: Жизненный цикл подписки
 *
 * Сценарий:
 * 1. Пользователь регистрируется и получает 7-дневный триал
 * 2. Активно использует AI сервисы в течение триала
 * 3. На 5-й день получает уведомление о скором окончании
 * 4. Покупает Premium подписку на месяц (2000₽)
 * 5. Получает 20% скидку на первый месяц (1600₽)
 * 6. Приглашает друга, который также покупает подписку
 * 7. Получает cashback 15% (300₽) за реферал
 * 8. Подписка автоматически продлевается на полную стоимость
 * 9. Пользователь отменяет подписку с сохранением до конца периода
 * 10. Получает предложение о возврате со скидкой 50%
 */

class SubscriptionLifecycleFlowTest extends UserStoryTest {
  private mainUser: any;
  private referredUser: any;
  private subscription: any;
  private referredSubscription: any;
  private trialPeriod: number = 7; // дней

  async runTest(): Promise<void> {
    await this.step1_RegistrationWithTrial();
    await this.step2_ActiveTrialUsage();
    await this.step3_TrialExpirationNotification();
    await this.step4_PurchasePremiumSubscription();
    await this.step5_FirstMonthDiscount();
    await this.step6_InviteFriendSubscription();
    await this.step7_ReferralCashback();
    await this.step8_AutoRenewal();
    await this.step9_CancelSubscription();
    await this.step10_WinBackOffer();
  }

  private async step1_RegistrationWithTrial(): Promise<void> {
    this.mainUser = await this.userService.registerUser({
      email: 'trial@example.com',
      password: 'TrialPass123!',
      source: 'organic',
    });

    // Автоматически активируем 7-дневный триал
    const trial = await this.subscriptionService.activateTrial({
      userId: this.mainUser.id,
      plan: 'premium_trial',
      duration: this.trialPeriod,
      features: ['unlimited_ai', 'priority_support', 'advanced_analytics'],
    });

    expect(trial.isActive).toBe(true);
    expect(trial.daysRemaining).toBe(7);
    expect(trial.plan).toBe('premium_trial');

    this.logStep('✅ Пользователь зарегистрирован с 7-дневным триалом');
  }

  private async step2_ActiveTrialUsage(): Promise<void> {
    // Симулируем активное использование в течение первых 4 дней
    const dailyUsage = [
      { day: 1, requests: 50, tokens: 25000, models: ['gpt-3.5-turbo', 'claude-3-haiku'] },
      { day: 2, requests: 75, tokens: 40000, models: ['gpt-4', 'claude-3-sonnet'] },
      { day: 3, requests: 100, tokens: 60000, models: ['gpt-4-turbo', 'claude-3-opus'] },
      { day: 4, requests: 120, tokens: 80000, models: ['gpt-4', 'claude-3-sonnet', 'gemini-pro'] },
    ];

    let totalTokens = 0;
    let totalRequests = 0;

    for (const usage of dailyUsage) {
      const dayUsage = await this.aiService.simulateDailyUsage({
        userId: this.mainUser.id,
        day: usage.day,
        requests: usage.requests,
        tokens: usage.tokens,
        models: usage.models,
      });

      totalTokens += usage.tokens;
      totalRequests += usage.requests;

      expect(dayUsage.processed).toBe(true);
    }

    // Проверяем статистику использования
    const usageStats = await this.analyticsService.getTrialUsageStats(this.mainUser.id);
    expect(usageStats.totalTokens).toBe(totalTokens);
    expect(usageStats.totalRequests).toBe(totalRequests);
    expect(usageStats.averageRequestsPerDay).toBe(totalRequests / 4);

    this.logStep(`✅ Активное использование: ${totalRequests} запросов, ${totalTokens} токенов`);
  }

  private async step3_TrialExpirationNotification(): Promise<void> {
    // На 5-й день отправляем уведомление о скором окончании триала
    const notification = await this.notificationService.sendTrialExpirationWarning({
      userId: this.mainUser.id,
      daysRemaining: 2,
      usageStats: {
        totalRequests: 345,
        totalTokens: 205000,
        favoriteModels: ['gpt-4', 'claude-3-sonnet'],
      },
    });

    expect(notification.sent).toBe(true);
    expect(notification.type).toBe('trial_expiration_warning');
    expect(notification.daysRemaining).toBe(2);

    // Проверяем, что уведомление содержит персонализированное предложение
    expect(notification.content).toContain('gpt-4');
    expect(notification.content).toContain('claude-3-sonnet');
    expect(notification.offerDiscount).toBe(20); // 20% скидка для активных пользователей

    this.logStep('✅ Уведомление о скором окончании триала отправлено');
  }

  private async step4_PurchasePremiumSubscription(): Promise<void> {
    // Пользователь покупает Premium подписку
    this.subscription = await this.subscriptionService.purchaseSubscription({
      userId: this.mainUser.id,
      plan: 'premium_monthly',
      basePrice: 2000,
      currency: 'RUB',
      paymentMethod: 'card',
      promoCode: 'TRIAL20', // 20% скидка
    });

    expect(this.subscription.plan).toBe('premium_monthly');
    expect(this.subscription.status).toBe('active');
    expect(this.subscription.basePrice).toBe(2000);
    expect(this.subscription.discountApplied).toBe(400); // 20% от 2000₽

    this.logStep('✅ Premium подписка куплена с промокодом TRIAL20');
  }

  private async step5_FirstMonthDiscount(): Promise<void> {
    // Обрабатываем платеж со скидкой
    const payment = await this.billingService.processSubscriptionPayment({
      subscriptionId: this.subscription.id,
      amount: 1600, // 2000₽ - 400₽ скидка
      currency: 'RUB',
      period: 'first_month',
    });

    expect(payment.amount).toBe(1600);
    expect(payment.discount).toBe(400);
    expect(payment.status).toBe('completed');

    // Проверяем баланс пользователя
    const userBalance = await this.billingService.getBalance(this.mainUser.id);
    expect(userBalance.RUB).toBe(-1600); // Списание за подписку

    this.logStep('✅ Первый месяц оплачен со скидкой 20% (1600₽)');
  }

  private async step6_InviteFriendSubscription(): Promise<void> {
    // Генерируем реферальную ссылку
    const referralLink = await this.userService.generateReferralLink(this.mainUser.id, {
      type: 'subscription_referral',
      reward: 'cashback_15_percent',
    });

    // Друг регистрируется по реферальной ссылке
    this.referredUser = await this.userService.registerUser({
      email: 'friend@example.com',
      password: 'FriendPass123!',
      referralCode: referralLink.code,
    });

    // Друг также покупает подписку
    this.referredSubscription = await this.subscriptionService.purchaseSubscription({
      userId: this.referredUser.id,
      plan: 'premium_monthly',
      basePrice: 2000,
      currency: 'RUB',
      paymentMethod: 'card',
      referredBy: this.mainUser.id,
    });

    expect(this.referredSubscription.plan).toBe('premium_monthly');
    expect(this.referredSubscription.status).toBe('active');
    expect(this.referredSubscription.referredBy).toBe(this.mainUser.id);

    this.logStep('✅ Друг зарегистрирован и купил подписку по реферальной ссылке');
  }

  private async step7_ReferralCashback(): Promise<void> {
    // Основной пользователь получает cashback 15% за реферал
    const cashback = await this.billingService.processReferralCashback({
      referrerId: this.mainUser.id,
      referredUserId: this.referredUser.id,
      subscriptionAmount: 2000,
      cashbackRate: 0.15,
    });

    expect(cashback.amount).toBe(300); // 15% от 2000₽
    expect(cashback.type).toBe('subscription_referral_cashback');

    // Проверяем, что cashback зачислен на баланс
    const balance = await this.billingService.getBalance(this.mainUser.id);
    expect(balance.RUB).toBe(-1600 + 300); // Предыдущий баланс + cashback

    this.logStep('✅ Получен cashback 300₽ за реферал подписки');
  }

  private async step8_AutoRenewal(): Promise<void> {
    // Симулируем прохождение месяца и автоматическое продление
    await this.timeService.advanceTime({ days: 30 });

    const renewal = await this.subscriptionService.processAutoRenewal({
      subscriptionId: this.subscription.id,
      amount: 2000, // Полная стоимость без скидки
      currency: 'RUB',
    });

    expect(renewal.amount).toBe(2000);
    expect(renewal.status).toBe('completed');
    expect(renewal.isRenewal).toBe(true);

    // Проверяем, что подписка продлена
    const updatedSubscription = await this.subscriptionService.getSubscription(
      this.subscription.id,
    );
    expect(updatedSubscription.status).toBe('active');
    expect(updatedSubscription.renewalCount).toBe(1);

    this.logStep('✅ Подписка автоматически продлена на полную стоимость 2000₽');
  }

  private async step9_CancelSubscription(): Promise<void> {
    // Пользователь отменяет подписку
    const cancellation = await this.subscriptionService.cancelSubscription({
      subscriptionId: this.subscription.id,
      reason: 'cost_too_high',
      feedback: 'Отличный сервис, но дорого для моих нужд',
      immediateCancel: false, // Сохранить до конца периода
    });

    expect(cancellation.status).toBe('cancelled');
    expect(cancellation.activeUntil).toBeDefined();
    expect(cancellation.reason).toBe('cost_too_high');

    // Проверяем, что подписка еще активна до конца периода
    const subscription = await this.subscriptionService.getSubscription(this.subscription.id);
    expect(subscription.status).toBe('active'); // Еще активна
    expect(subscription.willCancelAt).toBeDefined();

    this.logStep('✅ Подписка отменена с сохранением до конца периода');
  }

  private async step10_WinBackOffer(): Promise<void> {
    // Через 3 дня после отмены отправляем win-back предложение
    await this.timeService.advanceTime({ days: 3 });

    const winBackOffer = await this.marketingService.createWinBackOffer({
      userId: this.mainUser.id,
      previousPlan: 'premium_monthly',
      discount: 50,
      validFor: 7, // дней
      personalizedMessage: true,
    });

    expect(winBackOffer.discount).toBe(50);
    expect(winBackOffer.newPrice).toBe(1000); // 50% от 2000₽
    expect(winBackOffer.validUntil).toBeDefined();

    // Отправляем персонализированное email
    const email = await this.emailService.sendWinBackEmail({
      userId: this.mainUser.id,
      offer: winBackOffer,
      usageStats: {
        favoriteModels: ['gpt-4', 'claude-3-sonnet'],
        averageMonthlyRequests: 2500,
      },
    });

    expect(email.sent).toBe(true);
    expect(email.personalized).toBe(true);

    this.logStep('✅ Win-back предложение со скидкой 50% отправлено');
  }
}

describe('💳 Subscription Lifecycle Flow', () => {
  let test: SubscriptionLifecycleFlowTest;

  beforeEach(async () => {
    test = new SubscriptionLifecycleFlowTest();
    await test.setup();
  });

  afterEach(async () => {
    await test.cleanup();
  });

  it('should complete full subscription lifecycle from trial to cancellation', async () => {
    await test.runTest();

    // Проверяем финальное состояние
    const finalSubscription = await test.subscriptionService.getSubscription(test.subscription.id);
    expect(finalSubscription.status).toBe('active'); // Еще активна до конца периода
    expect(finalSubscription.willCancelAt).toBeDefined();

    // Проверяем баланс пользователя
    const finalBalance = await test.billingService.getBalance(test.mainUser.id);
    expect(finalBalance.RUB).toBe(-3300); // -1600 (первый месяц) + 300 (cashback) - 2000 (второй месяц)
  });

  it('should track subscription metrics correctly', async () => {
    await test.runTest();

    const metrics = await test.analyticsService.getSubscriptionMetrics(test.mainUser.id);
    expect(metrics.totalPaid).toBe(3600); // 1600 + 2000
    expect(metrics.totalDiscount).toBe(400); // Скидка первого месяца
    expect(metrics.referralCashback).toBe(300);
    expect(metrics.subscriptionDuration).toBe(2); // месяца
  });

  it('should handle win-back offer acceptance', async () => {
    await test.runTest();

    // Симулируем принятие win-back предложения
    const winBackAcceptance = await test.subscriptionService.acceptWinBackOffer({
      userId: test.mainUser.id,
      offerId: 'winback_50_percent',
      newPrice: 1000,
    });

    expect(winBackAcceptance.accepted).toBe(true);
    expect(winBackAcceptance.newPrice).toBe(1000);

    // Проверяем, что подписка возобновлена
    const renewedSubscription = await test.subscriptionService.getSubscription(
      test.subscription.id,
    );
    expect(renewedSubscription.status).toBe('active');
    expect(renewedSubscription.currentPrice).toBe(1000);
  });

  it('should calculate lifetime value correctly', async () => {
    await test.runTest();

    const ltv = await test.analyticsService.calculateCustomerLTV(test.mainUser.id);
    expect(ltv.totalRevenue).toBe(3600); // Общая выручка
    expect(ltv.totalCashback).toBe(300); // Выплаченный cashback
    expect(ltv.netRevenue).toBe(3300); // Чистая выручка
    expect(ltv.monthsActive).toBe(2);
    expect(ltv.referralsGenerated).toBe(1);
  });
});
