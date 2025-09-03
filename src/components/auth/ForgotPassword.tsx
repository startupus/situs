import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { ThemeButton, ThemeAlert, ThemeSpinner, VerificationCodeInput } from '../ui';

interface ForgotPasswordProps {
  onBack?: () => void;
}

type Step = 'contact' | 'verification' | 'newPassword' | 'complete';
type ContactMethod = 'email' | 'phone';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('contact');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    email: '',
    phone: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
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

  const handleResetPassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contactMethod === 'email' ? form.email : undefined,
          phone: contactMethod === 'phone' ? form.phone : undefined,
          code: form.verificationCode,
          newPassword: form.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка сброса пароля');
      }

      setSuccess(true);
      setCurrentStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    switch (currentStep) {
      case 'contact':
        return contactMethod === 'email' ? form.email.length > 0 : form.phone.length > 0;
      case 'verification':
        return form.verificationCode.length === 6;
      case 'newPassword':
        return form.newPassword.length >= 6 && form.confirmPassword.length >= 6;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'contact') {
      handleSendCode();
    } else if (currentStep === 'verification') {
      setCurrentStep('newPassword');
    } else if (currentStep === 'newPassword') {
      handleResetPassword();
    }
  };

  const handleBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('contact');
    } else if (currentStep === 'newPassword') {
      setCurrentStep('verification');
    } else if (onBack) {
      onBack();
    } else {
      navigate('/login');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'contact':
        return 'Восстановление пароля';
      case 'verification':
        return 'Подтверждение';
      case 'newPassword':
        return 'Новый пароль';
      case 'complete':
        return 'Готово!';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'contact':
        return `Введите ${contactMethod === 'email' ? 'email' : 'телефон'} для получения кода`;
      case 'verification':
        return 'Введите код из сообщения';
      case 'newPassword':
        return 'Создайте новый пароль';
      case 'complete':
        return 'Пароль успешно изменен';
      default:
        return '';
    }
  };

  const renderContactStep = () => (
    <div className="space-y-6">
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

      <ThemeButton onClick={handleNext} disabled={!validateForm() || loading} className="w-full" loading={loading}>
        Отправить код
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
                setCurrentStep('newPassword');
              }, 500);
            }
          }}
          error={error}
        />
      </div>
    </div>
  );

  const renderNewPasswordStep = () => (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="Новый пароль"
          required
        />
      </div>

      <div className="relative">
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="Подтвердите пароль"
          required
        />
      </div>

      <ThemeButton onClick={handleNext} disabled={!validateForm() || loading} className="w-full" loading={loading}>
        Изменить пароль
      </ThemeButton>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Пароль успешно изменен. Теперь вы можете войти в систему с новым паролем.
      </p>
      <ThemeButton onClick={() => navigate('/login')} className="w-full">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Situs Platform</h1>
          <p className="text-gray-600 dark:text-gray-400">Восстановление доступа</p>
        </div>

        {/* Форма */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Кнопка назад */}
          {currentStep !== 'contact' && currentStep !== 'complete' && (
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getStepTitle()}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{getStepDescription()}</p>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="mb-6">
              <ThemeAlert variant="error">{error}</ThemeAlert>
            </div>
          )}

          {/* Контент шага */}
          {currentStep === 'contact' && renderContactStep()}
          {currentStep === 'verification' && renderVerificationStep()}
          {currentStep === 'newPassword' && renderNewPasswordStep()}
          {currentStep === 'complete' && renderCompleteStep()}

          {/* Ссылка назад к входу */}
          {currentStep === 'contact' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Вернуться к входу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
