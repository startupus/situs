import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import SitusSidebar from "../Sidebar/SitusSidebar";
import SitusHeader from "../Header/SitusHeader";
import { Outlet } from "react-router-dom";
const SitusMainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "relative flex min-h-screen w-full items-start", children: [_jsx(SitusSidebar, { sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen }), _jsxs("div", { className: "w-full xl:pl-[90px]", children: [_jsx(SitusHeader, { sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen }), _jsx("div", { className: "p-[30px]", children: _jsx(Outlet, {}) })] })] }) }));
};
export default SitusMainLayout;
//# sourceMappingURL=SitusMainLayout.js.map