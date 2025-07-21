import React from 'react';
import Card from '../components/ui/Card';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки системы</h1>
        <p className="text-sm text-gray-500">
          Конфигурация и настройки биллинговой системы
        </p>
      </div>
      
      <Card>
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">Страница в разработке</h2>
          <p className="text-gray-500">Настройки системы будут доступны в следующей версии</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;