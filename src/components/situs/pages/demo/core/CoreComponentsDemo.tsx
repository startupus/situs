import React, { useState } from 'react';
import { FiGrid, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ComponentDisplay from '../ComponentDisplay';

// Импорты Core Components
import { 
  ThemeAvatar1, ThemeAvatar2, ThemeAvatar3, ThemeAvatar4, ThemeAvatar5,
  ThemePrimaryBadge, ThemeSuccessBadge, ThemeDangerBadge, ThemeWarningBadge,
  ThemePrimaryButton, ThemeSecondaryButton, ThemeDarkButton,
  ThemeSuccessAlert1, ThemeInfoAlert1, ThemeWarningAlert1, ThemeAttentionAlert1,
  ThemeFormElementInput, ThemeFormElementSelect, ThemeFormElementTextarea,
  ThemeInputRange1, ThemeInputRange2, ThemeInputRange3,
  ThemeVerificationCodeInput1, ThemeVerificationCodeInput2
} from '@/components/ui';

interface CoreComponentGroup {
  id: string;
  title: string;
  description: string;
  components: Array<{
    id: string;
    title: string;
    component: React.ReactNode;
    filePath: string;
    description?: string;
  }>;
}

const CoreComponentsDemo: React.FC = () => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['avatars']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const componentGroups: CoreComponentGroup[] = [
    {
      id: 'avatars',
      title: 'Avatars',
      description: 'Компоненты аватаров пользователей',
      components: [
        {
          id: 'core-avatar-1',
          title: 'Avatar Variant 1',
          component: <ThemeAvatar1 />,
          filePath: 'src/components/ui/core/Avatar/Avatar1.tsx',
          description: 'Круглые аватары разных размеров'
        },
        {
          id: 'core-avatar-2',
          title: 'Avatar Variant 2',
          component: <ThemeAvatar2 />,
          filePath: 'src/components/ui/core/Avatar/Avatar2.tsx',
          description: 'Аватары без закругления'
        },
        {
          id: 'core-avatar-3',
          title: 'Avatar Variant 3',
          component: <ThemeAvatar3 />,
          filePath: 'src/components/ui/core/Avatar/Avatar3.tsx',
          description: 'Квадратные аватары'
        },
        {
          id: 'core-avatar-4',
          title: 'Avatar Variant 4',
          component: <ThemeAvatar4 />,
          filePath: 'src/components/ui/core/Avatar/Avatar4.tsx',
          description: 'Аватары с закругленными углами'
        },
        {
          id: 'core-avatar-5',
          title: 'Avatar Variant 5',
          component: <ThemeAvatar5 />,
          filePath: 'src/components/ui/core/Avatar/Avatar5.tsx',
          description: 'Аватары с индикатором статуса'
        }
      ]
    },
    {
      id: 'badges',
      title: 'Badges',
      description: 'Значки и метки',
      components: [
        {
          id: 'core-badge-primary',
          title: 'Primary Badge',
          component: <ThemePrimaryBadge>Primary</ThemePrimaryBadge>,
          filePath: 'src/components/ui/core/Badges/PrimaryBadge.tsx'
        },
        {
          id: 'core-badge-success',
          title: 'Success Badge',
          component: <ThemeSuccessBadge>Success</ThemeSuccessBadge>,
          filePath: 'src/components/ui/core/Badges/SuccessBadge.tsx'
        },
        {
          id: 'core-badge-danger',
          title: 'Danger Badge',
          component: <ThemeDangerBadge>Danger</ThemeDangerBadge>,
          filePath: 'src/components/ui/core/Badges/DangerBadge.tsx'
        },
        {
          id: 'core-badge-warning',
          title: 'Warning Badge',
          component: <ThemeWarningBadge>Warning</ThemeWarningBadge>,
          filePath: 'src/components/ui/core/Badges/WarningBadge.tsx'
        }
      ]
    },
    {
      id: 'buttons',
      title: 'Buttons',
      description: 'Кнопки различных стилей',
      components: [
        {
          id: 'core-button-primary',
          title: 'Primary Button',
          component: <ThemePrimaryButton>Primary Button</ThemePrimaryButton>,
          filePath: 'src/components/ui/core/Buttons/PrimaryButton.tsx'
        },
        {
          id: 'core-button-secondary',
          title: 'Secondary Button',
          component: <ThemeSecondaryButton>Secondary Button</ThemeSecondaryButton>,
          filePath: 'src/components/ui/core/Buttons/SecondaryButton.tsx'
        },
        {
          id: 'core-button-dark',
          title: 'Dark Button',
          component: <ThemeDarkButton>Dark Button</ThemeDarkButton>,
          filePath: 'src/components/ui/core/Buttons/DarkButton.tsx'
        }
      ]
    },
    {
      id: 'alerts',
      title: 'Alerts',
      description: 'Уведомления и алерты',
      components: [
        {
          id: 'core-alert-success',
          title: 'Success Alert',
          component: <ThemeSuccessAlert1 />,
          filePath: 'src/components/ui/core/Alerts/SuccessAlert1.tsx'
        },
        {
          id: 'core-alert-info',
          title: 'Info Alert',
          component: <ThemeInfoAlert1 />,
          filePath: 'src/components/ui/core/Alerts/InfoAlert1.tsx'
        },
        {
          id: 'core-alert-warning',
          title: 'Warning Alert',
          component: <ThemeWarningAlert1 />,
          filePath: 'src/components/ui/core/Alerts/WarningAlert1.tsx'
        },
        {
          id: 'core-alert-attention',
          title: 'Attention Alert',
          component: <ThemeAttentionAlert1 />,
          filePath: 'src/components/ui/core/Alerts/AttentionAlert1.tsx'
        }
      ]
    },
    {
      id: 'forms',
      title: 'Form Elements',
      description: 'Элементы форм',
      components: [
        {
          id: 'core-form-input',
          title: 'Form Input',
          component: <ThemeFormElementInput />,
          filePath: 'src/components/ui/core/FormElement/FormElementInput.tsx'
        },
        {
          id: 'core-form-select',
          title: 'Form Select',
          component: <ThemeFormElementSelect />,
          filePath: 'src/components/ui/core/FormElement/FormElementSelect.tsx'
        },
        {
          id: 'core-form-textarea',
          title: 'Form Textarea',
          component: <ThemeFormElementTextarea />,
          filePath: 'src/components/ui/core/FormElement/FormElementTextarea.tsx'
        }
      ]
    },
    {
      id: 'input-range',
      title: 'Input Range',
      description: 'Слайдеры диапазонов',
      components: [
        {
          id: 'core-input-range-1',
          title: 'Input Range 1',
          component: <ThemeInputRange1 />,
          filePath: 'src/components/ui/core/InputRange/InputRange1.tsx'
        },
        {
          id: 'core-input-range-2',
          title: 'Input Range 2',
          component: <ThemeInputRange2 />,
          filePath: 'src/components/ui/core/InputRange/InputRange2.tsx'
        },
        {
          id: 'core-input-range-3',
          title: 'Input Range 3',
          component: <ThemeInputRange3 />,
          filePath: 'src/components/ui/core/InputRange/InputRange3.tsx'
        }
      ]
    },
    {
      id: 'verification',
      title: 'Verification Inputs',
      description: 'Поля ввода кода верификации',
      components: [
        {
          id: 'core-verification-1',
          title: 'Verification Code Input 1',
          component: <ThemeVerificationCodeInput1 />,
          filePath: 'src/components/ui/core/VerificationCodeInputs/VerificationCodeInput1.tsx'
        },
        {
          id: 'core-verification-2',
          title: 'Verification Code Input 2',
          component: <ThemeVerificationCodeInput2 />,
          filePath: 'src/components/ui/core/VerificationCodeInputs/VerificationCodeInput2.tsx'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-4 flex items-center">
            <FiGrid className="mr-3" />
            Core Components
          </h1>
          <p className="text-body-color dark:text-dark-6">
            Базовые UI компоненты с поддержкой глобальной темы
          </p>
        </div>

        {/* Groups */}
        <div className="space-y-6">
          {componentGroups.map((group) => (
            <div key={group.id} className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
              {/* Group Header */}
              <div 
                className="p-4 border-b border-stroke dark:border-dark-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-dark dark:text-white flex items-center">
                      {expandedGroups.includes(group.id) ? (
                        <FiChevronDown className="mr-2" />
                      ) : (
                        <FiChevronRight className="mr-2" />
                      )}
                      {group.title}
                      <span className="ml-3 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                        {group.components.length} компонентов
                      </span>
                    </h2>
                    <p className="text-sm text-body-color dark:text-dark-6 mt-1">
                      {group.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Components */}
              {expandedGroups.includes(group.id) && (
                <div className="p-6">
                  <div className="space-y-6">
                    {group.components.map((comp) => (
                      <ComponentDisplay
                        key={comp.id}
                        id={comp.id}
                        title={comp.title}
                        component={comp.component}
                        category="Core"
                        subcategory={group.title}
                        filePath={comp.filePath}
                        description={comp.description}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreComponentsDemo;