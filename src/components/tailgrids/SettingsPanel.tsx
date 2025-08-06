import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
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
  FaComments,
  FaPalette
} from 'react-icons/fa'
import PageThemeSettings from '../redaktus/PageThemeSettings'
import { useLanguage } from '../../contexts/LanguageContext';


interface SettingsPanelProps {
  currentPage?: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentPage = "Home" }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'page' | 'item' | 'blocks'>('page');

  return (
    <div 
      className="redaktus-settings-panel w-80 flex-shrink-0 overflow-y-auto transition-colors duration-200 border-l h-full"
      style={{
        backgroundColor: 'var(--interface-bg)',
        color: 'var(--interface-text)',
        borderColor: 'var(--interface-border)'
      }}
    >
      <div 
        className="h-full flex flex-col"
        style={{
          backgroundColor: 'var(--interface-bg)',
          color: 'var(--interface-text)'
        }}
      >
        {/* Вкладки в стиле TailGrids Tab2 - контрастные и видимые */}
        <div 
          className="flex-shrink-0 bg-[#FAFAFA] dark:bg-gray-700"
          style={{
            backgroundColor: 'var(--interface-surface)',
            borderColor: 'var(--interface-border)'
          }}
        >
          <nav className="flex">
            <button
              onClick={() => setActiveTab('page')}
              className={`border-b-2 py-4 px-6 text-sm font-medium md:text-base lg:py-5 lg:px-12 flex-1 transition-all duration-200 ${
                activeTab === 'page'
                  ? 'border-primary text-primary bg-[#EDF1FF] dark:bg-primary/20 dark:text-blue-400'
                  : 'border-[#F1F2F4] dark:border-gray-600 text-body-color dark:text-gray-300 hover:border-primary hover:text-primary hover:bg-[#EDF1FF] dark:hover:bg-primary/10 dark:hover:text-blue-400'
              }`}
            >
              {t('editor.panels.page')}
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`border-b-2 py-4 px-6 text-sm font-medium md:text-base lg:py-5 lg:px-12 flex-1 transition-all duration-200 ${
                activeTab === 'blocks'
                  ? 'border-primary text-primary bg-[#EDF1FF] dark:bg-primary/20 dark:text-blue-400'
                  : 'border-[#F1F2F4] dark:border-gray-600 text-body-color dark:text-gray-300 hover:border-primary hover:text-primary hover:bg-[#EDF1FF] dark:hover:bg-primary/10 dark:hover:text-blue-400'
              }`}
            >
              {t('editor.panels.block')}
            </button>
            <button
              onClick={() => setActiveTab('item')}
              className={`border-b-2 py-4 px-6 text-sm font-medium md:text-base lg:py-5 lg:px-12 flex-1 transition-all duration-200 ${
                activeTab === 'item'
                  ? 'border-primary text-primary bg-[#EDF1FF] dark:bg-primary/20 dark:text-blue-400'
                  : 'border-[#F1F2F4] dark:border-gray-600 text-body-color dark:text-gray-300 hover:border-primary hover:text-primary hover:bg-[#EDF1FF] dark:hover:bg-primary/10 dark:hover:text-blue-400'
              }`}
            >
              {t('editor.panels.item')}
            </button>
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
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100">
          {t('editor.settings.page.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('editor.settings.page.subtitle')}
        </p>
      </div>

      {/* Status and Visibility */}
      <SettingsSection 
        title={t('editor.settings.page.statusVisibility.title')} 
        icon={<FaEye size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label={t('editor.settings.page.statusVisibility.visibility')}
            type="select"
            value={t('editor.settings.page.statusVisibility.published')}
            options={[
              t('editor.settings.page.statusVisibility.published'),
              t('editor.settings.page.statusVisibility.draft'),
              t('editor.settings.page.statusVisibility.private')
            ]}
          />
          
          <div 
            className="flex items-center justify-between p-4 rounded-[20px] shadow-2 hover:shadow-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--interface-surface)',
              border: '1px solid var(--interface-border)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#10b981' }}
              ></div>
              <span 
                className="text-sm font-medium"
                style={{ color: '#10b981' }}
              >
                {t('editor.settings.page.statusVisibility.publishedLive')}
              </span>
            </div>
            <FaPlay size={14} style={{ color: '#10b981' }} />
          </div>
        </div>
      </SettingsSection>

      {/* Schedule Publish */}
      <SettingsSection 
        title={t('editor.settings.page.schedulePublish.title')} 
        icon={<FaClock size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label={t('editor.settings.page.schedulePublish.publishDate')}
            type="date"
            value="21.01.2025"
          />
          <InputGroup
            label={t('editor.settings.page.schedulePublish.publishTime')}
            type="time"
            value="00:00"
          />
        </div>
      </SettingsSection>

      {/* Page Structure */}
      <SettingsSection 
        title={t('editor.settings.page.pageStructure.title')} 
        icon={<FaCogs size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label={t('editor.settings.page.pageStructure.structureLocked')}
            type="select"
            value={t('editor.settings.page.pageStructure.unlocked')}
            options={[
              t('editor.settings.page.pageStructure.unlocked'),
              t('editor.settings.page.pageStructure.locked')
            ]}
          />
          <p className="text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">
            {t('editor.settings.page.pageStructure.description')}
          </p>
        </div>
      </SettingsSection>

      {/* Page Attributes */}
      <SettingsSection 
        title={t('editor.settings.page.pageAttributes.title')} 
        icon={<FaTag size={16} />}
        collapsible
      >
        <div className="space-y-4">
          <InputGroup
            label={t('editor.settings.page.pageAttributes.pageSlug')}
            type="text"
            value="/home"
            placeholder={t('editor.settings.page.pageAttributes.pageSlugPlaceholder')}
          />
        </div>
      </SettingsSection>

      {/* Page Theme Settings */}
      <SettingsSection 
        title={t('editor.settings.page.theme.title')} 
        icon={<FaPalette size={16} />}
        collapsible
      >
        <PageThemeSettings />
      </SettingsSection>

      {/* Page Stylistic Settings */}
      <SettingsSection 
        title="Стилистические настройки" 
        icon={<FaCog size={16} />}
        collapsible
      >
        <div className="space-y-4">
          {/* Typography Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Типографика
            </label>
            <div className="space-y-3">
              <InputGroup
                label="Основной шрифт"
                type="select"
                value="Inter"
                options={['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins']}
              />
              <InputGroup
                label="Размер базового шрифта"
                type="select"
                value="16px"
                options={['14px', '16px', '18px', '20px']}
              />
              <InputGroup
                label="Высота строки"
                type="select"
                value="1.5"
                options={['1.2', '1.4', '1.5', '1.6', '1.8']}
              />
            </div>
          </div>

          {/* Spacing Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Отступы и интервалы
            </label>
            <div className="space-y-3">
              <InputGroup
                label="Базовый отступ"
                type="select"
                value="1rem"
                options={['0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem']}
              />
              <InputGroup
                label="Межблочный интервал"
                type="select"
                value="2rem"
                options={['1rem', '1.5rem', '2rem', '2.5rem', '3rem']}
              />
            </div>
          </div>

          {/* Layout Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Макет
            </label>
            <div className="space-y-3">
              <InputGroup
                label="Максимальная ширина контейнера"
                type="select"
                value="1200px"
                options={['1000px', '1200px', '1400px', '1600px', '100%']}
              />
              <InputGroup
                label="Отступы контейнера"
                type="select"
                value="1rem"
                options={['0.5rem', '1rem', '1.5rem', '2rem']}
              />
            </div>
          </div>

          {/* Animation Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Анимации
            </label>
            <div className="space-y-3">
              <InputGroup
                label="Длительность переходов"
                type="select"
                value="0.2s"
                options={['0.1s', '0.2s', '0.3s', '0.4s']}
              />
              <InputGroup
                label="Функция плавности"
                type="select"
                value="ease-in-out"
                options={['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']}
              />
            </div>
          </div>
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
    <div 
      className="mb-6 rounded-[20px] bg-white p-6 shadow-2 hover:shadow-lg dark:bg-dark-2 dark:shadow-dark transition-colors duration-200 border border-stroke dark:border-dark-3"
      style={{ 
        borderColor: 'var(--interface-border)',
        backgroundColor: 'var(--interface-surface)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between cursor-pointer transition-colors ${
          collapsible ? 'hover:bg-opacity-50' : ''
        }`}
        style={{
          backgroundColor: collapsible ? 'var(--interface-bg)' : 'transparent'
        }}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <span style={{ color: 'var(--interface-text)' }}>
              {icon}
            </span>
          )}
          <div>
            <h4 
              className="text-lg font-semibold transition-colors duration-200"
              style={{ color: 'var(--interface-text)' }}
            >
              {title}
            </h4>
            {subtitle && (
              <p 
                className="text-sm text-body-color dark:text-dark-6 transition-colors duration-200"
                style={{ color: 'var(--interface-text)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {actionIcon && (
            <span style={{ color: 'var(--interface-text)' }}>
              {actionIcon}
            </span>
          )}
          {collapsible && (
            <FaChevronDown 
              size={12} 
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              style={{ color: 'var(--interface-text)' }}
            />
          )}
        </div>
      </div>
      {(!collapsible || isExpanded) && (
        <div 
          className="mt-4"
        >
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
  
  const inputStyles = {
    backgroundColor: disabled ? 'var(--interface-surface-disabled)' : 'var(--interface-surface)',
    color: disabled ? 'var(--interface-text-disabled)' : 'var(--interface-text)',
    borderColor: 'var(--interface-border)',
    borderRadius: '6px',
    border: '1px solid var(--interface-border)',
    outline: 'none'
  };
  
  return (
    <div className="space-y-2">
      <label 
        className="mb-[10px] block text-base font-medium transition-colors duration-200"
        style={{ color: 'var(--interface-text)' }}
      >
        {label}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
          style={inputStyles}
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
          rows={4}
          className="w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2 resize-none"
          style={inputStyles}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
          style={inputStyles}
        />
      )}
    </div>
  );
};

export default SettingsPanel; 