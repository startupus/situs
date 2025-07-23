import React, { useState } from "react";
import {
  FaChevronDown,
  FaPlay,
  FaClipboard,
  FaCog,
  FaEye,
  FaClock,
  FaLock,
  FaTag,
  FaSearch,
  FaSave,
  FaTrash,
  FaCube,
  FaFile,
  FaCogs
} from 'react-icons/fa'


interface SettingsPanelProps {
  currentPage?: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentPage = "Home" }) => {
  const [activeTab, setActiveTab] = useState<'page' | 'block' | 'item'>('page');

  return (
    <div 
      className="redaktus-settings-panel w-80 overflow-y-auto transition-colors duration-200 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 border-l"
    >
      <div className="bg-gray-100 dark:bg-gray-800">
        {/* Вкладки */}
        <div className="border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <nav className="flex">
            <div
              onClick={() => setActiveTab('page')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'page'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                  : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Page
            </div>
            <div
              onClick={() => setActiveTab('block')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'block'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                  : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Block
            </div>
            <div
              onClick={() => setActiveTab('item')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'item'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                  : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Item
            </div>
          </nav>
        </div>

        {/* Контент вкладок */}
        <div className="p-6">
          {activeTab === 'page' && <PageTab currentPage={currentPage} />}
          {activeTab === 'block' && <BlockTab />}
          {activeTab === 'item' && <ItemTab />}
        </div>
      </div>
    </div>
  );
};

// Вкладка Page - настройки страницы
const PageTab: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100">
          Page Settings
        </h3>
        <p className="text-sm mt-1 transition-colors duration-200 text-gray-500 dark:text-gray-400">
          Configure page properties and SEO
        </p>
      </div>

      {/* Status and Visibility */}
      <SettingsSection 
        title="Status and Visibility" 
        icon={<FaEye size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label="VISIBILITY"
            type="select"
            value="Published"
            options={['Published', 'Draft', 'Private']}
          />
          
          <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Published Live</span>
            </div>
            <FaPlay size={12} />
          </div>
        </div>
      </SettingsSection>

      {/* Schedule Publish */}
      <SettingsSection 
        title="Schedule Publish" 
        icon={<FaClock size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label="PUBLISH DATE"
            type="date"
            value="21.01.2025"
          />
          <InputGroup
            label="PUBLISH TIME"
            type="time"
            value="00:00"
          />
        </div>
      </SettingsSection>

      {/* Page Structure */}
      <SettingsSection 
        title="Page Structure" 
        icon={<FaCogs size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label="STRUCTURE LOCKED?"
            type="select"
            value="Unlocked"
            options={['Unlocked', 'Locked']}
          />
          <p className="text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">
            When locked, the page structure cannot be modified by content editors
          </p>
        </div>
      </SettingsSection>

      {/* Page Attributes */}
      <SettingsSection 
        title="Page Attributes" 
        icon={<FaTag size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label="PAGE SLUG"
            type="text"
            value="/home"
            placeholder="Enter page slug"
          />
        </div>
      </SettingsSection>
    </div>
  );
};

// Вкладка Block - настройки блока
const BlockTab: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100">
          Block Settings
        </h3>
        <p className="text-sm mt-1 transition-colors duration-200 text-gray-500 dark:text-gray-400">
          Configure block properties and styling
        </p>
      </div>

      <SettingsSection 
        title="Block Properties" 
        icon={<FaCube size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label="BLOCK TYPE"
            type="text"
            value="Hero Section"
            disabled
          />
          <InputGroup
            label="BLOCK ID"
            type="text"
            value="hero-001"
            disabled
          />
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Styling" 
        icon={<FaCog size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label="BACKGROUND COLOR"
            type="select"
            value="Default"
            options={['Default', 'Light', 'Dark', 'Custom']}
          />
          <InputGroup
            label="TEXT ALIGNMENT"
            type="select"
            value="Center"
            options={['Left', 'Center', 'Right']}
          />
        </div>
      </SettingsSection>
    </div>
  );
};

// Вкладка Item - настройки элемента
const ItemTab: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100">
          Item Settings
        </h3>
        <p className="text-sm mt-1 transition-colors duration-200 text-gray-500 dark:text-gray-400">
          Configure individual item properties
        </p>
      </div>

      <SettingsSection 
        title="Content" 
        icon={<FaFile size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label="TEXT CONTENT"
            type="textarea"
            value="Sample text content"
            placeholder="Enter text content"
          />
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Actions" 
        icon={<FaCog size={16} />}
        collapsible
      >
        <div className="space-y-3">
                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
            <FaSave size={14} />
            <span>Save Changes</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
            <FaTrash size={14} />
            <span>Delete Item</span>
          </button>
        </div>
      </SettingsSection>
    </div>
  );
};

const SettingsSection: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  actionIcon?: React.ReactNode;
}> = ({ title, subtitle, icon, children, collapsible = false, actionIcon }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6 border rounded-lg transition-colors duration-200 border-gray-200 dark:border-gray-700">
      <div
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
          collapsible ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <span className="text-gray-500 dark:text-gray-400">
              {icon}
            </span>
          )}
          <div>
            <h4 className="font-medium transition-colors duration-200 text-gray-800 dark:text-gray-100">
              {title}
            </h4>
            {subtitle && (
              <p className="text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {actionIcon && (
            <span className="text-gray-500 dark:text-gray-400">
              {actionIcon}
            </span>
          )}
          {collapsible && (
            <FaChevronDown 
              size={12} 
              className={`transition-transform duration-200 text-gray-500 dark:text-gray-400 ${isExpanded ? 'rotate-180' : ''}`} 
            />
          )}
        </div>
      </div>
      {(!collapsible || isExpanded) && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

const InputGroup: React.FC<{
  label: string;
  type: 'text' | 'select' | 'textarea' | 'date' | 'time';
  value?: string;
  placeholder?: string;
  options?: string[];
  disabled?: boolean;
}> = ({ label, type, value, placeholder, options = [], disabled }) => {
  // Добавляем пустые обработчики для устранения React предупреждений
  const handleChange = () => {};
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
            disabled 
              ? 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
              : 'border-gray-300 text-gray-900 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-colors resize-none ${
            disabled 
              ? 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
              : 'border-gray-300 text-gray-900 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
            disabled 
              ? 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
              : 'border-gray-300 text-gray-900 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
        />
      )}
    </div>
  );
};

export default SettingsPanel; 