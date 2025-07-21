import React, { useState } from 'react';
import { FaSearch, FaFile, FaCube, FaHome, FaCircle, FaChevronDown, FaPlus, FaFolder, FaBlog, FaSun, FaMoon, FaChevronUp } from 'react-icons/fa';

interface VerticalNavbarProps {
  availableBricks?: any[]
}

const VerticalNavbar: React.FC<VerticalNavbarProps> = ({ availableBricks = [] }) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'entities'>('pages');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [interfaceLanguage, setInterfaceLanguage] = useState<'ru' | 'en'>('ru');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Здесь можно добавить логику для переключения темы всего приложения
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const selectLanguage = (lang: 'ru' | 'en') => {
    setInterfaceLanguage(lang);
    setIsLanguageDropdownOpen(false);
    // Здесь можно добавить логику для смены языка интерфейса
  };

  const languages = [
    { code: 'ru', name: 'RUS', flag: '🇷🇺' },
    { code: 'en', name: 'ENG', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === interfaceLanguage);

  return (
    <section className="h-full bg-gray-100 border-r border-gray-200 w-40 flex flex-col">
      <div className="flex flex-col h-full">
        {/* Навигационные табы */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <nav className="flex">
            <div
              onClick={() => setActiveTab('pages')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'pages'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Pages
            </div>
            <div
              onClick={() => setActiveTab('entities')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'entities'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Entities
            </div>
          </nav>
        </div>

        {/* Поиск */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search page"
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
          </div>
        </div>

        {/* Навигация по секциям - с прокруткой */}
        <nav className="flex-1 overflow-y-auto bg-gray-100 min-h-0">
          <ul className="p-4 space-y-2">
            {/* PAGES Section */}
            <NavSection 
              title="Pages" 
              icon={<FaFile size={12} />} 
              count={4}
              submenu
              expanded
            >
              <PageItem name="About us" />
              <PageItem name="Contacts" />
              <PageItem name="Home" active />
              <PageItem name="Pricing" />
            </NavSection>

            {/* BLOG Section */}
            <NavSection 
              title="Blog Posts" 
              icon={<FaBlog size={12} />} 
              count={12}
              submenu
            />
          </ul>
        </nav>

        {/* Переключатели внизу панели */}
        <div className="p-2 border-t border-gray-200 bg-white flex-shrink-0">
          {/* Переключатель темы и язык в одной строке */}
          <div className="flex items-center justify-between">
            {/* Переключатель темы */}
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <FaMoon 
                size={12} 
                className={`ml-1 ${isDarkMode ? 'text-blue-600' : 'text-gray-400'}`} 
              />
            </div>

            {/* Выпадающий список языка интерфейса */}
            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center justify-center px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm">{currentLanguage?.flag}</span>
                <span className="text-gray-700 ml-1 text-xs">{currentLanguage?.name}</span>
                {isLanguageDropdownOpen ? (
                  <FaChevronUp size={8} className="text-gray-400 ml-1" />
                ) : (
                  <FaChevronDown size={8} className="text-gray-400 ml-1" />
                )}
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-full">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => selectLanguage(lang.code as 'ru' | 'en')}
                      className={`w-full flex items-center justify-center space-x-1 px-2 py-1 text-xs hover:bg-gray-50 transition-colors ${
                        interfaceLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Компонент для секции навигации
const NavSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  count?: number;
  submenu?: boolean;
  expanded?: boolean;
  children?: React.ReactNode;
}> = ({ title, icon, count, submenu = false, expanded = false, children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(expanded);

  return (
    <li className="relative">
      <div
        onClick={() => submenu && setDropdownOpen(!dropdownOpen)}
        className={`flex items-center justify-between py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors ${
          submenu ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
          {count !== undefined && (
            <span className="text-gray-400">{count}</span>
          )}
        </div>
        {submenu && (
          <div className="flex items-center space-x-2">
            <button className="p-1">
              <FaPlus size={10} className="text-gray-400 hover:text-gray-600" />
            </button>
            <FaChevronDown 
              size={10} 
              className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
            />
          </div>
        )}
      </div>
      
      {(submenu || expanded) && (
        <div className={`${dropdownOpen ? 'block' : 'hidden'} pb-2`}>
          <ul className="space-y-1 px-2">
            {children}
          </ul>
        </div>
      )}
    </li>
  );
};

// Компонент для элемента страницы
const PageItem: React.FC<{ name: string; active?: boolean }> = ({ 
  name, 
  active = false
}) => {
  return (
    <li>
      <div 
        className={`flex items-center space-x-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
          active 
            ? 'bg-blue-50 border-l-2 border-blue-500 text-blue-700' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        {active ? (
          <FaHome className="text-blue-500" size={14} />
        ) : (
          <FaFile className="text-gray-400" size={14} />
        )}
        <span className="text-sm font-medium">{name}</span>
        {active && (
          <FaCircle className="ml-auto text-red-500" size={6} />
        )}
      </div>
    </li>
  );
};

export default VerticalNavbar; 