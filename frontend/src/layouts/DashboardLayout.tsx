import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CogIcon,
  BellIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Дашборд', href: '/', icon: HomeIcon },
    { name: 'Пользователи', href: '/users', icon: UsersIcon },
    { name: 'Транзакции', href: '/transactions', icon: CreditCardIcon },
    { name: 'Балансы', href: '/balances', icon: DocumentDuplicateIcon },
    { name: 'Валюты', href: '/currencies', icon: CurrencyDollarIcon },
    { name: 'События', href: '/events', icon: ClockIcon },
    { name: 'Плагины', href: '/plugins', icon: CogIcon },
    { name: 'Отчеты', href: '/reports', icon: ChartBarIcon },
    { name: 'Настройки', href: '/settings', icon: CogIcon },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderSidebar = () => (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center h-16 px-4 bg-gray-900">
        <img
          className="w-8 h-8"
          src="/logo.png"
          alt="Bilingus"
        />
        <span className="ml-2 text-xl font-bold text-white">Bilingus</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Администратор</p>
            <p className="text-xs text-gray-400">admin@bilingus.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Открыть меню</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-semibold text-gray-900">
                Управление биллингом
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full">
              <BellIcon className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full">
              <CogIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const renderMobileSidebar = () => (
    <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 flex z-40">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Закрыть меню</span>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {renderSidebar()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        {renderSidebar()}
      </div>
      
      {/* Mobile sidebar */}
      {renderMobileSidebar()}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderHeader()}
        
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;