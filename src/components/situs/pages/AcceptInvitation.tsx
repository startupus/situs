import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiCheck, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { ThemeButton, ThemeAlert, ThemeSpinner, VerificationCodeInput } from '../../ui';
import { InvitationsAPI, Invitation } from '../../../api/services/invitations.api';

interface AcceptInvitationForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  usePassword: boolean;
  verificationCode: string;
}

const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const [form, setForm] = useState<AcceptInvitationForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    usePassword: false,
    verificationCode: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<AcceptInvitationForm>>({});

  // Загрузка приглашения по токену
  useEffect(() => {
    if (!token) {
      setError('Токен приглашения не найден');
      setLoading(false);
      return;
    }

    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      const invitationData = await InvitationsAPI.getInvitationByToken(token!);
      setInvitation(invitationData);
      setForm(prev => ({
        ...prev,
        email: invitationData.email
      }));
    } catch (err: any) {
      setError(err.message || 'Приглашение не найдено или недействительно');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<AcceptInvitationForm> = {};

    if (!form.name.trim()) {
      errors.name = 'Имя обязательно';
    }

    // Валидация пароля только если пользователь выбрал использовать пароль
    if (form.usePassword) {
      if (!form.password) {
        errors.password = 'Пароль обязателен';
      } else if (form.password.length < 8) {
        errors.password = 'Пароль должен содержать минимум 8 символов';
      }

      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      if (form.usePassword) {
        // Регистрация с паролем
        await InvitationsAPI.acceptInvitation({
          token: token!,
          email: form.email,
          password: form.password,
          name: form.name
        });

        setSuccess(true);
        
        // Перенаправляем на главную страницу через 3 секунды
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      } else {
        // Регистрация без пароля - отправляем код подтверждения
        await sendVerificationCode();
        setStep('verification');
      }

    } catch (err: any) {
      setError(err.message || 'Ошибка при принятии приглашения');
    } finally {
      setSubmitting(false);
    }
  };

  const sendVerificationCode = async () => {
    try {
      // TODO: Реализовать API для отправки кода подтверждения
      // await InvitationsAPI.sendVerificationCode(form.email);
      
      // Временная заглушка
      console.log('Отправка кода подтверждения на:', form.email);
      setCodeSent(true);
      
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке кода подтверждения');
    }
  };

  const handleVerificationSubmit = async () => {
    if (form.verificationCode.length !== 6) {
      setError('Введите 6-значный код подтверждения');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // TODO: Реализовать API для подтверждения кода и создания пользователя
      // await InvitationsAPI.acceptInvitationWithCode({
      //   token: token!,
      //   email: form.email,
      //   name: form.name,
      //   verificationCode: form.verificationCode
      // });

      // Временная заглушка
      console.log('Подтверждение кода:', form.verificationCode);
      
      setSuccess(true);
      
      // Перенаправляем на главную страницу через 3 секунды
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Неверный код подтверждения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AcceptInvitationForm, value: string | boolean) => {
    if (field === 'usePassword') {
      setForm(prev => ({ ...prev, [field]: value === 'true' || value === true }));
    } else {
      setForm(prev => ({ ...prev, [field]: value as string }));
    }
    // Убираем ошибку при изменении поля
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Супер Админ';
      case 'STAFF': return 'Сотрудник';
      case 'AGENCY': return 'Агентство';
      case 'BUSINESS': return 'Бизнес';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ThemeSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Загрузка приглашения...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Приглашение недействительно
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <ThemeButton
              onClick={() => navigate('/')}
              variant="primary"
            >
              На главную
            </ThemeButton>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Добро пожаловать!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ваш аккаунт успешно создан. Сейчас вы будете перенаправлены на главную страницу.
            </p>
            <ThemeSpinner size="sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Принятие приглашения
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Создайте аккаунт для присоединения к платформе
            </p>
          </div>

          {/* Информация о приглашении */}
          {invitation && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Роль:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {getRoleText(invitation.role)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Истекает:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(invitation.expiresAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              {invitation.message && (
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {invitation.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ошибки */}
          {error && (
            <div className="mb-6">
              <ThemeAlert variant="error" title="Ошибка">
                {error}
              </ThemeAlert>
            </div>
          )}

          {/* Форма или код подтверждения */}
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email (только для чтения) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              {/* Имя */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Полное имя *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                      formErrors.name 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Введите ваше полное имя"
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                )}
              </div>

              {/* Выбор способа входа */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Способ входа в систему
                </p>
                
                {/* Вход по коду (по умолчанию) */}
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="authMethod"
                    checked={!form.usePassword}
                    onChange={() => handleInputChange('usePassword', 'false')}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Вход по коду подтверждения
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Мы отправим код на ваш email для входа в систему
                    </div>
                  </div>
                </label>

                {/* Вход по паролю */}
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="authMethod"
                    checked={form.usePassword}
                    onChange={() => handleInputChange('usePassword', 'true')}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Создать пароль
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Установите пароль для входа в систему
                    </div>
                  </div>
                </label>
              </div>

              {/* Поля пароля (показываются только если выбран вход по паролю) */}
              {form.usePassword && (
                <div className="space-y-4 pt-2">
                  {/* Пароль */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Пароль *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pl-9 pr-10 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                          formErrors.password 
                            ? 'border-red-300 dark:border-red-600' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Минимум 8 символов"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Подтверждение пароля */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Подтвердите пароль *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                          formErrors.confirmPassword 
                            ? 'border-red-300 dark:border-red-600' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Повторите пароль"
                      />
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Кнопка отправки */}
              <ThemeButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <ThemeSpinner size="sm" className="mr-2" />
                    {form.usePassword ? 'Создание аккаунта...' : 'Отправка кода...'}
                  </>
                ) : (
                  form.usePassword ? 'Создать аккаунт' : 'Получить код подтверждения'
                )}
              </ThemeButton>
            </form>
          ) : (
            /* Экран ввода кода подтверждения */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Введите код подтверждения
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Мы отправили 6-значный код на {form.email}
                </p>
              </div>

              <div className="flex justify-center">
                <VerificationCodeInput
                  length={6}
                  value={form.verificationCode}
                  onChange={(code) => handleInputChange('verificationCode', code)}
                  onComplete={handleVerificationSubmit}
                  error={!!error}
                  className="max-w-sm"
                />
              </div>

              <div className="space-y-3">
                <ThemeButton
                  onClick={handleVerificationSubmit}
                  variant="primary"
                  size="lg"
                  disabled={submitting || form.verificationCode.length !== 6}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <ThemeSpinner size="sm" className="mr-2" />
                      Проверка кода...
                    </>
                  ) : (
                    'Подтвердить'
                  )}
                </ThemeButton>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    disabled={submitting}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                  >
                    Отправить код повторно
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    disabled={submitting}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:underline disabled:opacity-50"
                  >
                    ← Вернуться к форме
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Футер */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
