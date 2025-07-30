import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
export const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // TODO: Интеграция с Loginus Service
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Неверные учетные данные');
            }
            const { user, token } = await response.json();
            // Сохраняем токен
            localStorage.setItem('auth-token', token);
            // Уведомляем родительский компонент
            onLogin?.(user);
            // Переходим к списку проектов
            navigate('/projects');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка входа');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4", children: _jsxs("div", { className: "max-w-md w-full", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4", children: _jsx("span", { className: "text-white text-2xl font-bold", children: "S" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "Situs Platform" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 \u0441\u0432\u043E\u044E \u0443\u0447\u0435\u0442\u043D\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C" })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8", children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(FaUser, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 16 }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100", placeholder: "your@email.com", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u041F\u0430\u0440\u043E\u043B\u044C" }), _jsxs("div", { className: "relative", children: [_jsx(FaLock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 16 }), _jsx("input", { id: "password", type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: showPassword ? _jsx(FaEyeSlash, { size: 16 }) : _jsx(FaEye, { size: 16 }) })] })] }), error && (_jsx("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsx("p", { className: "text-red-600 dark:text-red-400 text-sm", children: error }) })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", children: isLoading ? 'Вход...' : 'Войти' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("a", { href: "/forgot-password", className: "text-blue-600 hover:text-blue-500 text-sm", children: "\u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C?" }) })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: ["\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430?", ' ', _jsx("a", { href: "/register", className: "text-blue-600 hover:text-blue-500", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442" })] }) })] }) }));
};
export default LoginPage;
//# sourceMappingURL=LoginPage.js.map