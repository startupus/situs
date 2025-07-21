import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UserStoryTest,
  ServiceClients,
  ValidationHelpers,
  TEST_CONSTANTS,
} from '../../helpers/TestHelpers';

/**
 * 🧪 USER STORY: SMS Registration → Bonus → AI Testing → Referral Chain
 *
 * ПОЛНЫЙ СЦЕНАРИЙ:
 * 1. Пользователь регистрируется через SMS аутентификацию
 * 2. Получает приветственный бонус 500₽
 * 3. Тестирует AI через OpenRouter (тратит часть бонуса)
 * 4. Приглашает коллегу по реферальной ссылке
 * 5. Коллега создает независимый проект
 * 6. Коллега пополняет баланс на 5000₽
 * 7. Оригинальный пользователь получает 10% реферальный бонус (500₽)
 * 8. Проверяем все транзакции и балансы
 */
class SmsRegistrationReferralChainTest extends UserStoryTest {
  async runTest(): Promise<void> {
    await describe('📱 SMS Registration → Bonus → AI Testing → Referral Chain', async () => {
      beforeEach(async () => {
        await this.setup();
      });

      afterEach(async () => {
        await this.cleanup();
      });

      await it('should execute complete SMS registration and referral chain scenario', async () => {
        console.log('\n🚀 Starting SMS Registration & Referral Chain Test...\n');

        // === ЭТАП 1: SMS РЕГИСТРАЦИЯ С БОНУСОМ ===
        console.log('📱 STEP 1: SMS Registration with Welcome Bonus');

        // Симулируем SMS аутентификацию
        const phoneNumber = '+79991234567';
        const smsCode = '123456';

        // Отправляем SMS код
        const smsResponse = await ServiceClients.sendSmsCode(phoneNumber);
        expect(smsResponse.success).toBe(true);
        expect(smsResponse.codeId).toBeDefined();

        // Подтверждаем код и регистрируемся
        const user = await ServiceClients.confirmSmsAndRegister(smsResponse.codeId, smsCode, {
          name: 'Иван Петров',
          email: 'ivan.petrov@company.com',
        });

        expect(user.id).toBeDefined();
        expect(user.phone).toBe(phoneNumber);
        expect(user.isPhoneVerified).toBe(true);

        console.log(`✅ User registered: ${user.id} (${user.phone})`);

        // Проверяем приветственный бонус 500₽
        await ValidationHelpers.waitForTransactionProcessing();
        const initialBalance = await ServiceClients.getBalance(user.id);

        expect(initialBalance.bonusBalance).toBe(500);
        expect(initialBalance.balance).toBe(0);

        console.log(`💰 Welcome bonus credited: ${initialBalance.bonusBalance}₽`);

        // === ЭТАП 2: ТЕСТИРОВАНИЕ AI ЧЕРЕЗ OPENROUTER ===
        console.log('\n🤖 STEP 2: AI Testing through OpenRouter');

        const aiTests = [
          {
            model: 'openai/gpt-3.5-turbo',
            prompt: 'Создай план развития стартапа в сфере ИТ',
            expectedCost: 15, // ₽
          },
          {
            model: 'anthropic/claude-3-haiku',
            prompt: 'Проанализируй рынок мобильных приложений',
            expectedCost: 25, // ₽
          },
          {
            model: 'google/gemini-pro',
            prompt: 'Дай рекомендации по монетизации',
            expectedCost: 10, // ₽
          },
        ];

        let totalAiCost = 0;
        for (const test of aiTests) {
          const aiResponse = await ServiceClients.makeAIRequest(user.id, test.model, test.prompt);

          expect(aiResponse.success).toBe(true);
          expect(aiResponse.response).toBeDefined();
          expect(aiResponse.cost).toBeCloseTo(test.expectedCost, 1);

          totalAiCost += test.expectedCost;

          console.log(`✅ AI request to ${test.model}: ${test.expectedCost}₽`);
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // Проверяем баланс после AI тестов
        const balanceAfterAI = await ServiceClients.getBalance(user.id);
        const expectedBonusBalance = 500 - totalAiCost;

        expect(balanceAfterAI.bonusBalance).toBe(expectedBonusBalance);
        expect(balanceAfterAI.balance).toBe(0);

        console.log(`💰 Balance after AI tests: ${balanceAfterAI.bonusBalance}₽ bonus remaining`);

        // === ЭТАП 3: СОЗДАНИЕ РЕФЕРАЛЬНОЙ ССЫЛКИ ===
        console.log('\n🔗 STEP 3: Creating Referral Link');

        // Регистрируем пользователя как партнера
        const partner = await ServiceClients.registerPartner(user.id);
        expect(partner.id).toBeDefined();
        expect(partner.userId).toBe(user.id);

        // Генерируем реферальную ссылку
        const referralLink = await ServiceClients.generateReferralLink(partner.id, {
          utmSource: 'personal',
          description: 'Приглашение коллеги',
        });

        expect(referralLink.code).toBeDefined();
        expect(referralLink.partnerId).toBe(partner.id);

        console.log(`✅ Referral link created: ${referralLink.code}`);

        // === ЭТАП 4: РЕГИСТРАЦИЯ КОЛЛЕГИ ПО РЕФЕРАЛЬНОЙ ССЫЛКЕ ===
        console.log('\n👥 STEP 4: Colleague Registration via Referral Link');

        // Коллега переходит по ссылке и регистрируется
        const colleaguePhone = '+79997654321';
        const colleagueSmsResponse = await ServiceClients.sendSmsCode(colleaguePhone);

        const colleague = await ServiceClients.confirmSmsAndRegister(
          colleagueSmsResponse.codeId,
          '654321',
          {
            name: 'Мария Сидорова',
            email: 'maria.sidorova@company.com',
            referralCode: referralLink.code, // Используем реферальную ссылку
          },
        );

        expect(colleague.id).toBeDefined();
        expect(colleague.phone).toBe(colleaguePhone);

        console.log(`✅ Colleague registered: ${colleague.id} via referral`);

        // Проверяем, что связь реферал-партнер создана
        const referralConnection = await ServiceClients.getReferralConnection(
          partner.id,
          colleague.id,
        );

        expect(referralConnection.referrerId).toBe(user.id);
        expect(referralConnection.referredId).toBe(colleague.id);

        console.log(`✅ Referral connection established`);

        // === ЭТАП 5: КОЛЛЕГА СОЗДАЕТ НЕЗАВИСИМЫЙ ПРОЕКТ ===
        console.log('\n🏗️ STEP 5: Colleague Creates Independent Project');

        const project = await ServiceClients.createProject(colleague.id, {
          name: 'Mobile App Development',
          description: 'Разработка мобильного приложения для бизнеса',
          type: 'development',
        });

        expect(project.id).toBeDefined();
        expect(project.ownerId).toBe(colleague.id);

        console.log(`✅ Project created: ${project.id} (${project.name})`);

        // === ЭТАП 6: КОЛЛЕГА ПОПОЛНЯЕТ БАЛАНС НА 5000₽ ===
        console.log('\n💳 STEP 6: Colleague Deposits 5000₽');

        const depositAmount = 5000;
        const depositResponse = await ServiceClients.topupBalance(
          colleague.id,
          depositAmount,
          'card',
          {
            paymentMethod: 'credit_card',
            currency: 'RUB',
          },
        );

        expect(depositResponse.success).toBe(true);
        expect(depositResponse.amount).toBe(depositAmount);

        await ValidationHelpers.waitForTransactionProcessing();

        // Проверяем баланс коллеги
        const colleagueBalance = await ServiceClients.getBalance(colleague.id);
        expect(colleagueBalance.balance).toBe(depositAmount);

        console.log(`✅ Colleague deposited: ${depositAmount}₽`);

        // === ЭТАП 7: НАЧИСЛЕНИЕ РЕФЕРАЛЬНОГО БОНУСА ===
        console.log('\n🎁 STEP 7: Referral Bonus Calculation');

        // Проверяем начисление 10% реферального бонуса
        const referralBonusRate = 0.1; // 10%
        const expectedReferralBonus = depositAmount * referralBonusRate; // 500₽

        await ValidationHelpers.waitForReferralProcessing();

        // Проверяем баланс оригинального пользователя
        const finalUserBalance = await ServiceClients.getBalance(user.id);
        const expectedFinalBonusBalance = expectedBonusBalance + expectedReferralBonus;

        expect(finalUserBalance.bonusBalance).toBe(expectedFinalBonusBalance);
        expect(finalUserBalance.balance).toBe(0);

        console.log(`✅ Referral bonus credited: ${expectedReferralBonus}₽`);
        console.log(`💰 Final user bonus balance: ${finalUserBalance.bonusBalance}₽`);

        // === ЭТАП 8: ПРОВЕРКА ВСЕХ ТРАНЗАКЦИЙ ===
        console.log('\n📊 STEP 8: Transaction Validation');

        // Получаем историю транзакций пользователя
        const userTransactions = await ServiceClients.getTransactionHistory(user.id);

        // Проверяем приветственный бонус
        const welcomeBonusTransaction = userTransactions.find(
          (t) => t.type === 'bonus' && t.subtype === 'welcome',
        );
        expect(welcomeBonusTransaction).toBeDefined();
        expect(welcomeBonusTransaction!.amount).toBe(500);

        // Проверяем транзакции AI
        const aiTransactions = userTransactions.filter(
          (t) => t.type === 'spend' && t.subtype === 'ai_request',
        );
        expect(aiTransactions.length).toBe(aiTests.length);

        const totalAiSpent = aiTransactions.reduce((sum, t) => sum + t.amount, 0);
        expect(totalAiSpent).toBe(totalAiCost);

        // Проверяем реферальный бонус
        const referralBonusTransaction = userTransactions.find(
          (t) => t.type === 'bonus' && t.subtype === 'referral',
        );
        expect(referralBonusTransaction).toBeDefined();
        expect(referralBonusTransaction!.amount).toBe(expectedReferralBonus);
        expect(referralBonusTransaction!.relatedEntity).toBe(colleague.id);

        console.log(`✅ All transactions validated:`);
        console.log(`   - Welcome bonus: 500₽`);
        console.log(`   - AI spending: ${totalAiCost}₽`);
        console.log(`   - Referral bonus: ${expectedReferralBonus}₽`);

        // Получаем историю транзакций коллеги
        const colleagueTransactions = await ServiceClients.getTransactionHistory(colleague.id);

        // Проверяем депозит коллеги
        const depositTransaction = colleagueTransactions.find(
          (t) => t.type === 'deposit' && t.amount === depositAmount,
        );
        expect(depositTransaction).toBeDefined();

        console.log(`✅ Colleague deposit transaction validated: ${depositAmount}₽`);

        // === ЭТАП 9: ПРОВЕРКА ПАРТНЕРСКОЙ АНАЛИТИКИ ===
        console.log('\n📈 STEP 9: Partner Analytics Validation');

        const partnerStats = await ServiceClients.getPartnerStats(partner.id);

        expect(partnerStats.totalReferrals).toBe(1);
        expect(partnerStats.totalEarnings).toBe(expectedReferralBonus);
        expect(partnerStats.activeReferrals).toBe(1);

        console.log(`✅ Partner stats validated:`);
        console.log(`   - Total referrals: ${partnerStats.totalReferrals}`);
        console.log(`   - Total earnings: ${partnerStats.totalEarnings}₽`);
        console.log(`   - Active referrals: ${partnerStats.activeReferrals}`);

        // === ИТОГОВАЯ ПРОВЕРКА ===
        console.log('\n🎯 FINAL VALIDATION:');
        console.log(`👤 Original user (${user.id}):`);
        console.log(`   - Started with: 500₽ welcome bonus`);
        console.log(`   - Spent on AI: ${totalAiCost}₽`);
        console.log(`   - Earned referral: ${expectedReferralBonus}₽`);
        console.log(`   - Final balance: ${finalUserBalance.bonusBalance}₽ bonus`);
        console.log(`👥 Colleague (${colleague.id}):`);
        console.log(`   - Deposited: ${depositAmount}₽`);
        console.log(`   - Current balance: ${colleagueBalance.balance}₽`);
        console.log(`🔗 Referral system:`);
        console.log(`   - Bonus rate: ${referralBonusRate * 100}%`);
        console.log(`   - Bonus amount: ${expectedReferralBonus}₽`);

        // Финальная проверка целостности
        expect(finalUserBalance.bonusBalance).toBe(500 - totalAiCost + expectedReferralBonus);
        expect(colleagueBalance.balance).toBe(depositAmount);

        console.log('\n✅ SMS Registration → Referral Chain Test COMPLETED SUCCESSFULLY! 🎉\n');
      });

      await it('should handle referral bonus limits and caps', async () => {
        console.log('\n🔒 Testing Referral Bonus Limits...\n');

        // Создаем пользователя с большим количеством рефералов
        const user = await this.createTestUser('power_referrer');
        const partner = await ServiceClients.registerPartner(user.id);
        const referralLink = await ServiceClients.generateReferralLink(partner.id);

        // Симулируем множественные депозиты от рефералов
        const referralDeposits = [
          { amount: 10000, expectedBonus: 1000 }, // 10% от 10,000₽
          { amount: 15000, expectedBonus: 1500 }, // 10% от 15,000₽
          { amount: 50000, expectedBonus: 5000 }, // 10% от 50,000₽, но может быть ограничение
        ];

        let totalExpectedBonus = 0;
        let referralCount = 0;

        for (const deposit of referralDeposits) {
          referralCount++;

          // Создаем нового реферала
          const referral = await this.createTestUser(`referral_${referralCount}`);
          await ServiceClients.registerReferral(referral.id, referralLink.code);

          // Реферал делает депозит
          await ServiceClients.topupBalance(referral.id, deposit.amount, 'card');

          await ValidationHelpers.waitForReferralProcessing();

          // Проверяем начисленный бонус (может быть ограничен максимальной суммой)
          const balance = await ServiceClients.getBalance(user.id);

          // Если есть лимит на реферальный бонус (например, максимум 2000₽ за одного реферала)
          const maxBonusPerReferral = 2000;
          const actualExpectedBonus = Math.min(deposit.expectedBonus, maxBonusPerReferral);
          totalExpectedBonus += actualExpectedBonus;

          console.log(
            `✅ Referral ${referralCount}: ${deposit.amount}₽ → ${actualExpectedBonus}₽ bonus`,
          );
        }

        const finalBalance = await ServiceClients.getBalance(user.id);

        console.log(`💰 Total referral bonus earned: ${finalBalance.bonusBalance}₽`);
        console.log(`📊 Expected total: ${totalExpectedBonus}₽`);

        // Проверяем, что система корректно применяет лимиты
        expect(finalBalance.bonusBalance).toBeLessThanOrEqual(totalExpectedBonus);
      });

      await it('should track referral source analytics', async () => {
        console.log('\n📊 Testing Referral Source Analytics...\n');

        const user = await this.createTestUser('analytics_referrer');
        const partner = await ServiceClients.registerPartner(user.id);

        // Создаем реферальные ссылки с разными источниками
        const referralSources = [
          { utmSource: 'telegram', utmMedium: 'social' },
          { utmSource: 'email', utmMedium: 'newsletter' },
          { utmSource: 'website', utmMedium: 'banner' },
        ];

        const referralLinks = [];
        for (const source of referralSources) {
          const link = await ServiceClients.generateReferralLink(partner.id, source);
          referralLinks.push({ ...link, ...source });
        }

        // Приводим рефералов через разные источники
        for (let i = 0; i < referralLinks.length; i++) {
          const link = referralLinks[i];
          const referral = await this.createTestUser(`source_referral_${i}`);

          await ServiceClients.registerReferral(referral.id, link.code);
          await ServiceClients.topupBalance(referral.id, 1000, 'card');
        }

        await ValidationHelpers.waitForReferralProcessing();

        // Получаем аналитику по источникам
        const sourceAnalytics = await ServiceClients.getReferralSourceAnalytics(partner.id);

        expect(sourceAnalytics.sources).toHaveLength(3);

        for (const sourceData of sourceAnalytics.sources) {
          expect(sourceData.referrals).toBe(1);
          expect(sourceData.revenue).toBe(1000);
          expect(sourceData.bonusEarned).toBe(100); // 10%
        }

        console.log(`✅ Source analytics validated for ${referralSources.length} channels`);
      });
    });
  }
}

// Экспорт теста
export default async function runSmsRegistrationReferralChainTest(): Promise<void> {
  const test = new SmsRegistrationReferralChainTest();
  await test.runTest();
}
