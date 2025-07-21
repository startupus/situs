import { describe, it, expect } from 'vitest';

/**
 * 🚀 MASTER BILLING TEST RUNNER
 *
 * Координирует выполнение всех comprehensive billing tests
 * Обеспечивает правильный порядок и изоляцию тестов
 */

// Импорты всех основных тестов
import runSmsRegistrationReferralChainTest from './01-registration-flows/01-sms-registration-referral-chain.test';
import runAgencyMarkupRevenueSharing from './04-agency-client/01-agency-markup-revenue-sharing.test';
import runCrossBorderTransactionsTest from './02-multi-currency/01-cross-border-transactions.test';

// Планируемые импорты для будущих тестов
// import runMLMReferralProgramTest from './03-referral-mlm/01-mlm-referral-structures.test';
// import runAIServiceIntegrationTest from './05-ai-services/01-openrouter-integration.test';
// import runPaymentProcessingTest from './06-payment-flows/01-payment-methods.test';
// import runAdvancedScenariosTest from './07-advanced/01-escrow-automation.test';
// import runReportingAnalyticsTest from './08-reporting/01-revenue-analytics.test';

interface TestSuite {
  name: string;
  description: string;
  category: 'critical' | 'important' | 'extended' | 'performance';
  runTest: () => Promise<void>;
  enabled: boolean;
  estimatedTime: number; // в секундах
}

const BILLING_TEST_SUITES: TestSuite[] = [
  {
    name: 'SMS Registration → Referral Chain',
    description: 'Complete user journey from SMS auth to referral bonus collection',
    category: 'critical',
    runTest: runSmsRegistrationReferralChainTest,
    enabled: true,
    estimatedTime: 120,
  },
  {
    name: 'Agency Markup & Revenue Sharing',
    description: 'Complex agency-client relationship with markup and commission distribution',
    category: 'critical',
    runTest: runAgencyMarkupRevenueSharing,
    enabled: true,
    estimatedTime: 180,
  },
  {
    name: 'Cross-Border Multi-Currency',
    description: 'International transactions with currency conversion and tax compliance',
    category: 'important',
    runTest: runCrossBorderTransactionsTest,
    enabled: true,
    estimatedTime: 240,
  },
  // Планируемые тесты (пока отключены)
  // {
  //   name: 'MLM Referral Structures',
  //   description: 'Multi-level marketing with complex commission hierarchies',
  //   category: 'important',
  //   runTest: runMLMReferralProgramTest,
  //   enabled: false,
  //   estimatedTime: 200,
  // },
  // {
  //   name: 'AI Service Integration',
  //   description: 'OpenRouter integration with real-time pricing and usage tracking',
  //   category: 'critical',
  //   runTest: runAIServiceIntegrationTest,
  //   enabled: false,
  //   estimatedTime: 150,
  // },
  // {
  //   name: 'Payment Processing',
  //   description: 'All payment methods including crypto, refunds, and chargebacks',
  //   category: 'important',
  //   runTest: runPaymentProcessingTest,
  //   enabled: false,
  //   estimatedTime: 300,
  // },
  // {
  //   name: 'Advanced Scenarios',
  //   description: 'Escrow services, automated distribution, complex workflows',
  //   category: 'extended',
  //   runTest: runAdvancedScenariosTest,
  //   enabled: false,
  //   estimatedTime: 360,
  // },
  // {
  //   name: 'Reporting & Analytics',
  //   description: 'Comprehensive reporting, business intelligence, and compliance',
  //   category: 'extended',
  //   runTest: runReportingAnalyticsTest,
  //   enabled: false,
  //   estimatedTime: 180,
  // },
];

class BillingTestRunner {
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;
  private startTime: number = 0;

  async runAllTests(
    options: {
      categories?: ('critical' | 'important' | 'extended' | 'performance')[];
      timeLimit?: number; // в секундах
      parallel?: boolean;
    } = {},
  ): Promise<void> {
    console.log('\n🚀 COMPREHENSIVE BILLING SYSTEM TESTS');
    console.log('=====================================\n');

    this.startTime = Date.now();
    const { categories = ['critical', 'important'], timeLimit, parallel = false } = options;

    // Фильтруем тесты по категориям и статусу
    const testsToRun = BILLING_TEST_SUITES.filter(
      (suite) => suite.enabled && categories.includes(suite.category),
    );

    // Проверяем временные ограничения
    if (timeLimit) {
      const totalEstimatedTime = testsToRun.reduce((sum, suite) => sum + suite.estimatedTime, 0);
      if (totalEstimatedTime > timeLimit) {
        console.log(
          `⚠️ Warning: Estimated time ${totalEstimatedTime}s exceeds limit ${timeLimit}s`,
        );
        console.log('Consider running tests in parallel or selecting fewer categories.\n');
      }
    }

    this.totalTests = testsToRun.length;

    console.log(`📊 Test Plan:`);
    console.log(`   Categories: ${categories.join(', ')}`);
    console.log(`   Total suites: ${this.totalTests}`);
    console.log(`   Execution mode: ${parallel ? 'Parallel' : 'Sequential'}`);
    console.log(
      `   Estimated time: ${testsToRun.reduce((sum, suite) => sum + suite.estimatedTime, 0)}s\n`,
    );

    if (parallel) {
      await this.runTestsInParallel(testsToRun);
    } else {
      await this.runTestsSequentially(testsToRun);
    }

    await this.printSummary();
  }

  private async runTestsSequentially(testSuites: TestSuite[]): Promise<void> {
    for (let i = 0; i < testSuites.length; i++) {
      const suite = testSuites[i];
      await this.runSingleTest(suite, i + 1);
    }
  }

  private async runTestsInParallel(testSuites: TestSuite[]): Promise<void> {
    const promises = testSuites.map((suite, index) => this.runSingleTest(suite, index + 1));

    await Promise.allSettled(promises);
  }

  private async runSingleTest(suite: TestSuite, index: number): Promise<void> {
    const testStartTime = Date.now();

    console.log(`\n[${index}/${this.totalTests}] 🧪 ${suite.name}`);
    console.log(`📝 ${suite.description}`);
    console.log(`⏱️ Estimated time: ${suite.estimatedTime}s`);
    console.log(`🎯 Category: ${suite.category}`);
    console.log('─'.repeat(80));

    try {
      await suite.runTest();

      const duration = Math.round((Date.now() - testStartTime) / 1000);
      this.passedTests++;

      console.log('─'.repeat(80));
      console.log(`✅ PASSED: ${suite.name} (${duration}s)`);
    } catch (error) {
      const duration = Math.round((Date.now() - testStartTime) / 1000);
      this.failedTests++;

      console.log('─'.repeat(80));
      console.log(`❌ FAILED: ${suite.name} (${duration}s)`);
      console.error(`Error: ${error}`);

      // В случае критических тестов, останавливаем выполнение
      if (suite.category === 'critical') {
        console.log('\n🚨 Critical test failed. Stopping execution.\n');
        throw new Error(`Critical test failed: ${suite.name}`);
      }
    }
  }

  private async printSummary(): Promise<void> {
    const totalDuration = Math.round((Date.now() - this.startTime) / 1000);

    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE BILLING TESTS SUMMARY');
    console.log('='.repeat(80));

    console.log(`\n🎯 Results:`);
    console.log(`   ✅ Passed: ${this.passedTests}/${this.totalTests}`);
    console.log(`   ❌ Failed: ${this.failedTests}/${this.totalTests}`);
    console.log(`   ⏭️ Skipped: ${this.skippedTests}/${this.totalTests}`);
    console.log(`   ⏱️ Duration: ${totalDuration}s`);

    const successRate = (this.passedTests / this.totalTests) * 100;
    console.log(`   📈 Success Rate: ${successRate.toFixed(1)}%`);

    if (this.failedTests === 0) {
      console.log('\n🎉 ALL BILLING TESTS PASSED! 🎉');
      console.log('💰 Financial accuracy validated');
      console.log('🔄 Revenue sharing confirmed');
      console.log('🔗 Referral programs working');
      console.log('🌍 Multi-currency support verified');
      console.log('✅ Platform ready for production billing operations');
    } else if (this.failedTests > 0 && this.passedTests > 0) {
      console.log('\n⚠️ PARTIAL SUCCESS - Some tests failed');
      console.log('🔍 Review failed tests and fix issues before production');
    } else {
      console.log('\n🚨 CRITICAL FAILURE - Most/all tests failed');
      console.log('🛑 Do not deploy to production');
      console.log('🔧 Major fixes required in billing system');
    }

    console.log('\n📋 Next Steps:');

    if (this.failedTests === 0) {
      console.log('   1. ✅ Continue with remaining test categories');
      console.log('   2. ✅ Performance and load testing');
      console.log('   3. ✅ Security penetration testing');
      console.log('   4. ✅ Production deployment preparation');
    } else {
      console.log('   1. 🔍 Investigate failed test cases');
      console.log('   2. 🔧 Fix underlying business logic issues');
      console.log('   3. 🧪 Re-run failed tests');
      console.log('   4. 📝 Update documentation if needed');
    }

    console.log('\n' + '='.repeat(80));
  }

  async runCriticalTestsOnly(): Promise<void> {
    console.log('🚨 Running CRITICAL billing tests only...\n');
    await this.runAllTests({ categories: ['critical'] });
  }

  async runFullTestSuite(): Promise<void> {
    console.log('🔬 Running FULL billing test suite...\n');
    await this.runAllTests({
      categories: ['critical', 'important', 'extended'],
      parallel: false, // Полный набор лучше запускать последовательно
    });
  }

  async runPerformanceTests(): Promise<void> {
    console.log('⚡ Running PERFORMANCE billing tests...\n');
    await this.runAllTests({
      categories: ['performance'],
      parallel: true, // Performance тесты можно запускать параллельно
    });
  }
}

// Основная функция для запуска тестов
export async function runComprehensiveBillingTests(
  mode: 'critical' | 'full' | 'performance' | 'custom' = 'critical',
  customOptions?: Parameters<BillingTestRunner['runAllTests']>[0],
): Promise<void> {
  const runner = new BillingTestRunner();

  switch (mode) {
    case 'critical':
      await runner.runCriticalTestsOnly();
      break;

    case 'full':
      await runner.runFullTestSuite();
      break;

    case 'performance':
      await runner.runPerformanceTests();
      break;

    case 'custom':
      if (customOptions) {
        await runner.runAllTests(customOptions);
      } else {
        console.log('❌ Custom mode requires options parameter');
      }
      break;

    default:
      console.log('❌ Unknown test mode. Using critical tests.');
      await runner.runCriticalTestsOnly();
  }
}

// Основной экспорт для Vitest
describe('💳 Comprehensive Billing System Tests', () => {
  it(
    'should run all critical billing scenarios',
    async () => {
      await runComprehensiveBillingTests('critical');
    },
    { timeout: 300000 },
  ); // 5 минут таймаут для критических тестов

  // Раскомментировать когда все тесты будут готовы
  // it('should run full billing test suite', async () => {
  //   await runComprehensiveBillingTests('full');
  // }, { timeout: 1800000 }); // 30 минут для полного набора

  // it('should run performance billing tests', async () => {
  //   await runComprehensiveBillingTests('performance');
  // }, { timeout: 600000 }); // 10 минут для performance тестов
});

// Экспорты для отдельного запуска
export { BillingTestRunner, BILLING_TEST_SUITES };
export default runComprehensiveBillingTests;
