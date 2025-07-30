import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaGlobe, FaCog, FaEye, FaSearch, FaSort } from 'react-icons/fa';
export const ProjectsList = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated');
    useEffect(() => {
        loadProjects();
    }, []);
    const loadProjects = async () => {
        try {
            const response = await fetch('/api/projects', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        }
        catch (error) {
            console.error('Ошибка загрузки проектов:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'PUBLISHED': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'STAGING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'DEVELOPMENT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
            case 'ARCHIVED': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'PUBLISHED': return 'Опубликован';
            case 'STAGING': return 'Тестирование';
            case 'DEVELOPMENT': return 'Разработка';
            case 'DRAFT': return 'Черновик';
            case 'ARCHIVED': return 'Архив';
            default: return status;
        }
    };
    const filteredProjects = projects
        .filter(project => project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
        switch (sortBy) {
            case 'name': return a.name.localeCompare(b.name);
            case 'created': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'updated': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            default: return 0;
        }
    });
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u043F\u0440\u043E\u0435\u043A\u0442\u044B..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "\u041C\u043E\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u044B" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, ", user?.username || user?.email] })] }), _jsxs(Link, { to: "/projects/new", className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors", children: [_jsx(FaPlus, { size: 14 }), _jsx("span", { children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442" })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between", children: [_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(FaSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 16 }), _jsx("input", { type: "text", placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FaSort, { className: "text-gray-400", size: 16 }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "updated", children: "\u041F\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044E" }), _jsx("option", { value: "created", children: "\u041F\u043E \u0434\u0430\u0442\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F" }), _jsx("option", { value: "name", children: "\u041F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E" })] })] })] }), filteredProjects.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(FaGlobe, { className: "text-gray-400", size: 32 }) }), _jsx("h3", { className: "text-xl font-medium text-gray-900 dark:text-gray-100 mb-2", children: searchQuery ? 'Проекты не найдены' : 'Пока нет проектов' }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: searchQuery
                                    ? 'Попробуйте изменить критерии поиска'
                                    : 'Создайте свой первый сайт с помощью Situs' }), !searchQuery && (_jsxs(Link, { to: "/projects/new", className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors", children: [_jsx(FaPlus, { size: 16 }), _jsx("span", { children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0435\u0440\u0432\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442" })] }))] })) : (_jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: filteredProjects.map((project) => (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-1", children: project.name }), project.description && (_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: project.description }))] }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`, children: getStatusLabel(project.status) })] }), (project.domain || project.customDomain) && (_jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsx(FaGlobe, { size: 12 }), _jsx("span", { children: project.customDomain || project.domain })] }) })), _jsxs("div", { className: "mb-4 text-xs text-gray-500 dark:text-gray-500", children: ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D: ", new Date(project.updatedAt).toLocaleDateString('ru-RU')] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx(Link, { to: `/projects/${project.id}/dashboard`, className: "text-blue-600 hover:text-blue-700 dark:text-blue-400", title: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435", children: _jsx(FaCog, { size: 16 }) }), project.isPublished && (_jsx("a", { href: `https://${project.customDomain || project.domain}`, target: "_blank", rel: "noopener noreferrer", className: "text-green-600 hover:text-green-700 dark:text-green-400", title: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0441\u0430\u0439\u0442\u0430", children: _jsx(FaEye, { size: 16 }) }))] }), _jsx(Link, { to: `/projects/${project.id}/dashboard`, className: "text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition-colors", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" })] })] }) }, project.id))) }))] })] }));
};
export default ProjectsList;
//# sourceMappingURL=ProjectsList.js.map