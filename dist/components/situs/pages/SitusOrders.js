import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../../api/services/orders.api';
import { ApiUtils } from '../../../api/client';
const SitusOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        type: '',
        sortBy: 'date',
        sortOrder: 'desc',
        page: 1,
        limit: 20
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    // Загрузка заказов
    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ordersApi.getOrders(filters);
            setOrders(response.orders);
            setPagination(response.pagination);
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
            console.error('Load orders error:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // Загрузка при изменении фильтров
    useEffect(() => {
        loadOrders();
    }, [filters]);
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Сбрасываем страницу при изменении фильтров
        }));
    };
    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };
    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await ordersApi.updateOrderStatus(orderId, status);
            await loadOrders(); // Перезагружаем список
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
        }
    };
    const getStatusDisplayName = (status) => {
        const statusNames = {
            new: 'Новый',
            processing: 'В обработке',
            completed: 'Завершен',
            cancelled: 'Отменен',
            refunded: 'Возврат'
        };
        return statusNames[status] || status;
    };
    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    const getTypeDisplayName = (type) => {
        const typeNames = {
            product: 'Товар',
            service: 'Услуга',
            form: 'Форма',
            subscription: 'Подписка'
        };
        return typeNames[type] || type;
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency || 'RUB'
        }).format(amount);
    };
    if (loading && orders.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\u0417\u0430\u043A\u0430\u0437\u044B" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043A\u0430\u0437\u043E\u0432: ", pagination.total] })] }) }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043A\u0430\u0437\u043E\u0432" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: pagination.total })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u041D\u043E\u0432\u044B\u0435" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: orders.filter(o => o.status === 'new').length })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u0412 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435" }), _jsx("p", { className: "text-2xl font-bold text-yellow-600", children: orders.filter(o => o.status === 'processing').length })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: orders.filter(o => o.status === 'completed').length })] })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u041F\u043E\u0438\u0441\u043A" }), _jsx("input", { type: "text", value: filters.search || '', onChange: (e) => handleFilterChange({ search: e.target.value }), placeholder: "\u041D\u043E\u043C\u0435\u0440 \u0437\u0430\u043A\u0430\u0437\u0430, \u043A\u043B\u0438\u0435\u043D\u0442...", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsxs("select", { value: filters.status || '', onChange: (e) => handleFilterChange({ status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B" }), _jsx("option", { value: "new", children: "\u041D\u043E\u0432\u044B\u0439" }), _jsx("option", { value: "processing", children: "\u0412 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435" }), _jsx("option", { value: "completed", children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D" }), _jsx("option", { value: "cancelled", children: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D" }), _jsx("option", { value: "refunded", children: "\u0412\u043E\u0437\u0432\u0440\u0430\u0442" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0422\u0438\u043F" }), _jsxs("select", { value: filters.type || '', onChange: (e) => handleFilterChange({ type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u0442\u0438\u043F\u044B" }), _jsx("option", { value: "product", children: "\u0422\u043E\u0432\u0430\u0440" }), _jsx("option", { value: "service", children: "\u0423\u0441\u043B\u0443\u0433\u0430" }), _jsx("option", { value: "form", children: "\u0424\u043E\u0440\u043C\u0430" }), _jsx("option", { value: "subscription", children: "\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430" }), _jsxs("select", { value: `${filters.sortBy}_${filters.sortOrder}`, onChange: (e) => {
                                        const [sortBy, sortOrder] = e.target.value.split('_');
                                        handleFilterChange({ sortBy: sortBy, sortOrder: sortOrder });
                                    }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "date_desc", children: "\u041D\u043E\u0432\u044B\u0435 \u0441\u043D\u0430\u0447\u0430\u043B\u0430" }), _jsx("option", { value: "date_asc", children: "\u0421\u0442\u0430\u0440\u044B\u0435 \u0441\u043D\u0430\u0447\u0430\u043B\u0430" }), _jsx("option", { value: "amount_desc", children: "\u041F\u043E \u0441\u0443\u043C\u043C\u0435 (\u0443\u0431\u044B\u0432.)" }), _jsx("option", { value: "amount_asc", children: "\u041F\u043E \u0441\u0443\u043C\u043C\u0435 (\u0432\u043E\u0437\u0440.)" })] })] })] }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0417\u0430\u043A\u0430\u0437" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u041A\u043B\u0438\u0435\u043D\u0442" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0422\u0438\u043F" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0421\u0443\u043C\u043C\u0430" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0414\u0430\u0442\u0430" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: orders.map((order) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: order.orderNumber }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: order.projectName })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: order.customerName }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: order.customerEmail })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", children: getTypeDisplayName(order.type) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(order.amount, order.currency) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`, children: getStatusDisplayName(order.status) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: formatDate(order.date) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handleViewOrder(order), className: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300", children: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440" }), order.status === 'new' && (_jsx("button", { onClick: () => handleUpdateOrderStatus(order.id, 'processing'), className: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300", children: "\u041F\u0440\u0438\u043D\u044F\u0442\u044C" })), order.status === 'processing' && (_jsx("button", { onClick: () => handleUpdateOrderStatus(order.id, 'completed'), className: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300", children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C" })), _jsx(Link, { to: `/projects/${order.projectId}`, className: "text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300", children: "\u041F\u0440\u043E\u0435\u043A\u0442" })] }) })] }, order.id))) })] }) }), pagination.totalPages > 1 && (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ", orders.length, " \u0438\u0437 ", pagination.total, " \u0437\u0430\u043A\u0430\u0437\u043E\u0432"] }), _jsxs("div", { className: "flex space-x-1", children: [_jsx("button", { onClick: () => handlePageChange(pagination.page - 1), disabled: pagination.page === 1, className: "px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: "\u041D\u0430\u0437\u0430\u0434" }), Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const page = i + Math.max(1, pagination.page - 2);
                                        return (_jsx("button", { onClick: () => handlePageChange(page), className: `px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm ${page === pagination.page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`, children: page }, page));
                                    }), _jsx("button", { onClick: () => handlePageChange(pagination.page + 1), disabled: pagination.page === pagination.totalPages, className: "px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] })] }))] }), isOrderModalOpen && selectedOrder && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: ["\u0414\u0435\u0442\u0430\u043B\u0438 \u0437\u0430\u043A\u0430\u0437\u0430 ", selectedOrder.orderNumber] }), _jsx("button", { onClick: () => setIsOrderModalOpen(false), className: "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u041F\u0440\u043E\u0435\u043A\u0442" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: selectedOrder.projectName })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`, children: getStatusDisplayName(selectedOrder.status) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u041A\u043B\u0438\u0435\u043D\u0442" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: selectedOrder.customerName }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: selectedOrder.customerEmail })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u0421\u0443\u043C\u043C\u0430" }), _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: formatCurrency(selectedOrder.amount, selectedOrder.currency) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: selectedOrder.description })] }), selectedOrder.items && selectedOrder.items.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "\u0422\u043E\u0432\u0430\u0440\u044B/\u0423\u0441\u043B\u0443\u0433\u0438" }), _jsx("div", { className: "border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-600", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300", children: "\u041A\u043E\u043B-\u0432\u043E" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300", children: "\u0426\u0435\u043D\u0430" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600", children: selectedOrder.items.map((item, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-4 py-2 text-sm text-gray-900 dark:text-white", children: item.name }), _jsx("td", { className: "px-4 py-2 text-sm text-gray-500 dark:text-gray-400", children: item.quantity }), _jsx("td", { className: "px-4 py-2 text-sm text-gray-900 dark:text-white", children: formatCurrency(item.price, selectedOrder.currency) })] }, index))) })] }) })] })), _jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [_jsx("button", { onClick: () => setIsOrderModalOpen(false), className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700", children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C" }), _jsx(Link, { to: `/projects/${selectedOrder.projectId}`, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043F\u0440\u043E\u0435\u043A\u0442\u0443" })] })] })] }) }))] }));
};
export default SitusOrders;
//# sourceMappingURL=SitusOrders.js.map