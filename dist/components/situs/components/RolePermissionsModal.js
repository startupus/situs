import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const RolePermissionsModal = ({ isOpen, onClose, userId, onSave }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    // Mock права доступа
    const availablePermissions = [
        {
            category: 'Проекты',
            permissions: [
                { id: 'projects.view', name: 'Просмотр проектов', description: 'Может просматривать проекты' },
                { id: 'projects.create', name: 'Создание проектов', description: 'Может создавать новые проекты' },
                { id: 'projects.edit', name: 'Редактирование проектов', description: 'Может редактировать проекты' },
                { id: 'projects.delete', name: 'Удаление проектов', description: 'Может удалять проекты' },
                { id: 'projects.*', name: 'Все права проектов', description: 'Полный доступ к проектам' }
            ]
        },
        {
            category: 'Пользователи',
            permissions: [
                { id: 'users.view', name: 'Просмотр пользователей', description: 'Может просматривать пользователей' },
                { id: 'users.create', name: 'Создание пользователей', description: 'Может создавать новых пользователей' },
                { id: 'users.edit', name: 'Редактирование пользователей', description: 'Может редактировать пользователей' },
                { id: 'users.delete', name: 'Удаление пользователей', description: 'Может удалять пользователей' },
                { id: 'users.*', name: 'Все права пользователей', description: 'Полный доступ к пользователям' }
            ]
        },
        {
            category: 'Заказы',
            permissions: [
                { id: 'orders.view', name: 'Просмотр заказов', description: 'Может просматривать заказы' },
                { id: 'orders.create', name: 'Создание заказов', description: 'Может создавать новые заказы' },
                { id: 'orders.edit', name: 'Редактирование заказов', description: 'Может редактировать заказы' },
                { id: 'orders.delete', name: 'Удаление заказов', description: 'Может удалять заказы' },
                { id: 'orders.*', name: 'Все права заказов', description: 'Полный доступ к заказам' }
            ]
        },
        {
            category: 'Маркетинг',
            permissions: [
                { id: 'marketing.view', name: 'Просмотр маркетинга', description: 'Может просматривать маркетинговые данные' },
                { id: 'marketing.create', name: 'Создание кампаний', description: 'Может создавать маркетинговые кампании' },
                { id: 'marketing.edit', name: 'Редактирование кампаний', description: 'Может редактировать кампании' },
                { id: 'marketing.delete', name: 'Удаление кампаний', description: 'Может удалять кампании' },
                { id: 'marketing.*', name: 'Все права маркетинга', description: 'Полный доступ к маркетингу' }
            ]
        },
        {
            category: 'Настройки',
            permissions: [
                { id: 'settings.view', name: 'Просмотр настроек', description: 'Может просматривать настройки' },
                { id: 'settings.edit', name: 'Редактирование настроек', description: 'Может изменять настройки' },
                { id: 'settings.*', name: 'Все права настроек', description: 'Полный доступ к настройкам' }
            ]
        },
        {
            category: 'Отчеты',
            permissions: [
                { id: 'reports.view', name: 'Просмотр отчетов', description: 'Может просматривать отчеты' },
                { id: 'reports.create', name: 'Создание отчетов', description: 'Может создавать отчеты' },
                { id: 'reports.export', name: 'Экспорт отчетов', description: 'Может экспортировать отчеты' },
                { id: 'reports.*', name: 'Все права отчетов', description: 'Полный доступ к отчетам' }
            ]
        }
    ];
    useEffect(() => {
        if (isOpen && userId) {
            // Mock загрузка прав пользователя
            setSelectedPermissions(['projects.view', 'orders.view']);
        }
    }, [isOpen, userId]);
    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            }
            else {
                return [...prev, permissionId];
            }
        });
    };
    const handleCategoryToggle = (categoryPermissions) => {
        const allSelected = categoryPermissions.every(perm => selectedPermissions.includes(perm));
        if (allSelected) {
            // Убираем все права категории
            setSelectedPermissions(prev => prev.filter(perm => !categoryPermissions.includes(perm)));
        }
        else {
            // Добавляем все права категории
            setSelectedPermissions(prev => {
                const newPerms = [...prev];
                categoryPermissions.forEach(perm => {
                    if (!newPerms.includes(perm)) {
                        newPerms.push(perm);
                    }
                });
                return newPerms;
            });
        }
    };
    const handleSave = () => {
        onSave(selectedPermissions);
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0430\u043C\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "space-y-6", children: availablePermissions.map((category) => (_jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: category.category }), _jsx("button", { onClick: () => handleCategoryToggle(category.permissions.map(p => p.id)), className: "text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300", children: category.permissions.every(perm => selectedPermissions.includes(perm.id))
                                            ? 'Убрать все'
                                            : 'Выбрать все' })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: category.permissions.map((permission) => (_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("input", { type: "checkbox", id: permission.id, checked: selectedPermissions.includes(permission.id), onChange: () => handlePermissionToggle(permission.id), className: "mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: permission.id, className: "block text-sm font-medium text-gray-900 dark:text-white cursor-pointer", children: permission.name }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: permission.description })] })] }, permission.id))) })] }, category.category))) }), _jsxs("div", { className: "flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["\u0412\u044B\u0431\u0440\u0430\u043D\u043E \u043F\u0440\u0430\u0432: ", selectedPermissions.length] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700", children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx("button", { onClick: handleSave, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0430" })] })] })] }) }));
};
export default RolePermissionsModal;
//# sourceMappingURL=RolePermissionsModal.js.map