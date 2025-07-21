import React from 'react';
import Card from '../components/ui/Card';

const Plugins: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Управление плагинами</h1>
        <p className="text-sm text-gray-500">
          Настройка и управление плагинами биллинговой системы
        </p>
      </div>
      
      <Card>
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">Страница в разработке</h2>
          <p className="text-gray-500">Управление плагинами будет доступно в следующей версии</p>
        </div>
      </Card>
    </div>
  );
};

export default Plugins;