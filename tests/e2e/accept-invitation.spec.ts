import { test, expect } from '@playwright/test';

test.describe('Accept Invitation Multi-Step Process', () => {
  const invitationUrl = 'http://localhost:5177/accept-invitation?token=token3456789012cdefgh';

  test.beforeEach(async ({ page }) => {
    // Переходим на страницу принятия приглашения
    await page.goto(invitationUrl);
    await page.waitForLoadState('networkidle');
  });

  test('should display initial step with correct elements', async ({ page }) => {
    // Проверяем заголовок
    await expect(page.locator('h1')).toHaveText('Принятие приглашения');
    
    // Проверяем описание первого шага
    await expect(page.locator('p').first()).toHaveText('Создайте аккаунт для присоединения к платформе');
    
    // Проверяем прогресс-бар (должен показывать 3 шага)
    const progressSteps = page.locator('[class*="w-8 h-8 rounded-full"]');
    await expect(progressSteps).toHaveCount(3);
    
    // Проверяем, что первый шаг активен
    await expect(progressSteps.first()).toHaveClass(/bg-blue-600/);
    
    // Проверяем поля формы
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveValue('staff-member@example.com');
    await expect(page.locator('input[type="email"]')).toBeDisabled();
    
    await expect(page.getByPlaceholder('Введите ваше полное имя')).toBeVisible();
    await expect(page.getByPlaceholder('Введите ваше полное имя')).toBeEnabled();
    
    // Проверяем кнопку "Далее"
    await expect(page.getByRole('button', { name: 'Далее' })).toBeVisible();
    
    // Проверяем, что кнопки "Назад" нет на первом шаге
    await expect(page.getByRole('button', { name: 'Назад' })).not.toBeVisible();
  });

  test('should validate required fields on step 1', async ({ page }) => {
    // Пытаемся перейти дальше без заполнения имени
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Должна появиться ошибка валидации
    await expect(page.locator('text=Введите ваше полное имя')).toBeVisible();
  });

  test('should navigate to step 2 after filling name', async ({ page }) => {
    // Заполняем имя
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    
    // Переходим к следующему шагу
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Проверяем, что перешли на шаг 2
    await expect(page.locator('h1')).toHaveText('Принятие приглашения');
    await expect(page.locator('p').first()).toHaveText('Подтвердите ваш email адрес');
    
    // Проверяем заголовок шага
    await expect(page.locator('h3')).toHaveText('Введите код подтверждения');
    
    // Проверяем поля ввода кода
    const codeInputs = page.locator('input[inputmode="numeric"]');
    await expect(codeInputs).toHaveCount(6);
    
    // Проверяем кнопку "Назад"
    await expect(page.getByRole('button', { name: 'Назад' })).toBeVisible();
    
    // Проверяем прогресс-бар (первый шаг должен быть с галочкой)
    const progressSteps = page.locator('[class*="w-8 h-8 rounded-full"]');
    const firstStep = progressSteps.first();
    await expect(firstStep).toHaveClass(/bg-blue-600/);
  });

  test('should support code input via clipboard paste', async ({ page }) => {
    // Переходим к шагу 2
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Симулируем вставку кода
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    // Проверяем, что код заполнился
    const codeInputs = page.locator('input[inputmode="numeric"]');
    for (let i = 0; i < 6; i++) {
      await expect(codeInputs.nth(i)).toHaveValue((i + 1).toString());
    }
  });

  test('should navigate back from step 2 to step 1', async ({ page }) => {
    // Переходим к шагу 2
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Возвращаемся назад
    await page.getByRole('button', { name: 'Назад' }).click();
    
    // Проверяем, что вернулись на шаг 1
    await expect(page.locator('p').first()).toHaveText('Создайте аккаунт для присоединения к платформе');
    await expect(page.getByPlaceholder('Введите ваше полное имя')).toHaveValue('Тестовый Пользователь');
    
    // Проверяем, что кнопки "Назад" нет
    await expect(page.getByRole('button', { name: 'Назад' })).not.toBeVisible();
  });

  test('should navigate to step 3 (password setup)', async ({ page }) => {
    // Переходим к шагу 2
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Заполняем код
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    // Переходим к шагу 3
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Проверяем шаг 3
    await expect(page.locator('p').first()).toHaveText('Настройте безопасность аккаунта');
    await expect(page.locator('h3')).toHaveText('Настройка пароля');
    
    // Проверяем поле пароля
    await expect(page.getByPlaceholder('Минимум 8 символов')).toBeVisible();
    
    // Проверяем кнопку "Завершить"
    await expect(page.getByRole('button', { name: 'Завершить' })).toBeVisible();
  });

  test('should complete registration without password', async ({ page }) => {
    // Проходим все шаги без пароля
    await page.getByPlaceholder('Введите ваше полное имя').fill('Пользователь Без Пароля');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Заполняем код
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Завершаем без пароля
    await page.getByRole('button', { name: 'Завершить' }).click();
    
    // Проверяем финальный экран
    await expect(page.locator('h3')).toHaveText('Добро пожаловать!');
    await expect(page.locator('text=Ваш аккаунт успешно создан')).toBeVisible();
    
    // Проверяем финальную галочку в прогрессе
    const greenCheck = page.locator('[class*="bg-green-600"]');
    await expect(greenCheck).toBeVisible();
  });

  test('should complete registration with password', async ({ page }) => {
    // Проходим все шаги с паролем
    await page.getByPlaceholder('Введите ваше полное имя').fill('Пользователь С Паролем');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Заполняем код
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Создаем пароль
    await page.getByPlaceholder('Минимум 8 символов').fill('TestPassword123!');
    await page.getByPlaceholder('Повторите пароль').fill('TestPassword123!');
    
    // Завершаем с паролем
    await page.getByRole('button', { name: 'Завершить' }).click();
    
    // Проверяем финальный экран
    await expect(page.locator('h3')).toHaveText('Добро пожаловать!');
    await expect(page.locator('text=Ваш аккаунт успешно создан')).toBeVisible();
  });

  test('should validate password fields', async ({ page }) => {
    // Переходим к шагу пароля
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Тестируем валидацию пароля
    await page.getByPlaceholder('Минимум 8 символов').fill('123'); // Короткий пароль
    await page.getByPlaceholder('Повторите пароль').fill('456'); // Не совпадает
    
    await page.getByRole('button', { name: 'Завершить' }).click();
    
    // Проверяем ошибки валидации
    await expect(page.locator('text=Пароль должен содержать минимум 8 символов')).toBeVisible();
    await expect(page.locator('text=Пароли не совпадают')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    // Переходим к шагу пароля
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Проверяем переключение видимости пароля
    const passwordInput = page.getByPlaceholder('Минимум 8 символов');
    const toggleButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    
    // По умолчанию пароль скрыт
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Показываем пароль
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Скрываем пароль
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle resend code functionality', async ({ page }) => {
    // Переходим к шагу 2
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Проверяем кнопку переотправки
    await expect(page.getByRole('button', { name: 'Отправить код повторно' })).toBeVisible();
    
    // Нажимаем переотправку (пока что заглушка)
    await page.getByRole('button', { name: 'Отправить код повторно' }).click();
    
    // Проверяем, что страница не сломалась
    await expect(page.locator('h3')).toHaveText('Введите код подтверждения');
  });

  test('should maintain form data when navigating back and forth', async ({ page }) => {
    const testName = 'Тестовый Пользователь Навигация';
    
    // Заполняем имя на шаге 1
    await page.getByPlaceholder('Введите ваше полное имя').fill(testName);
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Возвращаемся назад
    await page.getByRole('button', { name: 'Назад' }).click();
    
    // Проверяем, что данные сохранились
    await expect(page.getByPlaceholder('Введите ваше полное имя')).toHaveValue(testName);
    
    // Снова переходим вперед
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Заполняем код
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    // Переходим к шагу 3
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Возвращаемся к шагу 2
    await page.getByRole('button', { name: 'Назад' }).click();
    
    // Проверяем, что код сохранился
    const codeInputs = page.locator('input[inputmode="numeric"]');
    for (let i = 0; i < 6; i++) {
      await expect(codeInputs.nth(i)).toHaveValue((i + 1).toString());
    }
  });

  test('should display correct progress indicators', async ({ page }) => {
    // Шаг 1: проверяем начальное состояние
    let progressSteps = page.locator('[class*="w-8 h-8 rounded-full"]');
    await expect(progressSteps.first()).toHaveClass(/bg-blue-600/);
    await expect(progressSteps.first()).toHaveText('1');
    
    // Переходим к шагу 2
    await page.getByPlaceholder('Введите ваше полное имя').fill('Тестовый Пользователь');
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Проверяем прогресс на шаге 2
    progressSteps = page.locator('[class*="w-8 h-8 rounded-full"]');
    await expect(progressSteps.first()).toHaveClass(/bg-blue-600/);
    // Первый шаг должен показывать галочку
    await expect(progressSteps.first().locator('svg')).toBeVisible();
    
    // Переходим к шагу 3
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[inputmode="numeric"]');
      const code = '123456';
      inputs.forEach((input: any, index) => {
        input.value = code[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    
    await page.getByRole('button', { name: 'Далее' }).click();
    
    // Проверяем прогресс на шаге 3
    progressSteps = page.locator('[class*="w-8 h-8 rounded-full"]');
    await expect(progressSteps.first()).toHaveClass(/bg-blue-600/);
    await expect(progressSteps.nth(1)).toHaveClass(/bg-blue-600/);
    
    // Завершаем процесс
    await page.getByRole('button', { name: 'Завершить' }).click();
    
    // Проверяем финальную зеленую галочку
    const greenCheck = page.locator('[class*="bg-green-600"]');
    await expect(greenCheck).toBeVisible();
  });
});
