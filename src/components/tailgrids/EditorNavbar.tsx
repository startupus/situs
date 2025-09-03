import React, { useState } from 'react';
import {
  FaCube,
  FaExternalLinkAlt,
  FaChevronDown,
  FaUser,
  FaCalendarDay,
  FaSave,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage';

interface EditorNavbarProps {
  currentPage?: string;
  onSave?: () => void;
  autosaveEnabled?: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  saveError?: string | null;
}

const EditorNavbar: React.FC<EditorNavbarProps> = ({
  currentPage = 'Home',
  onSave,
  autosaveEnabled = true,
  isSaving = false,
  lastSaved = null,
  saveError = null,
}) => {
  const { t } = useLanguage();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'media' | 'playground'>('editor');

  console.log('🎯 EditorNavbar rendering - should be visible at top');

  return (
    <header
      className="redaktus-editor-navbar flex w-full items-center border-b h-14 shadow-sm z-50 relative transition-colors duration-200 bg-white dark:bg-dark border-stroke dark:border-dark-3"
      style={{
        backgroundColor: 'var(--interface-bg, var(--color-gray-50, #ffffff))',
        borderColor: 'var(--interface-border, var(--color-stroke, #e5e7eb))',
        color: 'var(--interface-text, var(--color-body-color, #1f2937))',
      }}
    >
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <FaCube
                className="text-xl transition-colors duration-200"
                style={{ color: 'var(--interface-primary, var(--color-primary, #1E40AF))' }}
              />
              <span
                className="text-lg font-bold tracking-wide transition-colors duration-200 font-inter"
                style={{ color: 'var(--interface-text, var(--color-body-color, #1f2937))' }}
              >
                REDAKTUS
              </span>
            </div>
          </div>

          {/* Center Section - Navigation Tabs */}
          <div className="flex items-center space-x-8">
            <NavTab active={activeTab === 'editor'} onClick={() => setActiveTab('editor')}>
              {t('editor.tabs.editor')}
            </NavTab>
            <NavTab active={activeTab === 'media'} onClick={() => setActiveTab('media')}>
              {t('editor.tabs.media')}
            </NavTab>
            <NavTab active={activeTab === 'playground'} onClick={() => setActiveTab('playground')}>
              {t('editor.tabs.playground')}
            </NavTab>
          </div>

          {/* Right Section - Controls & User */}
          <div className="flex items-center space-x-4">
            {/* Текущий заголовок страницы по центру в навигации */}
            <div className="hidden sm:block text-sm font-semibold opacity-80">{currentPage}</div>
            {/* Save Status */}
            <div className="flex items-center space-x-2">
              {isSaving && (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span className="text-sm">{t('editor.navbar.saving')}</span>
                </div>
              )}

              {saveError && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <FaExclamationTriangle size={14} />
                  <span className="text-sm">{t('editor.navbar.saveError')}</span>
                </div>
              )}

              {lastSaved && !isSaving && !saveError && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <FaCheck size={14} />
                  <span className="text-sm">{t('notifications.saved', { time: lastSaved.toLocaleTimeString() })}</span>
                </div>
              )}
            </div>

            {/* Manual Save Button */}
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`inline-flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none transition-all duration-200 font-inter ${
                isSaving
                  ? 'border-stroke text-body-color/50 cursor-not-allowed dark:border-dark-3 dark:text-dark-6/50'
                  : 'border-stroke text-body-color hover:bg-primary hover:text-white hover:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:bg-primary dark:hover:text-white'
              }`}
              style={{
                borderColor: isSaving
                  ? 'var(--interface-border, var(--color-stroke, #e5e7eb))'
                  : 'var(--interface-border, var(--color-stroke, #e5e7eb))',
                color: isSaving
                  ? 'var(--interface-text-disabled, var(--color-body-color, #64748b))50'
                  : 'var(--interface-text, var(--color-body-color, #64748b))',
              }}
            >
              <FaSave size={12} />
              <span>{t('editor.navbar.save').toUpperCase()}</span>
            </button>

            {/* View Site Button */}
            <button
              className="inline-flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none transition-all duration-200 font-inter border-stroke text-body-color hover:bg-primary hover:text-white hover:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:bg-primary dark:hover:text-white"
              style={{
                borderColor: 'var(--interface-border, var(--color-stroke, #e5e7eb))',
                color: 'var(--interface-text, var(--color-body-color, #64748b))',
              }}
            >
              <FaExternalLinkAlt size={12} />
              <span>{t('editor.navbar.viewSite').toUpperCase()}</span>
            </button>

            {/* Calendar/Date */}
            <button className="p-2 rounded-md transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700">
              <FaCalendarDay size={16} />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-md transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">RU</span>
                </div>
                <FaChevronDown size={12} />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border py-2 z-50 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <DropdownItem icon={<FaUser size={14} />}>Profile</DropdownItem>
                  <div className="border-t my-2 border-gray-100 dark:border-gray-700"></div>
                  <DropdownItem>Sign out</DropdownItem>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavTab: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 py-2 px-4 text-sm font-medium transition-all duration-200 font-inter ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-body-color hover:border-primary hover:text-primary'
      }`}
      style={{
        borderBottomColor: active ? 'var(--interface-primary, var(--color-primary, #1E40AF))' : 'transparent',
        color: active
          ? 'var(--interface-primary, var(--color-primary, #1E40AF))'
          : 'var(--interface-text, var(--color-body-color, #64748b))',
        backgroundColor: active ? 'var(--interface-primary, var(--color-primary, #1E40AF))15' : 'transparent',
      }}
    >
      {children}
    </button>
  );
};

const DropdownItem: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}> = ({ children, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700"
    >
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default EditorNavbar;
