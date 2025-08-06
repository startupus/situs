import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { FiMoon, FiSun, FiGlobe } from 'react-icons/fi';
import { useCanvasTheme } from '../hooks/useCanvasTheme';
const InterfaceControls = ({ collapsed = false }) => {
    const { theme, toggleTheme } = useCanvasTheme();
    const [currentLanguage, setCurrentLanguage] = React.useState('ru');
    const languages = [
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
    const handleLanguageChange = (langCode) => {
        setCurrentLanguage(langCode);
        // Здесь будет логика смены языка
        console.log('Switching language to:', langCode);
    };
    if (collapsed) {
        return (_jsxs("div", { className: "p-2 space-y-2", children: [_jsx("button", { onClick: toggleTheme, className: "w-full flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors", title: theme === 'dark' ? 'Светлая тема' : 'Темная тема', children: theme === 'dark' ? (_jsx(FiSun, { className: "w-5 h-5" })) : (_jsx(FiMoon, { className: "w-5 h-5" })) }), _jsxs("div", { className: "relative group", children: [_jsx("button", { className: "w-full flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors", title: "\u042F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430", children: _jsx(FiGlobe, { className: "w-5 h-5" }) }), _jsx("div", { className: "absolute bottom-full left-0 mb-2 w-48 bg-surface dark:bg-gray-800 rounded-lg shadow-xl border border-stroke dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50", children: _jsxs("div", { className: "p-3", children: [_jsx("h3", { className: "text-sm font-medium text-dark dark:text-white mb-2", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430" }), _jsx("p", { className: "text-xs text-body-color dark:text-gray-400 mb-3", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0435\u043C\u043E\u0439 \u0438 \u044F\u0437\u044B\u043A\u043E\u043C \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430" })] }) })] })] }));
    }
    return (_jsxs("div", { className: "p-4 border-t border-gray-200 dark:border-gray-700 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "\u0422\u0435\u043C\u0430 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430" }), _jsx("button", { onClick: toggleTheme, className: `relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark'
                            ? 'bg-blue-600'
                            : 'bg-gray-200'}`, children: _jsx("span", { className: `inline-block w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsx("div", { className: "flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400", children: theme === 'dark' ? (_jsxs(_Fragment, { children: [_jsx(FiMoon, { className: "w-4 h-4" }), _jsx("span", { children: "\u0422\u0435\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430" })] })) : (_jsxs(_Fragment, { children: [_jsx(FiSun, { className: "w-4 h-4" }), _jsx("span", { children: "\u0421\u0432\u0435\u0442\u043B\u0430\u044F \u0442\u0435\u043C\u0430" })] })) }), _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "\u042F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430" }), _jsx("div", { className: "relative", children: _jsx("select", { value: currentLanguage, onChange: (e) => handleLanguageChange(e.target.value), className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: languages.map((lang) => (_jsxs("option", { value: lang.code, children: [lang.flag, " ", lang.name] }, lang.code))) }) })] }), _jsx("div", { className: "pt-2 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 space-y-1", children: [_jsx("div", { children: "Situs Platform v1.0" }), _jsx("div", { children: "\u00A9 2024 \u0421\u0442\u0430\u0440\u0442\u0430\u043F\u0443\u0441" })] }) })] }));
};
export default InterfaceControls;
//# sourceMappingURL=InterfaceControls.js.map