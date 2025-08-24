import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { ThemeButton, ThemeAlert, ThemeSpinner } from '../../ui';
import { InvitationsAPI, Invitation } from '../../../api/services/invitations.api';

interface AcceptInvitationForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
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

  const [form, setForm] = useState<AcceptInvitationForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
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

    if (!form.password) {
      errors.password = 'Пароль обязателен';
    } else if (form.password.length < 8) {
      errors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
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

    } catch (err: any) {
      setError(err.message || 'Ошибка при принятии приглашения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AcceptInvitationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
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

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (только для чтения) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>
            </div>

            {/* Имя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Полное имя *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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

            {/* Пароль */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пароль *
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.password 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Минимум 8 символов"
                />
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
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  Создание аккаунта...
                </>
              ) : (
                'Создать аккаунт'
              )}
            </ThemeButton>
          </form>

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
