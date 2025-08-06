import React, { useState } from 'react';
import { FaSearch, FaFile, FaCube, FaHome, FaCircle, FaChevronDown, FaPlus, FaFolder, FaBlog, FaSun, FaMoon, FaChevronUp } from 'react-icons/fa';
import { useInterfaceTheme } from '../../hooks/useInterfaceTheme';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../LanguageSwitcher';

interface VerticalNavbarProps {
  availableBricks?: any[]
}

const VerticalNavbar: React.FC<VerticalNavbarProps> = ({ availableBricks = [] }) => {
  const { theme: interfaceTheme, toggleTheme: toggleInterfaceTheme, resolvedTheme: interfaceResolvedTheme } = useInterfaceTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pages' | 'entities'>('pages');

  const handleToggleTheme = () => {
    console.log('🎨 VerticalNavbar: Interface theme toggle clicked!');
    toggleInterfaceTheme();
  };

  return (
    <section 
      className="redaktus-vertical-navbar h-full border-r w-40 flex flex-col transition-colors duration-200 bg-white dark:bg-dark border-stroke dark:border-dark-3"
      style={{
        backgroundColor: 'var(--interface-bg, var(--color-gray-50, #ffffff))',
        color: 'var(--interface-text, var(--color-body-color, #64748b))',
        borderColor: 'var(--interface-border, var(--color-stroke, #e5e7eb))'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Навигационные табы - в стиле SettingsPanel */}
        <div 
          className="flex-shrink-0"
          style={{ 
            backgroundColor: 'var(--interface-surface)',
            borderColor: 'var(--interface-border)'
          }}
        >
          <nav className="flex">
            <button
              onClick={() => setActiveTab('pages')}
              className={`border-b-2 py-2 px-3 text-sm font-medium font-inter flex-1 transition-all duration-200 ${
                activeTab === 'pages'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color hover:border-primary hover:text-primary'
              }`}
              style={{
                borderBottomColor: activeTab === 'pages' 
                  ? 'var(--interface-primary, var(--color-primary, #1E40AF))'
                  : 'transparent',
                color: activeTab === 'pages' 
                  ? 'var(--interface-primary, var(--color-primary, #1E40AF))'
                  : 'var(--interface-text, var(--color-body-color, #64748b))',
                backgroundColor: activeTab === 'pages' 
                  ? 'var(--interface-primary, var(--color-primary, #1E40AF))15'
                  : 'transparent'
              }}
            >
              {t('editor.panels.pages')}
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`border-b-2 py-2 px-3 text-sm font-medium font-inter flex-1 transition-all duration-200 ${
                activeTab === 'entities'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color hover:border-primary hover:text-primary'
              }`}
              style={{
                borderBottomColor: activeTab === 'entities' 
                  ? 'var(--interface-primary, var(--color-primary, #1E40AF))'
                  : 'transparent',
                color: activeTab === 'entities' 
                  ? 'var(--interface-primary, var(--color-primary, #1E40AF))'
                  : 'var(--interface-text, var(--color-body-color, #64748b))',
                backgroundColor: activeTab === 'entities' 
                  ? 'var(--interface-primary, var(--color-primary, #1E40AF))15'
                  : 'transparent'
              }}
            >
              {t('editor.panels.entities')}
            </button>
          </nav>
        </div>

        {/* Поиск */}
        <div 
          className="p-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--interface-border)' }}
        >
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('editor.buttons.searchPage')}
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              style={{
                backgroundColor: 'var(--interface-surface)',
                color: 'var(--interface-text)',
                borderColor: 'var(--interface-border)'
              }}
            />
            <FaSearch 
              className="absolute left-2.5 top-2.5" 
              size={14}
              style={{ color: 'var(--interface-text)' }}
            />
          </div>
        </div>

        {/* Навигация по секциям - с прокруткой */}
        <nav className="flex-1 overflow-y-auto min-h-0">
          <ul 
            className="p-4 space-y-2"
            style={{ borderColor: 'var(--interface-border)' }}
          >
            {/* PAGES Section */}
            <NavSection 
              title={t('editor.panels.pages')} 
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
              title={t('editor.panels.stories')} 
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
              title={t('editor.panels.entities')} 
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
          interfaceResolvedTheme === 'dark' ? '!border-gray-700' : '!border-gray-200'
        }`}>
          {/* Переключатели языка и темы в одну строку */}
          <div className="flex items-center justify-between space-x-2">
            {/* Переключатель языка интерфейса */}
            <LanguageSwitcher showLabel={false} size="sm" />
            
            {/* Переключатель темы интерфейса редактора */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎨 VerticalNavbar: Button clicked!');
                handleToggleTheme();
              }}
              className="p-2 rounded-md transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700"
              title={`Переключить тему интерфейса (текущая: ${interfaceResolvedTheme === 'dark' ? 'темная' : 'светлая'})`}
            >
              {interfaceResolvedTheme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>
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
    <div 
      className="border rounded-lg p-2 transition-colors"
      style={{ 
        borderColor: 'var(--interface-border)',
        backgroundColor: 'var(--interface-surface)'
      }}
    >
      <div
        onClick={() => submenu && setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
          submenu ? 'hover:bg-opacity-50' : ''
        }`}
        style={{
          backgroundColor: submenu ? 'var(--interface-bg)' : 'transparent'
        }}
      >
        <div className="flex items-center space-x-2">
          <span style={{ color: 'var(--interface-text)' }}>
            {icon}
          </span>
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--interface-text)' }}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {count && (
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--interface-border)',
                color: 'var(--interface-text)'
              }}
            >
              {count}
            </span>
          )}
          {submenu && (
            <span style={{ color: 'var(--interface-text)' }}>
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
    <li 
      className={`px-2 py-1 rounded text-sm transition-colors cursor-pointer`}
      style={{
        backgroundColor: active ? 'var(--interface-primary)' : 'transparent',
        color: active ? '#ffffff' : 'var(--interface-text)'
      }}
    >
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
      className="px-2 py-1 rounded text-sm transition-colors cursor-move"
      style={{
        color: 'var(--interface-text)',
        backgroundColor: 'transparent'
      }}
    >
      {name}
    </li>
  );
};

export default VerticalNavbar; 