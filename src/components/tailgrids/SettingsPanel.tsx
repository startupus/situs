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
  FaCogs,
  FaPlus,
  FaFolder,
  FaStar,
  FaImage,
  FaHeading,
  FaParagraph,
  FaList,
  FaTable,
  FaVideo,
  FaMap,
  FaChartBar,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaComments
} from 'react-icons/fa'


interface SettingsPanelProps {
  currentPage?: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentPage = "Home" }) => {
  const [activeTab, setActiveTab] = useState<'page' | 'item' | 'blocks'>('page');

  return (
    <div 
      className="redaktus-settings-panel w-80 flex-shrink-0 overflow-y-auto transition-colors duration-200 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 border-l h-full"
    >
      <div className="bg-gray-100 dark:bg-gray-800 h-full flex flex-col">
        {/* Вкладки */}
        <div className="border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 flex-shrink-0">
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
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${
                activeTab === 'blocks'
                  ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                  : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Blocks
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
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'page' && <PageTab currentPage={currentPage} />}
          {activeTab === 'blocks' && <BlocksTab />}
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

// Новая вкладка Blocks - каталог блоков
const BlocksTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Категории блоков - только TailGrids
  const blockCategories = [
    {
      id: 'all',
      name: 'All Blocks',
      icon: <FaCube size={16} />,
      count: 3
    },
    {
      id: 'hero',
      name: 'Hero Sections',
      icon: <FaStar size={16} />,
      count: 1
    },
    {
      id: 'content',
      name: 'Content Blocks',
      icon: <FaParagraph size={16} />,
      count: 2
    }
  ];

  // Блоки с их схемами - только TailGrids
  const blocks = [
    // Hero Sections
    {
      id: 'hero-block',
      name: 'Hero Block (TailGrids)',
      description: 'Professional hero section with TailGrids design',
      category: 'hero',
      icon: <FaStar size={16} />,
      preview: '/preview-images/hero-block.png',
      schema: {
        title: { type: 'string', default: 'Kickstart Startup Website with TailGrids' },
        subtitle: { type: 'string', default: 'With TailGrids, business and students thrive together.' },
        primaryButtonText: { type: 'string', default: 'Get Started' },
        secondaryButtonText: { type: 'string', default: 'Download App' },
        heroImage: { type: 'string', default: 'https://cdn.tailgrids.com/1.0/assets/images/hero/hero-image-01.png' },
        clientLogos: { type: 'array', default: [] }
      }
    },
    {
      id: 'testimonial-block',
      name: 'Testimonial Block (TailGrids)',
      description: 'Customer testimonials with ratings',
      category: 'content',
      icon: <FaComments size={16} />,
      preview: '/preview-images/testimonial-block.png',
      schema: {
        testimonials: { type: 'array', default: [
          {
            image: 'https://cdn.tailgrids.com/2.0/image/marketing/images/testimonials/testimonial-01/image-01.jpg',
            name: 'Larry Diamond',
            position: 'Chief Executive Officer',
            details: 'Velit est sit voluptas eum sapiente omnis! Porro, impedit minus quam reprehenderit tempore sint quaerat id!'
          }
        ] }
      }
    },
    {
      id: 'services-block',
      name: 'Services Block (TailGrids)',
      description: 'Services showcase with icons',
      category: 'content',
      icon: <FaCogs size={16} />,
      preview: '/preview-images/services-block.png',
      schema: {
        sectionTitle: { type: 'string', default: 'What We Offer' },
        sectionSubtitle: { type: 'string', default: 'Our Services' },
        sectionDescription: { type: 'string', default: 'There are many variations of passages of Lorem Ipsum available.' },
        services: { type: 'array', default: [
          {
            title: 'Refreshing Design',
            details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
            icon: 'design'
          },
          {
            title: 'Based on Tailwind CSS',
            details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
            icon: 'tailwind'
          },
          {
            title: '100+ Components',
            details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
            icon: 'components'
          },
          {
            title: 'Speed Optimized',
            details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
            icon: 'speed'
          },
          {
            title: 'Fully Customizable',
            details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
            icon: 'customizable'
          },
          {
            title: 'Regular Updates',
            details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
            icon: 'updates'
          }
        ] }
      }
    }
  ];

  // Фильтрация блоков
  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, block: any) => {
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100">
          Block Library
        </h3>
        <p className="text-sm mt-1 transition-colors duration-200 text-gray-500 dark:text-gray-400">
          Drag blocks to add them to your page
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
          <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {blockCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-700 text-white dark:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
              <span className="text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="space-y-3">
        {filteredBlocks.map(block => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            className="group p-3 border rounded-lg cursor-move transition-all hover:shadow-md hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-gray-100 rounded-md dark:bg-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  {block.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {block.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {block.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {blockCategories.find(cat => cat.id === block.category)?.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    Drag to add
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlocks.length === 0 && (
        <div className="text-center py-8">
          <FaCube className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No blocks found matching your search
          </p>
        </div>
      )}
    </div>
  );
};

// Вкладка Block - настройки блока


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