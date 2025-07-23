import React, { useState } from 'react';
import { FaSearch, FaFile, FaCube, FaHome, FaCircle, FaChevronDown, FaPlus, FaFolder, FaBlog, FaSun, FaMoon, FaChevronUp } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';

interface VerticalNavbarProps {
  availableBricks?: any[]
}

const VerticalNavbar: React.FC<VerticalNavbarProps> = ({ availableBricks = [] }) => {
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'pages' | 'entities'>('pages');
  const [interfaceLanguage, setInterfaceLanguage] = useState<'ru' | 'en'>('ru');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const handleToggleTheme = () => {
    console.log('🎨 VerticalNavbar: handleToggleTheme clicked!');
    toggleTheme();
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
    <section 
      className="redaktus-vertical-navbar h-full border-r w-40 flex flex-col transition-colors duration-200 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex flex-col h-full">
        {/* Навигационные табы */}
        <div className="border-b flex-shrink-0 border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <div
              onClick={() => setActiveTab('pages')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'pages'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                  : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Pages
            </div>
            <div
              onClick={() => setActiveTab('entities')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'entities'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                  : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Entities
            </div>
          </nav>
        </div>

        {/* Поиск */}
        <div className="p-4 border-b flex-shrink-0 border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search page"
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
          </div>
        </div>

        {/* Навигация по секциям - с прокруткой */}
        <nav className="flex-1 overflow-y-auto min-h-0">
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
            >
              <PageItem name="Getting Started" />
              <PageItem name="Advanced Features" />
              <PageItem name="Tutorials" />
            </NavSection>

            {/* ENTITIES Section */}
            <NavSection 
              title="Entities" 
              icon={<FaCube size={12} />} 
              count={8}
              submenu
            >
              <PageItem name="Users" />
              <PageItem name="Products" />
              <PageItem name="Categories" />
            </NavSection>
          </ul>
        </nav>

        {/* Нижняя панель с настройками */}
        <div className={`p-4 border-t flex-shrink-0 ${
          resolvedTheme === 'dark' ? '!border-gray-700' : '!border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            {/* Переключатель темы интерфейса редактора */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎨 VerticalNavbar: Button clicked!');
                handleToggleTheme();
              }}
              className="p-2 rounded-md transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700"
              title="Toggle editor theme"
            >
              {resolvedTheme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>

            {/* Язык интерфейса */}
            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700"
              >
                <span>{currentLanguage?.flag}</span>
                <span>{currentLanguage?.name}</span>
                <FaChevronDown size={10} />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-24 rounded-md shadow-lg border py-1 z-50 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => selectLanguage(lang.code as 'ru' | 'en')}
                      className={`w-full flex items-center space-x-2 px-3 py-1 text-xs transition-colors ${
                        interfaceLanguage === lang.code
                          ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
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

const NavSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  count?: number;
  submenu?: boolean;
  expanded?: boolean;
  children?: React.ReactNode;
}> = ({ title, icon, count, submenu = false, expanded = false, children }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div>
      <div
        onClick={() => submenu && setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
          submenu ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 dark:text-gray-400">
            {icon}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {count && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {count}
            </span>
          )}
          {submenu && (
            <span className="text-gray-500 dark:text-gray-400">
              {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </span>
          )}
        </div>
      </div>
      {submenu && isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const PageItem: React.FC<{ name: string; active?: boolean }> = ({ 
  name, 
  active = false
}) => {
  return (
    <li className={`px-2 py-1 rounded text-sm transition-colors cursor-pointer ${
      active 
        ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200' 
        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
    }`}>
      {name}
    </li>
  );
};

const DraggableBlock: React.FC<{ name: string; type: string }> = ({ 
  name, 
  type 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <li 
      draggable
      onDragStart={handleDragStart}
      className="px-2 py-1 rounded text-sm transition-colors cursor-move text-gray-600 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
    >
      {name}
    </li>
  );
};

export default VerticalNavbar; 