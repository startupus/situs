import React, { useState } from 'react';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import DemoNavigation from './DemoNavigation';
import CoreComponentsDemo from './core/CoreComponentsDemo';
import DashboardComponentsDemo from './dashboard/DashboardComponentsDemo';
import ApplicationComponentsDemo from './application/ApplicationComponentsDemo';

const DemoController: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToNavigation = () => {
    setSelectedCategory(null);
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'core':
        return <CoreComponentsDemo />;
      case 'dashboard':
        return <DashboardComponentsDemo />;
      case 'application':
        return <ApplicationComponentsDemo />;
      default:
        return (
          <DemoNavigation 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory || undefined}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      {selectedCategory && (
        <div className="bg-white dark:bg-dark-2 border-b border-stroke dark:border-dark-3 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToNavigation}
                  className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <FiArrowLeft className="mr-2" />
                  Назад к категориям
                </button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <FiHome className="text-gray-500" />
                  <span className="text-gray-500">/</span>
                  <span className="text-dark dark:text-white font-medium">
                    {selectedCategory === 'core' && 'Core Components'}
                    {selectedCategory === 'dashboard' && 'Dashboard Components'}
                    {selectedCategory === 'application' && 'Application Components'}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Демо компонентов Situs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default DemoController;