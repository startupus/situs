import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './i18n'; // Инициализация i18n
import { SiteProvider } from './contexts/SiteContext';
import { UserProvider } from './contexts/UserContext';
import { ProjectProvider } from './contexts/ProjectContext';
// Legacy components moved to legacy folder
import { StudioInterface } from './components/legacy/StudioInterface';
import RedaktusEditor from './components/legacy/RedaktusEditor';
import ProjectWorkspace from './components/legacy/ProjectWorkspace';
import ProjectSelector from './pages/ProjectSelector';
import { useTheme } from './hooks/useTheme';
import SitusApp from './components/situs/SitusApp';
function App() {
    const { resolvedTheme } = useTheme();
    console.log("App component rendered, theme:", resolvedTheme);
    return (_jsx(HelmetProvider, { children: _jsx(UserProvider, { children: _jsx(ProjectProvider, { children: _jsx(Router, { children: _jsx("div", { className: `min-h-screen w-screen max-w-none overflow-x-hidden transition-colors duration-200 ${resolvedTheme === 'dark' ? 'bg-dark text-gray-1' : 'bg-gray text-black'}`, style: { width: '100vw', maxWidth: 'none' }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/situs", element: _jsx(SiteProvider, { children: _jsx(ProjectSelector, {}) }) }), _jsx(Route, { path: "/situs/project/:projectId", element: _jsx(SiteProvider, { children: _jsx(ProjectWorkspace, {}) }) }), _jsx(Route, { path: "/redaktus", element: _jsx("div", { className: "min-h-screen bg-white", children: _jsx(RedaktusEditor, { mode: "editor" }) }) }), _jsx(Route, { path: "/studio/*", element: _jsx(SiteProvider, { children: _jsx(StudioInterface, {}) }) }), _jsx(Route, { path: "/*", element: _jsx(SiteProvider, { children: _jsx(SitusApp, {}) }) })] }) }) }) }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map