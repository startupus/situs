import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaCog, FaUsers, FaProjectDiagram, FaStore, FaRobot, FaChartBar, FaLock, FaBell, FaGlobe, FaPalette } from 'react-icons/fa';
/**
 * Страница настроек разделов Situs
 * Базируется на SettingsPage2 компоненте из react-pro-components-main
 */
const SitusSectionSettings = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sections, setSections] = useState([
        {
            id: 'dashboard',
            name: 'Дашборд',
            description: 'Основная панель управления и аналитики',
            enabled: true,
            permissions: ['view', 'edit'],
            icon: _jsx(FaChartBar, { className: "text-blue-500" }),
            settings: {
                showStats: true,
                autoRefresh: true,
                refreshInterval: 30
            }
        },
        {
            id: 'projects',
            name: 'Проекты',
            description: 'Управление проектами и портфолио',
            enabled: true,
            permissions: ['view', 'create', 'edit', 'delete'],
            icon: _jsx(FaProjectDiagram, { className: "text-green-500" }),
            settings: {
                defaultTemplate: 'modern',
                autoSave: true,
                versioning: true
            }
        },
        {
            id: 'websites',
            name: 'Веб-сайты',
            description: 'Конструктор и управление веб-сайтами',
            enabled: true,
            permissions: ['view', 'create', 'edit', 'publish'],
            icon: _jsx(FaGlobe, { className: "text-purple-500" }),
            settings: {
                seoOptimization: true,
                responsiveDesign: true,
                analytics: true
            }
        },
        {
            id: 'stores',
            name: 'Интернет-магазины',
            description: 'Создание и управление онлайн-магазинами',
            enabled: true,
            permissions: ['view', 'create', 'edit', 'manage_orders'],
            icon: _jsx(FaStore, { className: "text-orange-500" }),
            settings: {
                paymentGateways: ['stripe', 'paypal'],
                inventory: true,
                orderTracking: true
            }
        },
        {
            id: 'chatbots',
            name: 'Чат-боты',
            description: 'AI-чат-боты и автоматизация',
            enabled: true,
            permissions: ['view', 'create', 'train'],
            icon: _jsx(FaRobot, { className: "text-red-500" }),
            settings: {
                aiModel: 'gpt-4',
                autoLearn: true,
                multiLanguage: true
            }
        },
        {
            id: 'users',
            name: 'Пользователи',
            description: 'Управление пользователями и правами доступа',
            enabled: true,
            permissions: ['view', 'create', 'edit', 'manage_roles'],
            icon: _jsx(FaUsers, { className: "text-indigo-500" }),
            settings: {
                registration: 'invite_only',
                emailVerification: true,
                twoFactorAuth: false
            }
        }
    ]);
    const [globalSettings, setGlobalSettings] = useState({
        theme: 'auto',
        language: 'ru',
        timezone: 'Europe/Moscow',
        notifications: {
            email: true,
            push: true,
            sms: false
        },
        security: {
            sessionTimeout: 60,
            passwordPolicy: 'strong',
            ipWhitelist: false
        }
    });
    const handleSectionToggle = (sectionId) => {
        setSections(prev => prev.map(section => section.id === sectionId
            ? { ...section, enabled: !section.enabled }
            : section));
    };
    const handleSectionSettingChange = (sectionId, setting, value) => {
        setSections(prev => prev.map(section => section.id === sectionId
            ? {
                ...section,
                settings: { ...section.settings, [setting]: value }
            }
            : section));
    };
    const handleGlobalSettingChange = (category, setting, value) => {
        setGlobalSettings(prev => ({
            ...prev,
            [category]: typeof prev[category] === 'object'
                ? { ...prev[category], [setting]: value }
                : value
        }));
    };
    const currentSection = sections.find(s => s.id === activeSection);
    const menuItems = [
        { id: 'general', name: 'Общие настройки', icon: _jsx(FaCog, {}) },
        { id: 'appearance', name: 'Внешний вид', icon: _jsx(FaPalette, {}) },
        { id: 'notifications', name: 'Уведомления', icon: _jsx(FaBell, {}) },
        { id: 'security', name: 'Безопасность', icon: _jsx(FaLock, {}) }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-dark", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "w-64 bg-white shadow-lg dark:bg-dark-2", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-bold text-dark dark:text-white mb-6", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0440\u0430\u0437\u0434\u0435\u043B\u043E\u0432" }), _jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-sm font-semibold text-body-color uppercase tracking-wide mb-3", children: "\u0420\u0430\u0437\u0434\u0435\u043B\u044B \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B" }), _jsx("div", { className: "space-y-2", children: sections.map((section) => (_jsxs("button", { onClick: () => setActiveSection(section.id), className: `w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                                ? 'bg-primary text-white'
                                                : 'text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-dark'}`, children: [_jsx("div", { className: "mr-3", children: section.icon }), _jsx("span", { className: "font-medium", children: section.name }), _jsx("div", { className: `ml-auto w-2 h-2 rounded-full ${section.enabled ? 'bg-green-500' : 'bg-red-500'}` })] }, section.id))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-body-color uppercase tracking-wide mb-3", children: "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }), _jsx("div", { className: "space-y-2", children: menuItems.map((item) => (_jsxs("button", { onClick: () => setActiveSection(item.id), className: `w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${activeSection === item.id
                                                ? 'bg-primary text-white'
                                                : 'text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-dark'}`, children: [_jsx("div", { className: "mr-3", children: item.icon }), _jsx("span", { className: "font-medium", children: item.name })] }, item.id))) })] })] }) }), _jsxs("div", { className: "flex-1 p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-dark dark:text-white mb-2", children: currentSection ? currentSection.name : 'Настройки' }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: currentSection ? currentSection.description : 'Управление настройками платформы' })] }), currentSection && (_jsxs("div", { className: "grid gap-8 md:grid-cols-2", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2", children: [_jsx("h3", { className: "text-xl font-semibold text-dark dark:text-white mb-6", children: "\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-dark dark:text-white", children: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0440\u0430\u0437\u0434\u0435\u043B" }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0440\u0430\u0437\u0434\u0435\u043B \u0432 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C" })] }), _jsxs("label", { className: "relative inline-flex cursor-pointer items-center", children: [_jsx("input", { type: "checkbox", checked: currentSection.enabled, onChange: () => handleSectionToggle(currentSection.id), className: "peer sr-only" }), _jsx("div", { className: "peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" })] })] }) }), _jsx("div", { className: "space-y-4", children: Object.entries(currentSection.settings).map(([key, value]) => (_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-dark dark:text-white capitalize", children: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }), typeof value === 'boolean' ? (_jsxs("label", { className: "relative inline-flex cursor-pointer items-center", children: [_jsx("input", { type: "checkbox", checked: value, onChange: (e) => handleSectionSettingChange(currentSection.id, key, e.target.checked), className: "peer sr-only" }), _jsx("div", { className: "peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" })] })) : typeof value === 'number' ? (_jsx("input", { type: "number", value: value, onChange: (e) => handleSectionSettingChange(currentSection.id, key, Number(e.target.value)), className: "w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white" })) : Array.isArray(value) ? (_jsx("div", { className: "space-y-2", children: value.map((item, index) => (_jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: "px-3 py-1 bg-primary/10 text-primary rounded-full text-sm", children: item }) }, index))) })) : (_jsx("input", { type: "text", value: value, onChange: (e) => handleSectionSettingChange(currentSection.id, key, e.target.value), className: "w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white" }))] }, key))) })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2", children: [_jsx("h3", { className: "text-xl font-semibold text-dark dark:text-white mb-6", children: "\u041F\u0440\u0430\u0432\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" }), _jsx("div", { className: "space-y-4", children: currentSection.permissions.map((permission) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-dark dark:text-white capitalize", children: permission.replace('_', ' ') }), _jsxs("p", { className: "text-sm text-body-color dark:text-dark-6", children: ["\u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u043D\u0430 ", permission.replace('_', ' ').toLowerCase()] })] }), _jsxs("label", { className: "relative inline-flex cursor-pointer items-center", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "peer sr-only" }), _jsx("div", { className: "peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" })] })] }, permission))) })] })] })), ['general', 'appearance', 'notifications', 'security'].includes(activeSection) && (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2", children: [_jsx("h3", { className: "text-xl font-semibold text-dark dark:text-white mb-6", children: menuItems.find(item => item.id === activeSection)?.name }), activeSection === 'general' && (_jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-dark dark:text-white", children: "\u0422\u0435\u043C\u0430 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F" }), _jsxs("select", { value: globalSettings.theme, onChange: (e) => handleGlobalSettingChange('theme', '', e.target.value), className: "w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white", children: [_jsx("option", { value: "light", children: "\u0421\u0432\u0435\u0442\u043B\u0430\u044F" }), _jsx("option", { value: "dark", children: "\u0422\u0451\u043C\u043D\u0430\u044F" }), _jsx("option", { value: "auto", children: "\u0410\u0432\u0442\u043E" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-dark dark:text-white", children: "\u042F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430" }), _jsxs("select", { value: globalSettings.language, onChange: (e) => handleGlobalSettingChange('language', '', e.target.value), className: "w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white", children: [_jsx("option", { value: "ru", children: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" }), _jsx("option", { value: "en", children: "English" })] })] })] })), activeSection === 'notifications' && (_jsx("div", { className: "space-y-6", children: Object.entries(globalSettings.notifications).map(([key, value]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-dark dark:text-white capitalize", children: key === 'email' ? 'Email уведомления' :
                                                            key === 'push' ? 'Push уведомления' :
                                                                'SMS уведомления' }), _jsxs("p", { className: "text-sm text-body-color dark:text-dark-6", children: ["\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0447\u0435\u0440\u0435\u0437 ", key] })] }), _jsxs("label", { className: "relative inline-flex cursor-pointer items-center", children: [_jsx("input", { type: "checkbox", checked: value, onChange: (e) => handleGlobalSettingChange('notifications', key, e.target.checked), className: "peer sr-only" }), _jsx("div", { className: "peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" })] })] }, key))) }))] })), _jsxs("div", { className: "mt-8 flex gap-4", children: [_jsx("button", { onClick: () => console.log('Сохранение настроек'), className: "rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors font-medium", children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F" }), _jsx("button", { type: "button", className: "rounded-lg border border-stroke px-6 py-3 text-dark hover:bg-gray-50 transition-colors font-medium dark:border-dark-3 dark:text-white dark:hover:bg-dark", children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C" })] })] })] }) }));
};
export default SitusSectionSettings;
//# sourceMappingURL=SitusSectionSettings.js.map