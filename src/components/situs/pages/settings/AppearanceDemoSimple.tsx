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

// Core Components - Selects и Forms
import { 
  Select1, Select2, Select3,
  FormElementInput, FormElementSelect, FormElementTextarea, FormElementFileUpload,
  InputRange1, InputRange2, InputRange3,
  VerificationCodeInput1, VerificationCodeInput2, VerificationCodeInput3, VerificationCodeInput4
} from '@/components/ui';

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

  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Настройки', href: '/settings' },
    { label: 'Внешний вид', current: true }
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
          <ComponentDemo title="Selects" id="core-selects">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select 1</h4>
                  <Select1 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select 2</h4>
                  <Select2 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select 3</h4>
                  <Select3 />
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Form Elements" id="core-form-elements">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Input Field</h4>
                  <FormElementInput />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select Field</h4>
                  <FormElementSelect />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Textarea Field</h4>
                  <FormElementTextarea />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">File Upload</h4>
                  <FormElementFileUpload />
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Input Range" id="core-input-range">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Range 1</h4>
                  <InputRange1 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Range 2</h4>
                  <InputRange2 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Range 3</h4>
                  <InputRange3 />
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Verification Code Inputs" id="core-verification">
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 1</h4>
                  <VerificationCodeInput1 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 2</h4>
                  <VerificationCodeInput2 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 3</h4>
                  <VerificationCodeInput3 />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Code Input 4</h4>
                  <VerificationCodeInput4 />
                </div>
              </div>
            </div>
          </ComponentDemo>

          <ComponentDemo title="Buttons" id="core-buttons">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Primary Button</button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Secondary Button</button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Dark Button</button>
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

        {/* Информация о полной библиотеке */}
        <DemoSection title="📚 Полная библиотека компонентов" id="full-library">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              300+ компонентов доступно
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Theme Components (11)</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Alerts, Avatars, Badges</li>
                  <li>• Breadcrumb, Checkbox</li>
                  <li>• Progress, Pagination</li>
                  <li>• Spinner, Switch, Tooltip</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Core Components (200+)</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Buttons (33 варианта)</li>
                  <li>• Forms, Inputs, Selects</li>
                  <li>• Navigation, Tabs, Menus</li>
                  <li>• Data Display, Lists</li>
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
    </div>
  );
};

export default AppearanceDemoSimple;
