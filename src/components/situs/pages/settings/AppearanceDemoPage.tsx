import React, { useState } from 'react';
import AppearanceDemoSimple from './AppearanceDemoSimple';
import AppearanceDemoSidebar from './AppearanceDemoSidebar';

const AppearanceDemoPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('theme-components');

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Боковое меню компонентов */}
      <AppearanceDemoSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Основной контент */}
      <div className="flex-1 overflow-auto">
        <AppearanceDemoSimple />
      </div>
    </div>
  );
};

export default AppearanceDemoPage;
