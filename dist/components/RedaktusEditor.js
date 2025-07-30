import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { FiSave, FiEye, FiGlobe, FiClock, FiArrowLeft } from 'react-icons/fi';
// Redaktus Editor - НАГЛО СКОПИРОВАНО С REACTBRICKS!
// Импортируем скопированные админские компоненты
import AdminEditor from './redaktus/admin/editor';
import AdminLogin from './redaktus/admin/index';
import AdminPlayground from './redaktus/admin/playground';
import AdminMedia from './redaktus/admin/media';
import AdminAppSettings from './redaktus/admin/app-settings';
// Импортируем конфигурацию
import config from './redaktus/config/config';
// Импортируем главный провайдер из starter
import RedaktusApp from './redaktus/starter-components/RedaktusApp';
// Интеграция с проектами
import { useProject } from '../contexts/ProjectContext';
import { useAutoSave } from '../hooks/useAutoSave';
const RedaktusEditor = ({ mode = 'editor', onBack }) => {
    const { currentPage, currentProject, savePage, updatePage } = useProject();
    const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
    const [lastSaved, setLastSaved] = useState(null);
    // Автосохранение для текущего контента страницы
    const { isSaving, saveNow } = useAutoSave(currentPage?.content || {}, {
        onSave: async (content) => {
            if (currentPage) {
                await savePage(currentPage.id, content);
                setLastSaved(new Date());
            }
        },
        delay: 3000,
        enabled: isAutoSaveEnabled && !!currentPage
    });
    console.log('RedaktusEditor render - mode:', mode);
    console.log('RedaktusEditor config:', config);
    console.log('Current page:', currentPage);
    // Ручное сохранение
    const handleManualSave = async () => {
        if (currentPage) {
            await saveNow();
        }
    };
    // Публикация страницы
    const handlePublish = async () => {
        if (currentPage && currentPage.status === 'draft') {
            await updatePage(currentPage.id, {
                status: 'published',
                publishedAt: new Date()
            });
        }
    };
    // Роутинг как в ReactBricks
    const renderAdminComponent = () => {
        console.log('renderAdminComponent called - mode:', mode);
        switch (mode) {
            case 'login':
                console.log('Rendering AdminLogin');
                return _jsx(AdminLogin, {});
            case 'playground':
                console.log('Rendering AdminPlayground');
                return _jsx(AdminPlayground, {});
            case 'media':
                console.log('Rendering AdminMedia');
                return _jsx(AdminMedia, {});
            case 'app-settings':
                console.log('Rendering AdminAppSettings');
                return _jsx(AdminAppSettings, {});
            default:
                console.log('Rendering AdminEditor (default)');
                return (_jsxs("div", { className: "h-full flex flex-col", children: [currentPage && (_jsxs("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [onBack && (_jsx("button", { onClick: onBack, className: "p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors", title: "\u041D\u0430\u0437\u0430\u0434 \u043A \u043F\u0440\u043E\u0435\u043A\u0442\u0443", children: _jsx(FiArrowLeft, { className: "w-5 h-5" }) })), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: currentPage.title }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("span", { children: ["/", currentPage.slug] }), _jsx("span", { children: "\u2022" }), _jsx("div", { className: "flex items-center space-x-1", children: currentPage.status === 'published' ? (_jsxs(_Fragment, { children: [_jsx(FiGlobe, { className: "w-4 h-4 text-green-500" }), _jsx("span", { className: "text-green-600 dark:text-green-400", children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E" })] })) : (_jsxs(_Fragment, { children: [_jsx(FiClock, { className: "w-4 h-4 text-yellow-500" }), _jsx("span", { className: "text-yellow-600 dark:text-yellow-400", children: "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A" })] })) })] })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: isSaving ? (_jsx("span", { children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435..." })) : lastSaved ? (_jsxs("span", { children: ["\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E \u0432 ", lastSaved.toLocaleTimeString()] })) : null }), _jsxs("button", { className: "flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors", title: "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440", children: [_jsx(FiEye, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440" })] }), _jsxs("button", { onClick: handleManualSave, disabled: isSaving, className: "flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50", title: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C", children: [_jsx(FiSave, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" })] }), currentPage.status === 'draft' && (_jsxs("button", { onClick: handlePublish, className: "flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors", title: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443", children: [_jsx(FiGlobe, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C" })] }))] })] })), _jsx("div", { className: "flex-1", children: _jsx(AdminEditor, {}) })] }));
        }
    };
    console.log('About to render RedaktusApp');
    return (_jsx(RedaktusApp, { Component: () => {
            console.log('RedaktusApp Component function called');
            return renderAdminComponent();
        }, pageProps: {} }));
};
export default RedaktusEditor;
//# sourceMappingURL=RedaktusEditor.js.map