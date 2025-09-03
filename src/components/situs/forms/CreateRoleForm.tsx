import React, { useState } from 'react';
import { FiShield, FiInfo } from 'react-icons/fi';
import { ThemeModal, ThemeButton, ThemeForm, ThemeInput, ThemeTextarea, ThemeSelect } from '../../ui';

interface CreateRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roleData: CreateRoleData) => void;
}

interface CreateRoleData {
  name: string;
  displayName: string;
  description: string;
  level: number;
  basedOnRole?: string;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateRoleData>({
    name: '',
    displayName: '',
    description: '',
    level: 50,
    basedOnRole: '',
  });

  const [errors, setErrors] = useState<Partial<CreateRoleData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseRoleOptions = [
    { value: '', label: 'Создать с нуля' },
    { value: 'BUSINESS', label: 'На основе роли "Бизнес"' },
    { value: 'AGENCY', label: 'На основе роли "Агентство"' },
    { value: 'STAFF', label: 'На основе роли "Сотрудник"' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateRoleData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Системное имя обязательно';
    } else if (!/^[A-Z_]+$/.test(formData.name)) {
      newErrors.name = 'Системное имя должно содержать только заглавные буквы и подчеркивания';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Отображаемое имя обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }

    if (formData.level < 1 || formData.level > 100) {
      newErrors.level = 'Уровень должен быть от 1 до 100';
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
      console.error('Ошибка создания роли:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      level: 50,
      basedOnRole: '',
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange =
    (field: keyof CreateRoleData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      let value: string | number = e.target.value;

      if (field === 'level') {
        value = parseInt(value) || 0;
      }

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Очищаем ошибку при изменении поля
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  // Автоматическое заполнение системного имени на основе отображаемого
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayName = e.target.value;
    const systemName = displayName
      .toUpperCase()
      .replace(/[^A-ZА-Я0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[А-Я]/g, (match) => {
        const rusToEng: { [key: string]: string } = {
          А: 'A',
          Б: 'B',
          В: 'V',
          Г: 'G',
          Д: 'D',
          Е: 'E',
          Ё: 'E',
          Ж: 'ZH',
          З: 'Z',
          И: 'I',
          Й: 'Y',
          К: 'K',
          Л: 'L',
          М: 'M',
          Н: 'N',
          О: 'O',
          П: 'P',
          Р: 'R',
          С: 'S',
          Т: 'T',
          У: 'U',
          Ф: 'F',
          Х: 'H',
          Ц: 'TS',
          Ч: 'CH',
          Ш: 'SH',
          Щ: 'SCH',
          Ъ: '',
          Ы: 'Y',
          Ь: '',
          Э: 'E',
          Ю: 'YU',
          Я: 'YA',
        };
        return rusToEng[match] || match;
      });

    setFormData((prev) => ({
      ...prev,
      displayName,
      name: systemName,
    }));

    // Очищаем ошибки
    if (errors.displayName || errors.name) {
      setErrors((prev) => ({
        ...prev,
        displayName: undefined,
        name: undefined,
      }));
    }
  };

  return (
    <ThemeModal isOpen={isOpen} onClose={handleClose} title="Создать новую роль" size="md">
      <ThemeForm onSubmit={handleSubmit}>
        <ThemeInput
          label="Отображаемое имя"
          placeholder="Например: Менеджер проектов"
          value={formData.displayName}
          onChange={handleDisplayNameChange}
          required
          error={errors.displayName}
        />

        <ThemeInput
          label="Системное имя"
          placeholder="MANAGER_PROJECTS"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
          error={errors.name}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Уровень доступа <span className="text-red-500">*</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={formData.level}
            onChange={handleInputChange('level')}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 (Минимальный)</span>
            <span className="font-medium">{formData.level}</span>
            <span>100 (Максимальный)</span>
          </div>
          {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
        </div>

        <ThemeTextarea
          label="Описание"
          placeholder="Опишите назначение и возможности этой роли"
          value={formData.description}
          onChange={handleInputChange('description')}
          rows={3}
          required
          error={errors.description}
        />

        <ThemeSelect
          label="Базовая роль"
          value={formData.basedOnRole}
          onChange={handleInputChange('basedOnRole')}
          options={baseRoleOptions}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Информация о создании роли:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Уровень доступа определяет иерархию ролей (чем выше, тем больше прав)</li>
                <li>Системное имя должно быть уникальным и содержать только заглавные буквы</li>
                <li>После создания можно настроить конкретные права доступа</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <ThemeButton variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </ThemeButton>
          <ThemeButton type="submit" disabled={isSubmitting} icon={<FiShield className="w-4 h-4" />}>
            {isSubmitting ? 'Создание...' : 'Создать роль'}
          </ThemeButton>
        </div>
      </ThemeForm>
    </ThemeModal>
  );
};

export default CreateRoleForm;
