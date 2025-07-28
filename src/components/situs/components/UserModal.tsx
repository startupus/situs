import React, { useState, useEffect } from 'react';
import { User, UserForm, UserRole, UserStatus } from '../../../types/users';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserForm) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserForm>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'client',
    status: 'active',
    phone: '',
    company: '',
    position: '',
    notes: '',
    permissions: [],
    password: '',
    sendWelcomeEmail: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // Редактирование существующего пользователя
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || '',
        notes: user.notes || '',
        permissions: user.permissions,
      });
    } else {
      // Создание нового пользователя
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'client',
        status: 'active',
        phone: '',
        company: '',
        position: '',
        notes: '',
        permissions: [],
        password: '',
        sendWelcomeEmail: true,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Фамилия обязательна';
    }

    if (!user && !formData.password) {
      newErrors.password = 'Пароль обязателен для нового пользователя';
    }

    if (formData.phone && !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона (+7 (999) 123-45-67)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof UserForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-dark-2">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            {user ? 'Редактировать пользователя' : 'Добавить пользователя'}
          </h2>
          <button
            onClick={onClose}
            className="text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Имя *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 text-dark focus:border-primary focus:outline-none dark:bg-dark-3 dark:text-white ${
                  errors.firstName ? 'border-red-500' : 'border-stroke dark:border-dark-3'
                }`}
                placeholder="Введите имя"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Фамилия *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 text-dark focus:border-primary focus:outline-none dark:bg-dark-3 dark:text-white ${
                  errors.lastName ? 'border-red-500' : 'border-stroke dark:border-dark-3'
                }`}
                placeholder="Введите фамилию"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full rounded-lg border px-4 py-2 text-dark focus:border-primary focus:outline-none dark:bg-dark-3 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-stroke dark:border-dark-3'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {!user && (
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Пароль *
              </label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 text-dark focus:border-primary focus:outline-none dark:bg-dark-3 dark:text-white ${
                  errors.password ? 'border-red-500' : 'border-stroke dark:border-dark-3'
                }`}
                placeholder="Введите пароль"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Телефон
            </label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full rounded-lg border px-4 py-2 text-dark focus:border-primary focus:outline-none dark:bg-dark-3 dark:text-white ${
                errors.phone ? 'border-red-500' : 'border-stroke dark:border-dark-3'
              }`}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Компания
              </label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                placeholder="Название компании"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Должность
              </label>
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                placeholder="Должность"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Роль
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                className="w-full rounded-lg border border-stroke px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              >
                <option value="client">Клиент</option>
                <option value="editor">Редактор</option>
                <option value="moderator">Модератор</option>
                <option value="admin">Администратор</option>
                <option value="company_admin">Админ компании</option>
                <option value="super_admin">Супер админ</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as UserStatus)}
                className="w-full rounded-lg border border-stroke px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              >
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
                <option value="suspended">Заблокирован</option>
                <option value="pending">Ожидает</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Заметки
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-stroke px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              placeholder="Дополнительные заметки о пользователе"
            />
          </div>

          {!user && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendWelcomeEmail"
                checked={formData.sendWelcomeEmail || false}
                onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked.toString())}
                className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
              />
              <label htmlFor="sendWelcomeEmail" className="ml-2 text-sm text-dark dark:text-white">
                Отправить приветственное письмо
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-6 py-2 text-dark transition-colors hover:bg-gray/5 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
            >
              {user ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal; 