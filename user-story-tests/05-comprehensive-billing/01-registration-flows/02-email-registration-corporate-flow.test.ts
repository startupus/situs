import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserStoryTest } from '../../helpers/UserStoryTest';

/**
 * 📧 Пользовательская история: Корпоративная регистрация по Email
 *
 * Сценарий:
 * 1. Корпоративный пользователь регистрируется по email
 * 2. Получает бонус 1000₽ (корпоративный тариф)
 * 3. Создает команду из 5 участников
 * 4. Каждый участник получает 300₽ бонуса
 * 5. Команда тестирует AI сервисы (GPT-4, Claude-3-Opus)
 * 6. Корпоративный пользователь приглашает партнера
 * 7. Партнер создает свой проект и пополняет на 15000₽
 * 8. Корпоративный пользователь получает 15% партнерский бонус (2250₽)
 * 9. Команда получает коллективный бонус 5% (750₽)
 * 10. Генерируется отчет по корпоративной активности
 */

class EmailRegistrationCorporateFlowTest extends UserStoryTest {
  private corporateUser: any;
  private teamMembers: any[] = [];
  private partner: any;
  private corporateProject: any;
  private partnerProject: any;

  async runTest(): Promise<void> {
    await this.step1_CorporateEmailRegistration();
    await this.step2_ReceiveCorporateBonus();
    await this.step3_CreateTeamMembers();
    await this.step4_TeamMembersBonuses();
    await this.step5_TeamAiTesting();
    await this.step6_InvitePartner();
    await this.step7_PartnerProjectAndDeposit();
    await this.step8_CorporatePartnerBonus();
    await this.step9_TeamCollectiveBonus();
    await this.step10_CorporateActivityReport();
  }

  private async step1_CorporateEmailRegistration(): Promise<void> {
    this.corporateUser = await this.userService.registerUser({
      email: 'corp@bigcompany.com',
      password: 'SecurePass123!',
      accountType: 'corporate',
      companyName: 'Big Tech Corp',
      companySize: 'large',
      industry: 'technology',
    });

    expect(this.corporateUser).toBeDefined();
    expect(this.corporateUser.email).toBe('corp@bigcompany.com');
    expect(this.corporateUser.accountType).toBe('corporate');

    this.logStep('✅ Корпоративный пользователь зарегистрирован по email');
  }

  private async step2_ReceiveCorporateBonus(): Promise<void> {
    // Корпоративный бонус 1000₽
    const welcomeBonus = await this.billingService.processWelcomeBonus(this.corporateUser.id, {
      amount: 1000,
      currency: 'RUB',
      type: 'corporate_welcome',
    });

    expect(welcomeBonus.amount).toBe(1000);
    expect(welcomeBonus.currency).toBe('RUB');
    expect(welcomeBonus.type).toBe('corporate_welcome');

    const balance = await this.billingService.getBalance(this.corporateUser.id);
    expect(balance.RUB).toBe(1000);

    this.logStep('✅ Корпоративный бонус 1000₽ зачислен');
  }

  private async step3_CreateTeamMembers(): Promise<void> {
    const teamEmails = [
      'dev1@bigcompany.com',
      'dev2@bigcompany.com',
      'designer@bigcompany.com',
      'manager@bigcompany.com',
      'analyst@bigcompany.com',
    ];

    for (const email of teamEmails) {
      const member = await this.userService.registerUser({
        email,
        password: 'TeamPass123!',
        invitedBy: this.corporateUser.id,
        teamRole: email.includes('dev')
          ? 'developer'
          : email.includes('designer')
            ? 'designer'
            : email.includes('manager')
              ? 'manager'
              : 'analyst',
      });

      this.teamMembers.push(member);
    }

    // Создаем корпоративную команду
    const team = await this.userService.createTeam({
      ownerId: this.corporateUser.id,
      name: 'Big Tech Development Team',
      members: this.teamMembers.map((m) => m.id),
    });

    expect(this.teamMembers).toHaveLength(5);
    expect(team.members).toHaveLength(5);

    this.logStep('✅ Команда из 5 участников создана');
  }

  private async step4_TeamMembersBonuses(): Promise<void> {
    // Каждый участник команды получает 300₽
    for (const member of this.teamMembers) {
      const teamBonus = await this.billingService.processTeamMemberBonus(member.id, {
        amount: 300,
        currency: 'RUB',
        type: 'team_member_welcome',
      });

      expect(teamBonus.amount).toBe(300);

      const balance = await this.billingService.getBalance(member.id);
      expect(balance.RUB).toBe(300);
    }

    this.logStep('✅ Каждый участник команды получил бонус 300₽');
  }

  private async step5_TeamAiTesting(): Promise<void> {
    // Команда тестирует премиум AI сервисы
    const aiServices = [
      { model: 'gpt-4', provider: 'openai', cost: 0.03 },
      { model: 'claude-3-opus', provider: 'anthropic', cost: 0.015 },
      { model: 'gpt-4-turbo', provider: 'openai', cost: 0.01 },
    ];

    let totalSpent = 0;

    for (const member of this.teamMembers) {
      for (const service of aiServices) {
        const usage = await this.aiService.processUsage({
          userId: member.id,
          model: service.model,
          provider: service.provider,
          tokens: 1000,
          costPerToken: service.cost,
        });

        totalSpent += usage.totalCost;
      }
    }

    // Проверяем, что команда потратила средства на AI
    expect(totalSpent).toBeGreaterThan(0);

    this.logStep(`✅ Команда протестировала AI сервисы, потрачено: ${totalSpent.toFixed(2)}₽`);
  }

  private async step6_InvitePartner(): Promise<void> {
    // Корпоративный пользователь приглашает партнера
    const referralLink = await this.userService.generateReferralLink(this.corporateUser.id, {
      type: 'corporate_partner',
      bonusRate: 0.15,
    });

    expect(referralLink).toBeDefined();
    expect(referralLink.bonusRate).toBe(0.15);

    // Партнер регистрируется по реферальной ссылке
    this.partner = await this.userService.registerUser({
      email: 'partner@techpartner.com',
      password: 'PartnerPass123!',
      referralCode: referralLink.code,
      accountType: 'business',
      companyName: 'Tech Partner LLC',
    });

    expect(this.partner).toBeDefined();
    expect(this.partner.referredBy).toBe(this.corporateUser.id);

    this.logStep('✅ Партнер приглашен и зарегистрирован');
  }

  private async step7_PartnerProjectAndDeposit(): Promise<void> {
    // Партнер создает проект
    this.partnerProject = await this.projectService.createProject({
      userId: this.partner.id,
      name: 'Partner AI Integration',
      type: 'ai_development',
      budget: 15000,
    });

    expect(this.partnerProject).toBeDefined();

    // Партнер пополняет счет на 15000₽
    const deposit = await this.billingService.processDeposit({
      userId: this.partner.id,
      amount: 15000,
      currency: 'RUB',
      method: 'bank_transfer',
      projectId: this.partnerProject.id,
    });

    expect(deposit.amount).toBe(15000);
    expect(deposit.status).toBe('completed');

    const partnerBalance = await this.billingService.getBalance(this.partner.id);
    expect(partnerBalance.RUB).toBe(15000);

    this.logStep('✅ Партнер создал проект и пополнил счет на 15000₽');
  }

  private async step8_CorporatePartnerBonus(): Promise<void> {
    // Корпоративный пользователь получает 15% партнерский бонус
    const partnerBonus = await this.billingService.processReferralBonus({
      referrerId: this.corporateUser.id,
      referredUserId: this.partner.id,
      transactionAmount: 15000,
      bonusRate: 0.15,
      type: 'corporate_partner_bonus',
    });

    expect(partnerBonus.amount).toBe(2250); // 15% от 15000₽
    expect(partnerBonus.type).toBe('corporate_partner_bonus');

    const corporateBalance = await this.billingService.getBalance(this.corporateUser.id);
    expect(corporateBalance.RUB).toBe(1000 + 2250); // Первоначальный бонус + партнерский

    this.logStep('✅ Корпоративный пользователь получил партнерский бонус 2250₽');
  }

  private async step9_TeamCollectiveBonus(): Promise<void> {
    // Команда получает коллективный бонус 5% от партнерского депозита
    const collectiveBonus = 15000 * 0.05; // 750₽
    const bonusPerMember = collectiveBonus / this.teamMembers.length; // 150₽ на каждого

    for (const member of this.teamMembers) {
      const teamBonus = await this.billingService.processTeamBonus({
        userId: member.id,
        amount: bonusPerMember,
        currency: 'RUB',
        type: 'team_collective_bonus',
        sourceTransaction: 'partner_deposit',
      });

      expect(teamBonus.amount).toBe(bonusPerMember);
    }

    this.logStep('✅ Команда получила коллективный бонус 750₽ (150₽ на каждого)');
  }

  private async step10_CorporateActivityReport(): Promise<void> {
    // Генерируем отчет по корпоративной активности
    const report = await this.reportingService.generateCorporateReport({
      userId: this.corporateUser.id,
      period: 'current_month',
      includeTeam: true,
      includePartners: true,
    });

    expect(report).toBeDefined();
    expect(report.totalEarnings).toBe(2250); // Партнерский бонус
    expect(report.teamMembers).toBe(5);
    expect(report.partnersReferred).toBe(1);
    expect(report.totalTeamSpending).toBeGreaterThan(0);

    // Проверяем детализацию отчета
    expect(report.bonusBreakdown).toEqual({
      corporate_welcome: 1000,
      corporate_partner_bonus: 2250,
      team_collective_bonus: 750,
    });

    this.logStep('✅ Отчет по корпоративной активности сгенерирован');
  }
}

describe('📧 Email Registration Corporate Flow', () => {
  let test: EmailRegistrationCorporateFlowTest;

  beforeEach(async () => {
    test = new EmailRegistrationCorporateFlowTest();
    await test.setup();
  });

  afterEach(async () => {
    await test.cleanup();
  });

  it('should complete corporate email registration flow with team and partner bonuses', async () => {
    await test.runTest();

    // Дополнительные проверки целостности
    const finalCorporateBalance = await test.billingService.getBalance(test.corporateUser.id);
    expect(finalCorporateBalance.RUB).toBe(3250); // 1000 + 2250

    const teamTotalBalance = await Promise.all(
      test.teamMembers.map((member) => test.billingService.getBalance(member.id)),
    );

    // Каждый участник команды должен иметь: 300₽ (welcome) + 150₽ (collective) - потраченное на AI
    teamTotalBalance.forEach((balance) => {
      expect(balance.RUB).toBeGreaterThan(400); // Минимум после трат на AI
    });
  });

  it('should handle corporate referral limits', async () => {
    await test.runTest();

    // Проверяем лимиты корпоративных рефералов
    const referralStats = await test.userService.getReferralStats(test.corporateUser.id);
    expect(referralStats.corporatePartnersCount).toBe(1);
    expect(referralStats.canInviteMore).toBe(true); // Корпоративный аккаунт может приглашать больше
  });

  it('should track team performance metrics', async () => {
    await test.runTest();

    // Проверяем метрики производительности команды
    const teamMetrics = await test.analyticsService.getTeamMetrics(test.corporateUser.id);
    expect(teamMetrics.totalMembers).toBe(5);
    expect(teamMetrics.activeMembers).toBe(5); // Все использовали AI
    expect(teamMetrics.totalAiUsage).toBeGreaterThan(0);
    expect(teamMetrics.averageUsagePerMember).toBeGreaterThan(0);
  });
});
