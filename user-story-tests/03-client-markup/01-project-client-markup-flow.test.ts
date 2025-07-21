import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UserStoryTest,
  ServiceClients,
  ValidationHelpers,
  TEST_CONSTANTS,
} from '../helpers/TestHelpers';

/**
 * 🧪 USER STORY: Проектная клиентская надценка с комиссиями
 *
 * СЦЕНАРИЙ из ТЗ:
 * 1. Пользователь регистрируется, создает проект
 * 2. Добавляет в проект клиента
 * 3. Назначает надценку +30% за пользование ИИ
 * 4. Клиент пополняет баланс на 5000₽
 * 5. По мере списания за ИИ (с себестоимостью и надценкой):
 *    - 70% от доп. надценки 30% -> владельцу проекта
 *    - 30% от доп. надценки -> комиссия сервиса
 *    - 10% от обычной цены (без доп. надценки) -> владельцу за приведенного клиента
 * 6. Админ и владелец видят доходную часть за неделю
 */
class ProjectClientMarkupFlowTest extends UserStoryTest {
  async runTest(): Promise<void> {
    await describe('💼 Project Client Markup Flow', async () => {
      beforeEach(async () => {
        await this.setup();
      });

      afterEach(async () => {
        await this.cleanup();
      });

      await it('should handle complete project markup flow with complex commission structure', async () => {
        // 👤 ЭТАП 1: Регистрация владельца проекта
        const projectOwner = await this.createTestUser('owner', {
          email: 'owner@agency.com',
          phone: '+7999777888',
        });

        console.log(`✅ Project owner registered: ${projectOwner.email}`);

        // 🏗️ ЭТАП 2: Создание проекта с надценкой 30%
        const project = await this.createTestProject('owner', {
          name: 'Marketing AI Agency',
          markup: 30, // 30% надценка
        });

        expect(project.ownerId).toBe(projectOwner.id);
        expect(project.markup).toBe(30);

        console.log(`✅ Project created: ${project.name} with ${project.markup}% markup`);

        // 👥 ЭТАП 3: Добавление клиента в проект
        const clientEmail = 'client@business.com';
        const invitation = await ServiceClients.addClientToProject(project.id, clientEmail);

        expect(invitation.inviteLink).toMatch(/^https:\/\/platform\.com\/invite\//);

        console.log(`✅ Client invitation created: ${invitation.inviteLink}`);

        // 👤 ЭТАП 4: Регистрация клиента и принятие приглашения
        const client = await this.createTestUser('client', {
          email: clientEmail,
          phone: '+7999555666',
        });

        await ServiceClients.acceptProjectInvite(invitation.inviteLink, client.id);

        console.log(`✅ Client registered and joined project: ${client.email}`);

        // 💳 ЭТАП 5: Клиент пополняет баланс на 5000₽
        const topupAmount = 5000;
        const topupTransaction = await ServiceClients.topupBalance(client.id, topupAmount, 'card');

        expect(topupTransaction.amount).toBe(topupAmount);
        await ValidationHelpers.waitForTransactionProcessing();

        console.log(`✅ Client topped up: ${topupAmount}₽`);

        // 🤖 ЭТАП 6: Клиент использует AI в рамках проекта
        const aiUsageScenarios = [
          {
            model: 'gpt-4',
            prompt: 'Создай рекламную кампанию',
            inputTokens: 200,
            outputTokens: 300,
          },
          {
            model: 'gpt-3.5-turbo',
            prompt: 'Анализ конкурентов',
            inputTokens: 150,
            outputTokens: 200,
          },
          { model: 'claude-3', prompt: 'SEO стратегия', inputTokens: 180, outputTokens: 250 },
        ];

        const aiRequests: any[] = [];
        let totalBaseCost = 0;
        let totalServiceCost = 0;
        let totalFinalCost = 0;

        for (const scenario of aiUsageScenarios) {
          const aiRequest = await ServiceClients.makeAIRequest(
            client.id,
            scenario.model,
            scenario.prompt,
            project.id, // важно: в рамках проекта
          );

          // Пересчитываем стоимость с учетом проектной надценки
          const baseCost = scenario.inputTokens * 0.001 + scenario.outputTokens * 0.002;
          const serviceCost = baseCost * (1 + TEST_CONSTANTS.SERVICE_MARKUP / 100); // +20% сервиса
          const finalCost = serviceCost * (1 + project.markup / 100); // +30% проектная

          aiRequest.baseCost = baseCost;
          aiRequest.serviceCost = serviceCost;
          aiRequest.finalCost = finalCost;

          aiRequests.push(aiRequest);
          totalBaseCost += baseCost;
          totalServiceCost += serviceCost;
          totalFinalCost += finalCost;

          console.log(
            `✅ AI request: ${scenario.model} - Base: ${baseCost.toFixed(2)}₽, Service: ${serviceCost.toFixed(2)}₽, Final: ${finalCost.toFixed(2)}₽`,
          );
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // 💰 ЭТАП 7: Расчет и проверка комиссий

        // 7.1. Расчет надценки и комиссий
        const serviceMarkupAmount = totalServiceCost - totalBaseCost; // надценка сервиса (20%)
        const projectMarkupAmount = totalFinalCost - totalServiceCost; // проектная надценка (30%)

        const ownerShare = projectMarkupAmount * (TEST_CONSTANTS.PROJECT_OWNER_SHARE / 100); // 70% от проектной надценки
        const serviceCommission = projectMarkupAmount * (TEST_CONSTANTS.SERVICE_COMMISSION / 100); // 30% от проектной надценки
        const clientBonusToOwner = totalBaseCost * (TEST_CONSTANTS.CLIENT_BONUS_RATE / 100); // 10% от базовой стоимости

        console.log(`📊 COST BREAKDOWN:`);
        console.log(`   Base cost: ${totalBaseCost.toFixed(2)}₽`);
        console.log(
          `   Service markup (${TEST_CONSTANTS.SERVICE_MARKUP}%): ${serviceMarkupAmount.toFixed(2)}₽`,
        );
        console.log(`   Project markup (${project.markup}%): ${projectMarkupAmount.toFixed(2)}₽`);
        console.log(
          `   Owner share (${TEST_CONSTANTS.PROJECT_OWNER_SHARE}% of project markup): ${ownerShare.toFixed(2)}₽`,
        );
        console.log(
          `   Service commission (${TEST_CONSTANTS.SERVICE_COMMISSION}% of project markup): ${serviceCommission.toFixed(2)}₽`,
        );
        console.log(
          `   Client bonus to owner (${TEST_CONSTANTS.CLIENT_BONUS_RATE}% of base): ${clientBonusToOwner.toFixed(2)}₽`,
        );

        // 7.2. Проверка начислений владельцу проекта
        const ownerCommissions = await ServiceClients.getCommissionHistory(projectOwner.id);

        // Владелец должен получить долю от проектной надценки
        const markupCommission = ownerCommissions.find(
          (c) => c.type === 'client_markup' && Math.abs(c.amount - ownerShare) < 0.01,
        );
        expect(markupCommission).toBeDefined();

        // Владелец должен получить бонус за приведенного клиента
        const clientBonus = ownerCommissions.find(
          (c) => c.type === 'client_markup' && Math.abs(c.amount - clientBonusToOwner) < 0.01,
        );
        expect(clientBonus).toBeDefined();

        console.log(`✅ Owner commissions validated`);

        // 7.3. Проверка баланса клиента (должен уменьшиться)
        const clientBalance = await ServiceClients.getBalance(client.id);
        const expectedClientBalance = topupAmount - totalFinalCost;
        ValidationHelpers.validateBalance(clientBalance.balance, expectedClientBalance);

        console.log(
          `✅ Client balance after AI usage: ${clientBalance.balance}₽ (spent: ${totalFinalCost.toFixed(2)}₽)`,
        );

        // 📈 ЭТАП 8: Еженедельная отчетность

        // 8.1. Отчет владельца проекта
        const ownerReport = await ServiceClients.generateReport(projectOwner.id, 'project', {
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // неделя
          to: new Date(),
        });

        const expectedOwnerRevenue = ownerShare + clientBonusToOwner;
        expect(ownerReport.commissions).toBeGreaterThanOrEqual(expectedOwnerRevenue);

        console.log(`📊 OWNER WEEKLY REPORT:`);
        console.log(`   Revenue: ${ownerReport.commissions}₽`);
        console.log(`   Clients: ${ownerReport.users || 1}`);
        console.log(`   AI Requests: ${aiRequests.length}`);

        // 8.2. Админский отчет
        const adminReport = await ServiceClients.generateReport('admin', 'admin', {
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          to: new Date(),
        });

        const expectedServiceRevenue = serviceMarkupAmount + serviceCommission;
        expect(adminReport.revenue).toBeGreaterThanOrEqual(expectedServiceRevenue);

        console.log(`📊 ADMIN WEEKLY REPORT:`);
        console.log(`   Total Revenue: ${adminReport.revenue}₽`);
        console.log(`   Service Commission: ${serviceCommission.toFixed(2)}₽`);
        console.log(`   Platform Users: ${adminReport.users}`);
        console.log(`   Total Transactions: ${adminReport.transactions}`);

        // 🎉 ЭТАП 9: Итоговая сводка
        console.log(`\n🎉 PROJECT MARKUP FLOW COMPLETED SUCCESSFULLY`);
        console.log(`💼 Project: ${project.name} (${project.markup}% markup)`);
        console.log(`👤 Owner earned: ${expectedOwnerRevenue.toFixed(2)}₽`);
        console.log(`🏢 Service earned: ${expectedServiceRevenue.toFixed(2)}₽`);
        console.log(
          `💳 Client spent: ${totalFinalCost.toFixed(2)}₽ for ${aiRequests.length} AI requests`,
        );
        console.log(`📊 All commissions and reports validated ✅`);
      });

      await it('should handle multiple clients in one project', async () => {
        // 👤 Создаем владельца проекта
        const owner = await this.createTestUser('multiOwner');
        const project = await this.createTestProject('multiOwner', {
          name: 'Multi-Client Agency',
          markup: 25, // 25% надценка
        });

        // 👥 Создаем нескольких клиентов
        const clients: any[] = [];
        for (let i = 1; i <= 3; i++) {
          const client = await this.createTestUser(`client${i}`, {
            email: `client${i}@business.com`,
          });

          const invitation = await ServiceClients.addClientToProject(project.id, client.email);
          await ServiceClients.acceptProjectInvite(invitation.inviteLink, client.id);

          // Каждый клиент пополняет баланс
          await ServiceClients.topupBalance(client.id, 2000, 'card');

          clients.push(client);
        }

        // 🤖 Каждый клиент использует AI
        for (const client of clients) {
          await ServiceClients.makeAIRequest(client.id, 'gpt-4', 'Test request', project.id);
        }

        await ValidationHelpers.waitForTransactionProcessing();

        // 📊 Проверяем суммарные комиссии владельца
        const ownerCommissions = await ServiceClients.getCommissionHistory(owner.id);
        expect(ownerCommissions.length).toBeGreaterThan(0);

        // Должны быть комиссии от всех клиентов
        const uniqueClients = new Set(ownerCommissions.map((c) => c.fromUserId));
        expect(uniqueClients.size).toBe(clients.length);

        console.log(
          `✅ Multi-client project: ${clients.length} clients, ${ownerCommissions.length} commissions`,
        );
      });

      await it('should prevent commission calculation without project context', async () => {
        // 👤 Создаем пользователя без проекта
        const independentUser = await this.createTestUser('independent');
        await ServiceClients.topupBalance(independentUser.id, 1000, 'card');

        // 🤖 Использует AI без проектного контекста
        const aiRequest = await ServiceClients.makeAIRequest(
          independentUser.id,
          'gpt-4',
          'Independent request',
          // НЕТ projectId!
        );

        expect(aiRequest.projectId).toBeUndefined();

        await ValidationHelpers.waitForTransactionProcessing();

        // ✅ Не должно быть проектных комиссий
        const commissions = await ServiceClients.getCommissionHistory(independentUser.id);
        const projectCommissions = commissions.filter((c) => c.type === 'client_markup');
        expect(projectCommissions).toHaveLength(0);

        console.log(`✅ Independent AI usage: no project commissions`);
      });

      await it('should calculate progressive markup rates', async () => {
        // Тестируем разные уровни надценки
        const markupTestCases = [
          { markup: 10, name: 'Low Markup Project' },
          { markup: 50, name: 'High Markup Project' },
          { markup: 100, name: 'Premium Project' },
        ];

        for (const testCase of markupTestCases) {
          const owner = await this.createTestUser(`owner_${testCase.markup}`);
          const project = await this.createTestProject(`owner_${testCase.markup}`, {
            name: testCase.name,
            markup: testCase.markup,
          });

          const client = await this.createTestUser(`client_${testCase.markup}`, {
            email: `client_${testCase.markup}@test.com`,
          });

          const invitation = await ServiceClients.addClientToProject(project.id, client.email);
          await ServiceClients.acceptProjectInvite(invitation.inviteLink, client.id);
          await ServiceClients.topupBalance(client.id, 1000, 'card');

          // Фиксированный AI запрос для сравнения
          const baseCost = 10; // 10₽ базовая стоимость
          const aiRequest = await ServiceClients.makeAIRequest(
            client.id,
            'gpt-4',
            'Fixed cost request',
            project.id,
          );

          // Переопределяем стоимости для тестирования
          aiRequest.baseCost = baseCost;
          aiRequest.serviceCost = baseCost * 1.2; // +20% сервиса
          aiRequest.finalCost = aiRequest.serviceCost * (1 + testCase.markup / 100);

          await ValidationHelpers.waitForTransactionProcessing();

          const expectedMarkupAmount = aiRequest.finalCost - aiRequest.serviceCost;
          const expectedOwnerShare = expectedMarkupAmount * 0.7; // 70%

          const ownerCommissions = await ServiceClients.getCommissionHistory(owner.id);
          const markupCommission = ownerCommissions.find((c) => c.type === 'client_markup');

          expect(markupCommission).toBeDefined();
          ValidationHelpers.validateBalance(markupCommission!.amount, expectedOwnerShare);

          console.log(
            `✅ Markup ${testCase.markup}%: Owner earned ${expectedOwnerShare.toFixed(2)}₽`,
          );
        }
      });
    });
  }
}

// Запуск теста
export default async function runProjectClientMarkupFlowTest(): Promise<void> {
  const test = new ProjectClientMarkupFlowTest();
  await test.runTest();
}
