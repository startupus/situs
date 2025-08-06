import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaPlay, FaCog, FaEye, FaClock, FaTag, FaSearch, FaSave, FaTrash, FaCube, FaFile, FaCogs, FaStar, FaParagraph, FaComments, FaPalette } from 'react-icons/fa';
import PageThemeSettings from '../redaktus/PageThemeSettings';
const SettingsPanel = ({ currentPage = "Home" }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('page');
    return (_jsx("div", { className: "redaktus-settings-panel w-80 flex-shrink-0 overflow-y-auto transition-colors duration-200 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 border-l h-full", children: _jsxs("div", { className: "bg-gray-100 dark:bg-gray-800 h-full flex flex-col", children: [_jsx("div", { className: "border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 flex-shrink-0", children: _jsxs("nav", { className: "flex", children: [_jsx("div", { onClick: () => setActiveTab('page'), className: `flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${activeTab === 'page'
                                    ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                                    : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, children: t('editor.panels.page') }), _jsx("div", { onClick: () => setActiveTab('blocks'), className: `flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${activeTab === 'blocks'
                                    ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                                    : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, children: t('editor.panels.block') }), _jsx("div", { onClick: () => setActiveTab('item'), className: `flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${activeTab === 'item'
                                    ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                                    : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, children: t('editor.panels.item') })] }) }), _jsxs("div", { className: "p-6 flex-1 overflow-y-auto", children: [activeTab === 'page' && _jsx(PageTab, { currentPage: currentPage }), activeTab === 'blocks' && _jsx(BlocksTab, {}), activeTab === 'item' && _jsx(ItemTab, {})] })] }) }));
};
// Вкладка Page - настройки страницы
const PageTab = ({ currentPage }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100", children: t('editor.settings.page.title') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: t('editor.settings.page.subtitle') })] }), _jsx(SettingsSection, { title: t('editor.settings.page.statusVisibility.title'), icon: _jsx(FaEye, { size: 16 }), collapsible: true, children: _jsxs("div", { className: "space-y-4", children: [_jsx(InputGroup, { label: t('editor.settings.page.statusVisibility.visibility'), type: "select", value: t('editor.settings.page.statusVisibility.published'), options: [
                                t('editor.settings.page.statusVisibility.published'),
                                t('editor.settings.page.statusVisibility.draft'),
                                t('editor.settings.page.statusVisibility.private')
                            ] }), _jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium", children: t('editor.settings.page.statusVisibility.publishedLive') })] }), _jsx(FaPlay, { size: 12 })] })] }) }), _jsx(SettingsSection, { title: t('editor.settings.page.schedulePublish.title'), icon: _jsx(FaClock, { size: 16 }), collapsible: true, children: _jsxs("div", { className: "space-y-4", children: [_jsx(InputGroup, { label: t('editor.settings.page.schedulePublish.publishDate'), type: "date", value: "21.01.2025" }), _jsx(InputGroup, { label: t('editor.settings.page.schedulePublish.publishTime'), type: "time", value: "00:00" })] }) }), _jsx(SettingsSection, { title: t('editor.settings.page.pageStructure.title'), icon: _jsx(FaCogs, { size: 16 }), collapsible: true, children: _jsxs("div", { className: "space-y-4", children: [_jsx(InputGroup, { label: t('editor.settings.page.pageStructure.structureLocked'), type: "select", value: t('editor.settings.page.pageStructure.unlocked'), options: [
                                t('editor.settings.page.pageStructure.unlocked'),
                                t('editor.settings.page.pageStructure.locked')
                            ] }), _jsx("p", { className: "text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400", children: t('editor.settings.page.pageStructure.description') })] }) }), _jsx(SettingsSection, { title: t('editor.settings.page.pageAttributes.title'), icon: _jsx(FaTag, { size: 16 }), collapsible: true, children: _jsx("div", { className: "space-y-4", children: _jsx(InputGroup, { label: t('editor.settings.page.pageAttributes.pageSlug'), type: "text", value: "/home", placeholder: t('editor.settings.page.pageAttributes.pageSlugPlaceholder') }) }) }), _jsx(SettingsSection, { title: t('editor.settings.page.theme.title'), icon: _jsx(FaPalette, { size: 16 }), collapsible: true, children: _jsx(PageThemeSettings, {}) })] }));
};
// Новая вкладка Blocks - каталог блоков
const BlocksTab = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    // Категории блоков - только TailGrids
    const blockCategories = [
        {
            id: 'all',
            name: 'All Blocks',
            icon: _jsx(FaCube, { size: 16 }),
            count: 3
        },
        {
            id: 'hero',
            name: 'Hero Sections',
            icon: _jsx(FaStar, { size: 16 }),
            count: 1
        },
        {
            id: 'content',
            name: 'Content Blocks',
            icon: _jsx(FaParagraph, { size: 16 }),
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
            icon: _jsx(FaStar, { size: 16 }),
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
            icon: _jsx(FaComments, { size: 16 }),
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
            icon: _jsx(FaCogs, { size: 16 }),
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
    const handleDragStart = (e, block) => {
        e.dataTransfer.setData('text/plain', block.id);
        e.dataTransfer.effectAllowed = 'copy';
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100", children: "Block Library" }), _jsx("p", { className: "text-sm mt-1 transition-colors duration-200 text-gray-500 dark:text-gray-400", children: "Drag blocks to add them to your page" })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search blocks...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" }), _jsx(FaSearch, { className: "absolute left-2.5 top-2.5 text-gray-400", size: 14 })] }) }), _jsx("div", { className: "mb-4", children: _jsx("div", { className: "flex flex-wrap gap-2", children: blockCategories.map(category => (_jsxs("button", { onClick: () => setSelectedCategory(category.id), className: `flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${selectedCategory === category.id
                            ? 'bg-gray-700 text-white dark:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`, children: [category.icon, _jsx("span", { children: category.name }), _jsxs("span", { className: "text-xs opacity-75", children: ["(", category.count, ")"] })] }, category.id))) }) }), _jsx("div", { className: "space-y-3", children: filteredBlocks.map(block => (_jsx("div", { draggable: true, onDragStart: (e) => handleDragStart(e, block), className: "group p-3 border rounded-lg cursor-move transition-all hover:shadow-md hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 p-2 bg-gray-100 rounded-md dark:bg-gray-700", children: _jsx("span", { className: "text-gray-600 dark:text-gray-400", children: block.icon }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: block.name }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: block.description }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [_jsx("span", { className: "text-xs px-2 py-1 bg-gray-100 rounded dark:bg-gray-700 text-gray-600 dark:text-gray-400", children: blockCategories.find(cat => cat.id === block.category)?.name }), _jsx("span", { className: "text-xs text-gray-400", children: "Drag to add" })] })] })] }) }, block.id))) }), filteredBlocks.length === 0 && (_jsxs("div", { className: "text-center py-8", children: [_jsx(FaCube, { className: "mx-auto h-8 w-8 text-gray-400" }), _jsx("p", { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: "No blocks found matching your search" })] }))] }));
};
// Вкладка Block - настройки блока
// Вкладка Item - настройки элемента
const ItemTab = () => {
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100", children: "Item Settings" }), _jsx("p", { className: "text-sm mt-1 transition-colors duration-200 text-gray-500 dark:text-gray-400", children: "Configure individual item properties" })] }), _jsx(SettingsSection, { title: "Content", icon: _jsx(FaFile, { size: 16 }), collapsible: true, children: _jsx("div", { className: "space-y-4", children: _jsx(InputGroup, { label: "TEXT CONTENT", type: "textarea", value: "Sample text content", placeholder: "Enter text content" }) }) }), _jsx(SettingsSection, { title: "Actions", icon: _jsx(FaCog, { size: 16 }), collapsible: true, children: _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { className: "w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500", children: [_jsx(FaSave, { size: 14 }), _jsx("span", { children: "Save Changes" })] }), _jsxs("button", { className: "w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700", children: [_jsx(FaTrash, { size: 14 }), _jsx("span", { children: "Delete Item" })] })] }) })] }));
};
const SettingsSection = ({ title, subtitle, icon, children, collapsible = false, actionIcon }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    return (_jsxs("div", { className: "mb-6 border rounded-lg transition-colors duration-200 border-gray-200 dark:border-gray-700", children: [_jsxs("div", { onClick: () => collapsible && setIsExpanded(!isExpanded), className: `flex items-center justify-between p-4 cursor-pointer transition-colors ${collapsible ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [icon && (_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: icon })), _jsxs("div", { children: [_jsx("h4", { className: "font-medium transition-colors duration-200 text-gray-800 dark:text-gray-100", children: title }), subtitle && (_jsx("p", { className: "text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400", children: subtitle }))] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [actionIcon && (_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: actionIcon })), collapsible && (_jsx(FaChevronDown, { size: 12, className: `transition-transform duration-200 text-gray-500 dark:text-gray-400 ${isExpanded ? 'rotate-180' : ''}` }))] })] }), (!collapsible || isExpanded) && (_jsx("div", { className: "p-4 border-t border-gray-200 dark:border-gray-700", children: children }))] }));
};
const InputGroup = ({ label, type, value, placeholder, options = [], disabled }) => {
    // Добавляем пустые обработчики для устранения React предупреждений
    const handleChange = () => { };
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300", children: label }), type === 'select' ? (_jsx("select", { value: value, onChange: handleChange, disabled: disabled, className: `w-full px-3 py-2 border rounded-md text-sm transition-colors ${disabled
                    ? 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                    : 'border-gray-300 text-gray-900 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-gray-500'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`, children: options.map((option) => (_jsx("option", { value: option, children: option }, option))) })) : type === 'textarea' ? (_jsx("textarea", { value: value, onChange: handleChange, placeholder: placeholder, disabled: disabled, rows: 3, className: `w-full px-3 py-2 border rounded-md text-sm transition-colors resize-none ${disabled
                    ? 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                    : 'border-gray-300 text-gray-900 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-gray-500'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50` })) : (_jsx("input", { type: type, value: value, onChange: handleChange, placeholder: placeholder, disabled: disabled, className: `w-full px-3 py-2 border rounded-md text-sm transition-colors ${disabled
                    ? 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                    : 'border-gray-300 text-gray-900 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-gray-500'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50` }))] }));
};
export default SettingsPanel;
//# sourceMappingURL=SettingsPanel.js.map