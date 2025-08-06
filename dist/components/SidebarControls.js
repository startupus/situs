import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useCanvasTheme } from '../hooks/useCanvasTheme';
const SidebarControls = () => {
    const { theme, toggleTheme } = useCanvasTheme();
    const [currentLanguage, setCurrentLanguage] = React.useState('ru');
    const languages = [
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
    const handleLanguageChange = (langCode) => {
        setCurrentLanguage(langCode);
        console.log('Switching language to:', langCode);
    };
    return (_jsxs("div", { className: "fixed bottom-6 left-6 bg-surface dark:bg-gray-800 rounded-lg shadow-xl border border-stroke dark:border-gray-700 p-4 space-y-4 z-50", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-dark dark:text-white", children: "\u0422\u0435\u043C\u0430" }), _jsx("button", { onClick: toggleTheme, className: `relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark'
                            ? 'bg-primary'
                            : 'bg-gray-200'}`, children: _jsx("span", { className: `inline-block w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsx("div", { className: "flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400", children: theme === 'dark' ? (_jsxs(_Fragment, { children: [_jsx(FiMoon, { className: "w-4 h-4" }), _jsx("span", { children: "\u0422\u0435\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430" })] })) : (_jsxs(_Fragment, { children: [_jsx(FiSun, { className: "w-4 h-4" }), _jsx("span", { children: "\u0421\u0432\u0435\u0442\u043B\u0430\u044F \u0442\u0435\u043C\u0430" })] })) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-dark dark:text-white", children: "\u042F\u0437\u044B\u043A" }), _jsx("select", { value: currentLanguage, onChange: (e) => handleLanguageChange(e.target.value), className: "w-full px-3 py-2 text-sm border border-stroke dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors", children: languages.map((lang) => (_jsxs("option", { value: lang.code, children: [lang.flag, " ", lang.name] }, lang.code))) })] }) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-4", children: _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 space-y-1", children: [_jsx("div", { children: "Situs Platform" }), _jsx("div", { children: "v1.0 \u00A9 2024" })] }) })] }));
};
export default SidebarControls;
//# sourceMappingURL=SidebarControls.js.map