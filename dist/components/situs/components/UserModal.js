import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'client',
        status: 'active',
        phone: '',
        company: '',
        position: '',
        password: ''
    });
    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                status: user.status,
                phone: user.phone || '',
                company: user.company || '',
                position: user.position || '',
                password: ''
            });
        }
        else {
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                role: 'client',
                status: 'active',
                phone: '',
                company: '',
                position: '',
                password: ''
            });
        }
    }, [user]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white mb-4", children: user ? 'Редактировать пользователя' : 'Добавить пользователя' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Email *" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0418\u043C\u044F" }), _jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0424\u0430\u043C\u0438\u043B\u0438\u044F" }), _jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0420\u043E\u043B\u044C" }), _jsxs("select", { name: "role", value: formData.role, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "client", children: "\u041A\u043B\u0438\u0435\u043D\u0442" }), _jsx("option", { value: "editor", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440" }), _jsx("option", { value: "moderator", children: "\u041C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "admin", children: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "company_admin", children: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" }), _jsx("option", { value: "super_admin", children: "\u0421\u0443\u043F\u0435\u0440 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsxs("select", { name: "status", value: formData.status, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "active", children: "\u0410\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "inactive", children: "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "suspended", children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D" }), _jsx("option", { value: "pending", children: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" }), _jsx("input", { type: "text", name: "company", value: formData.company, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C" }), _jsx("input", { type: "text", name: "position", value: formData.position, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] }), !user && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u041F\u0430\u0440\u043E\u043B\u044C *" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" })] })), _jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700", children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: user ? 'Сохранить' : 'Создать' })] })] })] }) }));
};
export default UserModal;
//# sourceMappingURL=UserModal.js.map