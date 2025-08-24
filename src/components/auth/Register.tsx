import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { ThemeButton, ThemeAlert, VerificationCodeInput } from '../ui';

interface RegisterForm {
  email: string;
  phone: string;
  name: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

type Step = 'info' | 'verification' | 'password' | 'complete';
type ContactMethod = 'email' | 'phone';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const [form, setForm] = useState<RegisterForm>({
    email: '',
    phone: '',
    name: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    switch (currentStep) {
      case 'info':
        return form.name.length > 0 && 
               (contactMethod === 'email' ? form.email.length > 0 : form.phone.length > 0);
      case 'verification':
        return form.verificationCode.length === 6;
      case 'password':
        return form.password.length >= 6 && form.password === form.confirmPassword;
      default:
        return false;
    }
  };

  const handleSendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contactMethod === 'email' ? form.email : undefined,
          phone: contactMethod === 'phone' ? form.phone : undefined,
          channel: contactMethod === 'email' ? 'EMAIL' : 'SMS',
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки кода');
      }

      setCurrentStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register-public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contactMethod === 'email' ? form.email : undefined,
          phone: contactMethod === 'phone' ? form.phone : undefined,
          name: form.name,
          password: form.password,
          verificationCode: form.verificationCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      setSuccess(true);
      setCurrentStep('complete');
      
      // Автоматический редирект через 5 секунд
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 'info') {
      handleSendCode();
    } else if (currentStep === 'verification') {
      setCurrentStep('password');
    } else if (currentStep === 'password') {
      handleRegister();
    }
  };

  const handleBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('info');
    } else if (currentStep === 'password') {
      setCurrentStep('verification');
    } else {
      navigate('/login');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'info':
        return 'Регистрация';
      case 'verification':
        return 'Подтверждение';
      case 'password':
        return 'Создание пароля';
      case 'complete':
        return 'Добро пожаловать!';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'info':
        return 'Создайте новый аккаунт';
      case 'verification':
        return 'Введите код из сообщения';
      case 'password':
        return 'Создайте надежный пароль';
      case 'complete':
        return 'Аккаунт успешно создан';
      default:
        return '';
    }
  };

  const renderProgressBar = () => {
    const steps = ['info', 'verification', 'password'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  index < currentIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            )}
          </React.Fragment>
        ))}
        {currentStep === 'complete' && (
          <>
            <div className="w-12 h-0.5 mx-2 bg-blue-600" />
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderInfoStep = () => (
    <div className="space-y-6">
      {/* Поле имени */}
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="Полное имя"
          required
        />
      </div>

      {/* Табы для выбора канала связи */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setContactMethod('email')}
          className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            contactMethod === 'email'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <FaEnvelope className="w-4 h-4 mr-2" />
          Почта
        </button>
        <button
          type="button"
          onClick={() => setContactMethod('phone')}
          className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            contactMethod === 'phone'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <FaPhone className="w-4 h-4 mr-2" />
          Телефон
        </button>
      </div>

      {/* Поле ввода контакта */}
      {contactMethod === 'email' ? (
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            placeholder="Введите ваш email"
            required
          />
        </div>
      ) : (
        <div className="relative">
          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            placeholder="+7 (900) 123-45-67"
            required
          />
        </div>
      )}

      <ThemeButton
        onClick={handleNext}
        disabled={!validateForm() || loading}
        className="w-full"
        loading={loading}
      >
        Далее
      </ThemeButton>
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
            // Автоматически переходим к следующему шагу при заполнении
            if (value.length === 6) {
              setTimeout(() => {
                setCurrentStep('password');
              }, 500);
            }
          }}
          error={error}
        />
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="Создайте пароль"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>

      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type={showPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="Подтвердите пароль"
          required
        />
      </div>

      {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
        <p className="text-red-600 dark:text-red-400 text-sm">
          Пароли не совпадают
        </p>
      )}

      <ThemeButton
        onClick={handleNext}
        disabled={!validateForm() || loading}
        className="w-full"
        loading={loading}
      >
        Создать аккаунт
      </ThemeButton>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Аккаунт создан!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Добро пожаловать в Situs Platform. Переход к входу через {redirectCountdown} сек.
        </p>
      </div>
      <ThemeButton
        onClick={() => navigate('/login')}
        className="w-full"
      >
        Войти в систему
      </ThemeButton>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Situs Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Создание нового аккаунта
          </p>
        </div>

        {/* Прогресс-бар */}
        {currentStep !== 'complete' && renderProgressBar()}

        {/* Форма */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Кнопка назад */}
          {currentStep !== 'info' && currentStep !== 'complete' && (
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </button>
            </div>
          )}

          {/* Заголовок */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getStepTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getStepDescription()}
            </p>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="mb-6">
              <ThemeAlert variant="error">
                {error}
              </ThemeAlert>
            </div>
          )}

          {/* Контент шага */}
          {currentStep === 'info' && renderInfoStep()}
          {currentStep === 'verification' && renderVerificationStep()}
          {currentStep === 'password' && renderPasswordStep()}
          {currentStep === 'complete' && renderCompleteStep()}

          {/* Ссылка на вход */}
          {currentStep === 'info' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Уже есть аккаунт?
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Войти в систему
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
