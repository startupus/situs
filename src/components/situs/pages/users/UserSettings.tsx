import React from 'react';

interface UserSettings {
  registration: {
    enabled: boolean;
    requireEmailVerification: boolean;
    allowedDomains: string[];
    defaultRole: string;
    autoApprove: boolean;
  };
  authentication: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  notifications: {
    welcomeEmail: boolean;
    roleChangeNotification: boolean;
    securityAlerts: boolean;
  };
  privacy: {
    showUserList: boolean;
    allowProfileSearch: boolean;
    dataRetentionDays: number;
  };
}

interface UserSettingsProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

const UserSettingsComponent: React.FC<UserSettingsProps> = ({ settings, onUpdateSettings }) => {
  const updateRegistrationSetting = (key: keyof UserSettings['registration'], value: any) => {
    onUpdateSettings({
      ...settings,
      registration: { ...settings.registration, [key]: value },
    });
  };

  const updateAuthenticationSetting = (key: keyof UserSettings['authentication'], value: any) => {
    onUpdateSettings({
      ...settings,
      authentication: { ...settings.authentication, [key]: value },
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Настройки регистрации */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Регистрация пользователей</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.registration.enabled}
              onChange={(e) => updateRegistrationSetting('enabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Разрешить регистрацию новых пользователей</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.registration.requireEmailVerification}
              onChange={(e) => updateRegistrationSetting('requireEmailVerification', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Требовать подтверждение email</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Роль по умолчанию</label>
            <select
              value={settings.registration.defaultRole}
              onChange={(e) => updateRegistrationSetting('defaultRole', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="BUSINESS">Бизнес</option>
              <option value="AGENCY">Агентство</option>
            </select>
          </div>
        </div>
      </div>

      {/* Настройки безопасности */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Безопасность</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.authentication.requireTwoFactor}
              onChange={(e) => updateAuthenticationSetting('requireTwoFactor', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Обязательная двухфакторная аутентификация</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Время сессии (часы)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={settings.authentication.sessionTimeout}
              onChange={(e) => updateAuthenticationSetting('sessionTimeout', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Максимум попыток входа
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={settings.authentication.maxLoginAttempts}
              onChange={(e) => updateAuthenticationSetting('maxLoginAttempts', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsComponent;
