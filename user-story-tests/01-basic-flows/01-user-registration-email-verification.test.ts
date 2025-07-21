import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestHelper } from '../helpers/TestHelper';
import { UserService } from '../helpers/UserService';
import { EmailService } from '../helpers/EmailService';
import { BalanceService } from '../helpers/BalanceService';

describe('User Registration with Email Verification', () => {
  let testHelper: TestHelper;
  let userService: UserService;
  let emailService: EmailService;
  let balanceService: BalanceService;

  beforeEach(async () => {
    testHelper = new TestHelper();
    userService = new UserService(testHelper);
    emailService = new EmailService(testHelper);
    balanceService = new BalanceService(testHelper);
    
    await testHelper.setup();
  });

  afterEach(async () => {
    await testHelper.cleanup();
  });

  it('Полный цикл регистрации с неверным email и последующим подтверждением', async () => {
    // Шаг 1: Пользователь пытается зарегистрироваться с неверным email
    const incorrectEmail = 'invalid-email@nonexistent.domain';
    const userData = {
      name: 'Тестовый Пользователь',
      email: incorrectEmail,
      password: 'SecurePassword123!',
      phone: '+79991234567'
    };

    console.log('🔄 Шаг 1: Регистрация с неверным email...');
    const registrationResult = await userService.register(userData);
    
    // Проверяем что регистрация прошла успешно
    expect(registrationResult.success).toBe(true);
    expect(registrationResult.user.email).toBe(incorrectEmail);
    expect(registrationResult.user.emailVerified).toBe(false);
    
    const userId = registrationResult.user.id;
    
    // Шаг 2: Проверяем что email не отправился (неверный домен)
    console.log('🔄 Шаг 2: Проверка неотправленного email...');
    const emailStatus = await emailService.checkEmailDelivery(incorrectEmail);
    expect(emailStatus.delivered).toBe(false);
    expect(emailStatus.error).toContain('domain not found');

    // Шаг 3: Пользователь пытается войти без подтверждения
    console.log('🔄 Шаг 3: Попытка входа без подтверждения email...');
    const loginAttempt = await userService.login({
      email: incorrectEmail,
      password: userData.password
    });
    
    expect(loginAttempt.success).toBe(false);
    expect(loginAttempt.error).toBe('EMAIL_NOT_VERIFIED');
    expect(loginAttempt.message).toContain('необходимо подтвердить email');

    // Шаг 4: Пользователь обновляет email на корректный
    console.log('🔄 Шаг 4: Обновление email на корректный...');
    const correctEmail = 'test.user@gmail.com';
    const updateResult = await userService.updateEmail(userId, correctEmail);
    
    expect(updateResult.success).toBe(true);
    expect(updateResult.newEmail).toBe(correctEmail);

    // Шаг 5: Система отправляет код подтверждения
    console.log('🔄 Шаг 5: Отправка кода подтверждения...');
    const verificationEmail = await emailService.getLastEmail(correctEmail);
    expect(verificationEmail).toBeDefined();
    expect(verificationEmail.subject).toContain('Подтверждение email');
    
    const verificationCode = emailService.extractVerificationCode(verificationEmail.body);
    expect(verificationCode).toMatch(/^\d{6}$/); // 6-значный код

    // Шаг 6: Пользователь подтверждает email
    console.log('🔄 Шаг 6: Подтверждение email кодом...');
    const confirmationResult = await userService.verifyEmail(userId, verificationCode);
    
    expect(confirmationResult.success).toBe(true);
    expect(confirmationResult.message).toContain('Email успешно подтвержден');

    // Шаг 7: Проверяем что email теперь подтвержден
    const user = await userService.getUser(userId);
    expect(user.emailVerified).toBe(true);
    expect(user.emailVerifiedAt).toBeDefined();

    // Шаг 8: Теперь пользователь может войти
    console.log('🔄 Шаг 8: Успешный вход после подтверждения...');
    const successfulLogin = await userService.login({
      email: correctEmail,
      password: userData.password
    });
    
    expect(successfulLogin.success).toBe(true);
    expect(successfulLogin.token).toBeDefined();
    expect(successfulLogin.user.id).toBe(userId);

    // Шаг 9: Проверяем начисление регистрационного бонуса
    console.log('🔄 Шаг 9: Проверка регистрационного бонуса...');
    const balance = await balanceService.getBalance(userId);
    
    expect(balance.MNT).toBe(500); // 500 Монетус за регистрацию
    expect(balance.transactions).toHaveLength(1);
    expect(balance.transactions[0]).toMatchObject({
      type: 'REGISTRATION_BONUS',
      amount: 500,
      currency: 'MNT',
      description: 'Бонус за регистрацию'
    });

    // Шаг 10: Проверяем отправку welcome email
    console.log('🔄 Шаг 10: Проверка welcome email...');
    const welcomeEmail = await emailService.getEmailsByType(correctEmail, 'WELCOME');
    expect(welcomeEmail).toHaveLength(1);
    expect(welcomeEmail[0].subject).toContain('Добро пожаловать');
    expect(welcomeEmail[0].body).toContain('500 Монетус');

    console.log('✅ Тест завершен успешно!');
    console.log(`📧 Email подтвержден: ${correctEmail}`);
    console.log(`💰 Баланс: ${balance.MNT} Монетус`);
    console.log(`🎉 Пользователь готов к использованию системы`);
  });

  it('Повторная отправка кода подтверждения', async () => {
    // Регистрируем пользователя
    const userData = {
      name: 'Повторный Пользователь',
      email: 'repeat.user@gmail.com',
      password: 'SecurePassword123!'
    };

    const registrationResult = await userService.register(userData);
    const userId = registrationResult.user.id;

    // Первый код
    const firstEmail = await emailService.getLastEmail(userData.email);
    const firstCode = emailService.extractVerificationCode(firstEmail.body);

    // Ждем и запрашиваем повторную отправку
    await testHelper.wait(1000);
    
    const resendResult = await userService.resendVerificationCode(userId);
    expect(resendResult.success).toBe(true);

    // Второй код
    const secondEmail = await emailService.getLastEmail(userData.email);
    const secondCode = emailService.extractVerificationCode(secondEmail.body);

    // Коды должны отличаться
    expect(firstCode).not.toBe(secondCode);

    // Старый код не должен работать
    const oldCodeResult = await userService.verifyEmail(userId, firstCode);
    expect(oldCodeResult.success).toBe(false);
    expect(oldCodeResult.error).toBe('CODE_EXPIRED');

    // Новый код должен работать
    const newCodeResult = await userService.verifyEmail(userId, secondCode);
    expect(newCodeResult.success).toBe(true);
  });

  it('Защита от брутфорса кодов подтверждения', async () => {
    const userData = {
      name: 'Брутфорс Пользователь',
      email: 'bruteforce.user@gmail.com',
      password: 'SecurePassword123!'
    };

    const registrationResult = await userService.register(userData);
    const userId = registrationResult.user.id;

    // Попытки ввода неверных кодов
    for (let i = 0; i < 5; i++) {
      const wrongCode = '123456';
      const result = await userService.verifyEmail(userId, wrongCode);
      expect(result.success).toBe(false);
    }

    // После 5 неудачных попыток аккаунт должен быть заблокирован
    const correctEmail = await emailService.getLastEmail(userData.email);
    const correctCode = emailService.extractVerificationCode(correctEmail.body);
    
    const blockedResult = await userService.verifyEmail(userId, correctCode);
    expect(blockedResult.success).toBe(false);
    expect(blockedResult.error).toBe('ACCOUNT_TEMPORARILY_BLOCKED');
    expect(blockedResult.message).toContain('Слишком много неудачных попыток');
  });
});