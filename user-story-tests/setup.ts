/**
 * 🧪 НАСТРОЙКА ТЕСТОВОГО ОКРУЖЕНИЯ
 * 
 * Глобальная настройка для пользовательских сценариев тестирования
 * экосистемы Хабус
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { testInfrastructure, testMetrics } from './helpers/TestInfrastructure';

// Глобальные переменные для тестов
declare global {
  var testInfra: typeof testInfrastructure;
  var testMetrics: typeof testMetrics;
}

// Делаем доступными глобально
globalThis.testInfra = testInfrastructure;
globalThis.testMetrics = testMetrics;

/**
 * 🚀 ГЛОБАЛЬНАЯ НАСТРОЙКА ПЕРЕД ВСЕМИ ТЕСТАМИ
 */
beforeAll(async () => {
  console.log('🚀 Инициализация тестового окружения для пользовательских сценариев...');
  
  // Проверяем доступность сервисов
  const isHealthy = await testInfrastructure.healthCheck();
  if (!isHealthy) {
    console.warn('⚠️  Сервисы недоступны. Некоторые тесты могут не работать.');
  } else {
    console.log('✅ Все сервисы доступны');
  }

  // Инициализируем метрики
  testMetrics.startTimer();
  testMetrics.recordMetric('setup_start', new Date().toISOString());
  
  console.log('🎯 Тестовое окружение готово к работе');
});

/**
 * 🧹 ГЛОБАЛЬНАЯ ОЧИСТКА ПОСЛЕ ВСЕХ ТЕСТОВ
 */
afterAll(async () => {
  console.log('🧹 Финальная очистка тестового окружения...');
  
  // Очищаем тестовые данные
  await testInfrastructure.cleanup();
  
  // Логируем итоговые метрики
  testMetrics.recordMetric('setup_end', new Date().toISOString());
  testMetrics.logSummary();
  
  console.log('✅ Тестовое окружение очищено');
});

/**
 * 🔄 НАСТРОЙКА ПЕРЕД КАЖДЫМ ТЕСТОМ
 */
beforeEach(async (context) => {
  const testName = context.meta.name;
  console.log(`\n🧪 Подготовка к тесту: ${testName}`);
  
  // Записываем начало теста
  testMetrics.recordMetric(`test_${testName}_start`, Date.now());
  
  // Проверяем состояние системы
  const isHealthy = await testInfrastructure.healthCheck();
  if (!isHealthy) {
    console.warn(`⚠️  Система недоступна для теста: ${testName}`);
  }
});

/**
 * 🧹 ОЧИСТКА ПОСЛЕ КАЖДОГО ТЕСТА
 */
afterEach(async (context) => {
  const testName = context.meta.name;
  const testResult = context.meta.result;
  
  console.log(`\n🏁 Завершение теста: ${testName} (${testResult?.state || 'unknown'})`);
  
  // Записываем результат теста
  testMetrics.recordMetric(`test_${testName}_end`, {
    endTime: Date.now(),
    result: testResult?.state || 'unknown',
    duration: testResult?.duration || 0
  });
  
  // Логируем статистику созданных пользователей
  const users = testInfrastructure.getAllUsers();
  if (users.length > 0) {
    console.log(`👥 Создано пользователей в тесте: ${users.length}`);
  }
  
  // Небольшая пауза между тестами для стабильности
  await testInfrastructure.sleep(100);
});

/**
 * 🎯 УТИЛИТЫ ДЛЯ ТЕСТОВ
 */

// Глобальные хелперы
globalThis.createTestUser = testInfrastructure.createTestUser.bind(testInfrastructure);
globalThis.logTestState = testInfrastructure.logTestState.bind(testInfrastructure);
globalThis.sleep = testInfrastructure.sleep.bind(testInfrastructure);

// Константы для тестов
export const TEST_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  DEFAULT_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Тестовые данные
  REGISTRATION_BONUS: 500,
  AI_REQUEST_COST: 100,
  REFERRAL_BONUS: 1000,
  
  // Email коды для тестов
  EMAIL_VERIFICATION_CODE: '123456',
  FRIEND_EMAIL_CODE: '654321',
  
  // Платежные данные
  TEST_PAYMENT_AMOUNT: 1000,
  PAYMENT_METHOD: 'yoomoney'
};

console.log('📋 Тестовая конфигурация загружена:', TEST_CONFIG);