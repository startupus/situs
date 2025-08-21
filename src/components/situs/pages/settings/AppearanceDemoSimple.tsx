import React, { useState } from 'react';
// Временно импортируем компоненты напрямую, пока не настроим экспорты
import ThemeAlert from '@/components/ui/ThemeAlert';
import ThemeAvatar from '@/components/ui/ThemeAvatar';
import ThemeBadge from '@/components/ui/ThemeBadge';
import ThemeBreadcrumb from '@/components/ui/ThemeBreadcrumb';
import ThemeCheckbox from '@/components/ui/ThemeCheckbox';
import ThemePagination from '@/components/ui/ThemePagination';
import ThemeProgress from '@/components/ui/ThemeProgress';
import ThemeSpinner from '@/components/ui/ThemeSpinner';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import ThemeTooltip from '@/components/ui/ThemeTooltip';
import ThemeActionButtons from '@/components/ui/ThemeActionButtons';
import ThemePermissionsModal from '@/components/ui/ThemePermissionsModal';

// Core Badge Components - новые интегрированные компоненты
import { 
  ThemeDangerBadge, 
  ThemePrimaryBadge, 
  ThemeSuccessBadge, 
  ThemeWarningBadge, 
  ThemeInfoBadge,
  ThemeDarkBadge,
  ThemeGrayBadge,
  ThemeLightBadge,
  ThemeSecondaryBadge
} from '@/components/ui';

// Core Button Components - новые интегрированные компоненты
import { 
  ThemePrimaryButton,
  ThemePrimaryButtonWithIcon,
  ThemePrimaryOutlineButton,
  ThemePrimaryRoundedButton,
  ThemeSecondaryButton,
  ThemeSecondaryButtonWithIcon,
  ThemeDarkButton,
  ThemeDarkButtonWithIcon,
  ThemeWhiteButton,
  ThemeWhiteButtonWithIcon
} from '@/components/ui';

// Core Alert Components - новые интегрированные компоненты
import { 
  ThemeSuccessAlert1,
  ThemeInfoAlert1,
  ThemeWarningAlert1,
  ThemeAttentionAlert1
} from '@/components/ui';

// Core Avatar Components - новые интегрированные компоненты
import { 
  ThemeAvatar1,
  ThemeAvatar2,
  ThemeAvatar3,
  ThemeAvatar4,
  ThemeAvatar5
} from '@/components/ui';

// Core Breadcrumb Components - новые интегрированные компоненты
import { 
  ThemeBreadcrumb1,
  ThemeBreadcrumb2,
  ThemeBreadcrumb3,
  ThemeBreadcrumb4,
  ThemeBreadcrumb5
} from '@/components/ui';

// Core Checkbox Components - новые интегрированные компоненты
import { 
  ThemeCheckbox1,
  ThemeCheckbox2,
  ThemeCheckbox3,
  ThemeCheckbox4,
  ThemeCheckbox5
} from '@/components/ui';

// Core Progress & Spinner Components - новые интегрированные компоненты
import { 
  ThemeProgressBar1,
  ThemeProgressBar2,
  ThemeProgressBar3,
  ThemeSpinner1,
  ThemeSpinner2,
  ThemeSpinner3,
  ThemeSpinner4
} from '@/components/ui';

// Core Components - Selects и Forms (временно отключено для диагностики)
// import { 
//   Select1, Select2, Select3,
//   FormElementInput, FormElementSelect, FormElementTextarea, FormElementFileUpload,
//   InputRange1, InputRange2, InputRange3,
//   VerificationCodeInput1, VerificationCodeInput2, VerificationCodeInput3, VerificationCodeInput4
// } from '@/components/ui';

// Временный импорт только Select1 для тестирования
import Select1 from '@/components/ui/core/Selects/Select1';

interface DemoSectionProps {
  title: string;
  children: React.ReactNode;
  id: string;
}

const DemoSection: React.FC<DemoSectionProps> = ({ title, children, id }) => (
  <section id={id} className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 scroll-mt-20">
    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
      {title}
    </h2>
    <div className="space-y-6">
      {children}
    </div>
  </section>
);

const ComponentDemo: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({ title, children, id }) => (
  <div id={id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 scroll-mt-20">
    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
    <div className="flex flex-wrap gap-4 items-center">
      {children}
    </div>
  </div>
);

const AppearanceDemoSimple: React.FC = () => {
  const [checkboxState, setCheckboxState] = useState(false);
  const [switchState, setSwitchState] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Настройки', href: '/settings' },
    { label: 'Внешний вид', current: true }
  ];

  // Демо данные для модального окна прав
  const demoRole = {
    id: 'demo-role',
    name: 'DEMO',
    displayName: 'Демо роль',
    level: 50,
    description: 'Демонстрационная роль для показа модального окна',
    permissions: ['users.view', 'projects.create'],
    isSystem: false
  };

  const demoPermissions = [
    {
      id: 'users.view',
      name: 'users.view',
      displayName: 'Просмотр пользователей',
      description: 'Доступ к списку пользователей',
      category: 'users',
      subcategory: 'view',
      isSystem: false
    },
    {
      id: 'users.manage',
      name: 'users.manage',
      displayName: 'Управление пользователями',
      description: 'Создание, редактирование и удаление пользователей',
      category: 'users',
      subcategory: 'manage',
      isSystem: false
    },
    {
      id: 'projects.create',
      name: 'projects.create',
      displayName: 'Создание проектов',
      description: 'Создание новых проектов',
      category: 'projects',
      subcategory: 'create',
      isSystem: false
    },
    {
      id: 'projects.manage',
      name: 'projects.manage',
      displayName: 'Управление проектами',
      description: 'Редактирование и удаление проектов',
      category: 'projects',
      subcategory: 'manage',
      isSystem: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Заголовок страницы */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Демонстрация компонентов глобальной темы
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Основные компоненты UI библиотеки проекта Situs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Theme Components - Наши кастомные компоненты */}
        <DemoSection title="🎨 Theme Components (Кастомные)" id="theme-components">
          <ComponentDemo title="Alerts" id="theme-alerts">
            <ThemeAlert type="success" title="Успех">Операция выполнена успешно</ThemeAlert>
            <ThemeAlert type="error" title="Ошибка">Произошла ошибка</ThemeAlert>
            <ThemeAlert type="warning" title="Предупреждение">Внимание!</ThemeAlert>
            <ThemeAlert type="info" title="Информация">Полезная информация</ThemeAlert>
          </ComponentDemo>

          <ComponentDemo title="Avatars" id="theme-avatars">
            <ThemeAvatar size="sm" fallback="AB" />
            <ThemeAvatar size="md" fallback="CD" status="online" showStatus />
            <ThemeAvatar size="lg" fallback="EF" status="away" showStatus />
          </ComponentDemo>

          <ComponentDemo title="Badges" id="theme-badges">
            <ThemeBadge variant="primary">Primary</ThemeBadge>
            <ThemeBadge variant="success">Success</ThemeBadge>
            <ThemeBadge variant="danger">Danger</ThemeBadge>
            <ThemeBadge variant="warning" outline>Warning</ThemeBadge>
            <ThemeBadge variant="info" rounded="full">Info</ThemeBadge>
          </ComponentDemo>

          <ComponentDemo title="Breadcrumb" id="theme-breadcrumb">
            <ThemeBreadcrumb items={breadcrumbItems} showHomeIcon />
          </ComponentDemo>

          <ComponentDemo title="Forms" id="theme-forms">
            <div className="w-full space-y-4">
              <div className="flex flex-wrap gap-4">
                <ThemeCheckbox 
                  checked={checkboxState} 
                  onChange={setCheckboxState}
                  label="Согласен с условиями"
                />
                <ThemeSwitch 
                  checked={switchState} 
                  onChange={setSwitchState}
                  label="Включить уведомления"
                />
              </div>
              
              <div className="w-full max-w-md">
                <Select1 />
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Progress" id="theme-progress">
            <ThemeProgress value={75} showPercentage />
            <ThemeSpinner size="md" variant="primary" />
            <ThemeSpinner type="dots" variant="success" />
          </ComponentDemo>

          <ComponentDemo title="Pagination" id="theme-pagination">
            <ThemePagination 
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
              showFirstLast
            />
          </ComponentDemo>
        </DemoSection>

        {/* Core Components */}
        <DemoSection title="🔧 Core Components" id="core-components">
          <ComponentDemo title="Core Badges" id="core-badges">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Danger, Warning, Success</h4>
                  <div className="flex flex-wrap gap-2">
                    <ThemeDangerBadge />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ThemeWarningBadge />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ThemeSuccessBadge />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Primary, Info, Secondary</h4>
                  <div className="flex flex-wrap gap-2">
                    <ThemePrimaryBadge />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ThemeInfoBadge />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ThemeSecondaryBadge />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Dark, Gray, Light</h4>
                  <div className="flex flex-wrap gap-2">
                    <ThemeDarkBadge />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ThemeGrayBadge />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ThemeLightBadge />
                  </div>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Core Buttons" id="core-buttons">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Primary Variants</h4>
                  <div className="space-y-2">
                    <div><ThemePrimaryButton /></div>
                    <div><ThemePrimaryButtonWithIcon /></div>
                    <div><ThemePrimaryOutlineButton /></div>
                    <div><ThemePrimaryRoundedButton /></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Secondary Variants</h4>
                  <div className="space-y-2">
                    <div><ThemeSecondaryButton /></div>
                    <div><ThemeSecondaryButtonWithIcon /></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Dark Variants</h4>
                  <div className="space-y-2">
                    <div><ThemeDarkButton /></div>
                    <div><ThemeDarkButtonWithIcon /></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">White Variants</h4>
                  <div className="space-y-2 p-2 bg-gray-800 rounded">
                    <div><ThemeWhiteButton /></div>
                    <div><ThemeWhiteButtonWithIcon /></div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Core Alerts" id="core-alerts">
            <div className="w-full space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Success Alert</h4>
                  <div className="scale-75 origin-left">
                    <ThemeSuccessAlert1 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Info Alert</h4>
                  <div className="scale-75 origin-left">
                    <ThemeInfoAlert1 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Warning Alert</h4>
                  <div className="scale-75 origin-left">
                    <ThemeWarningAlert1 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Attention Alert</h4>
                  <div className="scale-75 origin-left">
                    <ThemeAttentionAlert1 />
                  </div>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Core Avatars" id="core-avatars">
            <div className="w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avatar Variant 1</h4>
                  <div className="scale-75 origin-left">
                    <ThemeAvatar1 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avatar Variant 2</h4>
                  <div className="scale-75 origin-left">
                    <ThemeAvatar2 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avatar Variant 3</h4>
                  <div className="scale-75 origin-left">
                    <ThemeAvatar3 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avatar Variant 4</h4>
                  <div className="scale-75 origin-left">
                    <ThemeAvatar4 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avatar Variant 5</h4>
                  <div className="scale-75 origin-left">
                    <ThemeAvatar5 />
                  </div>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Core Breadcrumbs" id="core-breadcrumbs">
            <div className="w-full space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Breadcrumb Variant 1</h4>
                  <div className="scale-75 origin-left">
                    <ThemeBreadcrumb1 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Breadcrumb Variant 2</h4>
                  <div className="scale-75 origin-left">
                    <ThemeBreadcrumb2 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Breadcrumb Variant 3</h4>
                  <div className="scale-75 origin-left">
                    <ThemeBreadcrumb3 />
                  </div>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Core Checkboxes" id="core-checkboxes">
            <div className="w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Checkbox Variant 1</h4>
                  <ThemeCheckbox1 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Checkbox Variant 2</h4>
                  <ThemeCheckbox2 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Checkbox Variant 3</h4>
                  <ThemeCheckbox3 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Checkbox Variant 4</h4>
                  <ThemeCheckbox4 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Checkbox Variant 5</h4>
                  <ThemeCheckbox5 />
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Core Progress Bars" id="core-progress">
            <div className="w-full space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Progress Bar Variant 1</h4>
                  <div className="scale-75 origin-left">
                    <ThemeProgressBar1 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Progress Bar Variant 2</h4>
                  <div className="scale-75 origin-left">
                    <ThemeProgressBar2 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Progress Bar Variant 3</h4>
                  <div className="scale-75 origin-left">
                    <ThemeProgressBar3 />
                  </div>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Core Spinners" id="core-spinners">
            <div className="w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Spinner Variant 1</h4>
                  <div className="flex justify-center p-4">
                    <ThemeSpinner1 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Spinner Variant 2</h4>
                  <div className="flex justify-center p-4">
                    <ThemeSpinner2 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Spinner Variant 3</h4>
                  <div className="flex justify-center p-4">
                    <ThemeSpinner3 />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Spinner Variant 4</h4>
                  <div className="flex justify-center p-4">
                    <ThemeSpinner4 />
                  </div>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Selects" id="core-selects">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select 1</h4>
                  <Select1 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select 2</h4>
                  {/* <Select2 /> */}
                  <p className="text-gray-500">Select2 временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select 3</h4>
                  {/* <Select3 /> */}
                  <p className="text-gray-500">Select3 временно отключен</p>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Form Elements" id="core-form-elements">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Input Field</h4>
                  {/* <FormElementInput /> */}
                  <p className="text-gray-500">FormElementInput временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select Field</h4>
                  {/* <FormElementSelect /> */}
                  <p className="text-gray-500">FormElementSelect временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Textarea Field</h4>
                  {/* <FormElementTextarea /> */}
                  <p className="text-gray-500">FormElementTextarea временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">File Upload</h4>
                  {/* <FormElementFileUpload /> */}
                  <p className="text-gray-500">FormElementFileUpload временно отключен</p>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Input Range" id="core-input-range">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Range 1</h4>
                  {/* <InputRange1 /> */}
                  <p className="text-gray-500">InputRange1 временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Range 2</h4>
                  {/* <InputRange2 /> */}
                  <p className="text-gray-500">InputRange2 временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Range 3</h4>
                  {/* <InputRange3 /> */}
                  <p className="text-gray-500">InputRange3 временно отключен</p>
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Verification Code Inputs" id="core-verification">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 1</h4>
                  {/* <VerificationCodeInput1 /> */}
                  <p className="text-gray-500">VerificationCodeInput1 временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 2</h4>
                  {/* <VerificationCodeInput2 /> */}
                  <p className="text-gray-500">VerificationCodeInput2 временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 3</h4>
                  {/* <VerificationCodeInput3 /> */}
                  <p className="text-gray-500">VerificationCodeInput3 временно отключен</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 4</h4>
                  {/* <VerificationCodeInput4 /> */}
                  <p className="text-gray-500">VerificationCodeInput4 временно отключен</p>
                </div>
              </div>
            </div>
          </ComponentDemo>


        </DemoSection>

        {/* Dashboard Components */}
        <DemoSection title="📊 Dashboard Components" id="dashboard-components">
          <ComponentDemo title="Calendar" id="dashboard-calendar">
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              📅 Calendar компоненты доступны в полной библиотеке
            </div>
          </ComponentDemo>

          <ComponentDemo title="Charts" id="dashboard-charts">
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              📈 Chart компоненты требуют дополнительных библиотек (Chart.js, D3.js)
            </div>
          </ComponentDemo>

          <ComponentDemo title="Data Stats" id="dashboard-stats">
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              📊 Data Stats компоненты доступны в полной библиотеке
            </div>
          </ComponentDemo>

          <ComponentDemo title="Profile" id="dashboard-profile">
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              👤 Profile компоненты доступны в полной библиотеке
            </div>
          </ComponentDemo>

          <ComponentDemo title="Chat" id="dashboard-chat">
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              💬 Chat компоненты доступны в полной библиотеке
            </div>
          </ComponentDemo>

          <ComponentDemo title="Dropdown" id="dashboard-dropdown">
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              ⬇️ Dropdown компоненты доступны в полной библиотеке
            </div>
          </ComponentDemo>

          <ComponentDemo title="Navigation" id="dashboard-navigation">
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              🧭 Navigation компоненты доступны в полной библиотеке
            </div>
          </ComponentDemo>
        </DemoSection>

        {/* Кнопки действий */}
        <DemoSection title="🔧 Кнопки действий" id="action-buttons">
          <ComponentDemo title="ThemeActionButtons" id="theme-action-buttons">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-32">Обе кнопки:</span>
                <ThemeActionButtons
                  onEdit={() => alert('Редактировать')}
                  onDelete={() => alert('Удалить')}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-32">Только редактирование:</span>
                <ThemeActionButtons
                  onEdit={() => alert('Редактировать')}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-32">Только удаление:</span>
                <ThemeActionButtons
                  onDelete={() => alert('Удалить')}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-32">Кастомные подсказки:</span>
                <ThemeActionButtons
                  onEdit={() => alert('Изменить пользователя')}
                  onDelete={() => alert('Удалить пользователя')}
                  editTitle="Изменить пользователя"
                  deleteTitle="Удалить пользователя"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
              <strong>Использование:</strong> В таблицах пользователей и разделе меню для единообразия интерфейса.
              Использует корпоративные иконки FiEdit и FiTrash2.
            </div>
          </ComponentDemo>

          <ComponentDemo title="ThemePermissionsModal" id="theme-permissions-modal">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Модальное окно настройки прав доступа:</span>
                <button
                  onClick={() => setShowPermissionsModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Открыть модальное окно
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
              <strong>Использование:</strong> В разделе управления ролями и правами пользователей.
              Поддерживает поиск, фильтрацию по категориям и массовые операции.
            </div>
          </ComponentDemo>
        </DemoSection>

        {/* Информация о полной библиотеке */}
        <DemoSection title="📚 Полная библиотека компонентов" id="full-library">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              300+ компонентов доступно
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Theme Components (13)</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Action Buttons, Alerts, Avatars</li>
                  <li>• Badges, Breadcrumb, Checkbox</li>
                  <li>• Progress, Pagination, Permissions</li>
                  <li>• Spinner, Switch, Tooltip</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Core Components (89 активно из 200+)</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>✅ Badges (9 компонентов)</li>
                  <li>✅ Buttons (33 компонента)</li>
                  <li>✅ Alerts (13 компонентов)</li>
                  <li>✅ Avatars (9 компонентов)</li>
                  <li>✅ Breadcrumbs (12 компонентов)</li>
                  <li>✅ Checkboxes (5 компонентов)</li>
                  <li>✅ Progress (3 компонента)</li>
                  <li>✅ Spinners (4 компонента)</li>
                  <li>• Forms, Inputs, Selects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Dashboard Components (100+)</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Charts, Calendar</li>
                  <li>• Data Stats, Profile</li>
                  <li>• Chat, Shopping Cart</li>
                  <li>• Navigation, Settings</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Примечание:</strong> Некоторые компоненты требуют дополнительных зависимостей (например, jsvectormap для карт). 
                Выше показаны основные компоненты, готовые к использованию.
              </p>
            </div>
          </div>
        </DemoSection>
      </div>

      {/* Модальное окно настройки прав */}
      <ThemePermissionsModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        role={demoRole}
        permissions={demoPermissions}
        onSave={(roleId, permissions) => {
          console.log('Сохранение прав для роли:', roleId, permissions);
          setShowPermissionsModal(false);
          alert(`Права сохранены для роли ${roleId}. Выбрано прав: ${permissions.length}`);
        }}
      />
    </div>
  );
};

export default AppearanceDemoSimple;
