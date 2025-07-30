import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiBarChart, FiUsers, FiGlobe, FiEye, FiEdit, FiTrash2, FiExternalLink, FiShoppingBag, FiBell } from 'react-icons/fi';
import { useSite } from '../contexts/SiteContext';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';
import SidebarControls from '../components/SidebarControls';
const ProjectSelector = () => {
    const { state, actions } = useSite();
    const { user } = useUser();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProjectType, setSelectedProjectType] = useState('website');
    // Статистика проектов
    const projectStats = {
        total: state.sites.length,
        published: state.sites.filter(site => site.pages.some(page => page.status === 'published')).length,
        draft: state.sites.filter(site => site.pages.some(page => page.status === 'draft')).length,
        archived: state.sites.filter(site => site.pages.some(page => page.status === 'archived')).length,
        totalPages: state.sites.reduce((acc, site) => acc + site.pages.length, 0),
        totalVisitors: state.sites.reduce((acc, site) => acc + (site.pages.length * 150), 0), // Моковые данные
        // Моковые данные о заказах для демонстрации
        newOrders: 3,
        totalOrders: 12,
        ordersRevenue: 28500
    };
    const handleCreateProject = async () => {
        try {
            const projectName = `Новый ${selectedProjectType === 'website' ? 'сайт' :
                selectedProjectType === 'ecommerce' ? 'магазин' :
                    selectedProjectType === 'landing' ? 'лендинг' : 'блог'}`;
            const newSite = await actions.createSite({
                name: projectName,
                description: `Описание для ${projectName}`,
                template: selectedProjectType,
                settings: {
                    theme: 'auto',
                    primaryColor: '#3B82F6',
                    favicon: '',
                    logo: ''
                },
                owner: user?.id || 'default-user',
                isPublic: false
            });
            setShowCreateModal(false);
            // Переходим к новому проекту
            navigate(`/situs/project/${newSite.id}`);
        }
        catch (error) {
            console.error('Ошибка создания проекта:', error);
            // Показать уведомление об ошибке
            alert('Ошибка создания проекта. Попробуйте еще раз.');
        }
    };
    const getProjectTypeIcon = (type) => {
        switch (type) {
            case 'website': return '🌐';
            case 'ecommerce': return '🛒';
            case 'landing': return '📄';
            case 'blog': return '📝';
            default: return '📁';
        }
    };
    const getProjectTypeName = (type) => {
        switch (type) {
            case 'website': return 'Сайт';
            case 'ecommerce': return 'Магазин';
            case 'landing': return 'Лендинг';
            case 'blog': return 'Блог';
            default: return 'Проект';
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, { title: "\u041C\u043E\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u044B", onNewProject: () => setShowCreateModal(true) }), _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-red-500", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-red-100 dark:bg-red-900 rounded-lg", children: _jsx(FiBell, { className: "w-6 h-6 text-red-600 dark:text-red-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u041D\u043E\u0432\u044B\u0435 \u0437\u0430\u043A\u0430\u0437\u044B" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: projectStats.newOrders })] })] }), _jsx("button", { onClick: () => {
                                                // Переходим к первому проекту в раздел заказов
                                                const firstProject = state.sites[0];
                                                if (firstProject) {
                                                    navigate(`/situs/project/${firstProject.id}?section=orders`);
                                                }
                                            }, className: "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium", children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u2192" })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900 rounded-lg", children: _jsx(FiGrid, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u0412\u0441\u0435\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: projectStats.total })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 dark:bg-green-900 rounded-lg", children: _jsx(FiEye, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: projectStats.published })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-purple-100 dark:bg-purple-900 rounded-lg", children: _jsx(FiBarChart, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u0412\u0441\u0435\u0433\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: projectStats.totalPages })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 dark:bg-green-900 rounded-lg", children: _jsx(FiShoppingBag, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u0412\u044B\u0440\u0443\u0447\u043A\u0430" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: ["\u20BD", projectStats.ordersRevenue.toLocaleString()] })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg", children: _jsx(FiUsers, { className: "w-6 h-6 text-yellow-600 dark:text-yellow-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "\u041F\u043E\u0441\u0435\u0442\u0438\u0442\u0435\u043B\u0438" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: projectStats.totalVisitors.toLocaleString() })] })] }) })] }), _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\u041C\u043E\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u044B" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0441\u0432\u043E\u0438\u043C\u0438 \u0441\u0430\u0439\u0442\u0430\u043C\u0438 \u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u043C\u0438" })] }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("select", { className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "all", children: "\u0412\u0441\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u044B" }), _jsx("option", { value: "published", children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u0435" }), _jsx("option", { value: "draft", children: "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0438" }), _jsx("option", { value: "archived", children: "\u0410\u0440\u0445\u0438\u0432" })] }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: state.sites.map((site) => (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "text-2xl", children: getProjectTypeIcon('website') }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: site.name }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: site.description })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${site.pages.some(page => page.status === 'published')
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : site.pages.some(page => page.status === 'draft')
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`, children: site.pages.some(page => page.status === 'published') ? 'Опубликован' :
                                                        site.pages.some(page => page.status === 'draft') ? 'Черновик' : 'Архив' }) })] }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-600 dark:text-gray-400", children: [_jsx(FiGlobe, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: site.domain || 'Домен не настроен' })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600 dark:text-gray-400", children: [_jsx(FiBarChart, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: [site.pages.length, " \u0441\u0442\u0440\u0430\u043D\u0438\u0446"] })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600 dark:text-gray-400", children: [_jsx(FiUsers, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: ["~", site.pages.length * 150, " \u043F\u043E\u0441\u0435\u0442\u0438\u0442\u0435\u043B\u0435\u0439"] })] })] }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiEye, { className: "w-4 h-4" }) }), _jsx("button", { className: "p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiEdit, { className: "w-4 h-4" }) }), _jsx("button", { className: "p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiTrash2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [site.pages.some(page => page.status === 'published') && site.domain && (_jsxs("a", { href: `https://${site.domain}`, target: "_blank", rel: "noopener noreferrer", className: "flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300", children: [_jsx(FiExternalLink, { className: "w-4 h-4" }), _jsx("span", { children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" })] })), _jsx("button", { onClick: () => navigate(`/situs/project/${site.id}`), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" })] })] })] }) }, site.id))) }), showCreateModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u0422\u0438\u043F \u043F\u0440\u043E\u0435\u043A\u0442\u0430" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                                        { id: 'website', name: 'Сайт', icon: '🌐' },
                                                        { id: 'ecommerce', name: 'Магазин', icon: '🛒' },
                                                        { id: 'landing', name: 'Лендинг', icon: '📄' },
                                                        { id: 'blog', name: 'Блог', icon: '📝' }
                                                    ].map((type) => (_jsxs("button", { onClick: () => setSelectedProjectType(type.id), className: `p-4 border rounded-lg text-center transition-colors ${selectedProjectType === type.id
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`, children: [_jsx("div", { className: "text-2xl mb-2", children: type.icon }), _jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: type.name })] }, type.id))) })] }) }), _jsxs("div", { className: "flex items-center justify-end space-x-3 mt-6", children: [_jsx("button", { onClick: () => setShowCreateModal(false), className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx("button", { onClick: handleCreateProject, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442" })] })] }) }) }))] }), _jsx(SidebarControls, {})] }));
};
export default ProjectSelector;
//# sourceMappingURL=ProjectSelector.js.map