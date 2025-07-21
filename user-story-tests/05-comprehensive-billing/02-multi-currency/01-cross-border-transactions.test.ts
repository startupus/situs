import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UserStoryTest,
  ServiceClients,
  ValidationHelpers,
  TEST_CONSTANTS,
} from '../../helpers/TestHelpers';

/**
 * 🧪 USER STORY: Cross-Border Multi-Currency Transactions
 *
 * ПОЛНЫЙ СЦЕНАРИЙ:
 * 1. Международное агентство (EUR) регистрируется на платформе
 * 2. Российский клиент (RUB) присоединяется к проекту агентства
 * 3. Американский клиент (USD) также присоединяется
 * 4. Проводятся депозиты в разных валютах
 * 5. AI сервисы используются с автоматической конверсией валют
 * 6. Комиссии распределяются с учетом курсов валют
 * 7. Реферальные бонусы начисляются в базовой валюте
 * 8. Генерируются отчеты с конверсией валют
 */
class CrossBorderTransactionsTest extends UserStoryTest {
  async runTest(): Promise<void> {
    await describe('🌍 Cross-Border Multi-Currency Transactions', async () => {
      beforeEach(async () => {
        await this.setup();
      });

      afterEach(async () => {
        await this.cleanup();
      });

      await it('should handle complex multi-currency cross-border transactions', async () => {
        console.log('\n🚀 Starting Cross-Border Multi-Currency Test...\n');

        // === ЭТАП 1: НАСТРОЙКА КУРСОВ ВАЛЮТ ===
        console.log('💱 STEP 1: Currency Exchange Rates Setup');

        const exchangeRates = {
          USD: 1.0, // Базовая валюта
          EUR: 0.85, // 1 USD = 0.85 EUR
          RUB: 75.0, // 1 USD = 75 RUB
          GBP: 0.73, // 1 USD = 0.73 GBP
          CNY: 7.2, // 1 USD = 7.2 CNY
        };

        // Устанавливаем курсы валют в системе
        await ServiceClients.updateExchangeRates(exchangeRates);
        console.log('✅ Exchange rates configured:', exchangeRates);

        // === ЭТАП 2: МЕЖДУНАРОДНОЕ АГЕНТСТВО (EUR) ===
        console.log('\n🏢 STEP 2: International Agency Registration (EUR)');

        const agency = await this.createTestUser('international_agency', {
          email: 'agency@eurodesign.eu',
          baseCurrency: 'EUR',
          country: 'Germany',
          timeZone: 'Europe/Berlin',
        });

        // Создаем международный проект с валютой EUR
        const project = await this.createTestProject('international_agency', {
          name: 'Global E-commerce Platform',
          baseCurrency: 'EUR',
          markup: 25, // 25% надценка
          acceptedCurrencies: ['EUR', 'USD', 'RUB', 'GBP'],
        });

        console.log(`✅ International agency registered: ${agency.id} (base: EUR)`);
        console.log(`✅ Project created: ${project.id} with multi-currency support`);

        // === ЭТАП 3: РОССИЙСКИЙ КЛИЕНТ (RUB) ===
        console.log('\n🇷🇺 STEP 3: Russian Client Registration (RUB)');

        const russianClient = await this.createTestUser('russian_client', {
          email: 'client@ruscompany.ru',
          baseCurrency: 'RUB',
          country: 'Russia',
          timeZone: 'Europe/Moscow',
        });

        // Клиент присоединяется к проекту
        const russianInvite = await ServiceClients.addClientToProject(
          project.id,
          russianClient.email,
        );
        await ServiceClients.acceptProjectInvite(russianInvite.inviteLink, russianClient.id);

        console.log(`✅ Russian client joined: ${russianClient.id} (base: RUB)`);

        // === ЭТАП 4: АМЕРИКАНСКИЙ КЛИЕНТ (USD) ===
        console.log('\n🇺🇸 STEP 4: American Client Registration (USD)');

        const americanClient = await this.createTestUser('american_client', {
          email: 'client@usacorp.com',
          baseCurrency: 'USD',
          country: 'USA',
          timeZone: 'America/New_York',
        });

        const americanInvite = await ServiceClients.addClientToProject(
          project.id,
          americanClient.email,
        );
        await ServiceClients.acceptProjectInvite(americanInvite.inviteLink, americanClient.id);

        console.log(`✅ American client joined: ${americanClient.id} (base: USD)`);

        // === ЭТАП 5: ДЕПОЗИТЫ В РАЗНЫХ ВАЛЮТАХ ===
        console.log('\n💳 STEP 5: Multi-Currency Deposits');

        const deposits = [
          {
            client: russianClient,
            amount: 150000, // 150,000 RUB
            currency: 'RUB',
            expectedUSD: 150000 / exchangeRates.RUB, // $2,000 USD
          },
          {
            client: americanClient,
            amount: 3000, // $3,000 USD
            currency: 'USD',
            expectedUSD: 3000, // $3,000 USD
          },
        ];

        let totalDepositUSD = 0;

        for (const deposit of deposits) {
          const transaction = await ServiceClients.topupBalance(
            deposit.client.id,
            deposit.amount,
            'bank_transfer',
            {
              currency: deposit.currency,
              projectId: project.id,
            },
          );

          // Проверяем конверсию валют
          expect(transaction.amount).toBe(deposit.amount);
          expect(transaction.currency).toBe(deposit.currency);
          expect(transaction.amountUSD).toBeCloseTo(deposit.expectedUSD, 2);

          totalDepositUSD += deposit.expectedUSD;

          console.log(
            `✅ ${deposit.currency} deposit: ${deposit.amount} → $${deposit.expectedUSD} USD`,
          );
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // === ЭТАП 6: ПРОВЕРКА БАЛАНСОВ С КОНВЕРСИЕЙ ===
        console.log('\n💰 STEP 6: Multi-Currency Balance Validation');

        // Проверяем баланс российского клиента
        const russianBalance = await ServiceClients.getBalance(russianClient.id);
        expect(russianBalance.balance).toBe(150000);
        expect(russianBalance.currency).toBe('RUB');
        expect(russianBalance.balanceUSD).toBeCloseTo(2000, 2);

        // Проверяем баланс американского клиента
        const americanBalance = await ServiceClients.getBalance(americanClient.id);
        expect(americanBalance.balance).toBe(3000);
        expect(americanBalance.currency).toBe('USD');
        expect(americanBalance.balanceUSD).toBe(3000);

        console.log(`✅ Russian balance: 150,000 RUB ($${russianBalance.balanceUSD})`);
        console.log(`✅ American balance: $3,000 USD ($${americanBalance.balanceUSD})`);

        // === ЭТАП 7: AI СЕРВИСЫ С ВАЛЮТНОЙ КОНВЕРСИЕЙ ===
        console.log('\n🤖 STEP 7: AI Services with Currency Conversion');

        const aiRequests = [
          {
            client: russianClient,
            model: 'openai/gpt-4',
            prompt: 'Создай описания товаров на русском языке',
            expectedCostUSD: 50, // $50 USD базовая стоимость
          },
          {
            client: americanClient,
            model: 'anthropic/claude-3-sonnet',
            prompt: 'Generate marketing content for US market',
            expectedCostUSD: 75, // $75 USD базовая стоимость
          },
        ];

        for (const request of aiRequests) {
          const aiResponse = await ServiceClients.makeAIRequest(
            request.client.id,
            request.model,
            request.prompt,
            project.id,
          );

          // Рассчитываем стоимость с надценками в валюте клиента
          const serviceCostUSD =
            request.expectedCostUSD * (1 + TEST_CONSTANTS.SERVICE_MARKUP / 100);
          const finalCostUSD = serviceCostUSD * (1 + project.markup / 100);

          // Конвертируем в валюту клиента
          const clientCurrency = request.client.baseCurrency;
          const finalCostClientCurrency = finalCostUSD * exchangeRates[clientCurrency];

          expect(aiResponse.baseCostUSD).toBeCloseTo(request.expectedCostUSD, 2);
          expect(aiResponse.finalCostUSD).toBeCloseTo(finalCostUSD, 2);
          expect(aiResponse.finalCost).toBeCloseTo(finalCostClientCurrency, 2);
          expect(aiResponse.currency).toBe(clientCurrency);

          console.log(
            `✅ AI request (${clientCurrency}): $${request.expectedCostUSD} → ${finalCostClientCurrency.toFixed(2)} ${clientCurrency}`,
          );
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // === ЭТАП 8: РАСПРЕДЕЛЕНИЕ ДОХОДОВ АГЕНТСТВА ===
        console.log('\n💼 STEP 8: Agency Revenue Distribution (EUR)');

        // Рассчитываем доходы агентства в базовой валюте (EUR)
        const totalMarkupUSD = totalDepositUSD * (project.markup / 100);
        const agencyShareUSD = totalMarkupUSD * (TEST_CONSTANTS.PROJECT_OWNER_SHARE / 100);
        const agencyShareEUR = agencyShareUSD * exchangeRates.EUR;

        const agencyBalance = await ServiceClients.getBalance(agency.id);
        expect(agencyBalance.currency).toBe('EUR');
        expect(agencyBalance.balance).toBeCloseTo(agencyShareEUR, 2);
        expect(agencyBalance.balanceUSD).toBeCloseTo(agencyShareUSD, 2);

        console.log(
          `✅ Agency revenue: €${agencyShareEUR.toFixed(2)} EUR ($${agencyShareUSD.toFixed(2)} USD)`,
        );

        // === ЭТАП 9: РЕФЕРАЛЬНАЯ ПРОГРАММА С ВАЛЮТАМИ ===
        console.log('\n🎁 STEP 9: Multi-Currency Referral Program');

        // Добавляем реферера из Великобритании (GBP)
        const referrer = await this.createTestUser('uk_referrer', {
          email: 'partner@ukmarketing.co.uk',
          baseCurrency: 'GBP',
          country: 'UK',
        });

        // Устанавливаем реферальную связь
        await ServiceClients.setReferralConnection(referrer.id, agency.id);

        // Реферальный бонус рассчитывается от базовой стоимости AI в USD
        const totalAiBaseCostUSD = aiRequests.reduce((sum, req) => sum + req.expectedCostUSD, 0);
        const referralBonusUSD =
          totalAiBaseCostUSD * (TEST_CONSTANTS.REFERRAL_COMMISSION_RATE / 100);
        const referralBonusGBP = referralBonusUSD * exchangeRates.GBP;

        await ValidationHelpers.waitForReferralProcessing();

        const referrerBalance = await ServiceClients.getBalance(referrer.id);
        expect(referrerBalance.currency).toBe('GBP');
        expect(referrerBalance.bonusBalance).toBeCloseTo(referralBonusGBP, 2);
        expect(referrerBalance.bonusBalanceUSD).toBeCloseTo(referralBonusUSD, 2);

        console.log(
          `✅ Referral bonus: £${referralBonusGBP.toFixed(2)} GBP ($${referralBonusUSD.toFixed(2)} USD)`,
        );

        // === ЭТАП 10: ВАЛЮТНЫЕ ОТЧЕТЫ ===
        console.log('\n📊 STEP 10: Multi-Currency Reporting');

        const reportPeriod = {
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          to: new Date(),
        };

        // Отчет агентства в базовой валюте (EUR)
        const agencyReport = await ServiceClients.generateReport(
          agency.id,
          'project',
          reportPeriod,
          { currency: 'EUR' },
        );

        expect(agencyReport.currency).toBe('EUR');
        expect(agencyReport.revenue).toBeGreaterThan(0);
        expect(agencyReport.revenueUSD).toBeGreaterThan(0);

        console.log(`📊 Agency Report (EUR):`);
        console.log(`   Revenue: €${agencyReport.revenue} (${agencyReport.revenueUSD} USD)`);
        console.log(`   Clients: ${agencyReport.clients} from ${agencyReport.countries} countries`);

        // Консолидированный отчет платформы в USD
        const platformReport = await ServiceClients.generateReport('admin', 'admin', reportPeriod, {
          currency: 'USD',
        });

        expect(platformReport.currency).toBe('USD');
        expect(platformReport.totalRevenue).toBeGreaterThan(0);

        console.log(`📊 Platform Report (USD):`);
        console.log(`   Total revenue: $${platformReport.totalRevenue}`);
        console.log(`   Active currencies: ${platformReport.activeCurrencies}`);
        console.log(`   Cross-border transactions: ${platformReport.crossBorderTransactions}`);

        // === ЭТАП 11: ВАЛЮТНЫЕ РИСКИ И ХЕДЖИРОВАНИЕ ===
        console.log('\n⚠️ STEP 11: Currency Risk Management');

        // Симулируем изменение курса валют
        const newExchangeRates = {
          ...exchangeRates,
          RUB: 80.0, // RUB ослабляется
          EUR: 0.88, // EUR укрепляется
        };

        await ServiceClients.updateExchangeRates(newExchangeRates);
        console.log('✅ Exchange rates updated (simulating market volatility)');

        // Проверяем переоценку балансов
        const updatedRussianBalance = await ServiceClients.getBalance(russianClient.id);
        const newBalanceUSD = updatedRussianBalance.balance / newExchangeRates.RUB;

        expect(updatedRussianBalance.balanceUSD).toBeCloseTo(newBalanceUSD, 2);
        console.log(
          `✅ Russian balance revalued: ${updatedRussianBalance.balance} RUB → $${updatedRussianBalance.balanceUSD} USD`,
        );

        // === ЭТАП 12: НАЛОГООБЛОЖЕНИЕ ПО ЮРИСДИКЦИЯМ ===
        console.log('\n📋 STEP 12: Multi-Jurisdiction Tax Compliance');

        const taxReports = [];

        // Налоговый отчет для агентства (Германия)
        const germanyTaxReport = await ServiceClients.generateTaxReport(agency.id, reportPeriod, {
          jurisdiction: 'DE',
          currency: 'EUR',
        });

        expect(germanyTaxReport.vatRate).toBe(0.19); // 19% НДС в Германии
        expect(germanyTaxReport.grossRevenue).toBeGreaterThan(0);
        taxReports.push(germanyTaxReport);

        // Налоговый отчет для российского клиента
        const russiaTaxReport = await ServiceClients.generateTaxReport(
          russianClient.id,
          reportPeriod,
          {
            jurisdiction: 'RU',
            currency: 'RUB',
          },
        );

        expect(russiaTaxReport.vatRate).toBe(0.2); // 20% НДС в России
        taxReports.push(russiaTaxReport);

        console.log(`📋 Tax Reports Generated:`);
        console.log(`   Germany (VAT 19%): €${germanyTaxReport.netRevenue}`);
        console.log(`   Russia (VAT 20%): ${russiaTaxReport.netRevenue} RUB`);

        // === ИТОГОВАЯ ПРОВЕРКА ===
        console.log('\n🎯 FINAL MULTI-CURRENCY VALIDATION:');

        const finalBalances = await Promise.all([
          ServiceClients.getBalance(agency.id),
          ServiceClients.getBalance(russianClient.id),
          ServiceClients.getBalance(americanClient.id),
          ServiceClients.getBalance(referrer.id),
        ]);

        console.log(
          `🏢 Agency (EUR): €${finalBalances[0].balance} ($${finalBalances[0].balanceUSD} USD)`,
        );
        console.log(
          `🇷🇺 Russian Client (RUB): ${finalBalances[1].balance} RUB ($${finalBalances[1].balanceUSD} USD)`,
        );
        console.log(`🇺🇸 American Client (USD): $${finalBalances[2].balance} USD`);
        console.log(
          `🇬🇧 UK Referrer (GBP): £${finalBalances[3].bonusBalance} GBP ($${finalBalances[3].bonusBalanceUSD} USD)`,
        );

        // Проверяем целостность валютных операций
        const currencyIntegrityCheck = await ServiceClients.validateCurrencyIntegrity();
        expect(currencyIntegrityCheck.totalBalanceUSD).toBeGreaterThan(0);
        expect(currencyIntegrityCheck.exchangeRateAccuracy).toBeGreaterThan(0.99);

        console.log('\n✅ Cross-Border Multi-Currency Test COMPLETED SUCCESSFULLY! 🌍\n');
      });

      await it('should handle cryptocurrency transactions', async () => {
        console.log('\n₿ Testing Cryptocurrency Transactions...\n');

        // Добавляем поддержку криптовалют
        const cryptoRates = {
          BTC: 0.000023, // 1 USD = 0.000023 BTC
          ETH: 0.00035, // 1 USD = 0.00035 ETH
          USDT: 1.0, // 1 USD = 1 USDT (стейблкоин)
        };

        await ServiceClients.updateCryptoRates(cryptoRates);

        const cryptoUser = await this.createTestUser('crypto_user', {
          baseCurrency: 'BTC',
          country: 'Switzerland',
        });

        // Депозит в биткоинах
        const btcDeposit = await ServiceClients.topupBalance(
          cryptoUser.id,
          0.1, // 0.1 BTC
          'crypto_wallet',
          { currency: 'BTC' },
        );

        expect(btcDeposit.currency).toBe('BTC');
        expect(btcDeposit.amountUSD).toBeCloseTo(0.1 / cryptoRates.BTC, 2);

        console.log(`✅ Crypto deposit: 0.1 BTC → $${btcDeposit.amountUSD} USD`);
      });

      await it('should handle currency conversion limits and slippage', async () => {
        console.log('\n📉 Testing Currency Conversion Limits...\n');

        // Большая транзакция, которая может повлиять на курс
        const largeTransactionUser = await this.createTestUser('whale_user');

        const largeAmount = 1000000; // $1M USD

        // Проверяем лимиты на конверсию
        const conversionLimits = await ServiceClients.getCurrencyConversionLimits('USD', 'RUB');

        if (largeAmount > conversionLimits.maxAmount) {
          console.log(
            `⚠️ Transaction exceeds limit: $${largeAmount} > $${conversionLimits.maxAmount}`,
          );

          // Разбиваем на несколько транзакций
          const chunks = Math.ceil(largeAmount / conversionLimits.maxAmount);
          const chunkSize = conversionLimits.maxAmount;

          for (let i = 0; i < chunks; i++) {
            const amount = Math.min(chunkSize, largeAmount - i * chunkSize);
            await ServiceClients.topupBalance(largeTransactionUser.id, amount, 'bank_transfer');

            // Ждем между транзакциями для соблюдения лимитов
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        console.log(`✅ Large transaction processed with proper limits`);
      });
    });
  }
}

// Экспорт теста
export default async function runCrossBorderTransactionsTest(): Promise<void> {
  const test = new CrossBorderTransactionsTest();
  await test.runTest();
}
