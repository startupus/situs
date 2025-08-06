import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FaCog, FaUsers, FaProjectDiagram, FaStore, FaRobot, FaChartBar, FaLock, FaBell, FaGlobe, FaPalette } from 'react-icons/fa';
import EnhancedThemeSettings from '../../admin/EnhancedThemeSettings';
import { useTheme } from '../../../contexts/ThemeContext';
/**
 * Страница настроек разделов Situs с поддержкой вложенных маршрутов
 * Базируется на SettingsPage2 компоненте из react-pro-components-main
 */
const SitusSectionSettings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();
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
        setGlobalSettings(prev => {
            const categoryValue = prev[category];
            return {
                ...prev,
                [category]: typeof categoryValue === 'object' && categoryValue !== null
                    ? { ...categoryValue, [setting]: value }
                    : value
            };
        });
    };
    const menuItems = [
        { id: 'general', name: 'Общие настройки', icon: _jsx(FaCog, {}), path: '' },
        { id: 'appearance', name: 'Внешний вид', icon: _jsx(FaPalette, {}), path: 'theme' },
        { id: 'notifications', name: 'Уведомления', icon: _jsx(FaBell, {}), path: 'notifications' },
        { id: 'security', name: 'Безопасность', icon: _jsx(FaLock, {}), path: 'security' }
    ];
    const currentPath = location.pathname.split('/').pop() || '';
    const currentMenuItem = menuItems.find(item => item.path === currentPath) || menuItems[0];
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-dark", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "w-64 bg-white shadow-lg dark:bg-dark-2", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-bold text-dark dark:text-white mb-6", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0440\u0430\u0437\u0434\u0435\u043B\u043E\u0432" }), _jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-sm font-semibold text-body-color uppercase tracking-wide mb-3", children: "\u0420\u0430\u0437\u0434\u0435\u043B\u044B \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B" }), _jsx("div", { className: "space-y-2", children: sections.map((section) => (_jsxs("button", { onClick: () => navigate(`/section-settings/${section.id}`), className: `w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${currentPath === section.id
                                                ? 'bg-primary text-white'
                                                : 'text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-dark'}`, children: [_jsx("div", { className: "mr-3", children: section.icon }), _jsx("span", { className: "font-medium", children: section.name }), _jsx("div", { className: `ml-auto w-2 h-2 rounded-full ${section.enabled ? 'bg-green-500' : 'bg-red-500'}` })] }, section.id))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-body-color uppercase tracking-wide mb-3", children: "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }), _jsx("div", { className: "space-y-2", children: menuItems.map((item) => (_jsxs("button", { onClick: () => navigate(`/section-settings${item.path ? '/' + item.path : ''}`), className: `w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${currentPath === item.path
                                                ? 'bg-primary text-white'
                                                : 'text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-dark'}`, children: [_jsx("div", { className: "mr-3", children: item.icon }), _jsx("span", { className: "font-medium", children: item.name })] }, item.id))) })] })] }) }), _jsx("div", { className: "flex-1 p-8", children: _jsxs(Routes, { children: [sections.map((section) => (_jsx(Route, { path: section.id, element: _jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-dark dark:text-white mb-2", children: ["\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0440\u0430\u0437\u0434\u0435\u043B\u0430: ", section.name] }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: section.description })] }), _jsxs("div", { className: "grid gap-8 md:grid-cols-2", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2", children: [_jsx("h3", { className: "text-xl font-semibold text-dark dark:text-white mb-6", children: "\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-dark dark:text-white", children: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0440\u0430\u0437\u0434\u0435\u043B" }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0440\u0430\u0437\u0434\u0435\u043B \u0432 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C" })] }), _jsx("button", { onClick: () => handleSectionToggle(section.id), className: `relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${section.enabled
                                                                            ? 'bg-primary'
                                                                            : 'bg-gray-200'}`, children: _jsx("span", { className: `inline-block w-4 h-4 rounded-full bg-white transition-transform ${section.enabled ? 'translate-x-6' : 'translate-x-1'}` }) })] }) }), _jsx("div", { className: "space-y-4", children: Object.entries(section.settings).map(([key, value]) => (_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-dark dark:text-white capitalize", children: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }), typeof value === 'boolean' ? (_jsxs("label", { className: "relative inline-flex cursor-pointer items-center", children: [_jsx("input", { type: "checkbox", checked: value, onChange: (e) => handleSectionSettingChange(section.id, key, e.target.checked), className: "peer sr-only" }), _jsx("div", { className: "peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" })] })) : typeof value === 'number' ? (_jsx("input", { type: "number", value: value, onChange: (e) => handleSectionSettingChange(section.id, key, Number(e.target.value)), className: "w-full rounded-lg border border-stroke bg-surface dark:bg-gray-800 px-3 py-2 text-dark dark:text-white outline-hidden focus:border-primary transition-colors" })) : Array.isArray(value) ? (_jsx("div", { className: "space-y-2", children: value.map((item, index) => (_jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: "px-3 py-1 bg-primary/10 text-primary rounded-full text-sm", children: item }) }, index))) })) : (_jsx("input", { type: "text", value: value, onChange: (e) => handleSectionSettingChange(section.id, key, e.target.value), className: "w-full rounded-lg border border-stroke bg-surface dark:bg-gray-800 px-3 py-2 text-dark dark:text-white outline-hidden focus:border-primary transition-colors" }))] }, key))) })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2", children: [_jsx("h3", { className: "text-xl font-semibold text-dark dark:text-white mb-6", children: "\u041F\u0440\u0430\u0432\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" }), _jsx("div", { className: "space-y-4", children: section.permissions.map((permission) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-dark dark:text-white capitalize", children: permission.replace('_', ' ') }), _jsxs("p", { className: "text-sm text-body-color dark:text-dark-6", children: ["\u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u043D\u0430 ", permission.replace('_', ' ').toLowerCase()] })] }), _jsxs("label", { className: "relative inline-flex cursor-pointer items-center", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "peer sr-only" }), _jsx("div", { className: "peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" })] })] }, permission))) })] })] })] }) }, section.id))), _jsx(Route, { path: "theme", element: _jsxs("div", { children: [_jsxs("div", { className: "mb-8 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-dark dark:text-white mb-2", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0432\u043D\u0435\u0448\u043D\u0435\u0433\u043E \u0432\u0438\u0434\u0430" }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0435\u043C\u043E\u0439 \u0438 \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C\u0438 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B" })] }), _jsxs("button", { onClick: toggleDarkMode, className: "flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-2 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark transition-colors", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" }) }), _jsx("span", { children: isDarkMode ? 'Темный режим' : 'Светлый режим' })] })] }), _jsx(EnhancedThemeSettings, {})] }) }), _jsx(Route, { path: "", element: _jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-dark dark:text-white mb-2", children: "\u041E\u0431\u0449\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B \u0438 \u0440\u0430\u0437\u0434\u0435\u043B\u043E\u0432" })] }), _jsx("div", { className: "grid gap-8 md:grid-cols-2", children: sections.map((section) => (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "mr-3", children: section.icon }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-dark dark:text-white", children: section.name }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: section.description })] })] }), _jsx("button", { onClick: () => handleSectionToggle(section.id), className: `relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${section.enabled
                                                                    ? 'bg-primary'
                                                                    : 'bg-gray-200'}`, children: _jsx("span", { className: `inline-block w-4 h-4 rounded-full bg-white transition-transform ${section.enabled ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsx("div", { className: "space-y-3", children: _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-dark dark:text-white", children: "\u041F\u0440\u0430\u0432\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: section.permissions.map((permission) => (_jsx("span", { className: "px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-dark dark:text-white rounded", children: permission }, permission))) })] }) })] }, section.id))) })] }) }), _jsx(Route, { path: "*", element: _jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-dark dark:text-white", children: "404 - \u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" }), _jsx("p", { className: "text-body-color dark:text-dark-6 mt-2", children: "\u0417\u0430\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u043C\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" })] }) })] }) })] }) }));
};
export default SitusSectionSettings;
//# sourceMappingURL=SitusSectionSettings.js.map