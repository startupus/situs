import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import SitusLayout from './dashy/layouts/SitusLayout';
import SitusDashboard from './dashy/pages/SitusDashboard';
import ProjectsList from './dashy/pages/ProjectsList';
const TaildashProjectWorkspace = () => {
    return (_jsx(SitusLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(SitusDashboard, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectsList, {}) }), _jsx(Route, { path: "/projects/all", element: _jsx(ProjectsList, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
};
export default TaildashProjectWorkspace;
//# sourceMappingURL=TaildashProjectWorkspace.js.map