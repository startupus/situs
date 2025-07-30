import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaSearch, FaFile, FaCube, FaChevronDown, FaBlog, FaSun, FaMoon, FaChevronUp } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../LanguageSwitcher';
const VerticalNavbar = ({ availableBricks = [] }) => {
    const { theme, toggleTheme, resolvedTheme } = useTheme();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('pages');
    const handleToggleTheme = () => {
        console.log('🎨 VerticalNavbar: handleToggleTheme clicked!');
        toggleTheme();
    };
    return (_jsx("section", { className: "redaktus-vertical-navbar h-full border-r w-40 flex flex-col transition-colors duration-200 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "border-b flex-shrink-0 border-gray-200 dark:border-gray-700", children: _jsxs("nav", { className: "flex", children: [_jsx("div", { onClick: () => setActiveTab('pages'), className: `flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${activeTab === 'pages'
                                    ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                                    : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, children: t('editor.panels.pages') }), _jsx("div", { onClick: () => setActiveTab('entities'), className: `flex-1 px-3 py-3 text-sm cursor-pointer transition-colors ${activeTab === 'entities'
                                    ? 'text-gray-700 font-semibold border-b-2 border-gray-700 dark:text-gray-100 dark:border-gray-100'
                                    : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, children: t('editor.panels.entities') })] }) }), _jsx("div", { className: "p-4 border-b flex-shrink-0 border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: t('editor.buttons.searchPage'), className: "w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" }), _jsx(FaSearch, { className: "absolute left-2.5 top-2.5 text-gray-400", size: 14 })] }) }), _jsx("nav", { className: "flex-1 overflow-y-auto min-h-0", children: _jsxs("ul", { className: "p-4 space-y-2", children: [_jsxs(NavSection, { title: t('editor.panels.pages'), icon: _jsx(FaFile, { size: 12 }), count: 4, submenu: true, expanded: true, children: [_jsx(PageItem, { name: "About us" }), _jsx(PageItem, { name: "Contacts" }), _jsx(PageItem, { name: "Home", active: true }), _jsx(PageItem, { name: "Pricing" })] }), _jsxs(NavSection, { title: t('editor.panels.stories'), icon: _jsx(FaBlog, { size: 12 }), count: 12, submenu: true, children: [_jsx(PageItem, { name: "Getting Started" }), _jsx(PageItem, { name: "Advanced Features" }), _jsx(PageItem, { name: "Tutorials" })] }), _jsxs(NavSection, { title: t('editor.panels.entities'), icon: _jsx(FaCube, { size: 12 }), count: 8, submenu: true, children: [_jsx(PageItem, { name: "Users" }), _jsx(PageItem, { name: "Products" }), _jsx(PageItem, { name: "Categories" })] })] }) }), _jsx("div", { className: `p-4 border-t flex-shrink-0 ${resolvedTheme === 'dark' ? '!border-gray-700' : '!border-gray-200'}`, children: _jsxs("div", { className: "flex items-center justify-between space-x-2", children: [_jsx(LanguageSwitcher, { showLabel: false, size: "sm" }), _jsx("button", { onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🎨 VerticalNavbar: Button clicked!');
                                    handleToggleTheme();
                                }, className: "p-2 rounded-md transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700", title: "Toggle editor theme", children: resolvedTheme === 'dark' ? _jsx(FaSun, { size: 14 }) : _jsx(FaMoon, { size: 14 }) })] }) })] }) }));
};
const NavSection = ({ title, icon, count, submenu = false, expanded = false, children }) => {
    const [isExpanded, setIsExpanded] = useState(expanded);
    return (_jsxs("div", { children: [_jsxs("div", { onClick: () => submenu && setIsExpanded(!isExpanded), className: `flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${submenu ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''}`, children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: icon }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-200", children: title })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [count && (_jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300", children: count })), submenu && (_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: isExpanded ? _jsx(FaChevronUp, { size: 10 }) : _jsx(FaChevronDown, { size: 10 }) }))] })] }), submenu && isExpanded && (_jsx("div", { className: "ml-6 mt-1 space-y-1", children: children }))] }));
};
const PageItem = ({ name, active = false }) => {
    return (_jsx("li", { className: `px-2 py-1 rounded text-sm transition-colors cursor-pointer ${active
            ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
            : 'text-gray-600 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}`, children: name }));
};
const DraggableBlock = ({ name, type }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', type);
        e.dataTransfer.effectAllowed = 'copy';
    };
    return (_jsx("li", { draggable: true, onDragStart: handleDragStart, className: "px-2 py-1 rounded text-sm transition-colors cursor-move text-gray-600 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700", children: name }));
};
export default VerticalNavbar;
//# sourceMappingURL=VerticalNavbar.js.map