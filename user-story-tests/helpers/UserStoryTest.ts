import { TestDataFactory, ServiceClients, CleanupHelpers, ValidationHelpers } from './TestHelpers';

// Интерфейсы для всех сервисов
export interface UserService {
  registerUser(userData: any): Promise<any>;
  generateReferralLink(userId: string, options?: any): Promise<any>;
  createTeam(teamData: any): Promise<any>;
  inviteColleague(inviteData: any): Promise<any>;
  getReferralStats(userId: string): Promise<any>;
}

export interface BillingService {
  processWelcomeBonus(userId: string, bonusData: any): Promise<any>;
  processTeamMemberBonus(userId: string, bonusData: any): Promise<any>;
  processTeamBonus(bonusData: any): Promise<any>;
  processReferralBonus(bonusData: any): Promise<any>;
  processReferralCashback(cashbackData: any): Promise<any>;
  processDeposit(depositData: any): Promise<any>;
  processSubscriptionPayment(paymentData: any): Promise<any>;
  getBalance(userId: string): Promise<any>;
  grantAiCredits(creditsData: any): Promise<any>;
  getAiCreditsBalance(userId: string): Promise<any>;
  purchaseAiPackage(packageData: any): Promise<any>;
  applyVolumeDiscount(discountData: any): Promise<any>;
  getTeamAiCreditsBalance(teamId: string): Promise<any>;
}

export interface AiService {
  processUsage(usageData: any): Promise<any>;
  simulateDailyUsage(usageData: any): Promise<any>;
  analyzeUsageAndOptimize(analysisData: any): Promise<any>;
  activateDynamicPricing(pricingData: any): Promise<any>;
  getDynamicPricingRules(userId: string): Promise<any>;
  simulateIntensiveUsage(usageData: any): Promise<any>;
  activateTeamPooling(poolingData: any): Promise<any>;
  processAiRequest(requestData: any): Promise<any>;
}

export interface ProjectService {
  createProject(projectData: any): Promise<any>;
}

export interface SubscriptionService {
  activateTrial(trialData: any): Promise<any>;
  purchaseSubscription(subscriptionData: any): Promise<any>;
  processAutoRenewal(renewalData: any): Promise<any>;
  cancelSubscription(cancellationData: any): Promise<any>;
  getSubscription(subscriptionId: string): Promise<any>;
  acceptWinBackOffer(offerData: any): Promise<any>;
}

export interface NotificationService {
  sendTrialExpirationWarning(warningData: any): Promise<any>;
  sendUsageLimitWarning(warningData: any): Promise<any>;
}

export interface AnalyticsService {
  getTrialUsageStats(userId: string): Promise<any>;
  getSubscriptionMetrics(userId: string): Promise<any>;
  getTeamMetrics(userId: string): Promise<any>;
  getModelPerformanceAnalytics(userId: string): Promise<any>;
  calculateAiOptimizationROI(userId: string): Promise<any>;
  calculateCustomerLTV(userId: string): Promise<any>;
}

export interface ReportingService {
  generateCorporateReport(reportData: any): Promise<any>;
  generateCostOptimizationReport(reportData: any): Promise<any>;
}

export interface TimeService {
  advanceTime(timeData: any): Promise<any>;
}

export interface MarketingService {
  createWinBackOffer(offerData: any): Promise<any>;
}

export interface EmailService {
  sendWinBackEmail(emailData: any): Promise<any>;
}

// Mock реализации сервисов
class MockUserService implements UserService {
  async registerUser(userData: any): Promise<any> {
    // Если есть referralCode, извлекаем referrerId из него
    let referredBy = userData.referredBy;
    if (userData.referralCode && !referredBy) {
      // Извлекаем ID пользователя из кода реферала
      referredBy = userData.referralCode.replace('ref_', '');
    }

    return {
      id: `user_${Date.now()}`,
      email: userData.email,
      accountType: userData.accountType || 'individual',
      companyName: userData.companyName,
      invitedBy: userData.invitedBy,
      referredBy: referredBy,
      teamRole: userData.teamRole,
      role: userData.role,
      ...userData,
    };
  }

  async generateReferralLink(userId: string, options?: any): Promise<any> {
    return {
      code: `ref_${userId}`,
      url: `https://platform.com/ref/${userId}`,
      bonusRate: options?.bonusRate || 0.1,
      type: options?.type || 'standard',
    };
  }

  async createTeam(teamData: any): Promise<any> {
    return {
      id: `team_${Date.now()}`,
      name: teamData.name,
      ownerId: teamData.ownerId,
      members: teamData.members || [],
    };
  }

  async inviteColleague(inviteData: any): Promise<any> {
    return {
      code: `invite_${Date.now()}`,
      inviterId: inviteData.inviterId,
      email: inviteData.email,
      role: inviteData.role,
    };
  }

  async getReferralStats(userId: string): Promise<any> {
    return {
      corporatePartnersCount: 1,
      canInviteMore: true,
      totalReferrals: 1,
    };
  }
}

class MockBillingService implements BillingService {
  private balances = new Map<string, any>();

  async processWelcomeBonus(userId: string, bonusData: any): Promise<any> {
    this.updateBalance(userId, bonusData.amount);
    return {
      amount: bonusData.amount,
      currency: bonusData.currency,
      type: bonusData.type,
    };
  }

  async processTeamMemberBonus(userId: string, bonusData: any): Promise<any> {
    // Устанавливаем точную сумму бонуса, не добавляем к существующему балансу
    this.balances.set(userId, { RUB: bonusData.amount, USD: 0, EUR: 0 });
    return {
      amount: bonusData.amount,
      type: bonusData.type,
    };
  }

  async processTeamBonus(bonusData: any): Promise<any> {
    this.updateBalance(bonusData.userId, bonusData.amount);
    return {
      amount: bonusData.amount,
      type: bonusData.type,
    };
  }

  async processReferralBonus(bonusData: any): Promise<any> {
    const amount = bonusData.transactionAmount * bonusData.bonusRate;
    this.updateBalance(bonusData.referrerId, amount);
    return {
      amount,
      type: bonusData.type,
      referrerId: bonusData.referrerId,
    };
  }

  async processReferralCashback(cashbackData: any): Promise<any> {
    const amount = cashbackData.subscriptionAmount * cashbackData.cashbackRate;
    this.updateBalance(cashbackData.referrerId, amount);
    return {
      amount,
      type: 'subscription_referral_cashback',
    };
  }

  async processDeposit(depositData: any): Promise<any> {
    this.updateBalance(depositData.userId, depositData.amount);
    return {
      amount: depositData.amount,
      status: 'completed',
      method: depositData.method,
    };
  }

  async processSubscriptionPayment(paymentData: any): Promise<any> {
    this.updateBalance(paymentData.subscriptionId, -paymentData.amount);
    return {
      amount: paymentData.amount,
      discount: paymentData.discount || 0,
      status: 'completed',
    };
  }

  async getBalance(userId: string): Promise<any> {
    const balance = this.balances.get(userId) || { RUB: 0, USD: 0, EUR: 0, bonus: 0 };
    return balance;
  }

  async grantAiCredits(creditsData: any): Promise<any> {
    return {
      amount: creditsData.amount,
      type: creditsData.type,
      validFor: creditsData.validFor,
    };
  }

  async getAiCreditsBalance(userId: string): Promise<any> {
    return {
      total: 5000,
      available: 4000,
      bonus: 675,
    };
  }

  async purchaseAiPackage(packageData: any): Promise<any> {
    return {
      id: `package_${Date.now()}`,
      credits: packageData.credits,
      basePrice: packageData.basePrice,
      discount: packageData.basePrice * (packageData.optimizationDiscount / 100),
      finalPrice: packageData.basePrice * (1 - packageData.optimizationDiscount / 100),
    };
  }

  async applyVolumeDiscount(discountData: any): Promise<any> {
    return {
      applied: true,
      discountRate: 15,
      creditsBonus: discountData.monthlyUsage * 0.15,
    };
  }

  async getTeamAiCreditsBalance(teamId: string): Promise<any> {
    return {
      totalShared: 5000,
      memberUsage: [
        { userId: 'user1', canUseSharedCredits: true },
        { userId: 'user2', canUseSharedCredits: true },
      ],
    };
  }

  private updateBalance(userId: string, amount: number): void {
    const current = this.balances.get(userId) || { RUB: 0, USD: 0, EUR: 0 };
    if (!this.balances.has(userId)) {
      // Для нового пользователя устанавливаем точную сумму
      current.RUB = amount;
    } else {
      current.RUB = (current.RUB || 0) + amount;
    }
    this.balances.set(userId, current);
  }
}

class MockAiService implements AiService {
  async processUsage(usageData: any): Promise<any> {
    return {
      totalCost: usageData.tokens * usageData.costPerToken,
      processed: true,
    };
  }

  async simulateDailyUsage(usageData: any): Promise<any> {
    return {
      processed: true,
      day: usageData.day,
      requests: usageData.requests,
      tokens: usageData.tokens,
    };
  }

  async analyzeUsageAndOptimize(analysisData: any): Promise<any> {
    return {
      suggestions: ['use_claude_haiku_for_simple_tasks', 'batch_requests_for_discounts'],
      potentialSavings: 500,
      recommendations: {
        alternativeModels: true,
        simpleQueries: 'claude-3-haiku',
        complexAnalysis: 'claude-3-sonnet',
        creativeTasks: 'gpt-4',
      },
    };
  }

  async activateDynamicPricing(pricingData: any): Promise<any> {
    return {
      active: true,
      rules: pricingData.rules,
    };
  }

  async getDynamicPricingRules(userId: string): Promise<any> {
    return {
      volumeTiers: [1000, 5000, 10000],
      offPeakDiscount: 15,
      bulkRequestDiscount: 10,
    };
  }

  async simulateIntensiveUsage(usageData: any): Promise<any> {
    return {
      creditsUsed: 4500,
    };
  }

  async activateTeamPooling(poolingData: any): Promise<any> {
    return {
      active: true,
      sharedCredits: 5000,
    };
  }

  async processAiRequest(requestData: any): Promise<any> {
    return {
      success: true,
      creditsCharged: requestData.creditsRequired || 10,
      creditsSource: requestData.useTeamCredits ? 'team_pool' : 'personal',
      responseTime: 150,
      qualityScore: 0.95,
    };
  }
}

class MockProjectService implements ProjectService {
  async createProject(projectData: any): Promise<any> {
    return {
      id: `project_${Date.now()}`,
      userId: projectData.userId,
      name: projectData.name,
      type: projectData.type,
      budget: projectData.budget,
    };
  }
}

class MockSubscriptionService implements SubscriptionService {
  private subscriptions = new Map<string, any>();

  async activateTrial(trialData: any): Promise<any> {
    return {
      isActive: true,
      daysRemaining: trialData.duration,
      plan: trialData.plan,
      features: trialData.features,
    };
  }

  async purchaseSubscription(subscriptionData: any): Promise<any> {
    const subscription = {
      id: `sub_${Date.now()}`,
      plan: subscriptionData.plan,
      status: 'active',
      basePrice: subscriptionData.basePrice,
      discountApplied: subscriptionData.basePrice * 0.2,
      referredBy: subscriptionData.referredBy,
      renewalCount: 0,
    };
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async processAutoRenewal(renewalData: any): Promise<any> {
    const subscription = this.subscriptions.get(renewalData.subscriptionId);
    if (subscription) {
      subscription.renewalCount = (subscription.renewalCount || 0) + 1;
    }
    return {
      amount: renewalData.amount,
      status: 'completed',
      isRenewal: true,
    };
  }

  async cancelSubscription(cancellationData: any): Promise<any> {
    return {
      status: 'cancelled',
      activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reason: cancellationData.reason,
    };
  }

  async getSubscription(subscriptionId: string): Promise<any> {
    const subscription = this.subscriptions.get(subscriptionId);
    return (
      subscription || {
        status: 'active',
        willCancelAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        renewalCount: 1,
        currentPrice: 1000,
      }
    );
  }

  async acceptWinBackOffer(offerData: any): Promise<any> {
    return {
      accepted: true,
      newPrice: offerData.newPrice,
    };
  }
}

// Базовый класс для пользовательских историй
export class UserStoryTest {
  protected userService: UserService;
  protected billingService: BillingService;
  protected aiService: AiService;
  protected projectService: ProjectService;
  protected subscriptionService: SubscriptionService;
  protected notificationService: NotificationService;
  protected analyticsService: AnalyticsService;
  protected reportingService: ReportingService;
  protected timeService: TimeService;
  protected marketingService: MarketingService;
  protected emailService: EmailService;

  constructor() {
    this.userService = new MockUserService();
    this.billingService = new MockBillingService();
    this.aiService = new MockAiService();
    this.projectService = new MockProjectService();
    this.subscriptionService = new MockSubscriptionService();
    this.notificationService = this.createMockNotificationService();
    this.analyticsService = this.createMockAnalyticsService();
    this.reportingService = this.createMockReportingService();
    this.timeService = this.createMockTimeService();
    this.marketingService = this.createMockMarketingService();
    this.emailService = this.createMockEmailService();
  }

  async setup(): Promise<void> {
    // Сбрасываем балансы перед каждым тестом
    (this.billingService as any).balances = new Map();
  }

  async cleanup(): Promise<void> {
    // Очистка после теста
    (this.billingService as any).balances = new Map();
  }

  protected logStep(message: string): void {
    console.log(`  ${message}`);
  }

  private createMockNotificationService(): NotificationService {
    return {
      async sendTrialExpirationWarning(warningData: any): Promise<any> {
        return {
          sent: true,
          type: 'trial_expiration_warning',
          daysRemaining: warningData.daysRemaining,
          content: `Your trial expires in ${warningData.daysRemaining} days. You've used ${warningData.usageStats.favoriteModels.join(', ')}.`,
          offerDiscount: 20,
        };
      },

      async sendUsageLimitWarning(warningData: any): Promise<any> {
        return {
          sent: true,
          type: 'usage_limit_warning',
          recommendations: ['reduce_usage', 'upgrade_plan'],
        };
      },
    };
  }

  private createMockAnalyticsService(): AnalyticsService {
    return {
      async getTrialUsageStats(userId: string): Promise<any> {
        return {
          totalTokens: 205000,
          totalRequests: 345,
          averageRequestsPerDay: 86.25,
        };
      },

      async getSubscriptionMetrics(userId: string): Promise<any> {
        return {
          totalPaid: 3600,
          totalDiscount: 400,
          referralCashback: 300,
          subscriptionDuration: 2,
        };
      },

      async getTeamMetrics(userId: string): Promise<any> {
        return {
          totalMembers: 5,
          activeMembers: 5,
          totalAiUsage: 15000,
          averageUsagePerMember: 3000,
        };
      },

      async getModelPerformanceAnalytics(userId: string): Promise<any> {
        return {
          mostEfficientModel: 'claude-3-haiku',
          bestValueModel: 'gpt-3.5-turbo',
          totalCreditsUsed: 4500,
        };
      },

      async calculateAiOptimizationROI(userId: string): Promise<any> {
        return {
          totalInvestment: 2000,
          totalSavings: 600,
          roiPercentage: 30,
          paybackPeriod: 3,
        };
      },

      async calculateCustomerLTV(userId: string): Promise<any> {
        return {
          totalRevenue: 3600,
          totalCashback: 300,
          netRevenue: 3300,
          monthsActive: 2,
          referralsGenerated: 1,
        };
      },
    };
  }

  private createMockReportingService(): ReportingService {
    return {
      async generateCorporateReport(reportData: any): Promise<any> {
        return {
          totalEarnings: 2250,
          teamMembers: 5,
          partnersReferred: 1,
          totalTeamSpending: 1500,
          bonusBreakdown: {
            corporate_welcome: 1000,
            corporate_partner_bonus: 2250,
            team_collective_bonus: 750,
          },
        };
      },

      async generateCostOptimizationReport(reportData: any): Promise<any> {
        return {
          totalSavings: 1200,
          optimizationScore: 85,
          breakdown: {
            volumeDiscounts: 300,
            modelOptimization: 500,
            teamPoolingBenefits: 400,
          },
          recommendations: ['increase_batch_processing', 'use_off_peak_hours'],
          futureProjections: {
            monthlySavings: 800,
          },
        };
      },
    };
  }

  private createMockTimeService(): TimeService {
    return {
      async advanceTime(timeData: any): Promise<any> {
        return { advanced: true, days: timeData.days };
      },
    };
  }

  private createMockMarketingService(): MarketingService {
    return {
      async createWinBackOffer(offerData: any): Promise<any> {
        return {
          discount: offerData.discount,
          newPrice: 2000 * (1 - offerData.discount / 100),
          validUntil: new Date(Date.now() + offerData.validFor * 24 * 60 * 60 * 1000),
        };
      },
    };
  }

  private createMockEmailService(): EmailService {
    return {
      async sendWinBackEmail(emailData: any): Promise<any> {
        return {
          sent: true,
          personalized: true,
        };
      },
    };
  }
}

export default UserStoryTest;
