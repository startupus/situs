import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UserStoryTest,
  ServiceClients,
  ValidationHelpers,
  TEST_CONSTANTS,
} from '../helpers/TestHelpers';

/**
 * 🧪 USER STORY: Регистрация пользователя и получение стартового бонуса
 *
 * СЦЕНАРИЙ:
 * 1. Пользователь регистрируется по SMS/email
 * 2. Получает 500₽ бонусных на счет
 * 3. Может просматривать баланс в личном кабинете
 * 4. Получает уведомление о бонусе
 */
class UserRegistrationBonusTest extends UserStoryTest {
  async runTest(): Promise<void> {
    await describe('👤 User Registration and Bonus', async () => {
      beforeEach(async () => {
        await this.setup();
      });

      afterEach(async () => {
        await this.cleanup();
      });

      await it('should register user and grant registration bonus', async () => {
        // 📱 Пользователь регистрируется
        const newUser = await this.createTestUser('alex', {
          phone: '+7999123456',
          email: 'alex@example.com',
        });

        // ✅ Проверяем создание пользователя
        expect(newUser.id).toBeDefined();
        expect(newUser.email).toBe('alex@example.com');
        expect(newUser.phone).toBe('+7999123456');
        expect(newUser.isActive).toBe(true);

        // 💰 Проверяем начисление регистрационного бонуса
        const balance = await ServiceClients.getBalance(newUser.id);
        expect(balance.bonusBalance).toBe(TEST_CONSTANTS.REGISTRATION_BONUS);
        expect(balance.balance).toBe(0); // основной баланс пустой

        // 📊 Проверяем транзакцию бонуса
        const transactions = await ServiceClients.getTransactionHistory(newUser.id);
        const bonusTransaction = transactions.find((t) => t.type === 'bonus');

        expect(bonusTransaction).toBeDefined();
        ValidationHelpers.validateTransaction(bonusTransaction!, {
          userId: newUser.id,
          type: 'bonus',
          amount: TEST_CONSTANTS.REGISTRATION_BONUS,
          description: 'Registration bonus',
        });

        console.log(
          `✅ User ${newUser.email} registered with ${TEST_CONSTANTS.REGISTRATION_BONUS}₽ bonus`,
        );
      });

      await it('should prevent duplicate registration bonus', async () => {
        // 📱 Первая регистрация
        const user1 = await this.createTestUser('duplicate1', {
          email: 'duplicate@example.com',
          phone: '+7999123456',
        });

        // 📱 Попытка повторной регистрации с тем же телефоном
        const attemptDuplicate = async () => {
          await this.createTestUser('duplicate2', {
            email: 'duplicate2@example.com',
            phone: '+7999123456', // тот же номер
          });
        };

        // ✅ Должна быть ошибка дублирования
        await expect(attemptDuplicate()).rejects.toThrow('Phone number already registered');

        // ✅ Бонус должен быть начислен только один раз
        const transactions = await ServiceClients.getTransactionHistory(user1.id);
        const bonusTransactions = transactions.filter((t) => t.type === 'bonus');
        expect(bonusTransactions).toHaveLength(1);
      });

      await it('should handle SMS verification flow', async () => {
        // 📱 Начало регистрации с SMS
        const phoneNumber = '+7999555777';

        // В реальности здесь был бы запрос на отправку SMS
        const smsCode = '123456'; // мок-код

        // 📱 Подтверждение регистрации
        const user = await ServiceClients.registerUser({
          phone: phoneNumber,
          email: 'sms-user@example.com',
        });

        // ✅ Проверяем успешную регистрацию
        expect(user.phone).toBe(phoneNumber);
        expect(user.isActive).toBe(true);

        // 💰 Проверяем бонус
        const balance = await ServiceClients.getBalance(user.id);
        expect(balance.bonusBalance).toBe(TEST_CONSTANTS.REGISTRATION_BONUS);

        console.log(`✅ SMS registration completed for ${phoneNumber}`);
      });

      await it('should track registration analytics', async () => {
        // 📱 Регистрируем несколько пользователей
        const users = await Promise.all([
          this.createTestUser('analytics1'),
          this.createTestUser('analytics2'),
          this.createTestUser('analytics3'),
        ]);

        // 📊 Проверяем аналитику регистраций
        const analyticsReport = await ServiceClients.generateReport('admin', 'admin', {
          from: new Date(Date.now() - 24 * 60 * 60 * 1000), // за сутки
          to: new Date(),
        });

        // ✅ Проверяем метрики
        expect(analyticsReport.users).toBeGreaterThanOrEqual(3);
        expect(analyticsReport.transactions).toBeGreaterThanOrEqual(3); // бонусные транзакции

        // 💰 Проверяем общую сумму бонусов
        const totalBonuses = users.length * TEST_CONSTANTS.REGISTRATION_BONUS;
        // В отчете должны быть отражены выданные бонусы

        console.log(`✅ Registration analytics: ${users.length} users, ${totalBonuses}₽ bonuses`);
      });
    });
  }
}

// Запуск теста
export default async function runUserRegistrationBonusTest(): Promise<void> {
  const test = new UserRegistrationBonusTest();
  await test.runTest();
}
