import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import SitusMainLayout from "./layouts/SitusMainLayout";
import SitusDashboard from "./pages/SitusDashboard";
import SitusProjects from "./pages/SitusProjects";
import SitusWebsites from "./pages/SitusWebsites";
import SitusStores from "./pages/SitusStores";
import SitusChatbots from "./pages/SitusChatbots";
import SitusOrders from "./pages/SitusOrders";
import SitusMarketing from "./pages/SitusMarketing";
import SitusUsers from "./pages/SitusUsers";
import SitusUsersNew from "./pages/SitusUsersNew";
import SitusSupport from "./pages/SitusSupport";
import SitusProfileSettings from "./pages/SitusProfileSettings";
import SitusSectionSettings from "./pages/SitusSectionSettings";
const SitusApp = () => {
    console.log("SitusApp component rendered");
    return (_jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(SitusMainLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(SitusDashboard, {}) }), _jsx(Route, { path: "projects", element: _jsx(SitusProjects, {}) }), _jsx(Route, { path: "projects/websites", element: _jsx(SitusWebsites, {}) }), _jsx(Route, { path: "projects/stores", element: _jsx(SitusStores, {}) }), _jsx(Route, { path: "projects/chatbots", element: _jsx(SitusChatbots, {}) }), _jsx(Route, { path: "orders", element: _jsx(SitusOrders, {}) }), _jsx(Route, { path: "marketing", element: _jsx(SitusMarketing, {}) }), _jsx(Route, { path: "users", element: _jsx(SitusUsers, {}) }), _jsx(Route, { path: "users/new", element: _jsx(SitusUsersNew, {}) }), _jsx(Route, { path: "support", element: _jsx(SitusSupport, {}) }), _jsx(Route, { path: "profile-settings", element: _jsx(SitusProfileSettings, {}) }), _jsx(Route, { path: "section-settings/*", element: _jsx(SitusSectionSettings, {}) }), _jsx(Route, { path: "*", element: _jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-dark dark:text-white", children: "404 - \u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" }), _jsx("p", { className: "text-body-color dark:text-dark-6 mt-2", children: "\u0417\u0430\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u043C\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" })] }) })] }) }));
};
export default SitusApp;
//# sourceMappingURL=SitusApp.js.map