import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { usersApi } from '../../../api/services/users.api';
import { ApiUtils } from '../../../api/client';
import UserModal from '../components/UserModal';
import RolePermissionsModal from '../components/RolePermissionsModal';
const SitusUsers = () => {
    const [users, setUsers] = useState([]);
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
        role: '',
        status: '',
        sortBy: 'created',
        sortOrder: 'desc',
        page: 1,
        limit: 20
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    // Загрузка пользователей
    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await usersApi.getUsers(filters);
            setUsers(response.users);
            setPagination(response.pagination);
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
            console.error('Load users error:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // Загрузка при изменении фильтров
    useEffect(() => {
        loadUsers();
    }, [filters]);
    // Статистика пользователей
    const stats = useMemo(() => {
        return {
            total: pagination.total,
            active: users.filter(u => u.status === 'active').length,
            inactive: users.filter(u => u.status === 'inactive').length,
            suspended: users.filter(u => u.status === 'suspended').length,
            pending: users.filter(u => u.status === 'pending').length,
            byRole: {
                super_admin: users.filter(u => u.role === 'super_admin').length,
                company_admin: users.filter(u => u.role === 'company_admin').length,
                admin: users.filter(u => u.role === 'admin').length,
                moderator: users.filter(u => u.role === 'moderator').length,
                editor: users.filter(u => u.role === 'editor').length,
                client: users.filter(u => u.role === 'client').length,
            },
            newThisMonth: 0, // Будет вычисляться на бэкенде
            newThisWeek: 0, // Будет вычисляться на бэкенде
        };
    }, [users, pagination]);
    const getRoleDisplayName = (role) => {
        const roleNames = {
            super_admin: 'Супер администратор',
            company_admin: 'Администратор компании',
            admin: 'Администратор',
            moderator: 'Модератор',
            editor: 'Редактор',
            client: 'Клиент',
        };
        return roleNames[role] || role;
    };
    const getStatusDisplayName = (status) => {
        const statusNames = {
            active: 'Активен',
            inactive: 'Неактивен',
            suspended: 'Заблокирован',
            pending: 'Ожидает',
        };
        return statusNames[status] || status;
    };
    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    const getRoleColor = (role) => {
        const colors = {
            super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            company_admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            admin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            moderator: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            editor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            client: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Сбрасываем на первую страницу при изменении фильтров
        }));
    };
    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };
    const handleEditPermissions = (userId) => {
        setSelectedUserId(userId);
        setIsRoleModalOpen(true);
    };
    const handleCreateUser = () => {
        setSelectedUser(null);
        setIsUserModalOpen(true);
    };
    const handleUserSave = async (userData) => {
        try {
            if (selectedUser) {
                await usersApi.updateUser(selectedUser.id, userData);
            }
            else {
                await usersApi.createUser(userData);
            }
            loadUsers();
            setIsUserModalOpen(false);
            setSelectedUser(null);
        }
        catch (error) {
            console.error('Save user error:', error);
            alert('Ошибка сохранения пользователя');
        }
    };
    const handlePermissionsSave = async (permissions) => {
        try {
            if (selectedUserId) {
                // Здесь будет обновление прав пользователя
                console.log('Saving permissions for user:', selectedUserId, permissions);
            }
            setIsRoleModalOpen(false);
            setSelectedUserId(null);
        }
        catch (error) {
            console.error('Save permissions error:', error);
            alert('Ошибка сохранения прав доступа');
        }
    };
    const handleDeleteUser = async (userId) => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            return;
        }
        try {
            await usersApi.deleteUser(userId);
            loadUsers();
        }
        catch (error) {
            console.error('Delete user error:', error);
            alert('Ошибка удаления пользователя');
        }
    };
    if (loading && users.length === 0 && !error) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C\u0438" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C\u0438 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B, \u0440\u043E\u043B\u044F\u043C\u0438 \u0438 \u043F\u0440\u0430\u0432\u0430\u043C\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" })] }), _jsx("button", { onClick: handleCreateUser, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u0412\u0441\u0435\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: stats.total })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0445" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.active })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u041D\u043E\u0432\u044B\u0445 \u0437\u0430 \u043C\u0435\u0441\u044F\u0446" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: stats.newThisMonth })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "\u041E\u0436\u0438\u0434\u0430\u044E\u0442 \u0430\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u0438" }), _jsx("p", { className: "text-2xl font-bold text-yellow-600", children: stats.pending })] })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u041F\u043E\u0438\u0441\u043A" }), _jsx("input", { type: "text", value: filters.search || '', onChange: (e) => handleFilterChange({ search: e.target.value }), placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439...", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0420\u043E\u043B\u044C" }), _jsxs("select", { value: filters.role || '', onChange: (e) => handleFilterChange({ role: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u0440\u043E\u043B\u0438" }), _jsx("option", { value: "super_admin", children: "\u0421\u0443\u043F\u0435\u0440 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "company_admin", children: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" }), _jsx("option", { value: "admin", children: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "moderator", children: "\u041C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "editor", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440" }), _jsx("option", { value: "client", children: "\u041A\u043B\u0438\u0435\u043D\u0442" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsxs("select", { value: filters.status || '', onChange: (e) => handleFilterChange({ status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B" }), _jsx("option", { value: "active", children: "\u0410\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "inactive", children: "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "suspended", children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D" }), _jsx("option", { value: "pending", children: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430" }), _jsxs("select", { value: `${filters.sortBy}_${filters.sortOrder}`, onChange: (e) => {
                                        const [sortBy, sortOrder] = e.target.value.split('_');
                                        handleFilterChange({ sortBy: sortBy, sortOrder: sortOrder });
                                    }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "created_desc", children: "\u041D\u043E\u0432\u044B\u0435 \u0441\u043D\u0430\u0447\u0430\u043B\u0430" }), _jsx("option", { value: "created_asc", children: "\u0421\u0442\u0430\u0440\u044B\u0435 \u0441\u043D\u0430\u0447\u0430\u043B\u0430" }), _jsx("option", { value: "username_asc", children: "\u041F\u043E \u0438\u043C\u0435\u043D\u0438 \u0410-\u042F" }), _jsx("option", { value: "username_desc", children: "\u041F\u043E \u0438\u043C\u0435\u043D\u0438 \u042F-\u0410" })] })] })] }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0420\u043E\u043B\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u041F\u0440\u043E\u0435\u043A\u0442\u044B" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0432\u0445\u043E\u0434" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: users.map((user) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center", children: _jsx("span", { className: "text-white font-medium", children: user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase() }) }), _jsxs("div", { className: "ml-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: user.firstName && user.lastName
                                                                        ? `${user.firstName} ${user.lastName}`
                                                                        : user.email }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: user.email })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`, children: getRoleDisplayName(user.role) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`, children: getStatusDisplayName(user.status) }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: [user.projectsCount, " \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Никогда' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handleEditUser(user), className: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), _jsx("button", { onClick: () => handleEditPermissions(user.id), className: "text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300", children: "\u041F\u0440\u0430\u0432\u0430" }), _jsx("button", { onClick: () => handleDeleteUser(user.id), className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300", children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" })] }) })] }, user.id))) })] }) }), pagination.totalPages > 1 && (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ", users.length, " \u0438\u0437 ", pagination.total, " \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439"] }), _jsxs("div", { className: "flex space-x-1", children: [_jsx("button", { onClick: () => handlePageChange(pagination.page - 1), disabled: pagination.page === 1, className: "px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: "\u041D\u0430\u0437\u0430\u0434" }), Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const page = i + Math.max(1, pagination.page - 2);
                                        return (_jsx("button", { onClick: () => handlePageChange(page), className: `px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm ${page === pagination.page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`, children: page }, page));
                                    }), _jsx("button", { onClick: () => handlePageChange(pagination.page + 1), disabled: pagination.page === pagination.totalPages, className: "px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] })] }))] }), _jsx(UserModal, { isOpen: isUserModalOpen, onClose: () => {
                    setIsUserModalOpen(false);
                    setSelectedUser(null);
                }, user: selectedUser, onSave: handleUserSave }), _jsx(RolePermissionsModal, { isOpen: isRoleModalOpen, onClose: () => {
                    setIsRoleModalOpen(false);
                    setSelectedUserId(null);
                }, userId: selectedUserId || '', onSave: handlePermissionsSave })] }));
};
export default SitusUsers;
//# sourceMappingURL=SitusUsers.js.map