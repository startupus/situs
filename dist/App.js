import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './i18n'; // Инициализация i18n
import { SiteProvider } from './contexts/SiteContext';
import { UserProvider } from './contexts/UserContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { AdminThemeProvider } from './contexts/AdminThemeContext';
import { EditorThemeProvider } from './contexts/EditorThemeContext';
import { ProjectThemeProvider } from './contexts/ProjectThemeContext';
// Legacy components moved to legacy folder
import { StudioInterface } from './components/legacy/StudioInterface';
import RedaktusEditor from './components/legacy/RedaktusEditor';
import ProjectWorkspace from './components/legacy/ProjectWorkspace';
import ProjectSelector from './pages/ProjectSelector';
import { useAdminTheme } from './contexts/AdminThemeContext';
import SitusApp from './components/situs/SitusApp';
import SitusNewApp from './components/situs-new/SitusApp';
function App() {
    return (_jsx(HelmetProvider, { children: _jsx(AdminThemeProvider, { children: _jsx(EditorThemeProvider, { children: _jsx(ProjectThemeProvider, { children: _jsx(UserProvider, { children: _jsx(ProjectProvider, { children: _jsx(Router, { children: _jsx(AppContent, {}) }) }) }) }) }) }) }));
}
function AppContent() {
    const { theme, isDarkMode } = useAdminTheme();
    console.log("App component rendered, admin theme:", theme, "dark mode:", isDarkMode);
    return (_jsx("div", { className: `min-h-screen w-screen max-w-none overflow-x-hidden transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`, style: { width: '100vw', maxWidth: 'none' }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/situs", element: _jsx(SiteProvider, { children: _jsx(ProjectSelector, {}) }) }), _jsx(Route, { path: "/situs/project/:projectId", element: _jsx(SiteProvider, { children: _jsx(ProjectWorkspace, {}) }) }), _jsx(Route, { path: "/redaktus", element: _jsx("div", { className: "min-h-screen bg-white", children: _jsx(RedaktusEditor, { mode: "editor" }) }) }), _jsx(Route, { path: "/studio/*", element: _jsx(SiteProvider, { children: _jsx(StudioInterface, {}) }) }), _jsx(Route, { path: "/situs-new/*", element: _jsx(SiteProvider, { children: _jsx(SitusNewApp, {}) }) }), _jsx(Route, { path: "/*", element: _jsx(SiteProvider, { children: _jsx(SitusApp, {}) }) })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map