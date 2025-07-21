/**
 * 🚀 ГЛАВНЫЙ ЗАПУСКАТЕЛЬ КОМПЛЕКСНОГО ТЕСТИРОВАНИЯ
 * 
 * Автоматически запускает интеллектуальную систему тестирования
 * с полным покрытием всех микро-функций экосистемы Хабус
 */

import { intelligentTestRunner } from './core/IntelligentTestRunner';
import { coverageManager } from './core/CoverageManager';

interface TestingOptions {
  mode: 'auto' | 'interactive' | 'category' | 'scenario';
  targetCoverage?: number;
  maxScenarios?: number;
  category?: string;
  scenarioId?: string;
  reportOnly?: boolean;
}

class ComprehensiveTestingLauncher {
  
  /**
   * Главная функция запуска
   */
  async launch(options: TestingOptions = { mode: 'auto' }): Promise<void> {
    console.log('🎯 КОМПЛЕКСНАЯ СИСТЕМА ТЕСТИРОВАНИЯ ЭКОСИСТЕМЫ ХАБУС');
    console.log('=' .repeat(60));
    
    // Показываем текущее состояние
    await this.showInitialState();
    
    switch (options.mode) {
      case 'auto':
        await this.runAutomaticMode(options);
        break;
      case 'interactive':
        await this.runInteractiveMode();
        break;
      case 'category':
        await this.runCategoryMode(options.category || 'auth');
        break;
      case 'scenario':
        await this.runSpecificScenario(options.scenarioId || '');
        break;
      default:
        console.log('❌ Неизвестный режим тестирования');
    }
  }

  /**
   * Показывает начальное состояние системы
   */
  private async showInitialState(): Promise<void> {
    console.log('\n📊 ТЕКУЩЕЕ СОСТОЯНИЕ СИСТЕМЫ:');
    
    const stats = coverageManager.getCoverageStats();
    
    console.log(`📋 Всего функций: ${stats.totalFunctions}`);
    console.log(`✅ Протестировано: ${stats.testedFunctions} (${stats.coveragePercentage.toFixed(1)}%)`);
    console.log(`❌ Не протестировано: ${stats.untested.length}`);
    
    console.log('\n📊 Покрытие по категориям:');
    Object.entries(stats.categoryCoverage).forEach(([category, coverage]) => {
      const bar = this.createProgressBar(coverage);
      console.log(`  ${category}: ${coverage.toFixed(1)}% ${bar}`);
    });
    
    if (stats.recentlyTested.length > 0) {
      console.log(`\n🕒 Недавно протестировано (24ч): ${stats.recentlyTested.length} функций`);
    }
  }

  /**
   * Автоматический режим - полное тестирование
   */
  private async runAutomaticMode(options: TestingOptions): Promise<void> {
    console.log('\n🚀 ЗАПУСК АВТОМАТИЧЕСКОГО РЕЖИМА');
    console.log(`🎯 Цель: ${options.targetCoverage || 100}% покрытия`);
    console.log(`📋 Максимум сценариев: ${options.maxScenarios || 50}`);
    
    const startTime = Date.now();
    
    await intelligentTestRunner.runAutomaticTesting(
      options.targetCoverage || 100,
      options.maxScenarios || 50
    );
    
    const duration = Date.now() - startTime;
    console.log(`\n⏱️ Общее время выполнения: ${this.formatDuration(duration)}`);
    
    await this.showFinalStatistics();
  }

  /**
   * Интерактивный режим - пользователь выбирает действия
   */
  private async runInteractiveMode(): Promise<void> {
    console.log('\n🎮 ИНТЕРАКТИВНЫЙ РЕЖИМ');
    console.log('Выберите действие:');
    console.log('1. Сгенерировать и выполнить следующий оптимальный сценарий');
    console.log('2. Протестировать конкретную категорию');
    console.log('3. Показать детальный отчет');
    console.log('4. Показать рекомендации по доработке');
    console.log('5. Выход');
    
    // В реальной реализации здесь был бы интерактивный интерфейс
    console.log('\n💡 Запуск следующего оптимального сценария...');
    
    const scenario = coverageManager.generateNextScenario();
    console.log(`📋 Выбран сценарий: ${scenario.name}`);
    console.log(`🎯 Функции: ${scenario.functions.join(', ')}`);
    
    const execution = await intelligentTestRunner.executeScenario(scenario);
    
    console.log(`\n${execution.success ? '✅' : '❌'} Сценарий завершен`);
    console.log(`📊 Покрытие: ${execution.coverage.toFixed(1)}%`);
    
    if (execution.recommendations.length > 0) {
      console.log('\n💡 Рекомендации:');
      execution.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
  }

  /**
   * Режим тестирования категории
   */
  private async runCategoryMode(category: string): Promise<void> {
    console.log(`\n🎯 ТЕСТИРОВАНИЕ КАТЕГОРИИ: ${category.toUpperCase()}`);
    
    await intelligentTestRunner.runCategoryTesting(category, 10);
    
    // Показываем результаты для категории
    const stats = coverageManager.getCoverageStats();
    const categoryProgress = stats.categoryCoverage[category] || 0;
    
    console.log(`\n📊 Результат тестирования категории ${category}:`);
    console.log(`   Покрытие: ${categoryProgress.toFixed(1)}%`);
    console.log(`   ${this.createProgressBar(categoryProgress)}`);
  }

  /**
   * Запуск конкретного сценария
   */
  private async runSpecificScenario(scenarioId: string): Promise<void> {
    if (!scenarioId) {
      console.log('❌ Не указан ID сценария');
      return;
    }

    console.log(`\n🎯 ВЫПОЛНЕНИЕ СЦЕНАРИЯ: ${scenarioId}`);
    
    const execution = await intelligentTestRunner.runSpecificScenario(scenarioId);
    
    if (!execution) {
      console.log('❌ Сценарий не найден');
      return;
    }

    console.log(`\n📊 Результаты сценария:`);
    console.log(`   Покрытие: ${execution.coverage.toFixed(1)}%`);
    console.log(`   Длительность: ${this.formatDuration(execution.totalDuration)}`);
    console.log(`   Статус: ${execution.success ? 'УСПЕХ' : 'ПРОВАЛ'}`);
  }

  /**
   * Показывает финальную статистику
   */
  private async showFinalStatistics(): Promise<void> {
    console.log('\n📈 ФИНАЛЬНАЯ СТАТИСТИКА:');
    
    const stats = coverageManager.getCoverageStats();
    const history = intelligentTestRunner.getExecutionHistory();
    
    console.log(`📋 Выполнено сценариев: ${history.length}`);
    console.log(`✅ Успешных: ${history.filter(h => h.success).length}`);
    console.log(`📊 Общее покрытие: ${stats.coveragePercentage.toFixed(1)}%`);
    console.log(`⏱️ Средняя длительность сценария: ${this.formatDuration(intelligentTestRunner.getAverageScenarioDuration())}`);
    
    // Топ проблемных функций
    const recommendations = coverageManager.generateRecommendations();
    if (recommendations.missing.length > 0) {
      console.log('\n⚠️ КРИТИЧЕСКИЕ ПРОБЛЕМЫ:');
      recommendations.missing
        .filter(r => r.severity === 'critical')
        .slice(0, 5)
        .forEach(r => console.log(`   - ${r.function}: ${r.recommendation}`));
    }

    // Следующие шаги
    console.log('\n🚀 СЛЕДУЮЩИЕ ШАГИ:');
    if (stats.coveragePercentage < 100) {
      console.log(`   - Продолжить тестирование (осталось ${stats.untested.length} функций)`);
      console.log(`   - Приоритет: функции категорий с низким покрытием`);
    } else {
      console.log('   - 🎉 Достигнуто 100% покрытие! Переходите к нагрузочному тестированию');
    }
  }

  /**
   * Создает визуальную полосу прогресса
   */
  private createProgressBar(percentage: number, length: number = 20): string {
    const filled = Math.floor((percentage / 100) * length);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  /**
   * Форматирует длительность в читаемый вид
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}ч ${minutes % 60}м ${seconds % 60}с`;
    } else if (minutes > 0) {
      return `${minutes}м ${seconds % 60}с`;
    } else {
      return `${seconds}с`;
    }
  }

  /**
   * Показывает только отчет без выполнения тестов
   */
  async showReportOnly(): Promise<void> {
    console.log('\n📊 ДЕТАЛЬНЫЙ ОТЧЕТ БЕЗ ВЫПОЛНЕНИЯ ТЕСТОВ:');
    
    const detailedReport = coverageManager.generateDetailedReport();
    console.log(detailedReport);
    
    const recommendations = coverageManager.generateRecommendations();
    
    if (recommendations.missing.length > 0) {
      console.log('\n🔧 ПРИОРИТЕТНЫЕ ДОРАБОТКИ:');
      recommendations.missing
        .sort((a, b) => {
          const priority = { critical: 0, high: 1, medium: 2, low: 3 };
          return priority[a.severity] - priority[b.severity];
        })
        .slice(0, 15)
        .forEach((rec, index) => {
          console.log(`${index + 1}. [${rec.severity.toUpperCase()}] ${rec.function}`);
          console.log(`   ${rec.recommendation}`);
        });
    }
  }
}

/**
 * 🚀 ТОЧКА ВХОДА
 */
async function main(): Promise<void> {
  const launcher = new ComprehensiveTestingLauncher();
  
  // Простой парсинг аргументов
  const args = typeof globalThis !== 'undefined' && globalThis.process?.argv?.slice(2) || [];
  const options: TestingOptions = { mode: 'auto' };
  
  if (args.includes('--interactive')) {
    options.mode = 'interactive';
  } else if (args.includes('--report-only')) {
    await launcher.showReportOnly();
    return;
  } else if (args.includes('--category')) {
    options.mode = 'category';
    const categoryIndex = args.indexOf('--category') + 1;
    options.category = args[categoryIndex] || 'auth';
  } else if (args.includes('--scenario')) {
    options.mode = 'scenario';
    const scenarioIndex = args.indexOf('--scenario') + 1;
    options.scenarioId = args[scenarioIndex];
  }
  
  // Парсим целевое покрытие
  const coverageIndex = args.indexOf('--coverage');
  if (coverageIndex !== -1 && args[coverageIndex + 1]) {
    options.targetCoverage = parseInt(args[coverageIndex + 1]);
  }
  
  // Парсим максимальное количество сценариев
  const scenariosIndex = args.indexOf('--max-scenarios');
  if (scenariosIndex !== -1 && args[scenariosIndex + 1]) {
    options.maxScenarios = parseInt(args[scenariosIndex + 1]);
  }

  try {
    await launcher.launch(options);
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
  }
}

// Запускаем основную функцию
main().catch(error => {
  console.error('💥 Неожиданная ошибка:', error);
});

export { ComprehensiveTestingLauncher, main };