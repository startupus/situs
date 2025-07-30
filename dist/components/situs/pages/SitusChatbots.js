import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// Компонент левой панели с подменю (копируем из SitusProjects)
const ProjectsSidebar = () => {
    const location = useLocation();
    const menuItems = [
        {
            link: "/projects",
            text: "Все проекты",
            icon: (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", className: "fill-current", children: [_jsx("path", { d: "M1.5 2.25C1.5 1.83579 1.83579 1.5 2.25 1.5H7.5C7.91421 1.5 8.25 1.83579 8.25 2.25V7.5C8.25 7.91421 7.91421 8.25 7.5 8.25H2.25C1.83579 8.25 1.5 7.91421 1.5 7.5V2.25ZM3 3V6.75H6.75V3H3Z" }), _jsx("path", { d: "M9.75 2.25C9.75 1.83579 10.0858 1.5 10.5 1.5H15.75C16.1642 1.5 16.5 1.83579 16.5 2.25V7.5C16.5 7.91421 16.1642 8.25 15.75 8.25H10.5C10.0858 8.25 9.75 7.91421 9.75 7.5V2.25ZM11.25 3V6.75H15V3H11.25Z" }), _jsx("path", { d: "M9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H15.75C16.1642 9.75 16.5 10.0858 16.5 10.5V15.75C16.5 16.1642 16.1642 16.5 15.75 16.5H10.5C10.0858 16.5 9.75 16.1642 9.75 15.75V10.5ZM11.25 11.25V15H15V11.25H11.25Z" }), _jsx("path", { d: "M1.5 10.5C1.5 10.0858 1.83579 9.75 2.25 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5V15.75C8.25 16.1642 7.91421 16.5 7.5 16.5H2.25C1.83579 16.5 1.5 16.1642 1.5 15.75V10.5ZM3 11.25V15H6.75V11.25H3Z" })] }))
        },
        {
            link: "/projects/websites",
            text: "Сайты",
            icon: (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", className: "fill-current", children: [_jsx("path", { d: "M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9C15 12.3137 12.3137 15 9 15Z" }), _jsx("path", { d: "M6 6H12V8H6V6ZM6 10H12V12H6V10Z" })] }))
        },
        {
            link: "/projects/stores",
            text: "Магазины",
            icon: (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", className: "fill-current", children: [_jsx("path", { d: "M2 2V4H3V13C3 13.5523 3.44772 14 4 14H14C14.5523 14 15 13.5523 15 13V4H16V2H2ZM4 4H14V13H4V4Z" }), _jsx("path", { d: "M6 6V8H7V6H6ZM9 6V8H10V6H9Z" })] }))
        },
        {
            link: "/projects/chatbots",
            text: "Чатботы",
            icon: (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", className: "fill-current", children: [_jsx("path", { d: "M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9C15 12.3137 12.3137 15 9 15Z" }), _jsx("path", { d: "M6 6.5C6 6.22386 6.22386 6 6.5 6H11.5C11.7761 6 12 6.22386 12 6.5V11.5C12 11.7761 11.7761 12 11.5 12H6.5C6.22386 12 6 11.7761 6 11.5V6.5Z" })] }))
        },
        {
            link: "/projects/landings",
            text: "Лендинги",
            icon: (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 18 18", className: "fill-current", children: _jsx("path", { d: "M3 3H15V5H3V3ZM3 7H15V9H3V7ZM3 11H15V13H3V11ZM3 15H15V17H3V15Z" }) }))
        },
        {
            link: "/projects/apps",
            text: "Приложения",
            icon: (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", className: "fill-current", children: [_jsx("path", { d: "M6 2H12C13.1046 2 14 2.89543 14 4V14C14 15.1046 13.1046 16 12 16H6C4.89543 16 4 15.1046 4 14V4C4 2.89543 4.89543 2 6 2ZM6 4V14H12V4H6Z" }), _jsx("path", { d: "M7 5H11V7H7V5ZM7 9H11V11H7V9Z" })] }))
        }
    ];
    return (_jsxs("div", { className: "w-64 bg-white dark:bg-dark-2 border-r border-stroke dark:border-dark-3 p-4", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-dark dark:text-white mb-2", children: "\u0420\u0430\u0437\u0434\u0435\u043B\u044B \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432" }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043F \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430" })] }), _jsx("nav", { children: _jsx("ul", { className: "space-y-1", children: menuItems.map((item, index) => (_jsx("li", { children: _jsxs(Link, { to: item.link, className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.link
                                ? "bg-primary text-white"
                                : "text-body-color hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-3"}`, children: [_jsx("span", { className: "flex-shrink-0", children: item.icon }), _jsx("span", { children: item.text })] }) }, index))) }) }), _jsxs("div", { className: "mt-8 pt-6 border-t border-stroke dark:border-dark-3", children: [_jsx("div", { className: "text-sm text-body-color dark:text-dark-6 mb-3", children: "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }), _jsxs(Link, { to: "/projects/new", className: "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors", children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", className: "fill-current", children: _jsx("path", { d: "M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z" }) }), "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442"] })] })] }));
};
// Моковые данные чат-ботов
const mockChatbots = [
    {
        id: 3,
        name: "Чат-бот поддержки 'Помощник24'",
        status: "development",
        url: "https://t.me/helper24_bot",
        createdAt: "2024-03-10",
        visitors: 850,
        orders: 120,
        revenue: 85000,
        platform: "Telegram",
        messages: 1250
    },
    {
        id: 6,
        name: "Чат-бот заказа пиццы 'ПиццаБот'",
        status: "active",
        url: "https://t.me/pizzabot",
        createdAt: "2024-02-15",
        visitors: 1800,
        orders: 450,
        revenue: 225000,
        platform: "Telegram",
        messages: 3200
    },
    {
        id: 9,
        name: "Чат-бот консультаций 'ЮристБот'",
        status: "active",
        url: "https://t.me/lawyer_bot",
        createdAt: "2024-01-25",
        visitors: 950,
        orders: 75,
        revenue: 150000,
        platform: "Telegram",
        messages: 2100
    }
];
const SitusChatbots = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredChatbots = mockChatbots.filter(chatbot => chatbot.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", children: "\u0410\u043A\u0442\u0438\u0432\u0435\u043D" }));
            case "development":
                return (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", children: "\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435" }));
            default:
                return (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", children: status }));
        }
    };
    return (_jsxs("div", { className: "flex", children: [_jsx(ProjectsSidebar, {}), _jsxs("div", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-dark dark:text-white", children: "\u0427\u0430\u0442\u0431\u043E\u0442\u044B" }), _jsx("p", { className: "text-body-color dark:text-dark-6 mt-2", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0447\u0430\u0442-\u0431\u043E\u0442\u0430\u043C\u0438 \u0438 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u0435\u0439" })] }), _jsxs(Link, { to: "/projects/new?type=chatbot", className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors", children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", className: "fill-current", children: _jsx("path", { d: "M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z" }) }), "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0447\u0430\u0442-\u0431\u043E\u0442"] })] }), _jsx("div", { className: "mt-6", children: _jsxs("div", { className: "relative max-w-md", children: [_jsx("input", { type: "text", placeholder: "\u041F\u043E\u0438\u0441\u043A \u0447\u0430\u0442-\u0431\u043E\u0442\u043E\u0432...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 pl-10 text-body-color placeholder-body-color outline-none transition focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:placeholder-dark-6" }), _jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", className: "fill-current absolute left-3 top-1/2 -translate-y-1/2 text-body-color dark:text-dark-6", children: _jsx("path", { d: "M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 9.29583 13.5892 10.4957 12.8907 11.4765L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L11.4765 12.8907C10.4957 13.5892 9.29583 14 8 14C4.68629 14 2 11.3137 2 8Z" }) })] }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredChatbots.map((chatbot) => (_jsxs("div", { className: "bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6 hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", className: "fill-current text-purple-500", children: [_jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" }), _jsx("path", { d: "M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" }), _jsx("path", { d: "M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z" }), _jsx("path", { d: "M12 17C10.8954 17 10 16.1046 10 15H14C14 16.1046 13.1046 17 12 17Z" })] }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-dark dark:text-white text-sm", children: chatbot.name }), _jsx("p", { className: "text-xs text-body-color dark:text-dark-6", children: chatbot.platform })] })] }), getStatusBadge(chatbot.status)] }), _jsx("div", { className: "mb-4", children: _jsx("a", { href: chatbot.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary hover:text-primary/80 text-sm break-all", children: chatbot.url }) }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-semibold text-dark dark:text-white", children: chatbot.visitors.toLocaleString() }), _jsx("div", { className: "text-xs text-body-color dark:text-dark-6", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-semibold text-dark dark:text-white", children: chatbot.messages }), _jsx("div", { className: "text-xs text-body-color dark:text-dark-6", children: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-semibold text-dark dark:text-white", children: chatbot.orders }), _jsx("div", { className: "text-xs text-body-color dark:text-dark-6", children: "\u0417\u0430\u043A\u0430\u0437\u044B" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: `/projects/${chatbot.id}/edit`, className: "flex-1 text-center px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), _jsx(Link, { to: `/projects/${chatbot.id}/logs`, className: "flex-1 text-center px-3 py-2 text-sm font-medium text-body-color border border-stroke dark:border-dark-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors", children: "\u041B\u043E\u0433\u0438" })] })] }, chatbot.id))) }), filteredChatbots.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsxs("svg", { width: "64", height: "64", viewBox: "0 0 64 64", className: "fill-current text-gray-400 dark:text-dark-6 mx-auto mb-4", children: [_jsx("path", { d: "M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C21.177 52 12 42.823 12 32C12 21.177 21.177 12 32 12C42.823 12 52 21.177 52 32C52 42.823 42.823 52 32 52Z" }), _jsx("path", { d: "M32 20C25.373 20 20 25.373 20 32C20 38.627 25.373 44 32 44C38.627 44 44 38.627 44 32C44 25.373 38.627 20 32 20ZM32 40C27.589 40 24 36.411 24 32C24 27.589 27.589 24 32 24C36.411 24 40 27.589 40 32C40 36.411 36.411 40 32 40Z" })] }), _jsx("h3", { className: "text-lg font-semibold text-dark dark:text-white mb-2", children: "\u0427\u0430\u0442-\u0431\u043E\u0442\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B" }), _jsx("p", { className: "text-body-color dark:text-dark-6 mb-4", children: searchTerm
                                    ? "Попробуйте изменить поисковый запрос"
                                    : "Создайте свой первый чат-бот" }), !searchTerm && (_jsxs(Link, { to: "/projects/new?type=chatbot", className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors", children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", className: "fill-current", children: _jsx("path", { d: "M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z" }) }), "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0447\u0430\u0442-\u0431\u043E\u0442"] }))] }))] })] }));
};
export default SitusChatbots;
//# sourceMappingURL=SitusChatbots.js.map