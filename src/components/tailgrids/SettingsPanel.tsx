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
    <div className="w-80 bg-gray-100 border-l border-gray-200 overflow-y-auto">
      <div className="bg-gray-100">
        {/* Вкладки */}
        <div className="border-b border-gray-200 bg-gray-100">
          <nav className="flex">
            <div
              onClick={() => setActiveTab('page')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'page'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Page
            </div>
            <div
              onClick={() => setActiveTab('block')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'block'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Block
            </div>
            <div
              onClick={() => setActiveTab('item')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'item'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700'
                  : 'text-gray-600 hover:text-gray-700'
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
        <h3 className="text-lg font-semibold text-gray-800">Page Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Configure page properties and SEO</p>
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
          
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Published</span>
            </div>
            <span className="text-xs text-green-600">Live</span>
          </div>
        </div>
      </SettingsSection>

      {/* Schedule Publish */}
      <SettingsSection 
        title="Schedule Publish" 
        subtitle="GMT+0"
        icon={<FaClock size={16} />}
      >
        <div className="grid grid-cols-2 gap-3">
          <InputGroup
            label="DATE"
            type="date"
            value="2025-01-21"
          />
          <InputGroup
            label="TIME"
            type="time"
            value="00:00"
          />
        </div>
      </SettingsSection>

      {/* Page Structure */}
      <SettingsSection 
        title="Page Structure" 
        icon={<FaLock size={16} />}
      >
        <InputGroup
          label="STRUCTURE LOCKED?"
          type="select"
          value="Unlocked"
          options={['Unlocked', 'Locked']}
        />
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            Unlocked structure allows adding/removing blocks
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
            placeholder="/page-url"
          />
          
          <InputGroup
            label="PAGE TEMPLATE"
            type="select"
            value="Default"
            options={['Default', 'Landing Page', 'Blog Post']}
          />
          
          <InputGroup
            label="PAGE CATEGORY"
            type="text"
            value="Website"
            placeholder="Enter category"
          />
        </div>
      </SettingsSection>

      {/* SEO Settings */}
      <SettingsSection 
        title="SEO" 
        icon={<FaSearch size={16} />}
        collapsible
        actionIcon={<FaPlay size={12} />}
      >
        <div className="space-y-4">
          <InputGroup
            label="META TITLE"
            type="text"
            value="Home - Redaktus Editor"
            placeholder="Page title for search engines"
          />
          
          <InputGroup
            label="META DESCRIPTION"
            type="textarea"
            value="Create beautiful websites with Redaktus visual editor. No coding required."
            placeholder="Brief description for search results"
          />
          
          <InputGroup
            label="FOCUS KEYWORD"
            type="text"
            value="visual editor"
            placeholder="Primary keyword"
          />

          {/* SEO Score */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">SEO Score</span>
              <span className="text-sm font-bold text-green-600">85/100</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Change History */}
      <SettingsSection 
        title="Change History" 
        icon={<FaClipboard size={16} />}
        actionIcon={<FaPlay size={12} />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">Last saved</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
              View
            </button>
          </div>
          
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="text-sm text-gray-600">View full history</p>
          </button>
        </div>
      </SettingsSection>

      {/* Page Actions */}
      <div className="pt-6 border-t border-gray-200 space-y-3">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <FaSave size={14} />
          <span>Save Changes</span>
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <span>Duplicate</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors">
            <FaTrash size={12} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Вкладка Block - каталог блоков
const BlockTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const blocks = [
    { name: 'Hero Section', category: 'Layout', icon: <FaCube size={16} /> },
    { name: 'Text Block', category: 'Content', icon: <FaFile size={16} /> },
    { name: 'Image Gallery', category: 'Media', icon: <FaCube size={16} /> },
    { name: 'Contact Form', category: 'Forms', icon: <FaCube size={16} /> },
    { name: 'Testimonials', category: 'Content', icon: <FaCube size={16} /> },
    { name: 'Pricing Table', category: 'E-commerce', icon: <FaCube size={16} /> },
    { name: 'Navigation Menu', category: 'Navigation', icon: <FaCube size={16} /> },
    { name: 'Footer', category: 'Layout', icon: <FaCube size={16} /> },
  ];

  const filteredBlocks = blocks.filter(block =>
    block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Block Library</h3>
        <p className="text-sm text-gray-500 mt-1">Drag blocks to add to your page</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {['All', 'Layout', 'Content', 'Media', 'Forms', 'E-commerce', 'Navigation'].map(category => (
            <button
              key={category}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="space-y-3">
        {filteredBlocks.map((block, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify({
                type: 'block',
                name: block.name,
                category: block.category
              }));
            }}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-move transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-500">
                {block.icon}
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-800">{block.name}</h5>
                <p className="text-xs text-gray-500">{block.category}</p>
              </div>
              <div className="text-gray-400">
                <FaCube size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FaSearch size={24} className="mx-auto mb-2" />
          <p className="text-sm">No blocks found</p>
        </div>
      )}
    </div>
  );
};

// Вкладка Item - настройки выбранного элемента
const ItemTab: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Element Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Configure selected element properties</p>
      </div>

      {/* No Selection State */}
      <div className="text-center py-12 text-gray-500">
        <FaCogs size={48} className="mx-auto mb-4 text-gray-300" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">No Element Selected</h4>
        <p className="text-sm text-gray-500">
          Click on any element in the canvas to configure its properties
        </p>
      </div>

      {/* Placeholder for when element is selected */}
      {/* This would be populated when an element is actually selected */}
      <div className="hidden">
        <SettingsSection 
          title="Element Properties" 
          icon={<FaCog size={16} />}
        >
          <div className="space-y-4">
            <InputGroup
              label="ELEMENT TYPE"
              type="text"
              value="Text Block"
              disabled
            />
            
            <InputGroup
              label="ELEMENT ID"
              type="text"
              value="text-block-1"
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
              type="text"
              value="#ffffff"
              placeholder="#ffffff"
            />
            
            <InputGroup
              label="TEXT COLOR"
              type="text"
              value="#000000"
              placeholder="#000000"
            />
            
            <InputGroup
              label="PADDING"
              type="text"
              value="16px"
              placeholder="16px"
            />
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Advanced" 
          icon={<FaCog size={16} />}
          collapsible
        >
          <div className="space-y-4">
            <InputGroup
              label="CSS CLASSES"
              type="text"
              value="text-block custom-class"
              placeholder="Enter CSS classes"
            />
            
            <InputGroup
              label="CUSTOM ID"
              type="text"
              value=""
              placeholder="Enter custom ID"
            />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

// Компонент секции настроек
const SettingsSection: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  actionIcon?: React.ReactNode;
}> = ({ title, subtitle, icon, children, collapsible = false, actionIcon }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6">
      <div 
        className={`flex items-center justify-between mb-4 ${
          collapsible ? 'cursor-pointer' : ''
        }`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              {title}
            </h4>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {actionIcon && (
            <button className="p-1 text-gray-400 hover:text-gray-600">
              {actionIcon}
            </button>
          )}
          {collapsible && (
            <FaChevronDown 
              size={12} 
              className={`text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          )}
        </div>
      </div>
      
      {(!collapsible || isOpen) && (
        <div>{children}</div>
      )}
    </div>
  );
};

// Компонент группы ввода
const InputGroup: React.FC<{
  label: string;
  type: 'text' | 'select' | 'textarea' | 'date' | 'time';
  value?: string;
  placeholder?: string;
  options?: string[];
  disabled?: boolean;
}> = ({ label, type, value, placeholder, options = [], disabled }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
        {label}
      </label>
      
      {type === 'select' ? (
        <select 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          defaultValue={value}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default SettingsPanel; 