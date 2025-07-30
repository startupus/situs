import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FiShoppingBag, FiMail, FiPhone, FiUser, FiCalendar, FiClock, FiDollarSign, FiPackage, FiEye, FiCheck, FiX, FiMoreHorizontal, FiBell } from 'react-icons/fi';
const OrdersSection = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    // Моковые данные заказов и заявок
    const [orders] = useState([
        {
            id: 'ORD-001',
            type: 'ecommerce',
            status: 'new',
            customerName: 'Анна Петрова',
            customerEmail: 'anna@example.com',
            customerPhone: '+7 (912) 345-67-89',
            amount: 3500,
            currency: 'RUB',
            items: [
                { id: '1', name: 'Футболка базовая', quantity: 2, price: 1200 },
                { id: '2', name: 'Джинсы классические', quantity: 1, price: 3500 }
            ],
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
        },
        {
            id: 'ORD-002',
            type: 'contact',
            status: 'new',
            customerName: 'Михаил Иванов',
            customerEmail: 'mikhail@company.ru',
            customerPhone: '+7 (495) 123-45-67',
            message: 'Интересует разработка корпоративного сайта для нашей компании. Нужна консультация по функционалу и стоимости.',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
        },
        {
            id: 'ORD-003',
            type: 'callback',
            status: 'processing',
            customerName: 'Елена Смирнова',
            customerEmail: 'elena@example.com',
            customerPhone: '+7 (921) 876-54-32',
            message: 'Заказать обратный звонок для консультации по интернет-магазину',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
        },
        {
            id: 'ORD-004',
            type: 'ecommerce',
            status: 'completed',
            customerName: 'Дмитрий Козлов',
            customerEmail: 'dmitriy@example.com',
            amount: 5000,
            currency: 'RUB',
            items: [
                { id: '3', name: 'Кроссовки спортивные', quantity: 1, price: 5000 }
            ],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'low'
        },
        {
            id: 'ORD-005',
            type: 'contact',
            status: 'new',
            customerName: 'Ольга Федорова',
            customerEmail: 'olga@startup.io',
            message: 'Хотим создать лендинг для нашего стартапа. Когда можем обсудить детали?',
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            priority: 'high'
        }
    ]);
    const getFilteredOrders = () => {
        let filtered = orders;
        if (activeTab !== 'all') {
            if (activeTab === 'new') {
                filtered = filtered.filter(order => order.status === 'new');
            }
            else {
                filtered = filtered.filter(order => order.type === activeTab);
            }
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    };
    const getOrderTypeIcon = (type) => {
        switch (type) {
            case 'ecommerce': return FiShoppingBag;
            case 'contact': return FiMail;
            case 'callback': return FiPhone;
            default: return FiPackage;
        }
    };
    const getOrderTypeName = (type) => {
        switch (type) {
            case 'ecommerce': return 'Заказ';
            case 'contact': return 'Заявка';
            case 'callback': return 'Обратный звонок';
            default: return 'Заявка';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };
    const getStatusName = (status) => {
        switch (status) {
            case 'new': return 'Новый';
            case 'processing': return 'В работе';
            case 'completed': return 'Выполнен';
            case 'cancelled': return 'Отменен';
            default: return status;
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-red-500';
            case 'medium': return 'border-l-yellow-500';
            case 'low': return 'border-l-green-500';
            default: return 'border-l-gray-300';
        }
    };
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays > 0) {
            return `${diffDays} дн. назад`;
        }
        else if (diffHours > 0) {
            return `${diffHours} ч. назад`;
        }
        else {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes} мин. назад`;
        }
    };
    const handleStatusChange = (orderId, newStatus) => {
        // Здесь будет логика обновления статуса
        console.log(`Изменение статуса заказа ${orderId} на ${newStatus}`);
    };
    const newOrdersCount = orders.filter(order => order.status === 'new').length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\u0417\u0430\u043A\u0430\u0437\u044B \u0438 \u0437\u0430\u044F\u0432\u043A\u0438" }), newOrdersCount > 0 && (_jsxs("div", { className: "flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-900 rounded-full", children: [_jsx(FiBell, { className: "w-4 h-4 text-red-600 dark:text-red-400" }), _jsxs("span", { className: "text-sm font-medium text-red-600 dark:text-red-400", children: [newOrdersCount, " \u043D\u043E\u0432\u044B\u0445"] })] }))] }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "all", children: "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B" }), _jsx("option", { value: "new", children: "\u041D\u043E\u0432\u044B\u0435" }), _jsx("option", { value: "processing", children: "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435" }), _jsx("option", { value: "completed", children: "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0435" }), _jsx("option", { value: "cancelled", children: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0435" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-red-100 dark:bg-red-900 rounded-lg", children: _jsx(FiBell, { className: "w-6 h-6 text-red-600 dark:text-red-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u041D\u043E\u0432\u044B\u0435" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: orders.filter(o => o.status === 'new').length })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg", children: _jsx(FiClock, { className: "w-6 h-6 text-yellow-600 dark:text-yellow-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: orders.filter(o => o.status === 'processing').length })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900 rounded-lg", children: _jsx(FiShoppingBag, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u0417\u0430\u043A\u0430\u0437\u044B" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: orders.filter(o => o.type === 'ecommerce').length })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 dark:bg-green-900 rounded-lg", children: _jsx(FiDollarSign, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u0412\u044B\u0440\u0443\u0447\u043A\u0430" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [orders.filter(o => o.type === 'ecommerce' && o.status === 'completed')
                                                    .reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString(), " \u20BD"] })] })] }) })] }), _jsx("div", { className: "border-b border-gray-200 dark:border-gray-700", children: _jsx("nav", { className: "flex space-x-8", children: [
                        { id: 'all', label: 'Все', count: orders.length },
                        { id: 'new', label: 'Новые', count: orders.filter(o => o.status === 'new').length },
                        { id: 'ecommerce', label: 'Заказы', count: orders.filter(o => o.type === 'ecommerce').length },
                        { id: 'contact', label: 'Заявки', count: orders.filter(o => o.type !== 'ecommerce').length }
                    ].map(({ id, label, count }) => (_jsxs("button", { onClick: () => setActiveTab(id), className: `flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`, children: [_jsx("span", { children: label }), count > 0 && (_jsx("span", { className: "px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400", children: count }))] }, id))) }) }), _jsx("div", { className: "space-y-4", children: getFilteredOrders().map((order) => {
                    const TypeIcon = getOrderTypeIcon(order.type);
                    return (_jsx("div", { className: `bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 ${getPriorityColor(order.priority)}`, children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start space-x-4 flex-1", children: [_jsx("div", { className: "p-2 bg-gray-100 dark:bg-gray-700 rounded-lg", children: _jsx(TypeIcon, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: order.id }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`, children: getStatusName(order.status) }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: getOrderTypeName(order.type) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FiUser, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white font-medium", children: order.customerName })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FiMail, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: order.customerEmail })] }), order.customerPhone && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FiPhone, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: order.customerPhone })] }))] }), order.amount && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FiDollarSign, { className: "w-4 h-4 text-green-500" }), _jsxs("span", { className: "text-sm font-medium text-green-600 dark:text-green-400", children: [order.amount.toLocaleString(), " ", order.currency] }), order.items && (_jsxs("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["(", order.items.reduce((sum, item) => sum + item.quantity, 0), " \u0442\u043E\u0432\u0430\u0440\u043E\u0432)"] }))] })), order.message && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2", children: order.message }))] })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "text-right", children: _jsxs("div", { className: "flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400", children: [_jsx(FiCalendar, { className: "w-4 h-4" }), _jsx("span", { children: formatTime(order.createdAt) })] }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => setSelectedOrder(order), className: "p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiEye, { className: "w-4 h-4" }) }), order.status === 'new' && (_jsx("button", { onClick: () => handleStatusChange(order.id, 'processing'), className: "p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiCheck, { className: "w-4 h-4" }) })), _jsx("button", { className: "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiMoreHorizontal, { className: "w-4 h-4" }) })] })] })] }) }) }, order.id));
                }) }), getFilteredOrders().length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(FiPackage, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "\u0417\u0430\u043A\u0430\u0437\u043E\u0432 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0417\u0430\u043A\u0430\u0437\u044B \u0438 \u0437\u0430\u044F\u0432\u043A\u0438 \u0431\u0443\u0434\u0443\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0437\u0434\u0435\u0441\u044C" })] })), selectedOrder && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: ["\u0414\u0435\u0442\u0430\u043B\u0438 ", selectedOrder.type === 'ecommerce' ? 'заказа' : 'заявки', " ", selectedOrder.id] }), _jsx("button", { onClick: () => setSelectedOrder(null), className: "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300", children: _jsx(FiX, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-md font-medium text-gray-900 dark:text-white mb-3", children: "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u043A\u043B\u0438\u0435\u043D\u0442\u0435" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(FiUser, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-gray-900 dark:text-white", children: selectedOrder.customerName })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(FiMail, { className: "w-4 h-4 text-gray-400" }), _jsx("a", { href: `mailto:${selectedOrder.customerEmail}`, className: "text-blue-600 dark:text-blue-400 hover:underline", children: selectedOrder.customerEmail })] }), selectedOrder.customerPhone && (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(FiPhone, { className: "w-4 h-4 text-gray-400" }), _jsx("a", { href: `tel:${selectedOrder.customerPhone}`, className: "text-blue-600 dark:text-blue-400 hover:underline", children: selectedOrder.customerPhone })] }))] })] }), selectedOrder.items && (_jsxs("div", { children: [_jsx("h4", { className: "text-md font-medium text-gray-900 dark:text-white mb-3", children: "\u0422\u043E\u0432\u0430\u0440\u044B" }), _jsxs("div", { className: "space-y-3", children: [selectedOrder.items.map((item) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: item.name }), _jsxs("span", { className: "text-gray-500 dark:text-gray-400 ml-2", children: ["x", item.quantity] })] }), _jsxs("span", { className: "font-medium text-gray-900 dark:text-white", children: [(item.price * item.quantity).toLocaleString(), " \u20BD"] })] }, item.id))), _jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600", children: [_jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: "\u0418\u0442\u043E\u0433\u043E:" }), _jsxs("span", { className: "font-semibold text-lg text-gray-900 dark:text-white", children: [selectedOrder.amount?.toLocaleString(), " ", selectedOrder.currency] })] })] })] })), selectedOrder.message && (_jsxs("div", { children: [_jsx("h4", { className: "text-md font-medium text-gray-900 dark:text-white mb-3", children: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg", children: selectedOrder.message })] })), _jsxs("div", { className: "flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600", children: [_jsx("button", { onClick: () => setSelectedOrder(null), className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C" }), selectedOrder.status === 'new' && (_jsx("button", { onClick: () => {
                                                    handleStatusChange(selectedOrder.id, 'processing');
                                                    setSelectedOrder(null);
                                                }, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\u0412\u0437\u044F\u0442\u044C \u0432 \u0440\u0430\u0431\u043E\u0442\u0443" }))] })] })] }) }) }))] }));
};
export default OrdersSection;
//# sourceMappingURL=OrdersSection.js.map