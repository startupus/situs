import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UserStoryTest,
  ServiceClients,
  ValidationHelpers,
  TEST_CONSTANTS,
} from '../helpers/TestHelpers';

/**
 * 🧪 USER STORY: Базовый реферальный поток с начислением бонусов
 *
 * СЦЕНАРИЙ из ТЗ:
 * 1. Пользователь регистрируется, получает 500₽ бонусных
 * 2. Тестирует работу ИИ через OpenRouter
 * 3. Подключает к аккаунту коллегу, создавая ссылку-приглашение
 * 4. Коллега тестирует работу через OpenRouter
 * 5. Коллега создает независимый проект и пополняет на 5000₽
 * 6. Первому пользователю приходит 10% вознаграждение (500₽)
 */
class BasicReferralFlowTest extends UserStoryTest {
  async runTest(): Promise<void> {
    await describe('🔗 Basic Referral Flow', async () => {
      beforeEach(async () => {
        await this.setup();
      });

      afterEach(async () => {
        await this.cleanup();
      });

      await it('should complete full referral flow with bonus calculation', async () => {
        // 👤 ЭТАП 1: Регистрация первого пользователя (реферер)
        const referrer = await this.createTestUser('ivan', {
          email: 'ivan@company.com',
          phone: '+7999111222',
        });

        // 💰 Проверяем регистрационный бонус
        let referrerBalance = await ServiceClients.getBalance(referrer.id);
        expect(referrerBalance.bonusBalance).toBe(TEST_CONSTANTS.REGISTRATION_BONUS);

        console.log(
          `✅ Referrer registered: ${referrer.email} with ${TEST_CONSTANTS.REGISTRATION_BONUS}₽ bonus`,
        );

        // 🤖 ЭТАП 2: Первый пользователь тестирует AI
        const aiRequest1 = await ServiceClients.makeAIRequest(
          referrer.id,
          'gpt-4',
          'Создай план маркетинговой кампании',
        );

        expect(aiRequest1.userId).toBe(referrer.id);
        expect(aiRequest1.baseCost).toBeGreaterThan(0);

        // Списание с бонусного баланса
        await ValidationHelpers.waitForTransactionProcessing();
        referrerBalance = await ServiceClients.getBalance(referrer.id);
        const expectedBalanceAfterAI = TEST_CONSTANTS.REGISTRATION_BONUS - aiRequest1.finalCost;
        ValidationHelpers.validateBalance(referrerBalance.bonusBalance, expectedBalanceAfterAI);

        console.log(`✅ AI request processed: -${aiRequest1.finalCost}₽`);

        // 🔗 ЭТАП 3: Создание реферальной ссылки
        const referralLink = await ServiceClients.createReferralLink(referrer.id);
        expect(referralLink).toMatch(/^https:\/\/platform\.com\/ref\//);

        console.log(`✅ Referral link created: ${referralLink}`);

        // 👥 ЭТАП 4: Регистрация коллеги по реферальной ссылке
        const referralCode = referralLink.split('/').pop()!;
        const colleague = await ServiceClients.registerByReferral(referralCode, {
          email: 'colleague@company.com',
          phone: '+7999333444',
        });

        expect(colleague.referredBy).toBe(referralCode);
        expect(colleague.bonusBalance).toBe(TEST_CONSTANTS.REGISTRATION_BONUS);

        console.log(`✅ Colleague registered via referral: ${colleague.email}`);

        // 🤖 ЭТАП 5: Коллега тестирует AI
        const aiRequest2 = await ServiceClients.makeAIRequest(
          colleague.id,
          'gpt-3.5-turbo',
          'Помоги с анализом данных',
        );

        expect(aiRequest2.userId).toBe(colleague.id);

        console.log(`✅ Colleague tested AI: ${aiRequest2.model}`);

        // 🏗️ ЭТАП 6: Коллега создает независимый проект
        const colleagueProject = await this.createTestProject('colleague', {
          name: 'Independent Analytics Project',
          markup: 25, // 25% надценка
        });

        expect(colleagueProject.ownerId).toBe(colleague.id);

        console.log(`✅ Independent project created: ${colleagueProject.name}`);

        // 💳 ЭТАП 7: Коллега пополняет баланс на 5000₽
        const topupAmount = 5000;
        const topupTransaction = await ServiceClients.topupBalance(
          colleague.id,
          topupAmount,
          'card',
        );

        expect(topupTransaction.amount).toBe(topupAmount);
        expect(topupTransaction.type).toBe('topup');

        // Ждем обработки транзакции
        await ValidationHelpers.waitForTransactionProcessing();

        console.log(`✅ Colleague topped up: ${topupAmount}₽`);

        // 💰 ЭТАП 8: Проверяем начисление реферального бонуса (10% от пополнения)
        const expectedReferralBonus = topupAmount * (TEST_CONSTANTS.REFERRAL_COMMISSION_RATE / 100);

        const referralCommissions = await ServiceClients.getCommissionHistory(referrer.id);
        const topupCommission = referralCommissions.find(
          (c) =>
            c.type === 'referral' &&
            c.fromUserId === colleague.id &&
            c.amount === expectedReferralBonus,
        );

        expect(topupCommission).toBeDefined();
        ValidationHelpers.validateCommission(topupCommission!, {
          userId: referrer.id,
          fromUserId: colleague.id,
          type: 'referral',
          amount: expectedReferralBonus,
          rate: TEST_CONSTANTS.REFERRAL_COMMISSION_RATE,
        });

        console.log(
          `✅ Referral bonus calculated: ${expectedReferralBonus}₽ (${TEST_CONSTANTS.REFERRAL_COMMISSION_RATE}% of ${topupAmount}₽)`,
        );

        // 📊 ЭТАП 9: Проверяем итоговые балансы
        const finalReferrerBalance = await ServiceClients.getBalance(referrer.id);
        const finalColleagueBalance = await ServiceClients.getBalance(colleague.id);

        // Реферер должен получить комиссию
        const expectedReferrerTotal = referrerBalance.balance + expectedReferralBonus;
        ValidationHelpers.validateBalance(finalReferrerBalance.balance, expectedReferrerTotal);

        // Коллега должен иметь пополненный баланс
        ValidationHelpers.validateBalance(finalColleagueBalance.balance, topupAmount);

        console.log(
          `✅ Final balances - Referrer: ${finalReferrerBalance.balance}₽, Colleague: ${finalColleagueBalance.balance}₽`,
        );

        // 📈 ЭТАП 10: Проверяем аналитику
        const referrerReport = await ServiceClients.generateReport(referrer.id, 'user', {
          from: new Date(Date.now() - 24 * 60 * 60 * 1000),
          to: new Date(),
        });

        expect(referrerReport.commissions).toBeGreaterThanOrEqual(expectedReferralBonus);

        console.log(`🎉 FULL REFERRAL FLOW COMPLETED SUCCESSFULLY`);
        console.log(`💰 Total referral earnings: ${expectedReferralBonus}₽`);
        console.log(`👥 Referrals brought: 1 user with ${topupAmount}₽ topup`);
      });

      await it('should handle multiple referral levels', async () => {
        // 🏗️ Создаем цепочку рефералов: A -> B -> C
        const userA = await this.createTestUser('userA');

        // A создает реферальную ссылку
        const linkA = await ServiceClients.createReferralLink(userA.id);
        const codeA = linkA.split('/').pop()!;

        // B регистрируется по ссылке A
        const userB = await ServiceClients.registerByReferral(codeA, {
          email: 'userB@test.com',
        });

        // B создает свою реферальную ссылку
        const linkB = await ServiceClients.createReferralLink(userB.id);
        const codeB = linkB.split('/').pop()!;

        // C регистрируется по ссылке B
        const userC = await ServiceClients.registerByReferral(codeB, {
          email: 'userC@test.com',
        });

        // 💳 C пополняет баланс
        const topupAmount = 3000;
        await ServiceClients.topupBalance(userC.id, topupAmount, 'card');
        await ValidationHelpers.waitForTransactionProcessing();

        // 📊 Проверяем многоуровневые комиссии
        const commissionsA = await ServiceClients.getCommissionHistory(userA.id);
        const commissionsB = await ServiceClients.getCommissionHistory(userB.id);

        // B должен получить прямую комиссию (10%)
        const directCommission = topupAmount * 0.1;
        const directCommissionB = commissionsB.find(
          (c) => c.fromUserId === userC.id && c.type === 'referral',
        );
        expect(directCommissionB?.amount).toBe(directCommission);

        // A может получить комиссию второго уровня (если настроена)
        // Это зависит от конфигурации MLM системы

        console.log(
          `✅ Multi-level referral: B earned ${directCommission}₽ from C's ${topupAmount}₽ topup`,
        );
      });

      await it('should prevent self-referrals and fraud', async () => {
        // 👤 Создаем пользователя
        const user = await this.createTestUser('fraudUser');

        // 🔗 Создаем реферальную ссылку
        const referralLink = await ServiceClients.createReferralLink(user.id);
        const referralCode = referralLink.split('/').pop()!;

        // 🚫 Попытка самореферала (должна быть заблокирована)
        const attemptSelfReferral = async () => {
          await ServiceClients.registerByReferral(referralCode, {
            email: user.email, // тот же email
            phone: user.phone, // тот же телефон
          });
        };

        await expect(attemptSelfReferral()).rejects.toThrow('Self-referral not allowed');

        // 📊 Проверяем, что комиссии не начислены
        const commissions = await ServiceClients.getCommissionHistory(user.id);
        const selfCommissions = commissions.filter((c) => c.fromUserId === user.id);
        expect(selfCommissions).toHaveLength(0);

        console.log(`✅ Self-referral fraud prevention works`);
      });

      await it('should calculate referral bonuses correctly with different topup amounts', async () => {
        // Тестируем различные суммы пополнения
        const testCases = [
          { amount: 1000, expectedBonus: 100 }, // 10% от 1000
          { amount: 10000, expectedBonus: 1000 }, // 10% от 10000
          { amount: 500, expectedBonus: 50 }, // 10% от 500
        ];

        for (const testCase of testCases) {
          // 👤 Создаем реферера и реферала
          const referrer = await this.createTestUser(`referrer_${testCase.amount}`);
          const referralLink = await ServiceClients.createReferralLink(referrer.id);
          const referralCode = referralLink.split('/').pop()!;

          const referral = await ServiceClients.registerByReferral(referralCode, {
            email: `referral_${testCase.amount}@test.com`,
          });

          // 💳 Реферал пополняет баланс
          await ServiceClients.topupBalance(referral.id, testCase.amount, 'card');
          await ValidationHelpers.waitForTransactionProcessing();

          // 📊 Проверяем комиссию
          const commissions = await ServiceClients.getCommissionHistory(referrer.id);
          const commission = commissions.find((c) => c.fromUserId === referral.id);

          expect(commission?.amount).toBe(testCase.expectedBonus);

          console.log(`✅ Topup ${testCase.amount}₽ -> Bonus ${testCase.expectedBonus}₽`);
        }
      });
    });
  }
}

// Запуск теста
export default async function runBasicReferralFlowTest(): Promise<void> {
  const test = new BasicReferralFlowTest();
  await test.runTest();
}
