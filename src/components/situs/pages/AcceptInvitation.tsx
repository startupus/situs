import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { ThemeButton, ThemeAlert, ThemeSpinner, VerificationCodeInput } from '../../ui';
import { InvitationsAPI, Invitation } from '../../../api/services/invitations.api';

interface AcceptInvitationForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  verificationCode: string;
}

interface GlobalSettings {
  requireEmailVerification: boolean;
  allowPasswordCreation: boolean;
  requirePassword: boolean;
  enableTwoFactorAuth: boolean;
}

type Step = 'info' | 'verification' | 'password' | 'complete';

const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Глобальные настройки (пока захардкожены, потом будут из API)
  const [settings] = useState<GlobalSettings>({
    requireEmailVerification: true,
    allowPasswordCreation: true,
    requirePassword: false,
    enableTwoFactorAuth: false,
  });

  const [form, setForm] = useState<AcceptInvitationForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    verificationCode: '',
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

  // Таймер обратного отсчета для перенаправления
  useEffect(() => {
    if (currentStep === 'complete' && success) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, success, navigate]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      const response = await InvitationsAPI.getInvitationByToken(token!);

      if (response && response.email) {
        setInvitation(response);
        setForm((prev) => ({ ...prev, email: response.email }));
      } else {
        setError('Приглашение не найдено или недействительно');
      }
    } catch (err: any) {
      console.error('Ошибка загрузки приглашения:', err);
      setError(err.message || 'Ошибка загрузки приглашения');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AcceptInvitationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setError(null);
  };

  const validateCurrentStep = (): boolean => {
    const errors: Partial<AcceptInvitationForm> = {};

    if (currentStep === 'info') {
      if (!form.name.trim()) {
        errors.name = 'Введите ваше полное имя';
      }
      if (!form.email.trim()) {
        errors.email = 'Email обязателен';
      }
    }

    if (currentStep === 'verification') {
      if (!form.verificationCode || form.verificationCode.length < 6) {
        errors.verificationCode = 'Введите 6-значный код';
      }
    }

    if (currentStep === 'password') {
      if (form.password) {
        if (form.password.length < 8) {
          errors.password = 'Пароль должен содержать минимум 8 символов';
        }
        if (form.password !== form.confirmPassword) {
          errors.confirmPassword = 'Пароли не совпадают';
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getNextStep = (current: Step): Step | null => {
    switch (current) {
      case 'info':
        return settings.requireEmailVerification
          ? 'verification'
          : settings.allowPasswordCreation
            ? 'password'
            : 'complete';
      case 'verification':
        return settings.allowPasswordCreation ? 'password' : 'complete';
      case 'password':
        return 'complete';
      case 'complete':
        return null;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    const nextStep = getNextStep(currentStep);

    if (currentStep === 'info' && settings.requireEmailVerification) {
      // Отправляем код подтверждения
      await sendVerificationCode();
    }

    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      // Завершаем регистрацию
      await completeRegistration();
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verification':
        setCurrentStep('info');
        break;
      case 'password':
        setCurrentStep(settings.requireEmailVerification ? 'verification' : 'info');
        break;
      default:
        break;
    }
  };

  const sendVerificationCode = async () => {
    try {
      setSubmitting(true);
      console.log('Отправка кода подтверждения на:', form.email);
      // TODO: Реальная отправка кода через API
      setCodeSent(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки кода');
    } finally {
      setSubmitting(false);
    }
  };

  const completeRegistration = async () => {
    try {
      setSubmitting(true);

      const registrationData = {
        token: token!,
        name: form.name,
        ...(form.password && { password: form.password }),
        ...(settings.requireEmailVerification && { verificationCode: form.verificationCode }),
      };

      console.log('Завершение регистрации:', registrationData);

      // TODO: Реальный API вызов
      // const response = await InvitationsAPI.acceptInvitation(registrationData);

      setSuccess(true);
      setCurrentStep('complete');
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);
      setError(err.message || 'Ошибка при создании аккаунта');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleText = (role: string) => {
    const roleMap: Record<string, string> = {
      SUPER_ADMIN: 'Супер Админ',
      STAFF: 'Сотрудник',
      AGENCY: 'Агентство',
      BUSINESS: 'Бизнес',
    };
    return roleMap[role] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleManualRedirect = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ThemeSpinner size="lg" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <ThemeAlert type="error" title="Приглашение не найдено">
            Error
          </ThemeAlert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Заголовок */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-4">
              {currentStep !== 'info' ? (
                <button
                  onClick={handleBack}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FiArrowLeft className="mr-2" size={16} />
                  Назад
                </button>
              ) : (
                <div></div>
              )}

              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-12 h-12"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              <div></div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Принятие приглашения</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentStep === 'info' && 'Создайте аккаунт для присоединения к платформе'}
              {currentStep === 'verification' && 'Подтвердите ваш email адрес'}
              {currentStep === 'password' && 'Настройте безопасность аккаунта'}
              {currentStep === 'complete' && 'Добро пожаловать в команду!'}
            </p>
          </div>

          {/* Прогресс-бар */}
          <div className="mb-6">
            <div className="flex justify-center items-center mb-2">
              {(['info', 'verification', 'password'] as Step[]).map((step, index) => {
                const stepNumber = index + 1;
                const isActive = step === currentStep;
                const isCompleted = ['info', 'verification', 'password', 'complete'].indexOf(currentStep) > index;
                const isVisible =
                  step === 'info' ||
                  (step === 'verification' && settings.requireEmailVerification) ||
                  (step === 'password' && settings.allowPasswordCreation);

                if (!isVisible) return null;

                const visibleSteps = [
                  'info',
                  ...(settings.requireEmailVerification ? ['verification'] : []),
                  ...(settings.allowPasswordCreation ? ['password'] : []),
                ];
                const currentIndex = visibleSteps.indexOf(step);
                const isLastStep = currentIndex === visibleSteps.length - 1;

                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${
                        isCompleted || isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }
                    `}
                    >
                      {isCompleted ? <FiCheck size={16} /> : stepNumber}
                    </div>
                    {!isLastStep && (
                      <div
                        className={`
                        w-8 h-0.5 mx-2
                        ${isCompleted ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                      `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-4">
              <ThemeAlert type="error">Ошибка</ThemeAlert>
            </div>
          )}

          {success && (
            <div className="mb-4">
              <ThemeAlert type="success" title="Аккаунт создан!">
                Успешно
              </ThemeAlert>
            </div>
          )}

          {/* Шаг 1: Информация */}
          {currentStep === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Полное имя *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Введите ваше полное имя"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              ${
                                formErrors.name
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                  />
                </div>
                {formErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>}
              </div>
            </div>
          )}

          {/* Шаг 2: Подтверждение по коду */}
          {currentStep === 'verification' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Введите код подтверждения</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Мы отправили 6-значный код на {form.email}
                </p>
              </div>

              <div className="flex justify-center">
                <VerificationCodeInput
                  length={6}
                  value={form.verificationCode}
                  onChange={(code) => {
                    handleInputChange('verificationCode', code);
                    // Автоматически переходим к следующему шагу при заполнении кода
                    if (code.length === 6) {
                      setTimeout(() => {
                        const nextStep = getNextStep(currentStep);
                        if (nextStep) {
                          setCurrentStep(nextStep);
                        }
                      }, 500);
                    }
                  }}
                  error={!!formErrors.verificationCode}
                  className="max-w-sm"
                />
              </div>

              {formErrors.verificationCode && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">{formErrors.verificationCode}</p>
              )}

              <div className="text-center">
                <button
                  onClick={sendVerificationCode}
                  disabled={submitting}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Отправить код повторно
                </button>
              </div>
            </div>
          )}

          {/* Шаг 3: Создание пароля */}
          {currentStep === 'password' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Настройка пароля</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Вы можете создать пароль или пропустить этот шаг
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Пароль (опционально)
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Минимум 8 символов"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              ${
                                formErrors.password
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                )}
              </div>

              {form.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Повторите пароль"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg 
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                ${
                                  formErrors.confirmPassword
                                    ? 'border-red-300 dark:border-red-600'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Шаг 4: Завершение */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <FiCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Добро пожаловать!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Ваш аккаунт успешно создан.</p>

                {redirectCountdown > 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Автоматическое перенаправление через {redirectCountdown} сек...
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Перенаправление...</p>
                )}
              </div>

              <div className="flex justify-center">
                <ThemeButton onClick={handleManualRedirect} variant="primary" className="flex items-center">
                  Войти в систему
                  <FiArrowRight className="ml-2" size={16} />
                </ThemeButton>
              </div>
            </div>
          )}

          {/* Основная кнопка */}
          {currentStep !== 'complete' && (
            <div className="flex justify-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ThemeButton
                onClick={handleNext}
                variant="primary"
                disabled={submitting}
                className="flex items-center min-w-[120px] justify-center"
              >
                {submitting ? (
                  <ThemeSpinner size="sm" className="mr-2" />
                ) : (
                  <>
                    {currentStep === 'password' ? 'Завершить' : 'Далее'}
                    {currentStep !== 'password' && <FiArrowRight className="ml-2" size={16} />}
                  </>
                )}
              </ThemeButton>
            </div>
          )}

          {/* Ссылка на вход */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
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
