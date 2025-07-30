import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '../hooks/useTheme';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
const ThemeToggle = () => {
    const { theme, resolvedTheme, toggleTheme } = useTheme();
    const getIcon = () => {
        if (theme === 'system') {
            return _jsx(FiMonitor, { className: "w-4 h-4" });
        }
        else if (resolvedTheme === 'dark') {
            return _jsx(FiSun, { className: "w-4 h-4" });
        }
        else {
            return _jsx(FiMoon, { className: "w-4 h-4" });
        }
    };
    const getLabel = () => {
        if (theme === 'system') {
            return `Система (${resolvedTheme === 'dark' ? 'темная' : 'светлая'})`;
        }
        else if (resolvedTheme === 'dark') {
            return 'Светлая тема';
        }
        else {
            return 'Темная тема';
        }
    };
    return (_jsxs("button", { onClick: toggleTheme, className: "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200", title: getLabel(), children: [getIcon(), _jsx("span", { children: getLabel() })] }));
};
export default ThemeToggle;
//# sourceMappingURL=ThemeToggle.js.map