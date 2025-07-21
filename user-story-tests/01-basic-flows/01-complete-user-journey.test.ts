/**
 * 🎯 ОСНОВНОЙ ПОЛЬЗОВАТЕЛЬСКИЙ СЦЕНАРИЙ
 * 
 * Полный цикл работы пользователя:
 * 1. Регистрация с неверным email
 * 2. Попытка входа и уведомление о подтверждении
 * 3. Смена email и подтверждение
 * 4. Получение 500 Монетус за регистрацию
 * 5. Тестирование AI через чат-сервис (5 запросов по 100 Монетус)
 * 6. Уведомление о необходимости пополнения
 * 7. Покупка 1000 Монетус через ЮMoney
 * 8. Дополнительный AI запрос
 * 9. Реферальная программа - приглашение друга
 * 10. Получение 1000 Монетус за друга
 */

// Используем Node.js assert для базовых проверок
import { strict as assert } from 'assert';

// Простые хелперы для тестирования
const describe = (name: string, fn: () => void) => {
  console.log(`\n🧪 ${name}`);
  fn();
};

const it = (name: string, fn: () => Promise<void>) => {
  console.log(`  📝 ${name}`);
  return fn();
};

const expect = (actual: any) => ({
  toBe: (expected: any) => assert.strictEqual(actual, expected),
  toBeGreaterThan: (expected: any) => assert.ok(actual > expected),
  toBeGreaterThanOrEqual: (expected: any) => assert.ok(actual >= expected),
  toBeDefined: () => assert.ok(actual !== undefined),
  toContain: (expected: any) => assert.ok(actual.includes(expected))
});

const beforeEach = (fn: () => Promise<void>) => {
  // Заглушка для совместимости
};

const afterEach = (fn: () => Promise<void>) => {
  // Заглушка для совместимости  
};

describe('🎯 Полный пользовательский сценарий', () => {
  let testRunner: any;

  beforeEach(async () => {
    // Инициализация тестового окружения
    console.log('🔄 Подготовка тестового окружения...');
  });

  afterEach(async () => {
    // Очистка после тестов
    console.log('🧹 Очистка тестового окружения...');
  });

  it('Основной пользовательский journey от регистрации до реферальной программы', async () => {
    console.log('🚀 Начинаем полный пользовательский сценарий...');

    // ========================================
    // ЭТАП 1: РЕГИСТРАЦИЯ С НЕВЕРНЫМ EMAIL
    // ========================================
    console.log('\n📝 ЭТАП 1: Регистрация с неверным email');
    
    const user1Data = {
      name: 'Иван Петров',
      email: 'ivan@nonexistent-domain.ru', // Неверный email
      password: 'SecurePass123!',
      phone: '+79991234567'
    };

    // Пользователь регистрируется
    const registrationResult = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user1Data)
    });

    expect(registrationResult.ok).toBe(true);
    const regData = await registrationResult.json();
    expect(regData.success).toBe(true);
    expect(regData.user.emailVerified).toBe(false);
    
    const user1Id = regData.user.id;
    console.log(`✅ Пользователь зарегистрирован: ${user1Id}`);

    // ========================================
    // ЭТАП 2: ПОПЫТКА ВХОДА БЕЗ ПОДТВЕРЖДЕНИЯ
    // ========================================
    console.log('\n🔐 ЭТАП 2: Попытка входа без подтверждения email');

    const loginAttempt = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user1Data.email,
        password: user1Data.password
      })
    });

    const loginData = await loginAttempt.json();
    expect(loginData.success).toBe(false);
    expect(loginData.error).toBe('EMAIL_NOT_VERIFIED');
    expect(loginData.message).toContain('подтвердить email');
    
    console.log('❌ Вход заблокирован: требуется подтверждение email');

    // ========================================
    // ЭТАП 3: СМЕНА EMAIL И ПОДТВЕРЖДЕНИЕ
    // ========================================
    console.log('\n📧 ЭТАП 3: Смена email на корректный и подтверждение');

    const correctEmail = 'ivan.petrov@gmail.com';
    
    // Обновляем email
    const emailUpdateResult = await fetch(`/api/auth/update-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user1Id,
        newEmail: correctEmail
      })
    });

    expect(emailUpdateResult.ok).toBe(true);
    console.log(`📧 Email обновлен на: ${correctEmail}`);

    // Получаем код подтверждения (в тестах симулируем)
    const verificationCode = '123456'; // В реальности из email
    
    const verifyResult = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user1Id,
        code: verificationCode
      })
    });

    expect(verifyResult.ok).toBe(true);
    console.log('✅ Email подтвержден успешно');

    // Теперь можем войти
    const successfulLogin = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: correctEmail,
        password: user1Data.password
      })
    });

    const loginSuccess = await successfulLogin.json();
    expect(loginSuccess.success).toBe(true);
    
    const authToken = loginSuccess.token;
    console.log('🔓 Успешный вход в систему');

    // ========================================
    // ЭТАП 4: ПРОВЕРКА РЕГИСТРАЦИОННОГО БОНУСА
    // ========================================
    console.log('\n💰 ЭТАП 4: Проверка начисления 500 Монетус за регистрацию');

    const balanceResult = await fetch(`/api/billing/balance/${user1Id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const balanceData = await balanceResult.json();
    expect(balanceData.MNT).toBe(500); // 500 Монетус за регистрацию
    
    console.log(`💎 Баланс пользователя: ${balanceData.MNT} Монетус`);

    // ========================================
    // ЭТАП 5: ТЕСТИРОВАНИЕ AI (5 ЗАПРОСОВ)
    // ========================================
    console.log('\n🤖 ЭТАП 5: Тестирование AI через чат-сервис');

    // Получаем список доступных AI моделей
    const modelsResult = await fetch('/api/ai/models', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const models = await modelsResult.json();
    
    // Выбираем самую дешевую модель (для тестов)
    const cheapestModel = models.find(m => m.provider === 'openrouter' && m.cost <= 0.01);
    expect(cheapestModel).toBeDefined();
    
    console.log(`🎯 Выбрана модель: ${cheapestModel.name} (${cheapestModel.cost} за запрос)`);

    // Делаем 5 запросов к AI (по 100 Монетус каждый)
    for (let i = 1; i <= 5; i++) {
      console.log(`🔄 AI запрос ${i}/5...`);
      
      const aiRequest = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: cheapestModel.id,
          message: `Тестовый запрос ${i}: Привет, как дела?`,
          userId: user1Id
        })
      });

      const aiResponse = await aiRequest.json();
      expect(aiResponse.success).toBe(true);
      expect(aiResponse.cost).toBe(100); // 100 Монетус за запрос
      
      console.log(`✅ Запрос ${i} выполнен, стоимость: 100 Монетус`);
    }

    // Проверяем баланс после 5 запросов
    const balanceAfterAI = await fetch(`/api/billing/balance/${user1Id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const balanceAfterAIData = await balanceAfterAI.json();
    expect(balanceAfterAIData.MNT).toBe(0); // 500 - (5 * 100) = 0
    
    console.log(`💳 Баланс после AI запросов: ${balanceAfterAIData.MNT} Монетус`);

    // ========================================
    // ЭТАП 6: УВЕДОМЛЕНИЕ О ПОПОЛНЕНИИ
    // ========================================
    console.log('\n⚠️ ЭТАП 6: Система уведомляет о необходимости пополнения');

    // Попытка сделать еще один запрос при нулевом балансе
    const failedAIRequest = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: cheapestModel.id,
        message: 'Еще один запрос',
        userId: user1Id
      })
    });

    const failedResponse = await failedAIRequest.json();
    expect(failedResponse.success).toBe(false);
    expect(failedResponse.error).toBe('INSUFFICIENT_BALANCE');
    expect(failedResponse.message).toContain('пополнить счет');
    
    console.log('❌ Запрос отклонен: недостаточно средств');
    console.log('💡 Система предлагает пополнить счет или выбрать тариф');

    // ========================================
    // ЭТАП 7: ПОКУПКА 1000 МОНЕТУС ЧЕРЕЗ ЮMONEY
    // ========================================
    console.log('\n💳 ЭТАП 7: Покупка 1000 Монетус через ЮMoney');

    const paymentRequest = await fetch('/api/billing/purchase', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000,
        currency: 'MNT',
        paymentMethod: 'yoomoney',
        userId: user1Id
      })
    });

    const paymentData = await paymentRequest.json();
    expect(paymentData.success).toBe(true);
    expect(paymentData.paymentUrl).toBeDefined();
    
    console.log('🔄 Инициирован платеж через ЮMoney');

    // Симулируем успешный платеж (webhook от ЮMoney)
    const webhookResult = await fetch('/api/webhooks/yoomoney', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation_id: paymentData.operationId,
        status: 'success',
        amount: 1000,
        currency: 'MNT',
        user_id: user1Id
      })
    });

    expect(webhookResult.ok).toBe(true);
    console.log('✅ Платеж успешно обработан');

    // Проверяем обновленный баланс
    const balanceAfterPayment = await fetch(`/api/billing/balance/${user1Id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const balanceAfterPaymentData = await balanceAfterPayment.json();
    expect(balanceAfterPaymentData.MNT).toBe(1000);
    
    console.log(`💎 Баланс после пополнения: ${balanceAfterPaymentData.MNT} Монетус`);

    // ========================================
    // ЭТАП 8: ДОПОЛНИТЕЛЬНЫЙ AI ЗАПРОС
    // ========================================
    console.log('\n🤖 ЭТАП 8: Дополнительный AI запрос после пополнения');

    const additionalAIRequest = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: cheapestModel.id,
        message: 'Спасибо за пополнение! Теперь могу продолжить работу.',
        userId: user1Id
      })
    });

    const additionalAIResponse = await additionalAIRequest.json();
    expect(additionalAIResponse.success).toBe(true);
    
    console.log('✅ Дополнительный AI запрос выполнен успешно');

    // ========================================
    // ЭТАП 9: РЕФЕРАЛЬНАЯ ПРОГРАММА
    // ========================================
    console.log('\n🎁 ЭТАП 9: Система уведомляет о реферальной программе');

    // Система показывает уведомление о реферальной программе
    const referralInfoResult = await fetch(`/api/referral/info/${user1Id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const referralInfo = await referralInfoResult.json();
    expect(referralInfo.canRefer).toBe(true);
    expect(referralInfo.bonusAmount).toBe(1000); // 1000 Монетус за друга
    
    console.log('💡 Система уведомляет о возможности приглашать друзей');
    console.log(`🎁 Бонус за каждого друга: ${referralInfo.bonusAmount} Монетус`);

    // Пользователь получает свою реферальную ссылку
    const referralLinkResult = await fetch(`/api/referral/link/${user1Id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const referralLinkData = await referralLinkResult.json();
    expect(referralLinkData.link).toBeDefined();
    
    const referralLink = referralLinkData.link;
    console.log(`🔗 Реферальная ссылка: ${referralLink}`);

    // ========================================
    // ЭТАП 10: РЕГИСТРАЦИЯ ДРУГА И ПОЛУЧЕНИЕ БОНУСА
    // ========================================
    console.log('\n👥 ЭТАП 10: Друг регистрируется по реферальной ссылке');

    const friendData = {
      name: 'Петр Иванов',
      email: 'petr.ivanov@gmail.com',
      password: 'FriendPass123!',
      phone: '+79991234568',
      referralCode: referralLinkData.code
    };

    // Друг регистрируется
    const friendRegistration = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(friendData)
    });

    const friendRegData = await friendRegistration.json();
    expect(friendRegData.success).toBe(true);
    
    const friendId = friendRegData.user.id;
    console.log(`✅ Друг зарегистрирован: ${friendId}`);

    // Друг подтверждает email (симулируем)
    const friendVerifyResult = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: friendId,
        code: '654321'
      })
    });

    expect(friendVerifyResult.ok).toBe(true);
    console.log('✅ Email друга подтвержден');

    // Проверяем что первому пользователю зачислились 1000 Монетус
    const finalBalanceResult = await fetch(`/api/billing/balance/${user1Id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const finalBalanceData = await finalBalanceResult.json();
    expect(finalBalanceData.MNT).toBe(1900); // 1000 - 100 (AI запрос) + 1000 (реферальный бонус)
    
    console.log(`🎉 Финальный баланс: ${finalBalanceData.MNT} Монетус`);

    // Проверяем что друг тоже получил регистрационный бонус
    const friendBalanceResult = await fetch(`/api/billing/balance/${friendId}`);
    const friendBalanceData = await friendBalanceResult.json();
    expect(friendBalanceData.MNT).toBe(500); // 500 Монетус за регистрацию
    
    console.log(`👥 Баланс друга: ${friendBalanceData.MNT} Монетус`);

    // ========================================
    // ИТОГИ ТЕСТИРОВАНИЯ
    // ========================================
    console.log('\n🏆 ИТОГИ ПОЛНОГО ПОЛЬЗОВАТЕЛЬСКОГО СЦЕНАРИЯ:');
    console.log('✅ Регистрация с исправлением email');
    console.log('✅ Получение регистрационного бонуса (500 Монетус)');
    console.log('✅ Тестирование AI (5 запросов по 100 Монетус)');
    console.log('✅ Пополнение баланса через ЮMoney (1000 Монетус)');
    console.log('✅ Реферальная программа (приглашение друга)');
    console.log('✅ Получение реферального бонуса (1000 Монетус)');
    console.log(`💎 Итоговый баланс: ${finalBalanceData.MNT} Монетус`);
    console.log('🎯 Полный цикл пользователя протестирован успешно!');

    // Финальные проверки
    expect(finalBalanceData.MNT).toBeGreaterThan(1500); // Должно быть больше 1500
    expect(friendBalanceData.MNT).toBe(500);
    
    // Проверяем историю транзакций
    const transactionsResult = await fetch(`/api/billing/transactions/${user1Id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const transactions = await transactionsResult.json();
    expect(transactions.length).toBeGreaterThanOrEqual(7); // Минимум 7 транзакций
    
    const transactionTypes = transactions.map(t => t.type);
    expect(transactionTypes).toContain('REGISTRATION_BONUS');
    expect(transactionTypes).toContain('AI_USAGE');
    expect(transactionTypes).toContain('PAYMENT');
    expect(transactionTypes).toContain('REFERRAL_BONUS');
    
    console.log('📋 История транзакций проверена успешно');
  });
});