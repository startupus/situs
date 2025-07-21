import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UserStoryTest,
  ServiceClients,
  ValidationHelpers,
  TEST_CONSTANTS,
} from '../../helpers/TestHelpers';

/**
 * 🧪 USER STORY: Agency Markup & Revenue Sharing
 *
 * ПОЛНЫЙ СЦЕНАРИЙ:
 * 1. Пользователь регистрируется и создает проект (агентство)
 * 2. Добавляет клиента в проект с надценкой 30%
 * 3. Клиент пополняет баланс на 5000₽
 * 4. Транзакции обрабатываются с распределением:
 *    - 70% владельцу проекта (агентству)
 *    - 30% комиссия платформе
 * 5. 10% реферальный бонус от базовой цены
 * 6. Еженедельные отчеты о доходах для админа и пользователя
 */
class AgencyMarkupRevenueSharing extends UserStoryTest {
  async runTest(): Promise<void> {
    await describe('🏢 Agency Markup & Revenue Sharing System', async () => {
      beforeEach(async () => {
        await this.setup();
      });

      afterEach(async () => {
        await this.cleanup();
      });

      await it('should execute complete agency markup and revenue sharing scenario', async () => {
        console.log('\n🚀 Starting Agency Markup & Revenue Sharing Test...\n');

        // === ЭТАП 1: РЕГИСТРАЦИЯ АГЕНТСТВА ===
        console.log('🏢 STEP 1: Agency Registration & Project Setup');

        const agency = await this.createTestUser('digital_agency', {
          email: 'agency@digitalstudio.com',
          name: 'Digital Studio Agency',
        });

        console.log(`✅ Agency registered: ${agency.id} (${agency.email})`);

        // Создаем проект агентства
        const project = await this.createTestProject('digital_agency', {
          name: 'E-commerce Platform Development',
          description: 'Разработка платформы электронной коммерции для клиента',
          markup: 30, // 30% надценка
          type: 'development',
        });

        expect(project.ownerId).toBe(agency.id);
        expect(project.markup).toBe(30);

        console.log(`✅ Project created: ${project.id} with ${project.markup}% markup`);

        // === ЭТАП 2: ДОБАВЛЕНИЕ КЛИЕНТА ===
        console.log('\n👤 STEP 2: Adding Client to Project');

        // Создаем приглашение для клиента
        const clientInvite = await ServiceClients.addClientToProject(
          project.id,
          'client@retailcompany.com',
        );

        expect(clientInvite.inviteLink).toBeDefined();
        console.log(`✅ Client invite created: ${clientInvite.inviteLink}`);

        // Клиент регистрируется и принимает приглашение
        const client = await this.createTestUser('retail_client', {
          email: 'client@retailcompany.com',
          name: 'Retail Company LLC',
        });

        await ServiceClients.acceptProjectInvite(clientInvite.inviteLink, client.id);
        console.log(`✅ Client joined project: ${client.id}`);

        // === ЭТАП 3: КЛИЕНТ ПОПОЛНЯЕТ БАЛАНС ===
        console.log('\n💳 STEP 3: Client Deposits 5000₽');

        const depositAmount = 5000;
        const depositTransaction = await ServiceClients.topupBalance(
          client.id,
          depositAmount,
          'bank_transfer',
          {
            projectId: project.id, // Привязываем к проекту
            currency: 'RUB',
          },
        );

        expect(depositTransaction.amount).toBe(depositAmount);
        console.log(`✅ Client deposited: ${depositAmount}₽ to project ${project.id}`);

        await ValidationHelpers.waitForTransactionProcessing();

        // === ЭТАП 4: АВТОМАТИЧЕСКОЕ РАСПРЕДЕЛЕНИЕ СРЕДСТВ ===
        console.log('\n💰 STEP 4: Automatic Revenue Distribution');

        // Расчеты:
        // Базовая сумма: 5000₽
        // Надценка агентства: 30% = 1500₽
        // Общая сумма с надценкой: 6500₽

        const baseAmount = depositAmount;
        const markupAmount = baseAmount * (project.markup / 100); // 1500₽
        const totalWithMarkup = baseAmount + markupAmount; // 6500₽

        // Распределение надценки:
        // 70% агентству: 1500₽ * 0.7 = 1050₽
        // 30% платформе: 1500₽ * 0.3 = 450₽

        const agencyShare = markupAmount * (TEST_CONSTANTS.PROJECT_OWNER_SHARE / 100); // 1050₽
        const platformShare = markupAmount * (TEST_CONSTANTS.SERVICE_COMMISSION / 100); // 450₽

        console.log(`📊 Revenue Distribution Calculation:`);
        console.log(`   Base amount: ${baseAmount}₽`);
        console.log(`   Markup (${project.markup}%): ${markupAmount}₽`);
        console.log(`   Total with markup: ${totalWithMarkup}₽`);
        console.log(`   Agency share (70%): ${agencyShare}₽`);
        console.log(`   Platform share (30%): ${platformShare}₽`);

        // Проверяем баланс агентства
        const agencyBalance = await ServiceClients.getBalance(agency.id);
        expect(agencyBalance.balance).toBe(agencyShare);

        console.log(`✅ Agency balance updated: ${agencyBalance.balance}₽`);

        // === ЭТАП 5: AI СЕРВИСЫ С НАДЦЕНКОЙ ===
        console.log('\n🤖 STEP 5: AI Services with Markup Applied');

        // Клиент использует AI сервисы через проект
        const aiRequests = [
          {
            model: 'openai/gpt-4',
            prompt: 'Generate product descriptions for e-commerce',
            baseCost: 100, // ₽
          },
          {
            model: 'anthropic/claude-3-sonnet',
            prompt: 'Create marketing copy for product pages',
            baseCost: 150, // ₽
          },
          {
            model: 'openai/dall-e-3',
            prompt: 'Generate product images for catalog',
            baseCost: 200, // ₽
          },
        ];

        let totalAiBaseCost = 0;
        let totalAiFinalCost = 0;

        for (const request of aiRequests) {
          const aiResponse = await ServiceClients.makeAIRequest(
            client.id,
            request.model,
            request.prompt,
            project.id, // Запрос через проект с надценкой
          );

          // Рассчитываем стоимость с надценкой проекта
          const serviceCost = request.baseCost * (1 + TEST_CONSTANTS.SERVICE_MARKUP / 100); // +20%
          const finalCost = serviceCost * (1 + project.markup / 100); // +30%

          totalAiBaseCost += request.baseCost;
          totalAiFinalCost += finalCost;

          expect(aiResponse.baseCost).toBeCloseTo(request.baseCost, 1);
          expect(aiResponse.serviceCost).toBeCloseTo(serviceCost, 1);
          expect(aiResponse.finalCost).toBeCloseTo(finalCost, 1);

          console.log(
            `✅ AI request: ${request.baseCost}₽ → ${finalCost.toFixed(2)}₽ (with markup)`,
          );
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // === ЭТАП 6: ПРОВЕРКА БАЛАНСА ПОСЛЕ AI ИСПОЛЬЗОВАНИЯ ===
        console.log('\n💸 STEP 6: Balance Validation after AI Usage');

        const clientBalanceAfterAI = await ServiceClients.getBalance(client.id);
        const expectedClientBalance = depositAmount - totalAiFinalCost;

        expect(clientBalanceAfterAI.balance).toBeCloseTo(expectedClientBalance, 1);
        console.log(`✅ Client balance after AI usage: ${clientBalanceAfterAI.balance}₽`);

        // Проверяем доходы агентства от AI надценок
        const agencyBalanceAfterAI = await ServiceClients.getBalance(agency.id);

        // Агентство получает свою долю от AI надценок
        const aiMarkupTotal = totalAiBaseCost * (project.markup / 100);
        const agencyAiRevenue = aiMarkupTotal * (TEST_CONSTANTS.PROJECT_OWNER_SHARE / 100);
        const expectedAgencyBalance = agencyShare + agencyAiRevenue;

        expect(agencyBalanceAfterAI.balance).toBeCloseTo(expectedAgencyBalance, 1);
        console.log(`✅ Agency balance with AI revenue: ${agencyBalanceAfterAI.balance}₽`);

        // === ЭТАП 7: РЕФЕРАЛЬНАЯ ПРОГРАММА ===
        console.log('\n🎁 STEP 7: Referral Program Integration');

        // Если агентство было приведено по реферальной ссылке
        const referrer = await this.createTestUser('referrer_partner', {
          email: 'partner@marketing.com',
          name: 'Marketing Partner',
        });

        // Устанавливаем реферальную связь (симулируем, что агентство было приведено)
        await ServiceClients.setReferralConnection(referrer.id, agency.id);

        // Рассчитываем реферальный бонус с базовой цены (без надценок)
        const referralBonusRate = TEST_CONSTANTS.REFERRAL_COMMISSION_RATE / 100; // 10%
        const referralBonus = totalAiBaseCost * referralBonusRate;

        await ValidationHelpers.waitForReferralProcessing();

        // Проверяем начисление реферального бонуса
        const referrerBalance = await ServiceClients.getBalance(referrer.id);
        expect(referrerBalance.bonusBalance).toBeCloseTo(referralBonus, 1);

        console.log(
          `✅ Referral bonus calculated: ${referralBonus}₽ (from base cost ${totalAiBaseCost}₽)`,
        );

        // === ЭТАП 8: КОМИССИИ И ТРАНЗАКЦИИ ===
        console.log('\n📊 STEP 8: Commission & Transaction Analysis');

        // Получаем историю комиссий агентства
        const agencyCommissions = await ServiceClients.getCommissionHistory(agency.id);

        // Проверяем комиссии от депозита клиента
        const depositCommission = agencyCommissions.find(
          (c) => c.type === 'client_markup' && c.sourceTransactionId === depositTransaction.id,
        );

        expect(depositCommission).toBeDefined();
        expect(depositCommission!.amount).toBeCloseTo(agencyShare, 1);
        expect(depositCommission!.rate).toBe(TEST_CONSTANTS.PROJECT_OWNER_SHARE);

        console.log(`✅ Deposit commission validated: ${depositCommission!.amount}₽`);

        // Проверяем комиссии от AI использования
        const aiCommissions = agencyCommissions.filter((c) => c.type === 'client_markup');
        const totalAiCommissions = aiCommissions.reduce((sum, c) => sum + c.amount, 0);

        console.log(`✅ AI commissions total: ${totalAiCommissions}₽`);

        // === ЭТАП 9: ЕЖЕНЕДЕЛЬНЫЕ ОТЧЕТЫ ===
        console.log('\n📈 STEP 9: Weekly Revenue Reports');

        const reportPeriod = {
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // неделя назад
          to: new Date(),
        };

        // Отчет для агентства
        const agencyReport = await ServiceClients.generateReport(
          agency.id,
          'project',
          reportPeriod,
        );

        expect(agencyReport.revenue).toBeGreaterThan(0);
        expect(agencyReport.commissions).toBeGreaterThan(0);
        expect(agencyReport.clients).toBeGreaterThanOrEqual(1);

        console.log(`📊 Agency Weekly Report:`);
        console.log(`   Revenue: ${agencyReport.revenue}₽`);
        console.log(`   Commissions: ${agencyReport.commissions}₽`);
        console.log(`   Active clients: ${agencyReport.clients}`);
        console.log(`   AI requests: ${agencyReport.aiRequests || aiRequests.length}`);

        // Отчет для администрации
        const adminReport = await ServiceClients.generateReport('admin', 'admin', reportPeriod);

        expect(adminReport.totalRevenue).toBeGreaterThan(0);
        expect(adminReport.platformCommissions).toBeGreaterThan(0);
        expect(adminReport.activeProjects).toBeGreaterThanOrEqual(1);

        console.log(`📊 Admin Weekly Report:`);
        console.log(`   Total platform revenue: ${adminReport.totalRevenue}₽`);
        console.log(`   Platform commissions: ${adminReport.platformCommissions}₽`);
        console.log(`   Active projects: ${adminReport.activeProjects}`);
        console.log(`   Total users: ${adminReport.totalUsers}`);

        // === ЭТАП 10: ПРОВЕРКА НАЛОГОВОГО УЧЕТА ===
        console.log('\n📋 STEP 10: Tax and Compliance Validation');

        // Получаем детализированный отчет для налогового учета
        const taxReport = await ServiceClients.generateTaxReport(agency.id, reportPeriod);

        expect(taxReport.grossRevenue).toBeGreaterThan(0);
        expect(taxReport.platformFees).toBeGreaterThan(0);
        expect(taxReport.netRevenue).toBe(taxReport.grossRevenue - taxReport.platformFees);

        console.log(`📋 Tax Report for Agency:`);
        console.log(`   Gross revenue: ${taxReport.grossRevenue}₽`);
        console.log(`   Platform fees: ${taxReport.platformFees}₽`);
        console.log(`   Net revenue: ${taxReport.netRevenue}₽`);
        console.log(`   VAT applicable: ${taxReport.vatApplicable ? 'Yes' : 'No'}`);

        // === ИТОГОВАЯ ПРОВЕРКА ===
        console.log('\n🎯 FINAL VALIDATION SUMMARY:');

        const finalAgencyBalance = await ServiceClients.getBalance(agency.id);
        const finalClientBalance = await ServiceClients.getBalance(client.id);
        const finalReferrerBalance = await ServiceClients.getBalance(referrer.id);

        console.log(`👤 Agency (${agency.id}):`);
        console.log(`   Initial deposit share: ${agencyShare}₽`);
        console.log(`   AI markup revenue: ${agencyAiRevenue.toFixed(2)}₽`);
        console.log(`   Total balance: ${finalAgencyBalance.balance}₽`);

        console.log(`👥 Client (${client.id}):`);
        console.log(`   Deposited: ${depositAmount}₽`);
        console.log(`   Spent on AI (with markup): ${totalAiFinalCost.toFixed(2)}₽`);
        console.log(`   Remaining balance: ${finalClientBalance.balance}₽`);

        console.log(`🔗 Referrer (${referrer.id}):`);
        console.log(`   Referral bonus: ${finalReferrerBalance.bonusBalance}₽`);

        console.log(`📊 Revenue Distribution:`);
        console.log(`   Client paid: ${totalWithMarkup + totalAiFinalCost}₽ total`);
        console.log(`   Agency earned: ${finalAgencyBalance.balance}₽`);
        console.log(`   Platform earned: ${platformShare}₽ + AI platform fees`);
        console.log(`   Referrer earned: ${finalReferrerBalance.bonusBalance}₽`);

        // Финальные проверки целостности
        expect(finalAgencyBalance.balance).toBeGreaterThan(agencyShare);
        expect(finalClientBalance.balance).toBeLessThan(depositAmount);
        expect(finalReferrerBalance.bonusBalance).toBeGreaterThan(0);

        console.log('\n✅ Agency Markup & Revenue Sharing Test COMPLETED SUCCESSFULLY! 🎉\n');
      });

      await it('should handle different markup tiers correctly', async () => {
        console.log('\n📊 Testing Different Markup Tiers...\n');

        const markupTiers = [
          { name: 'Basic', markup: 15, minVolume: 0 },
          { name: 'Standard', markup: 30, minVolume: 10000 },
          { name: 'Premium', markup: 50, minVolume: 50000 },
          { name: 'Enterprise', markup: 75, minVolume: 100000 },
        ];

        for (const tier of markupTiers) {
          const agency = await this.createTestUser(`agency_${tier.name.toLowerCase()}`);
          const project = await this.createTestProject(`agency_${tier.name.toLowerCase()}`, {
            markup: tier.markup,
            name: `${tier.name} Project`,
          });

          // Симулируем депозит клиента
          const client = await this.createTestUser(`client_${tier.name.toLowerCase()}`);
          const testAmount = 1000;

          await ServiceClients.topupBalance(client.id, testAmount, 'card', {
            projectId: project.id,
          });

          await ValidationHelpers.waitForTransactionProcessing();

          // Проверяем корректность начислений
          const agencyBalance = await ServiceClients.getBalance(agency.id);
          const expectedRevenue =
            testAmount * (tier.markup / 100) * (TEST_CONSTANTS.PROJECT_OWNER_SHARE / 100);

          expect(agencyBalance.balance).toBeCloseTo(expectedRevenue, 1);

          console.log(
            `✅ ${tier.name} tier (${tier.markup}%): ${testAmount}₽ → ${expectedRevenue}₽ agency revenue`,
          );
        }
      });

      await it('should handle multi-client project revenue sharing', async () => {
        console.log('\n👥 Testing Multi-Client Project Revenue...\n');

        const agency = await this.createTestUser('multi_client_agency');
        const project = await this.createTestProject('multi_client_agency', {
          markup: 40,
          name: 'Multi-Client Development Project',
        });

        // Добавляем нескольких клиентов
        const clients = [];
        const deposits = [2000, 3500, 1500, 4000]; // разные суммы депозитов

        for (let i = 0; i < deposits.length; i++) {
          const client = await this.createTestUser(`multi_client_${i}`);
          clients.push(client);

          // Клиент присоединяется к проекту
          const invite = await ServiceClients.addClientToProject(project.id, client.email);
          await ServiceClients.acceptProjectInvite(invite.inviteLink, client.id);

          // Депозит клиента
          await ServiceClients.topupBalance(client.id, deposits[i], 'card', {
            projectId: project.id,
          });
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // Проверяем суммарный доход агентства
        const totalDeposits = deposits.reduce((sum, d) => sum + d, 0);
        const expectedAgencyRevenue =
          totalDeposits * (project.markup / 100) * (TEST_CONSTANTS.PROJECT_OWNER_SHARE / 100);

        const agencyBalance = await ServiceClients.getBalance(agency.id);
        expect(agencyBalance.balance).toBeCloseTo(expectedAgencyRevenue, 1);

        console.log(
          `✅ Multi-client revenue: ${totalDeposits}₽ deposits → ${expectedAgencyRevenue}₽ agency revenue`,
        );

        // Проверяем отчет по проекту
        const projectReport = await ServiceClients.getProjectReport(project.id);
        expect(projectReport.totalClients).toBe(clients.length);
        expect(projectReport.totalRevenue).toBeCloseTo(expectedAgencyRevenue, 1);

        console.log(
          `📊 Project report: ${projectReport.totalClients} clients, ${projectReport.totalRevenue}₽ revenue`,
        );
      });

      await it('should calculate accurate platform commissions', async () => {
        console.log('\n💰 Testing Platform Commission Accuracy...\n');

        const scenarios = [
          { markup: 20, volume: 5000, expectedPlatformShare: 0.3 },
          { markup: 35, volume: 12000, expectedPlatformShare: 0.3 },
          { markup: 60, volume: 25000, expectedPlatformShare: 0.3 },
        ];

        let totalPlatformCommissions = 0;

        for (let i = 0; i < scenarios.length; i++) {
          const scenario = scenarios[i];
          const agency = await this.createTestUser(`platform_test_agency_${i}`);
          const client = await this.createTestUser(`platform_test_client_${i}`);

          const project = await this.createTestProject(`platform_test_agency_${i}`, {
            markup: scenario.markup,
          });

          await ServiceClients.topupBalance(client.id, scenario.volume, 'card', {
            projectId: project.id,
          });

          await ValidationHelpers.waitForTransactionProcessing();

          // Рассчитываем ожидаемую комиссию платформы
          const markupAmount = scenario.volume * (scenario.markup / 100);
          const platformCommission = markupAmount * scenario.expectedPlatformShare;
          totalPlatformCommissions += platformCommission;

          console.log(
            `✅ Scenario ${i + 1}: ${scenario.volume}₽ × ${scenario.markup}% = ${platformCommission}₽ platform commission`,
          );
        }

        // Проверяем общую статистику платформы
        const platformStats = await ServiceClients.getPlatformStats();
        expect(platformStats.totalCommissions).toBeGreaterThanOrEqual(totalPlatformCommissions);

        console.log(`💰 Total platform commissions: ${totalPlatformCommissions}₽`);
      });
    });
  }
}

// Экспорт теста
export default async function runAgencyMarkupRevenueSharing(): Promise<void> {
  const test = new AgencyMarkupRevenueSharing();
  await test.runTest();
}
