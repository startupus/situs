import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { usersApi } from '../../../api/services/users.api';
import UserModal from '../components/UserModal';
import RolePermissionsModal from '../components/RolePermissionsModal';
/**
 * Компонент управления пользователями с интеграцией API
 * Поддерживает фильтрацию, поиск, пагинацию и CRUD операции
 */
const SitusUsersNew = () => {
    // Состояние компонента
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filters, setFilters] = useState({});
    const [showUserModal, setShowUserModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    // Загрузка пользователей
    const loadUsers = async () => {
        setLoading(true);
        try {
            const searchFilters = {
                ...filters,
                search: searchTerm || undefined,
                page: currentPage,
                limit: pageSize
            };
            const response = await usersApi.getUsers(searchFilters);
            setUsers(response.users);
            setPagination(response.pagination);
        }
        catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        }
        finally {
            setLoading(false);
        }
    };
    // Загрузка статистики
    const loadStats = async () => {
        try {
            // TODO: Добавить метод getUserStats в users API
            // const stats = await usersApi.getUserStats();
            // setStats(stats);
        }
        catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        }
    };
    // Обработчики событий
    const handleCreateUser = () => {
        setEditingUser(null);
        setShowUserModal(true);
    };
    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowUserModal(true);
    };
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await usersApi.deleteUser(userId);
                await loadUsers();
            }
            catch (error) {
                console.error('Ошибка удаления пользователя:', error);
            }
        }
    };
    const handleSaveUser = async (userData) => {
        try {
            if (editingUser) {
                await usersApi.updateUser(editingUser.id, userData);
            }
            else {
                await usersApi.createUser(userData);
            }
            setShowUserModal(false);
            setEditingUser(null);
            await loadUsers();
        }
        catch (error) {
            console.error('Ошибка сохранения пользователя:', error);
        }
    };
    const handleStatusChange = async (userId, newStatus) => {
        try {
            await usersApi.updateUserStatus(userId, newStatus);
            await loadUsers();
        }
        catch (error) {
            console.error('Ошибка изменения статуса:', error);
        }
    };
    const handleRoleChange = async (userId, newRole) => {
        try {
            await usersApi.updateUser(userId, { role: newRole });
            await loadUsers();
        }
        catch (error) {
            console.error('Ошибка изменения роли:', error);
        }
    };
    const handleSearch = () => {
        setCurrentPage(1);
        loadUsers();
    };
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };
    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => prev.includes(userId)
            ? prev.filter(id => id !== userId)
            : [...prev, userId]);
    };
    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        }
        else {
            setSelectedUsers(users.map(user => user.id));
        }
    };
    // Вспомогательные функции
    const getRoleDisplay = (role) => {
        const roleMap = {
            ADMIN: 'Администратор',
            USER: 'Пользователь'
        };
        return roleMap[role] || role;
    };
    const getStatusDisplay = (status) => {
        const statusMap = {
            ACTIVE: 'Активен',
            INACTIVE: 'Неактивен',
            SUSPENDED: 'Заблокирован'
        };
        return statusMap[status] || status;
    };
    const getStatusColor = (status) => {
        const colorMap = {
            ACTIVE: 'text-green-600 bg-green-100',
            INACTIVE: 'text-gray-600 bg-gray-100',
            SUSPENDED: 'text-red-600 bg-red-100'
        };
        return colorMap[status] || 'text-gray-600 bg-gray-100';
    };
    const getRoleColor = (role) => {
        const colorMap = {
            ADMIN: 'text-purple-600 bg-purple-100',
            USER: 'text-blue-600 bg-blue-100'
        };
        return colorMap[role] || 'text-gray-600 bg-gray-100';
    };
    // Загрузка данных при монтировании и изменении фильтров
    useEffect(() => {
        loadUsers();
        loadStats();
    }, [currentPage, filters]);
    useEffect(() => {
        const timeoutId = setTimeout(handleSearch, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "p-6 bg-white rounded-lg shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C\u0438" }), _jsx("button", { onClick: handleCreateUser, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" })] }), _jsx("div", { className: "mb-6 space-y-4", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0438\u043C\u0435\u043D\u0438 \u0438\u043B\u0438 email...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }) }), _jsxs("select", { value: filters.role || '', onChange: (e) => handleFilterChange({ role: e.target.value || undefined }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u0440\u043E\u043B\u0438" }), _jsx("option", { value: "ADMIN", children: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "USER", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C" })] }), _jsxs("select", { value: filters.status || '', onChange: (e) => handleFilterChange({ status: e.target.value || undefined }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B" }), _jsx("option", { value: "ACTIVE", children: "\u0410\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "INACTIVE", children: "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "SUSPENDED", children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D" })] })] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse border border-gray-200", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50", children: [_jsx("th", { className: "border border-gray-200 px-4 py-2 text-left", children: _jsx("input", { type: "checkbox", checked: selectedUsers.length === users.length && users.length > 0, onChange: handleSelectAll, className: "rounded border-gray-300" }) }), _jsx("th", { className: "border border-gray-200 px-4 py-2 text-left", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C" }), _jsx("th", { className: "border border-gray-200 px-4 py-2 text-left", children: "Email" }), _jsx("th", { className: "border border-gray-200 px-4 py-2 text-left", children: "\u0420\u043E\u043B\u044C" }), _jsx("th", { className: "border border-gray-200 px-4 py-2 text-left", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("th", { className: "border border-gray-200 px-4 py-2 text-left", children: "\u0414\u0430\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438" }), _jsx("th", { className: "border border-gray-200 px-4 py-2 text-left", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "border border-gray-200 px-4 py-2", children: _jsx("input", { type: "checkbox", checked: selectedUsers.includes(user.id), onChange: () => handleSelectUser(user.id), className: "rounded border-gray-300" }) }), _jsx("td", { className: "border border-gray-200 px-4 py-2", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-sm font-medium text-gray-700", children: user.username.charAt(0).toUpperCase() }) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: user.username }), user.profile?.firstName && user.profile?.lastName && (_jsxs("div", { className: "text-sm text-gray-500", children: [user.profile.firstName, " ", user.profile.lastName] }))] })] }) }), _jsx("td", { className: "border border-gray-200 px-4 py-2 text-gray-900", children: user.email }), _jsx("td", { className: "border border-gray-200 px-4 py-2", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`, children: getRoleDisplay(user.role) }) }), _jsx("td", { className: "border border-gray-200 px-4 py-2", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`, children: getStatusDisplay(user.status) }) }), _jsx("td", { className: "border border-gray-200 px-4 py-2 text-gray-500", children: new Date(user.createdAt).toLocaleDateString('ru-RU') }), _jsx("td", { className: "border border-gray-200 px-4 py-2", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handleEditUser(user), className: "text-blue-600 hover:text-blue-800 text-sm", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), _jsx("button", { onClick: () => handleDeleteUser(user.id), className: "text-red-600 hover:text-red-800 text-sm", children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" })] }) })] }, user.id))) })] }) }), pagination.totalPages > 1 && (_jsxs("div", { className: "flex justify-between items-center mt-6", children: [_jsxs("div", { className: "text-sm text-gray-700", children: ["\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ", ((pagination.page - 1) * pagination.limit) + 1, " - ", Math.min(pagination.page * pagination.limit, pagination.total), " \u0438\u0437 ", pagination.total] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setCurrentPage(prev => Math.max(1, prev - 1)), disabled: pagination.page === 1, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed", children: "\u041D\u0430\u0437\u0430\u0434" }), _jsx("button", { onClick: () => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1)), disabled: pagination.page === pagination.totalPages, className: "px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed", children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] })] })), showUserModal && (_jsx(UserModal, { isOpen: showUserModal, onClose: () => {
                    setShowUserModal(false);
                    setEditingUser(null);
                }, user: editingUser, onSave: handleSaveUser })), showPermissionsModal && (_jsx(RolePermissionsModal, { isOpen: showPermissionsModal, onClose: () => setShowPermissionsModal(false), userId: "", onSave: () => { } }))] }));
};
export default SitusUsersNew;
//# sourceMappingURL=SitusUsersNew.js.map