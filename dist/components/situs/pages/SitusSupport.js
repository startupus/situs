import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const mockTickets = [
    {
        id: "TICK-001",
        title: "Проблема с подключением API",
        description: "Не могу подключиться к API компонентов. Получаю ошибку 401",
        status: "open",
        priority: "high",
        category: "technical",
        createdAt: new Date("2024-01-15T10:30:00"),
        updatedAt: new Date("2024-01-15T10:30:00"),
        responses: 0
    },
    {
        id: "TICK-002",
        title: "Вопрос по тарифам",
        description: "Хотел бы узнать подробности о корпоративном тарифе",
        status: "in_progress",
        priority: "medium",
        category: "billing",
        createdAt: new Date("2024-01-14T14:20:00"),
        updatedAt: new Date("2024-01-15T09:15:00"),
        responses: 2
    },
    {
        id: "TICK-003",
        title: "Предложение новой функции",
        description: "Было бы здорово добавить поддержку dark mode для всех компонентов",
        status: "closed",
        priority: "low",
        category: "feature",
        createdAt: new Date("2024-01-12T16:45:00"),
        updatedAt: new Date("2024-01-14T11:30:00"),
        responses: 4
    },
    {
        id: "TICK-004",
        title: "Ошибка в компоненте Modal",
        description: "Модальное окно не закрывается при нажатии на overlay",
        status: "open",
        priority: "urgent",
        category: "bug",
        createdAt: new Date("2024-01-15T12:00:00"),
        updatedAt: new Date("2024-01-15T12:00:00"),
        responses: 0
    },
    {
        id: "TICK-005",
        title: "Помощь с интеграцией",
        description: "Нужна консультация по интеграции TailGrids в существующий проект",
        status: "in_progress",
        priority: "medium",
        category: "other",
        createdAt: new Date("2024-01-13T09:30:00"),
        updatedAt: new Date("2024-01-15T08:45:00"),
        responses: 3
    }
];
const SitusSupport = () => {
    const [tickets, setTickets] = useState(mockTickets);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'closed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'open': return 'Открыт';
            case 'in_progress': return 'В работе';
            case 'closed': return 'Закрыт';
            default: return status;
        }
    };
    const getPriorityText = (priority) => {
        switch (priority) {
            case 'urgent': return 'Срочно';
            case 'high': return 'Высокий';
            case 'medium': return 'Средний';
            case 'low': return 'Низкий';
            default: return priority;
        }
    };
    const getCategoryText = (category) => {
        switch (category) {
            case 'technical': return 'Техническая';
            case 'billing': return 'Биллинг';
            case 'feature': return 'Функции';
            case 'bug': return 'Ошибка';
            case 'other': return 'Другое';
            default: return category;
        }
    };
    const formatDate = (date) => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });
    const getStatistics = () => {
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'open').length;
        const inProgress = tickets.filter(t => t.status === 'in_progress').length;
        const closed = tickets.filter(t => t.status === 'closed').length;
        return { total, open, inProgress, closed };
    };
    const stats = getStatistics();
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-dark dark:text-white", children: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430" }), _jsx("p", { className: "mt-2 text-body-color dark:text-dark-6", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F\u043C\u0438 \u0432 \u0441\u043B\u0443\u0436\u0431\u0443 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsx("button", { className: "rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435" }) })] }), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx("div", { className: "rounded-lg bg-white p-6 shadow dark:bg-dark-2", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20", children: _jsx("svg", { className: "h-5 w-5 text-blue-600 dark:text-blue-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-body-color dark:text-dark-6", children: "\u0412\u0441\u0435\u0433\u043E \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0439" }), _jsx("p", { className: "text-2xl font-semibold text-dark dark:text-white", children: stats.total })] })] }) }), _jsx("div", { className: "rounded-lg bg-white p-6 shadow dark:bg-dark-2", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20", children: _jsx("svg", { className: "h-5 w-5 text-yellow-600 dark:text-yellow-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-body-color dark:text-dark-6", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0445" }), _jsx("p", { className: "text-2xl font-semibold text-dark dark:text-white", children: stats.open })] })] }) }), _jsx("div", { className: "rounded-lg bg-white p-6 shadow dark:bg-dark-2", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20", children: _jsx("svg", { className: "h-5 w-5 text-orange-600 dark:text-orange-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" }) }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-body-color dark:text-dark-6", children: "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435" }), _jsx("p", { className: "text-2xl font-semibold text-dark dark:text-white", children: stats.inProgress })] })] }) }), _jsx("div", { className: "rounded-lg bg-white p-6 shadow dark:bg-dark-2", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20", children: _jsx("svg", { className: "h-5 w-5 text-green-600 dark:text-green-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-body-color dark:text-dark-6", children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0445" }), _jsx("p", { className: "text-2xl font-semibold text-dark dark:text-white", children: stats.closed })] })] }) })] })] }), _jsx("div", { className: "mb-6 rounded-lg bg-white p-6 shadow dark:bg-dark-2", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-dark dark:text-white", children: "\u041F\u043E\u0438\u0441\u043A" }), _jsx("input", { type: "text", placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E, ID...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark placeholder-dark-5 outline-hidden focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-dark dark:text-white", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary", children: [_jsx("option", { value: "all", children: "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B" }), _jsx("option", { value: "open", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0435" }), _jsx("option", { value: "in_progress", children: "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435" }), _jsx("option", { value: "closed", children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0435" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-dark dark:text-white", children: "\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442" }), _jsxs("select", { value: priorityFilter, onChange: (e) => setPriorityFilter(e.target.value), className: "w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary", children: [_jsx("option", { value: "all", children: "\u0412\u0441\u0435 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u044B" }), _jsx("option", { value: "urgent", children: "\u0421\u0440\u043E\u0447\u043D\u043E" }), _jsx("option", { value: "high", children: "\u0412\u044B\u0441\u043E\u043A\u0438\u0439" }), _jsx("option", { value: "medium", children: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439" }), _jsx("option", { value: "low", children: "\u041D\u0438\u0437\u043A\u0438\u0439" })] })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: () => {
                                    setStatusFilter('all');
                                    setPriorityFilter('all');
                                    setSearchQuery('');
                                }, className: "w-full rounded-lg border border-stroke px-3 py-2 text-dark transition-colors hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3", children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C" }) })] }) }), _jsxs("div", { className: "rounded-lg bg-white shadow dark:bg-dark-2", children: [_jsx("div", { className: "overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-stroke dark:divide-dark-3", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-dark-3", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6", children: "\u041E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6", children: "\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6", children: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6", children: "\u041E\u0442\u0432\u0435\u0442\u044B" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6", children: "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E" }), _jsx("th", { className: "relative px-6 py-3", children: _jsx("span", { className: "sr-only", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }) })] }) }), _jsx("tbody", { className: "divide-y divide-stroke bg-white dark:divide-dark-3 dark:bg-dark-2", children: filteredTickets.map((ticket) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-dark-3", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center", children: [_jsx("p", { className: "text-sm font-medium text-dark dark:text-white", children: ticket.title }), _jsxs("span", { className: "ml-2 text-xs text-body-color dark:text-dark-6", children: ["#", ticket.id] })] }), _jsx("p", { className: "mt-1 text-sm text-body-color dark:text-dark-6 line-clamp-2", children: ticket.description })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(ticket.status)}`, children: getStatusText(ticket.status) }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`, children: getPriorityText(ticket.priority) }) }), _jsx("td", { className: "px-6 py-4 text-sm text-body-color dark:text-dark-6", children: getCategoryText(ticket.category) }), _jsx("td", { className: "px-6 py-4 text-sm text-body-color dark:text-dark-6", children: ticket.responses }), _jsx("td", { className: "px-6 py-4 text-sm text-body-color dark:text-dark-6", children: formatDate(ticket.updatedAt) }), _jsx("td", { className: "px-6 py-4 text-right text-sm font-medium", children: _jsx("button", { className: "text-primary hover:text-primary/80", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" }) })] }, ticket.id))) })] }) }), filteredTickets.length === 0 && (_jsxs("div", { className: "py-12 text-center", children: [_jsx("svg", { className: "mx-auto h-12 w-12 text-body-color dark:text-dark-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("h3", { className: "mt-2 text-sm font-medium text-dark dark:text-white", children: "\u041E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B" }), _jsx("p", { className: "mt-1 text-sm text-body-color dark:text-dark-6", children: "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B \u0438\u043B\u0438 \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0435 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435." })] }))] })] }));
};
export default SitusSupport;
//# sourceMappingURL=SitusSupport.js.map