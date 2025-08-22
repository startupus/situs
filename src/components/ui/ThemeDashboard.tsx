// src/components/ui/ThemeDashboard.tsx
import React, { useState } from 'react';
import { FiCalendar, FiBarChart2, FiTrendingUp, FiUser, FiMessageCircle, FiChevronDown, FiMenu } from 'react-icons/fi';

// ThemeCalendar - простой календарь
export const ThemeCalendar: React.FC = () => {
  const [currentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === currentDate.getDate();
    days.push(
      <div
        key={day}
        className={`p-2 text-center cursor-pointer hover:bg-primary hover:text-white rounded transition-colors ${
          isToday ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {day}
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-gray-200 dark:border-dark-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
          <FiCalendar className="mr-2" />
          {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

// ThemeChart - базовая диаграмма без внешних библиотек
export const ThemeChart: React.FC = () => {
  const data = [65, 59, 80, 81, 56, 55, 40];
  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const maxValue = Math.max(...data);
  
  return (
    <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-gray-200 dark:border-dark-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
          <FiBarChart2 className="mr-2" />
          Статистика продаж
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">За неделю</span>
      </div>
      <div className="flex items-end justify-between h-32 space-x-2">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary-hover"
              style={{ height: `${(value / maxValue) * 100}%`, minHeight: '4px' }}
              title={`${labels[index]}: ${value}`}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{labels[index]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Мин: {Math.min(...data)}</span>
        <span>Макс: {Math.max(...data)}</span>
        <span>Ср: {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}</span>
      </div>
    </div>
  );
};

// ThemeDataStats - карточки статистики
export const ThemeDataStats: React.FC = () => {
  const stats = [
    { title: 'Всего пользователей', value: '2,345', change: '+12%', positive: true, icon: FiUser },
    { title: 'Продажи', value: '₽125,430', change: '+8.2%', positive: true, icon: FiTrendingUp },
    { title: 'Заказы', value: '1,234', change: '-2.1%', positive: false, icon: FiBarChart2 },
    { title: 'Конверсия', value: '3.2%', change: '+0.5%', positive: true, icon: FiTrendingUp }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-dark-2 rounded-lg p-6 border border-gray-200 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs прошлый месяц</span>
              </div>
            </div>
            <div className="p-3 bg-primary bg-opacity-10 rounded-full">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ThemeProfile - профиль пользователя
export const ThemeProfile: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-2 rounded-lg p-6 border border-gray-200 dark:border-dark-3">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <FiUser className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Иван Иванов</h3>
          <p className="text-gray-600 dark:text-gray-400">Администратор</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">ivan@example.com</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Статус:</span>
          <span className="text-green-600 dark:text-green-400 font-medium">Активен</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Последний вход:</span>
          <span className="text-gray-800 dark:text-white">Сегодня, 14:30</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Роль:</span>
          <span className="text-gray-800 dark:text-white">Администратор</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-3">
        <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
          Редактировать профиль
        </button>
      </div>
    </div>
  );
};

// ThemeChat - простой чат интерфейс
export const ThemeChat: React.FC = () => {
  const [messages] = useState([
    { id: 1, user: 'Анна Петрова', message: 'Привет! Как дела с проектом?', time: '14:30', isOwn: false },
    { id: 2, user: 'Вы', message: 'Привет! Все идет по плану, завтра будет готово', time: '14:32', isOwn: true },
    { id: 3, user: 'Анна Петрова', message: 'Отлично! Жду результатов', time: '14:33', isOwn: false }
  ]);
  
  return (
    <div className="bg-white dark:bg-dark-2 rounded-lg border border-gray-200 dark:border-dark-3 h-80 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-dark-3">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
          <FiMessageCircle className="mr-2" />
          Чат команды
        </h3>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.isOwn 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-dark-3 text-gray-800 dark:text-white'
            }`}>
              {!msg.isOwn && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{msg.user}</p>
              )}
              <p className="text-sm">{msg.message}</p>
              <p className={`text-xs mt-1 ${
                msg.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-dark-3">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Введите сообщение..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-3 rounded-lg bg-transparent text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

// ThemeDropdown - выпадающее меню
export const ThemeDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const items = [
    { label: 'Профиль', action: () => console.log('Профиль') },
    { label: 'Настройки', action: () => console.log('Настройки') },
    { label: 'Помощь', action: () => console.log('Помощь') },
    { label: 'Выйти', action: () => console.log('Выйти') }
  ];
  
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-2 border border-gray-300 dark:border-dark-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
      >
        <span className="text-gray-700 dark:text-gray-300">Действия</span>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-2 border border-gray-200 dark:border-dark-3 rounded-lg shadow-lg z-10">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-3 first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ThemeNavigation - навигационное меню
export const ThemeNavigation: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const navItems = [
    { id: 'dashboard', label: 'Панель управления', icon: FiBarChart2 },
    { id: 'users', label: 'Пользователи', icon: FiUser },
    { id: 'messages', label: 'Сообщения', icon: FiMessageCircle },
    { id: 'calendar', label: 'Календарь', icon: FiCalendar }
  ];
  
  return (
    <nav className="bg-white dark:bg-dark-2 border border-gray-200 dark:border-dark-3 rounded-lg p-2">
      <div className="flex items-center mb-4 p-2">
        <FiMenu className="w-6 h-6 text-primary mr-2" />
        <span className="font-semibold text-gray-800 dark:text-white">Навигация</span>
      </div>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeItem === item.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-3'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Экспорт всех Dashboard компонентов как единый объект для удобства
export const ThemeDashboard = {
  Calendar: ThemeCalendar,
  Chart: ThemeChart,
  DataStats: ThemeDataStats,
  Profile: ThemeProfile,
  Chat: ThemeChat,
  Dropdown: ThemeDropdown,
  Navigation: ThemeNavigation,
};

// Экспорт по умолчанию
export default ThemeDashboard;