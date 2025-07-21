import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UserStoryTest,
  ServiceClients,
  ValidationHelpers,
  TEST_CONSTANTS,
} from '../helpers/TestHelpers';

/**
 * 🧪 USER STORY: AI ценообразование и биллинг
 *
 * СЦЕНАРИЙ:
 * 1. Пользователь тестирует разные AI модели (GPT-4, Claude, Gemini)
 * 2. Каждая модель имеет свою стоимость за токены
 * 3. Система корректно рассчитывает стоимость
 * 4. Списание происходит с правильными курсами
 * 5. Отслеживается использование по провайдерам
 */
class AIPricingBillingTest extends UserStoryTest {
  async runTest(): Promise<void> {
    await describe('🤖 AI Pricing and Billing', async () => {
      beforeEach(async () => {
        await this.setup();
      });

      afterEach(async () => {
        await this.cleanup();
      });

      await it('should correctly bill different AI models with accurate pricing', async () => {
        // 👤 Пользователь с достаточным балансом
        const user = await this.createTestUser('ai_tester', {
          email: 'tester@ai.com',
        });

        // 💳 Пополняем баланс
        await ServiceClients.topupBalance(user.id, 10000, 'card');
        await ValidationHelpers.waitForTransactionProcessing();

        // 🤖 Тестируем разные модели с реальными ценами
        const aiModels = [
          {
            provider: 'openai',
            model: 'gpt-4',
            inputTokenPrice: 0.03, // $0.03 per 1K tokens
            outputTokenPrice: 0.06, // $0.06 per 1K tokens
            inputTokens: 1000,
            outputTokens: 500,
            prompt: 'Создай детальный план бизнеса',
          },
          {
            provider: 'anthropic',
            model: 'claude-3-sonnet',
            inputTokenPrice: 0.015, // $0.015 per 1K tokens
            outputTokenPrice: 0.075, // $0.075 per 1K tokens
            inputTokens: 1200,
            outputTokens: 800,
            prompt: 'Проанализируй рыночные данные',
          },
          {
            provider: 'google',
            model: 'gemini-pro',
            inputTokenPrice: 0.001, // $0.001 per 1K tokens
            outputTokenPrice: 0.002, // $0.002 per 1K tokens
            inputTokens: 1500,
            outputTokens: 1000,
            prompt: 'Подсобрать идеи для стартапа',
          },
          {
            provider: 'openrouter',
            model: 'deepseek-coder',
            inputTokenPrice: 0.0002, // $0.0002 per 1K tokens
            outputTokenPrice: 0.0008, // $0.0008 per 1K tokens
            inputTokens: 2000,
            outputTokens: 1500,
            prompt: 'Напиши код для веб-приложения',
          },
        ];

        const aiResults: any[] = [];
        let totalExpectedCost = 0;

        // Выполняем запросы к каждой модели
        for (const modelData of aiModels) {
          const aiRequest = await ServiceClients.makeAIRequest(
            user.id,
            modelData.model,
            modelData.prompt,
          );

          // Рассчитываем ожидаемую стоимость
          const inputCost = (modelData.inputTokens / 1000) * modelData.inputTokenPrice;
          const outputCost = (modelData.outputTokens / 1000) * modelData.outputTokenPrice;
          const baseCost = inputCost + outputCost;
          const serviceCost = baseCost * (1 + TEST_CONSTANTS.SERVICE_MARKUP / 100);

          // Обновляем объект запроса с рассчитанными значениями
          aiRequest.inputTokens = modelData.inputTokens;
          aiRequest.outputTokens = modelData.outputTokens;
          aiRequest.baseCost = baseCost;
          aiRequest.serviceCost = serviceCost;
          aiRequest.finalCost = serviceCost; // без проектной надценки
          aiRequest.provider = modelData.provider;

          aiResults.push({
            ...aiRequest,
            expectedBaseCost: baseCost,
            expectedServiceCost: serviceCost,
          });

          totalExpectedCost += serviceCost;

          console.log(`✅ ${modelData.provider}/${modelData.model}:`);
          console.log(
            `   Input: ${modelData.inputTokens} tokens x $${modelData.inputTokenPrice}/1K = $${inputCost.toFixed(4)}`,
          );
          console.log(
            `   Output: ${modelData.outputTokens} tokens x $${modelData.outputTokenPrice}/1K = $${outputCost.toFixed(4)}`,
          );
          console.log(`   Base cost: $${baseCost.toFixed(4)}`);
          console.log(
            `   Service cost (+${TEST_CONSTANTS.SERVICE_MARKUP}%): $${serviceCost.toFixed(4)}`,
          );
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // 📊 Проверяем итоговый баланс
        const finalBalance = await ServiceClients.getBalance(user.id);
        const expectedFinalBalance = 10000 - totalExpectedCost;
        ValidationHelpers.validateBalance(finalBalance.balance, expectedFinalBalance);

        console.log(`💰 Total AI spending: $${totalExpectedCost.toFixed(4)}`);
        console.log(`💰 Remaining balance: $${finalBalance.balance.toFixed(4)}`);

        // 📈 Проверяем историю транзакций
        const transactions = await ServiceClients.getTransactionHistory(user.id);
        const aiTransactions = transactions.filter((t) => t.type === 'spend');

        expect(aiTransactions.length).toBe(aiModels.length);

        // Проверяем каждую транзакцию
        for (let i = 0; i < aiResults.length; i++) {
          const result = aiResults[i];
          const transaction = aiTransactions[i];

          ValidationHelpers.validateTransaction(transaction, {
            userId: user.id,
            type: 'spend',
            amount: result.expectedServiceCost,
          });
        }

        console.log(`✅ All ${aiResults.length} AI transactions validated`);
      });

      await it('should handle insufficient balance gracefully', async () => {
        // 👤 Пользователь с малым балансом
        const user = await this.createTestUser('poor_user');

        // 💳 Пополняем очень мало
        await ServiceClients.topupBalance(user.id, 0.5, 'card'); // $0.50
        await ValidationHelpers.waitForTransactionProcessing();

        // 🤖 Пытаемся сделать дорогой запрос
        const expensiveRequest = async () => {
          await ServiceClients.makeAIRequest(
            user.id,
            'gpt-4',
            'Очень длинный запрос, который потребует много токенов для обработки и сгенерирует детальный ответ с множеством примеров и объяснений',
          );
        };

        // ❌ Должна быть ошибка недостатка средств
        await expect(expensiveRequest()).rejects.toThrow('Insufficient balance');

        // 💰 Баланс не должен измениться
        const balance = await ServiceClients.getBalance(user.id);
        expect(balance.balance).toBe(0.5);

        console.log(`✅ Insufficient balance protection works`);
      });

      await it('should prioritize bonus balance over main balance', async () => {
        // 👤 Пользователь с бонусным и основным балансом
        const user = await this.createTestUser('bonus_user');

        // Устанавливаем оба баланса
        user.bonusBalance = 100; // бонусные
        user.balance = 200; // основные

        // 🤖 Делаем AI запрос на $50
        const aiRequest = await ServiceClients.makeAIRequest(
          user.id,
          'gpt-3.5-turbo',
          'Средний запрос',
        );

        const cost = 50;
        aiRequest.finalCost = cost;

        await ValidationHelpers.waitForTransactionProcessing();

        // 💰 Проверяем, что сначала тратятся бонусы
        const balance = await ServiceClients.getBalance(user.id);
        expect(balance.bonusBalance).toBe(50); // 100 - 50
        expect(balance.balance).toBe(200); // без изменений

        console.log(
          `✅ Bonus balance prioritization works: bonus ${balance.bonusBalance}, main ${balance.balance}`,
        );
      });

      await it('should handle mixed balance usage', async () => {
        // 👤 Пользователь с малым бонусным балансом
        const user = await this.createTestUser('mixed_user');

        user.bonusBalance = 30; // бонусные
        user.balance = 100; // основные

        // 🤖 Делаем запрос на $50 (больше бонусов)
        const aiRequest = await ServiceClients.makeAIRequest(
          user.id,
          'gpt-4',
          'Запрос дороже бонусов',
        );

        const cost = 50;
        aiRequest.finalCost = cost;

        await ValidationHelpers.waitForTransactionProcessing();

        // 💰 Проверяем смешанное списание
        const balance = await ServiceClients.getBalance(user.id);
        expect(balance.bonusBalance).toBe(0); // потрачены все бонусы (30)
        expect(balance.balance).toBe(80); // потрачено 20 с основного (100 - 20)

        const transactions = await ServiceClients.getTransactionHistory(user.id);
        const spendTransactions = transactions.filter((t) => t.type === 'spend');

        // Должно быть 2 транзакции: бонусная и основная
        expect(spendTransactions.length).toBe(2);

        console.log(`✅ Mixed balance usage: bonus spent ${30}, main spent ${20}`);
      });

      await it('should track AI usage analytics by provider', async () => {
        // 👤 Пользователь тестирует разных провайдеров
        const user = await this.createTestUser('analytics_user');
        await ServiceClients.topupBalance(user.id, 1000, 'card');

        // 🤖 Используем разных провайдеров с разной интенсивностью
        const providerUsage = [
          { provider: 'openai', requests: 5 },
          { provider: 'anthropic', requests: 3 },
          { provider: 'google', requests: 2 },
          { provider: 'openrouter', requests: 1 },
        ];

        for (const { provider, requests } of providerUsage) {
          for (let i = 0; i < requests; i++) {
            await ServiceClients.makeAIRequest(
              user.id,
              `${provider}-model`,
              `Test request ${i + 1} for ${provider}`,
            );
          }
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // 📊 Проверяем аналитику использования
        const report = await ServiceClients.generateReport(user.id, 'user', {
          from: new Date(Date.now() - 24 * 60 * 60 * 1000),
          to: new Date(),
        });

        // Должно быть учтено правильное количество запросов
        const totalRequests = providerUsage.reduce((sum, p) => sum + p.requests, 0);
        expect(report.transactions).toBeGreaterThanOrEqual(totalRequests);

        console.log(`📊 AI Usage Analytics:`);
        console.log(`   Total requests: ${totalRequests}`);
        console.log(`   OpenAI: ${providerUsage[0].requests} requests`);
        console.log(`   Anthropic: ${providerUsage[1].requests} requests`);
        console.log(`   Google: ${providerUsage[2].requests} requests`);
        console.log(`   OpenRouter: ${providerUsage[3].requests} requests`);
      });

      await it('should apply currency conversion correctly', async () => {
        // 👤 Пользователь в рублях
        const user = await this.createTestUser('rub_user');
        await ServiceClients.topupBalance(user.id, 100000, 'card'); // 100,000 ₽

        // 🤖 AI запрос с долларовой ценой
        const aiRequest = await ServiceClients.makeAIRequest(
          user.id,
          'gpt-4',
          'Request with currency conversion',
        );

        // Предположим курс 1 USD = 75 RUB
        const usdCost = 10; // $10
        const rubCost = usdCost * 75; // 750₽
        const exchangeRate = 75;

        aiRequest.baseCost = usdCost;
        aiRequest.finalCost = rubCost;

        await ValidationHelpers.waitForTransactionProcessing();

        // 💰 Проверяем списание в рублях
        const balance = await ServiceClients.getBalance(user.id);
        const expectedBalance = 100000 - rubCost;
        ValidationHelpers.validateBalance(balance.balance, expectedBalance);

        console.log(`💱 Currency conversion: $${usdCost} → ${rubCost}₽ (rate: ${exchangeRate})`);
        console.log(`💰 Balance after conversion: ${balance.balance}₽`);
      });

      await it('should handle concurrent AI requests correctly', async () => {
        // 👤 Пользователь с хорошим балансом
        const user = await this.createTestUser('concurrent_user');
        await ServiceClients.topupBalance(user.id, 1000, 'card');

        // 🤖 Множественные одновременные запросы
        const concurrentPromises: any[] = [];
        const requestCount = 10;

        for (let i = 0; i < requestCount; i++) {
          concurrentPromises.push(
            ServiceClients.makeAIRequest(user.id, 'gpt-3.5-turbo', `Concurrent request ${i + 1}`),
          );
        }

        // Ждем выполнения всех запросов
        const results = await Promise.all(concurrentPromises);
        await ValidationHelpers.waitForTransactionProcessing();

        // ✅ Все запросы должны быть успешными
        expect(results.length).toBe(requestCount);
        results.forEach((result, index) => {
          expect(result.id).toBeDefined();
          expect(result.userId).toBe(user.id);
        });

        // 📊 Проверяем транзакции
        const transactions = await ServiceClients.getTransactionHistory(user.id);
        const aiTransactions = transactions.filter((t) => t.type === 'spend');
        expect(aiTransactions.length).toBe(requestCount);

        // 💰 Баланс должен быть корректно уменьшен
        const balance = await ServiceClients.getBalance(user.id);
        expect(balance.balance).toBeLessThan(1000);

        console.log(`✅ ${requestCount} concurrent AI requests processed successfully`);
        console.log(`💰 Final balance: ${balance.balance}`);
      });
    });
  }
}

// Запуск теста
export default async function runAIPricingBillingTest(): Promise<void> {
  const test = new AIPricingBillingTest();
  await test.runTest();
}
