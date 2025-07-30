import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaMobile, FaTabletAlt, FaDesktop, FaCode, FaSun, FaMoon } from 'react-icons/fa';
import { useCanvasTheme } from '../../hooks/useCanvasTheme';
import { useLanguage } from '../../hooks/useLanguage';
const CanvasToolbar = ({ currentDevice, onDeviceChange, onLanguageChange, onPreview, onCode, onUndo, onRedo, onSave }) => {
    const { theme, resolvedTheme, toggleTheme } = useCanvasTheme();
    const { t } = useLanguage();
    const [showCode, setShowCode] = useState(false);
    const [currentLanguageId, setCurrentLanguageId] = useState('ru');
    // Языки по умолчанию
    const [languages, setLanguages] = useState([
        { id: 'ru', code: 'ru', name: 'Russian', flag: '🇷🇺', isDefault: true },
        { id: 'en', code: 'en', name: 'English', flag: '🇺🇸' },
        { id: 'de', code: 'de', name: 'German', flag: '🇩🇪' }
    ]);
    const toggleCodeView = () => {
        setShowCode(!showCode);
        onCode?.();
    };
    const handleLanguageChange = (languageId) => {
        setCurrentLanguageId(languageId);
        const language = languages.find(lang => lang.id === languageId);
        if (language && onLanguageChange) {
            onLanguageChange(language.code);
        }
    };
    const addNewLanguage = () => {
        const newLanguage = {
            id: `lang-${Date.now()}`,
            code: 'new',
            name: 'New Language',
            flag: '🌐'
        };
        setLanguages([...languages, newLanguage]);
        setCurrentLanguageId(newLanguage.id);
    };
    const removeLanguage = (languageId, event) => {
        event.stopPropagation();
        const languageToRemove = languages.find(lang => lang.id === languageId);
        if (languageToRemove && !languageToRemove.isDefault) {
            const updatedLanguages = languages.filter(lang => lang.id !== languageId);
            setLanguages(updatedLanguages);
            // Если удаляем текущий язык, переключаемся на дефолтный
            if (currentLanguageId === languageId) {
                const defaultLang = updatedLanguages.find(lang => lang.isDefault);
                if (defaultLang) {
                    setCurrentLanguageId(defaultLang.id);
                    if (onLanguageChange) {
                        onLanguageChange(defaultLang.code);
                    }
                }
            }
        }
    };
    const getThemeIcon = () => {
        // Показываем иконку для переключения на следующую тему
        if (theme === 'system') {
            // Система -> Светлая, показываем солнце 
            return _jsx(FaSun, { size: 11 });
        }
        else if (theme === 'light') {
            // Светлая -> Темная, показываем луну
            return _jsx(FaMoon, { size: 11 });
        }
        else {
            // Темная -> Система, показываем комбинированную иконку (солнце для системы)
            return _jsx(FaSun, { size: 11 });
        }
    };
    const getThemeLabel = () => {
        if (theme === 'system') {
            return `Система (${resolvedTheme === 'dark' ? 'темная' : 'светлая'}) → Светлая`;
        }
        else if (theme === 'light') {
            return 'Светлая → Темная';
        }
        else {
            return 'Темная → Система';
        }
    };
    return (_jsx("div", { className: "redaktus-canvas-toolbar border-b px-4 py-2 transition-colors duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [languages.map((lang) => (_jsxs("div", { className: "relative group", children: [_jsx("button", { onClick: () => handleLanguageChange(lang.id), className: `flex items-center justify-center w-8 h-8 rounded text-sm transition-colors ${currentLanguageId === lang.id
                                        ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-600 dark:text-gray-200'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'}`, title: lang.name, children: _jsx("span", { children: lang.flag }) }), currentLanguageId === lang.id && !lang.isDefault && (_jsx("div", { onClick: (e) => removeLanguage(lang.id, e), className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer", title: `Remove ${lang.name}`, children: _jsx("span", { className: "text-xs font-bold leading-none", style: { display: 'block', lineHeight: '1' }, children: "\u00D7" }) }))] }, lang.id))), _jsx("button", { onClick: addNewLanguage, className: "flex items-center justify-center w-8 h-8 rounded transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 border border-dashed border-gray-400 dark:border-gray-500", style: { minWidth: '32px', minHeight: '32px' }, title: "Add new language", children: _jsx("span", { className: "text-lg font-bold leading-none", style: { display: 'block', lineHeight: '1' }, children: "+" }) })] }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h2", { className: "text-base font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100", children: t('editor.title') }) }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(DeviceButton, { icon: _jsx(FaMobile, { size: 11 }), active: currentDevice === 'mobile', onClick: () => onDeviceChange('mobile'), title: t('editor.canvas.toolbar.device.mobile') }), _jsx(DeviceButton, { icon: _jsx(FaTabletAlt, { size: 11 }), active: currentDevice === 'tablet', onClick: () => onDeviceChange('tablet'), title: t('editor.canvas.toolbar.device.tablet') }), _jsx(DeviceButton, { icon: _jsx(FaDesktop, { size: 11 }), active: currentDevice === 'desktop', onClick: () => onDeviceChange('desktop'), title: t('editor.canvas.toolbar.device.desktop') }), _jsx("div", { className: "w-px h-5 mx-1 bg-gray-300 dark:bg-gray-600" }), _jsx("button", { onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('🎨 CanvasToolbar: Theme toggle clicked');
                                toggleTheme();
                            }, className: `p-1.5 rounded transition-colors border border-gray-300 dark:border-gray-600 ${resolvedTheme === 'dark'
                                ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'}`, title: `Текущая тема канваса: ${getThemeLabel()}. Нажмите для смены.`, style: { minWidth: '32px', minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: getThemeIcon() }), _jsx("button", { onClick: toggleCodeView, className: `p-1.5 rounded transition-colors ${showCode
                                ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'}`, title: "Toggle code view", children: _jsx(FaCode, { size: 11 }) })] })] }) }));
};
const DeviceButton = ({ icon, active = false, onClick, title }) => {
    return (_jsx("button", { onClick: onClick, className: `p-1.5 rounded transition-colors ${active
            ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'}`, title: title, children: icon }));
};
export default CanvasToolbar;
//# sourceMappingURL=CanvasToolbar.js.map