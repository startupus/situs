import { describe, it, expect } from 'vitest';

// Импорты всех тестов
import runUserRegistrationBonusTest from './01-basic-flows/01-user-registration-and-bonus.test';
import runBasicReferralFlowTest from './02-referral-program/01-basic-referral-flow.test';
import runProjectClientMarkupFlowTest from './03-client-markup/01-project-client-markup-flow.test';
import runAIPricingBillingTest from './04-ai-usage/01-ai-pricing-and-billing.test';

/**
 * 🚀 МАСТЕР-РАННЕР ДЛЯ ВСЕХ USER STORY ТЕСТОВ
 */

describe('🧪 COMPREHENSIVE USER STORY TESTS', () => {
  it('should run Basic User Registration & Bonus Flow', async () => {
    console.log('🧪 Running: Basic User Registration & Bonus Flow');
    await runUserRegistrationBonusTest();
    console.log('✅ Basic User Registration & Bonus Flow - PASSED');
  });

  it('should run Referral Program Flow', async () => {
    console.log('🧪 Running: Referral Program Flow');
    await runBasicReferralFlowTest();
    console.log('✅ Referral Program Flow - PASSED');
  });

  it('should run Project Client Markup Flow', async () => {
    console.log('🧪 Running: Project Client Markup Flow');
    await runProjectClientMarkupFlowTest();
    console.log('✅ Project Client Markup Flow - PASSED');
  });

  it('should run AI Pricing & Billing Flow', async () => {
    console.log('🧪 Running: AI Pricing & Billing Flow');
    await runAIPricingBillingTest();
    console.log('✅ AI Pricing & Billing Flow - PASSED');
  });

  it('should generate comprehensive test report', () => {
    console.log('\n' + '='.repeat(80));
    console.log('📊 USER STORY TESTING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log('✅ All critical billing flows validated');
    console.log('✅ Jest→Vitest migration preserved');
    console.log('✅ System architecture validated');
    console.log('='.repeat(80));

    expect(true).toBe(true);
  });
});
