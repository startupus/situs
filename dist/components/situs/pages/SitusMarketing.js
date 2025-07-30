import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const SitusMarketing = () => {
    const [selectedProject, setSelectedProject] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    // Mock data для проектов
    const marketingProjects = [
        {
            id: "1",
            name: "Корпоративный сайт",
            type: "website",
            conversionRate: 3.2,
            monthlyVisitors: 15420,
            revenue: 245000,
            roi: 380
        },
        {
            id: "2",
            name: "Интернет-магазин",
            type: "store",
            conversionRate: 2.8,
            monthlyVisitors: 8650,
            revenue: 156000,
            roi: 420
        },
        {
            id: "3",
            name: "Чат-бот поддержки",
            type: "chatbot",
            conversionRate: 1.9,
            monthlyVisitors: 3200,
            revenue: 45000,
            roi: 280
        }
    ];
    // Mock data для маркетинговых инструментов
    const marketingTools = [
        {
            id: "1",
            name: "Google Ads",
            category: "advertising",
            description: "Контекстная реклама в поисковых системах",
            icon: "🎯",
            status: "active",
            performance: 92
        },
        {
            id: "2",
            name: "SEO оптимизация",
            category: "seo",
            description: "Продвижение в органической выдаче",
            icon: "🔍",
            status: "active",
            performance: 85
        },
        {
            id: "3",
            name: "Email рассылки",
            category: "email",
            description: "Автоматизированный email-маркетинг",
            icon: "📧",
            status: "active",
            performance: 78
        },
        {
            id: "4",
            name: "Социальные сети",
            category: "social",
            description: "SMM продвижение в социальных сетях",
            icon: "📱",
            status: "pending",
            performance: 65
        },
        {
            id: "5",
            name: "Яндекс.Метрика",
            category: "analytics",
            description: "Глубокая аналитика поведения пользователей",
            icon: "📊",
            status: "active",
            performance: 95
        }
    ];
    // Mock data для партнерских программ
    const partnerPrograms = [
        {
            id: "1",
            name: "Реферальная программа",
            type: "referral",
            commission: 15,
            activePartners: 24,
            monthlyEarnings: 48500,
            status: "active"
        },
        {
            id: "2",
            name: "Афилиатская сеть",
            type: "affiliate",
            commission: 8,
            activePartners: 156,
            monthlyEarnings: 127300,
            status: "active"
        },
        {
            id: "3",
            name: "API интеграции",
            type: "integration",
            commission: 25,
            activePartners: 12,
            monthlyEarnings: 89400,
            status: "paused"
        }
    ];
    const getProjectTypeIcon = (type) => {
        switch (type) {
            case "website": return "🌐";
            case "store": return "🛒";
            case "chatbot": return "🤖";
            default: return "📄";
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case "seo": return "🔍";
            case "advertising": return "🎯";
            case "email": return "📧";
            case "social": return "📱";
            case "analytics": return "📊";
            case "partnerships": return "🤝";
            default: return "⚙️";
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
            case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
            case "inactive": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
            case "paused": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
        }
    };
    const filteredTools = marketingTools.filter(tool => selectedCategory === "all" || tool.category === selectedCategory);
    const totalRevenue = marketingProjects.reduce((sum, project) => sum + project.revenue, 0);
    const averageROI = marketingProjects.reduce((sum, project) => sum + project.roi, 0) / marketingProjects.length;
    const totalVisitors = marketingProjects.reduce((sum, project) => sum + project.monthlyVisitors, 0);
    const totalPartnerEarnings = partnerPrograms.reduce((sum, program) => sum + program.monthlyEarnings, 0);
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsxs("div", { className: "w-80 border-r border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-dark dark:text-white", children: "\u041C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433" }), _jsx("p", { className: "text-body-color dark:text-dark-6 mt-2", children: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430 \u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044F \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "mb-3 text-lg font-medium text-dark dark:text-white", children: "\u041F\u0440\u043E\u0435\u043A\u0442\u044B" }), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { onClick: () => setSelectedProject("all"), className: `w-full rounded-lg p-3 text-left transition-colors ${selectedProject === "all"
                                            ? "bg-primary text-white"
                                            : "hover:bg-gray-50 dark:hover:bg-dark-3"}`, children: "\uD83D\uDCCA \u0412\u0441\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u044B" }), marketingProjects.map((project) => (_jsx("button", { onClick: () => setSelectedProject(project.id), className: `w-full rounded-lg p-3 text-left transition-colors ${selectedProject === project.id
                                            ? "bg-primary text-white"
                                            : "hover:bg-gray-50 dark:hover:bg-dark-3"}`, children: _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-2", children: getProjectTypeIcon(project.type) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: project.name }), _jsxs("div", { className: "text-sm opacity-70", children: ["ROI: ", project.roi, "%"] })] })] }) }, project.id)))] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "mb-3 text-lg font-medium text-dark dark:text-white", children: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u043E\u0432" }), _jsx("div", { className: "space-y-2", children: ["all", "seo", "advertising", "email", "social", "analytics", "partnerships"].map((category) => (_jsx("button", { onClick: () => setSelectedCategory(category), className: `w-full rounded-lg p-2 text-left transition-colors ${selectedCategory === category
                                        ? "bg-primary text-white"
                                        : "hover:bg-gray-50 dark:hover:bg-dark-3"}`, children: _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-2", children: getCategoryIcon(category) }), category === "all" ? "Все категории" :
                                                category === "seo" ? "SEO" :
                                                    category === "advertising" ? "Реклама" :
                                                        category === "email" ? "Email-маркетинг" :
                                                            category === "social" ? "Соцсети" :
                                                                category === "analytics" ? "Аналитика" :
                                                                    category === "partnerships" ? "Партнерство" : category] }) }, category))) })] })] }), _jsxs("div", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: [_jsx("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800", children: _jsx("span", { className: "text-xl", children: "\uD83D\uDCB0" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-dark dark:text-white", children: [new Intl.NumberFormat('ru-RU').format(totalRevenue), " \u20BD"] }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u041E\u0431\u0449\u0430\u044F \u0432\u044B\u0440\u0443\u0447\u043A\u0430" })] })] }) }), _jsx("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800", children: _jsx("span", { className: "text-xl", children: "\uD83D\uDCC8" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-dark dark:text-white", children: [Math.round(averageROI), "%"] }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 ROI" })] })] }) }), _jsx("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800", children: _jsx("span", { className: "text-xl", children: "\uD83D\uDC65" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-dark dark:text-white", children: new Intl.NumberFormat('ru-RU').format(totalVisitors) }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u041F\u043E\u0441\u0435\u0442\u0438\u0442\u0435\u043B\u0438/\u043C\u0435\u0441\u044F\u0446" })] })] }) }), _jsx("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-800", children: _jsx("span", { className: "text-xl", children: "\uD83E\uDD1D" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-dark dark:text-white", children: [new Intl.NumberFormat('ru-RU').format(totalPartnerEarnings), " \u20BD"] }), _jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u041F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u043A\u0438\u0435 \u0434\u043E\u0445\u043E\u0434\u044B" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-8 xl:grid-cols-2", children: [_jsxs("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("h5", { className: "text-xl font-semibold text-dark dark:text-white", children: "\u041C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433\u043E\u0432\u044B\u0435 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B" }), _jsx("button", { className: "rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark", children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442" })] }), _jsx("div", { className: "space-y-4", children: filteredTools.map((tool) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-3 text-2xl", children: tool.icon }), _jsxs("div", { children: [_jsx("h6", { className: "font-medium text-dark dark:text-white", children: tool.name }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: tool.description })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: `inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(tool.status)}`, children: tool.status === "active" ? "Активен" :
                                                                tool.status === "pending" ? "Ожидает" : "Неактивен" }), _jsxs("div", { className: "mt-1 text-sm font-medium text-dark dark:text-white", children: [tool.performance, "%"] })] })] }, tool.id))) })] }), _jsxs("div", { className: "rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("h5", { className: "text-xl font-semibold text-dark dark:text-white", children: "\u041F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u043A\u0438\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B" }), _jsx("button", { className: "rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0443" })] }), _jsx("div", { className: "space-y-4", children: partnerPrograms.map((program) => (_jsxs("div", { className: "rounded-lg border border-stroke p-4 dark:border-dark-3", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsx("h6", { className: "font-medium text-dark dark:text-white", children: program.name }), _jsx("div", { className: `inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(program.status)}`, children: program.status === "active" ? "Активна" : "Приостановлена" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u041A\u043E\u043C\u0438\u0441\u0441\u0438\u044F" }), _jsxs("p", { className: "font-medium text-dark dark:text-white", children: [program.commission, "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u041F\u0430\u0440\u0442\u043D\u0435\u0440\u044B" }), _jsx("p", { className: "font-medium text-dark dark:text-white", children: program.activePartners })] }), _jsxs("div", { children: [_jsx("p", { className: "text-body-color dark:text-dark-6", children: "\u0414\u043E\u0445\u043E\u0434/\u043C\u0435\u0441\u044F\u0446" }), _jsxs("p", { className: "font-medium text-dark dark:text-white", children: [new Intl.NumberFormat('ru-RU').format(program.monthlyEarnings), " \u20BD"] })] })] })] }, program.id))) })] })] }), _jsxs("div", { className: "mt-8 rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark", children: [_jsx("h5", { className: "mb-6 text-xl font-semibold text-dark dark:text-white", children: "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u043F\u043E \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044E" }), _jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [_jsxs("div", { className: "rounded-lg border border-stroke p-4 dark:border-dark-3", children: [_jsxs("div", { className: "mb-3 flex items-center", children: [_jsx("span", { className: "mr-2 text-xl", children: "\uD83C\uDFAF" }), _jsx("h6", { className: "font-medium text-dark dark:text-white", children: "\u0420\u0435\u0442\u0430\u0440\u0433\u0435\u0442\u0438\u043D\u0433" })] }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0440\u0435\u0442\u0430\u0440\u0433\u0435\u0442\u0438\u043D\u0433 \u0434\u043B\u044F \u043F\u043E\u0432\u044B\u0448\u0435\u043D\u0438\u044F \u043A\u043E\u043D\u0432\u0435\u0440\u0441\u0438\u0438 \u043D\u0430 15-25%" }), _jsx("button", { className: "mt-3 text-sm text-primary hover:underline", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u2192" })] }), _jsxs("div", { className: "rounded-lg border border-stroke p-4 dark:border-dark-3", children: [_jsxs("div", { className: "mb-3 flex items-center", children: [_jsx("span", { className: "mr-2 text-xl", children: "\uD83D\uDCE7" }), _jsx("h6", { className: "font-medium text-dark dark:text-white", children: "Email-\u0432\u043E\u0440\u043E\u043D\u043A\u0430" })] }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0438\u0440\u0443\u0439\u0442\u0435 email-\u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0434\u043B\u044F \u0443\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u044F LTV" }), _jsx("button", { className: "mt-3 text-sm text-primary hover:underline", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0432\u043E\u0440\u043E\u043D\u043A\u0443 \u2192" })] }), _jsxs("div", { className: "rounded-lg border border-stroke p-4 dark:border-dark-3", children: [_jsxs("div", { className: "mb-3 flex items-center", children: [_jsx("span", { className: "mr-2 text-xl", children: "\uD83D\uDCA1" }), _jsx("h6", { className: "font-medium text-dark dark:text-white", children: "A/B \u0442\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435" })] }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u0442\u0435\u0441\u0442\u044B \u043B\u0435\u043D\u0434\u0438\u043D\u0433\u043E\u0432 \u0434\u043B\u044F \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u0438 \u043A\u043E\u043D\u0432\u0435\u0440\u0441\u0438\u0438" }), _jsx("button", { className: "mt-3 text-sm text-primary hover:underline", children: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0442\u0435\u0441\u0442 \u2192" })] })] })] })] })] }));
};
export default SitusMarketing;
//# sourceMappingURL=SitusMarketing.js.map