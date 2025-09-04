import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { ThemeButton, ThemeInput, ThemeAlert, ThemeSpinner, VerificationCodeInput } from '../ui';

interface CodeLoginProps {
  onLogin?: (user: any) => void;
  onBack?: () => void;
}

type LoginStep = 'contact' | 'verification' | 'complete';

interface LoginForm {
  email: string;
  phone: string;
  channel: 'EMAIL' | 'SMS';
  verificationCode: string;
}

export const CodeLogin: React.FC<CodeLoginProps> = ({ onLogin, onBack }) => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('contact');
  const [form, setForm] = useState<LoginForm>({
    email: '',
    phone: '',
    channel: 'EMAIL',
    verificationCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string>('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  // Таймер для повторной отправки кода
  React.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = (step: LoginStep): boolean => {
    switch (step) {
      case 'contact':
        if (form.channel === 'EMAIL' && !form.email) {
          setError('Введите email адрес');
          return false;
        }
        if (form.channel === 'SMS' && !form.phone) {
          setError('Введите номер телефона');
          return false;
        }
        return true;
      case 'verification':
        if (form.verificationCode.length < 6) {
          setError('Введите 6-значный код');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSendCode = async () => {
    if (!validateForm('contact')) return;

    setLoading(true);
    setError('');
    setResendCountdown(60); // Запускаем таймер при каждой отправке

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.channel === 'EMAIL' ? form.email : undefined,
          phone: form.channel === 'SMS' ? form.phone : undefined,
          channel: form.channel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка отправки кода');
      }

      setCodeExpiresAt(data.expiresAt);
      setCurrentStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateForm('verification')) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.channel === 'EMAIL' ? form.email : undefined,
          phone: form.channel === 'SMS' ? form.phone : undefined,
          code: form.verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // При ошибке очищаем поле кода и показываем ошибку
        setForm((prev) => ({ ...prev, verificationCode: '' }));
        throw new Error(data.message || 'Неверный код');
      }

      // Сохраняем токен
      localStorage.setItem('auth-token', data.tokens.accessToken);

      // Уведомляем родительский компонент
      onLogin?.(data.user);

      setSuccess(true);
      setCurrentStep('complete');

      // Переходим к списку проектов через 2 секунды
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'contact':
        return 'Вход по коду';
      case 'verification':
        return 'Подтверждение';
      case 'complete':
        return 'Добро пожаловать!';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'contact':
        return 'Введите email или телефон для получения кода';
      case 'verification':
        return `Введите код, отправленный на ${form.channel === 'EMAIL' ? form.email : form.phone}`;
      case 'complete':
        return 'Вход выполнен успешно';
      default:
        return '';
    }
  };

  const renderProgressBar = () => {
    const steps = [
      {
        id: 'contact',
        label: '1',
        active: currentStep === 'contact',
        completed: ['verification', 'complete'].includes(currentStep),
      },
      { id: 'verification', label: '2', active: currentStep === 'verification', completed: currentStep === 'complete' },
      { id: 'complete', label: <FaCheck className="w-3 h-3" />, active: currentStep === 'complete', completed: false },
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step.completed
                  ? 'bg-green-500 text-white'
                  : step.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  steps[index + 1].completed || steps[index + 1].active ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderContactStep = () => (
    <div className="space-y-6">
      {/* Табы для выбора канала связи */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => handleInputChange('channel', 'EMAIL')}
          className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            form.channel === 'EMAIL'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <FaEnvelope className="w-4 h-4 mr-2" />
          Почта
        </button>
        <button
          onClick={() => handleInputChange('channel', 'SMS')}
          className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            form.channel === 'SMS'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <FaPhone className="w-4 h-4 mr-2" />
          Телефон
        </button>
      </div>

      {/* Поле ввода */}
      {form.channel === 'EMAIL' ? (
        <ThemeInput
          type="email"
          placeholder="Введите ваш email"
          value={form.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          icon={<FaEnvelope />}
          required
        />
      ) : (
        <ThemeInput
          type="text"
          placeholder="+7 (900) 123-45-67"
          value={form.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          icon={<FaPhone />}
          required
        />
      )}

      {error && <ThemeAlert type="error">{error}</ThemeAlert>}

      <ThemeButton onClick={handleSendCode} className="w-full" size="lg">
        Отправить код
      </ThemeButton>

      {/* Ссылка на вход по паролю */}
      <div className="text-center space-y-3">
        <div>
          <button onClick={onBack} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            Войти по паролю
          </button>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Нет аккаунта?</p>
          <button
            onClick={() => (window.location.href = '/register')}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Создать аккаунт
          </button>
        </div>
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <VerificationCodeInput
          length={6}
          value={form.verificationCode}
          onChange={(value) => {
            handleInputChange('verificationCode', value);
            // Автоматически отправляем код при заполнении всех 6 цифр
            if (value.length === 6) {
              setTimeout(() => {
                handleVerifyCode();
              }, 300);
            }
          }}
          onComplete={handleVerifyCode}
          error={!!error}
          className="max-w-sm mx-auto"
        />
      </div>

      {error && <ThemeAlert type="error">{error}</ThemeAlert>}

      {loading && (
        <div className="text-center">
          <ThemeSpinner />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Проверяем код...</p>
        </div>
      )}

      {/* Ссылка для повторной отправки с таймером */}
      <div className="text-center">
        {resendCountdown > 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Запросить код повторно можно через {resendCountdown} сек
          </p>
        ) : (
          <button
            onClick={handleSendCode}
            disabled={loading}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium disabled:opacity-50"
          >
            Отправить код повторно
          </button>
        )}
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <FaCheck className="w-8 h-8 text-green-600" />
      </div>
      <p className="text-gray-600 dark:text-gray-400">Перенаправление в систему...</p>
      <ThemeSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок - только на первом шаге */}
        {currentStep === 'contact' && (
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Situs Platform</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Войдите в свою учетную запись</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Заголовок с кнопкой назад */}
          <div className="flex items-center mb-6">
            {(currentStep !== 'contact' || onBack) && (
              <button
                onClick={currentStep === 'contact' ? onBack : () => setCurrentStep('contact')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getStepTitle()}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{getStepDescription()}</p>
            </div>
          </div>

          {/* Контент шага */}
          {currentStep === 'contact' && renderContactStep()}
          {currentStep === 'verification' && renderVerificationStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </div>
      </div>
    </div>
  );
};

export default CodeLogin;
