import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import ProjectOrdersChart from "./ProjectOrdersChart";
import ProjectTrafficChart from "./ProjectTrafficChart";
import ProjectConversionWidget from "./ProjectConversionWidget";
import { projectOrdersData, projectTrafficData, timeLabels, projectConversionData, } from "./dashboardData";
const SitusDashboard = () => {
    const recentProjects = [
        {
            id: 1,
            name: "Landing Page",
            status: "В разработке",
            lastModified: "2 часа назад",
            progress: 75,
        },
        {
            id: 2,
            name: "Portfolio Website",
            status: "Опубликован",
            lastModified: "1 день назад",
            progress: 100,
        },
        {
            id: 3,
            name: "E-commerce Store",
            status: "В разработке",
            lastModified: "3 дня назад",
            progress: 45,
        },
    ];
    const stats = [
        {
            title: "Всего проектов",
            value: "12",
            change: "+2",
            changeType: "increase",
            icon: (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current", children: _jsx("path", { d: "M3 3V21H21V3H3ZM5 5H19V19H5V5Z" }) })),
        },
        {
            title: "Активных сайтов",
            value: "8",
            change: "+1",
            changeType: "increase",
            icon: (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current", children: _jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z" }) })),
        },
        {
            title: "Компонентов",
            value: "156",
            change: "+12",
            changeType: "increase",
            icon: (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current", children: _jsx("path", { d: "M12 2L1 7L12 12L23 7L12 2ZM12 15L1 10V16L12 21L23 16V10L12 15Z" }) })),
        },
        {
            title: "Посетителей",
            value: "2.4K",
            change: "+15%",
            changeType: "increase",
            icon: (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current", children: [_jsx("path", { d: "M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" }), _jsx("path", { d: "M8 6C9.65685 6 11 7.34315 11 9C11 10.6569 9.65685 12 8 12C6.34315 12 5 10.6569 5 9C5 7.34315 6.34315 6 8 6Z" }), _jsx("path", { d: "M8 14C4.68629 14 2 16.6863 2 20H14C14 16.6863 11.3137 14 8 14Z" }), _jsx("path", { d: "M16 14C13.7909 14 12 15.7909 12 18V20H22V18C22 15.7909 20.2091 14 18 14H16Z" })] })),
        },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-dark dark:text-white", children: "\u041F\u0430\u043D\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F Situs" }), _jsx("p", { className: "text-body-color dark:text-dark-6 mt-1", children: "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 \u0432\u0430\u0448\u0443 \u0440\u0430\u0431\u043E\u0447\u0443\u044E \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0441\u0430\u0439\u0442\u043E\u0432" })] }), _jsxs(Link, { to: "/projects/new", className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90", children: [_jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", className: "fill-current", children: _jsx("path", { d: "M10 2C10.4142 2 10.75 2.33579 10.75 2.75V9.25H17.25C17.6642 9.25 18 9.58579 18 10C18 10.4142 17.6642 10.75 17.25 10.75H10.75V17.25C10.75 17.6642 10.4142 18 10 18C9.58579 18 9.25 17.6642 9.25 17.25V10.75H2.75C2.33579 10.75 2 10.4142 2 10C2 9.58579 2.33579 9.25 2.75 9.25H9.25V2.75C9.25 2.33579 9.58579 2 10 2Z" }) }), "\u041D\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442"] })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: stats.map((stat, index) => (_jsxs("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary", children: stat.icon }), _jsx("span", { className: `text-sm font-medium ${stat.changeType === "increase"
                                        ? "text-green-500"
                                        : "text-red-500"}`, children: stat.change })] }), _jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-xl font-semibold text-dark dark:text-white", children: stat.value }), _jsx("p", { className: "text-body-color dark:text-dark-6 text-sm", children: stat.title })] })] }, index))) }), _jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [_jsx(ProjectOrdersChart, { data: projectOrdersData }), _jsx(ProjectTrafficChart, { data: projectTrafficData, timeLabels: timeLabels })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [_jsx(ProjectConversionWidget, { projects: projectConversionData }), _jsxs("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("h5", { className: "text-xl font-semibold text-dark dark:text-white", children: "\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u044B" }), _jsx(Link, { to: "/projects", className: "text-primary hover:text-primary/80 text-sm font-medium", children: "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0432\u0441\u0435" })] }), _jsx("div", { className: "space-y-4", children: recentProjects.map((project) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", className: "fill-current", children: _jsx("path", { d: "M2.5 2.5H17.5V17.5H2.5V2.5ZM4 4V16H16V4H4Z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-dark dark:text-white", children: project.name }), _jsxs("p", { className: "text-body-color dark:text-dark-6 text-sm", children: ["\u0418\u0437\u043C\u0435\u043D\u0435\u043D ", project.lastModified] })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-2 w-20 rounded-full bg-gray-200 dark:bg-dark-3", children: _jsx("div", { className: "h-2 rounded-full bg-primary", style: { width: `${project.progress}%` } }) }), _jsxs("span", { className: "text-body-color dark:text-dark-6 text-sm", children: [project.progress, "%"] })] }), _jsx("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${project.status === "Опубликован"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"}`, children: project.status }), _jsx(Link, { to: `/projects/${project.id}`, className: "text-primary hover:text-primary/80", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", className: "fill-current", children: _jsx("path", { d: "M7 14L12 9L7 4V14Z" }) }) })] })] }, project.id))) })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsx(Link, { to: "/templates", className: "group rounded-lg bg-white p-6 shadow-1 transition-colors hover:bg-gray-50 dark:bg-dark-2 dark:shadow-box-dark dark:hover:bg-dark-3", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current", children: _jsx("path", { d: "M3 3V21H21V3H3ZM5 5H19V19H5V5ZM7 7V17H17V7H7Z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-dark dark:text-white group-hover:text-primary", children: "\u0428\u0430\u0431\u043B\u043E\u043D\u044B" }), _jsx("p", { className: "text-body-color dark:text-dark-6 text-sm", children: "\u0413\u043E\u0442\u043E\u0432\u044B\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B \u0441\u0430\u0439\u0442\u043E\u0432" })] })] }) }), _jsx(Link, { to: "/components", className: "group rounded-lg bg-white p-6 shadow-1 transition-colors hover:bg-gray-50 dark:bg-dark-2 dark:shadow-box-dark dark:hover:bg-dark-3", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current", children: _jsx("path", { d: "M12 2L1 7L12 12L23 7L12 2ZM12 15L1 10V16L12 21L23 16V10L12 15Z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-dark dark:text-white group-hover:text-primary", children: "\u041A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B" }), _jsx("p", { className: "text-body-color dark:text-dark-6 text-sm", children: "\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 UI \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432" })] })] }) }), _jsx(Link, { to: "/help", className: "group rounded-lg bg-white p-6 shadow-1 transition-colors hover:bg-gray-50 dark:bg-dark-2 dark:shadow-box-dark dark:hover:bg-dark-3", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current", children: _jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-dark dark:text-white group-hover:text-primary", children: "\u0421\u043F\u0440\u0430\u0432\u043A\u0430" }), _jsx("p", { className: "text-body-color dark:text-dark-6 text-sm", children: "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430" })] })] }) })] })] }));
};
export default SitusDashboard;
//# sourceMappingURL=SitusDashboard.js.map