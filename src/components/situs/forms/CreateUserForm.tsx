import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import { ThemeModal, ThemeButton, ThemeForm, ThemeInput, ThemeSelect } from '../../ui';

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => void;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isActive: boolean;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BUSINESS',
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<CreateUserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions = [
    { value: 'BUSINESS', label: 'Бизнес' },
    { value: 'AGENCY', label: 'Агентство' },
    { value: 'STAFF', label: 'Сотрудник' },
    { value: 'SUPER_ADMIN', label: 'Супер Админ' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'BUSINESS',
      isActive: true,
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange =
    (field: keyof CreateUserData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Очищаем ошибку при изменении поля
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  return (
    <ThemeModal isOpen={isOpen} onClose={handleClose} title="Создать нового пользователя" size="md">
      <ThemeForm onSubmit={handleSubmit}>
        <ThemeInput
          label="Полное имя"
          placeholder="Введите полное имя"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
          error={errors.name}
        />

        <ThemeInput
          label="Email"
          type="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
          error={errors.email}
        />

        <ThemeInput
          label="Пароль"
          type="password"
          placeholder="Минимум 8 символов"
          value={formData.password}
          onChange={handleInputChange('password')}
          required
          error={errors.password}
        />

        <ThemeInput
          label="Подтвердите пароль"
          type="password"
          placeholder="Повторите пароль"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          required
          error={errors.confirmPassword}
        />

        <ThemeSelect
          label="Роль"
          value={formData.role}
          onChange={handleInputChange('role')}
          options={roleOptions}
          required
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Активировать пользователя сразу
          </label>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <ThemeButton variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </ThemeButton>
          <ThemeButton type="submit" disabled={isSubmitting} icon={<FiUser className="w-4 h-4" />}>
            {isSubmitting ? 'Создание...' : 'Создать пользователя'}
          </ThemeButton>
        </div>
      </ThemeForm>
    </ThemeModal>
  );
};

export default CreateUserForm;
