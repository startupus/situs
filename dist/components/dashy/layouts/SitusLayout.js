import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import Sidebar from "../Sidebar";
import DarkModeToggle from "../DarkModeToggle";
import Header from "../Header/index";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
const SitusLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { resolvedTheme } = useTheme();
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: `relative flex items-start w-full min-h-screen ${resolvedTheme === 'dark' ? 'dark' : ''}`, children: [_jsx(Sidebar, { sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen }), _jsxs("div", { className: "w-full xl:pl-[300px]", children: [_jsx(Header, { sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen }), _jsx("div", { className: "p-[30px]", children: _jsx(Outlet, {}) })] })] }), _jsx(DarkModeToggle, {})] }));
};
export default SitusLayout;
//# sourceMappingURL=SitusLayout.js.map