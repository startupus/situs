import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhone } from 'react-icons/fa';
import CodeLogin from '../components/auth/CodeLogin';

interface LoginPageProps {
  onLogin?: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Проверяем, нужно ли показать вход по коду
  const loginMethod = searchParams.get('method');
  const showCodeLogin = loginMethod === 'code';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginData = contactMethod === 'email' ? { email, password } : { phone, password }; // TODO: Добавить поддержку входа по телефону в API

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      const { user, token } = await response.json();

      // Сохраняем токен
      localStorage.setItem('auth-token', token);

      // Уведомляем родительский компонент
      onLogin?.(user);

      // Переходим к списку проектов
      navigate('/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  // Если выбран вход по коду, показываем CodeLogin
  if (showCodeLogin) {
    return <CodeLogin onLogin={onLogin} onBack={() => navigate('/login')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Situs Platform</h1>
          <p className="text-gray-600 dark:text-gray-400">Войдите в свою учетную запись</p>
        </div>

        {/* Форма входа */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Заголовок */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Вход по паролю</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Введите {contactMethod === 'email' ? 'email' : 'телефон'} и пароль
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="+7 (900) 123-45-67"
                  required
                />
              </div>
            )}

            {/* Поле пароля */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                placeholder="Введите пароль"
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

            {/* Ошибка */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            {/* Дополнительные ссылки */}
            <div className="text-center space-y-3">
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Забыли пароль?
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => (window.location.href = '/login?method=code')}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Войти по коду
                </button>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Нет аккаунта?</p>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Создать аккаунт
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
