import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiGrid, FiFileText, FiMenu, FiShoppingCart, FiTrendingUp, FiZap, FiSettings, FiHome, FiUsers, FiBarChart, FiEdit, FiPlus, FiTrash2, FiEye, FiArrowLeft } from 'react-icons/fi';
import { useSite } from '../contexts/SiteContext';
import { useUser } from '../contexts/UserContext';
import { useProject } from '../contexts/ProjectContext';
import Header from './Header';
import EcommerceSection from './sections/EcommerceSection';
import OrdersSection from './sections/OrdersSection';
import PagesSection from './sections/PagesSection';
import InterfaceControls from './InterfaceControls';
import ProjectEditorView from './ProjectEditorView';
// Импортируем новые компоненты
import { DataStats, TableStack, Button } from './index';
const ProjectWorkspace = () => {
    const { projectId } = useParams();
    const { state, actions } = useSite();
    const { user } = useUser();
    const { loadProject, currentProject, isLoading: projectLoading } = useProject();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeSection, setActiveSection] = useState('orders');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showCreatePageModal, setShowCreatePageModal] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    const [isEditorMode, setIsEditorMode] = useState(false);
    // Обработка URL параметров для прямого перехода в раздел
    useEffect(() => {
        const section = searchParams.get('section');
        if (section) {
            setActiveSection(section);
        }
    }, [searchParams]);
    // Загружаем проект при монтировании
    useEffect(() => {
        if (projectId) {
            loadProject(projectId);
        }
    }, [projectId, loadProject]);
    // Режим редактора страницы
    if (isEditorMode) {
        return (_jsx(ProjectEditorView, { onBack: () => setIsEditorMode(false) }));
    }
    if (!projectId || !currentProject) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDE15" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: "\u041F\u0440\u043E\u0435\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["\u041F\u0440\u043E\u0435\u043A\u0442 \u0441 ID ", projectId, " \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442"] })] }) }));
    }
    const navigationItems = [
        {
            id: 'orders',
            label: 'Заказы и заявки',
            icon: FiShoppingCart,
            description: 'Управление заказами и заявками'
        },
        {
            id: 'dashboard',
            label: 'Дашборд',
            icon: FiHome,
            description: 'Обзор проекта'
        },
        {
            id: 'pages',
            label: 'Страницы',
            icon: FiFileText,
            description: 'Управление страницами'
        },
        {
            id: 'menu',
            label: 'Меню',
            icon: FiMenu,
            description: 'Настройка навигации'
        },
        {
            id: 'ecommerce',
            label: 'E-commerce',
            icon: FiShoppingCart,
            description: 'Управление магазином'
        },
        {
            id: 'extensions',
            label: 'Расширения',
            icon: FiZap,
            description: 'Дополнительные функции'
        },
        {
            id: 'analytics',
            label: 'Аналитика',
            icon: FiBarChart,
            description: 'Статистика и отчеты'
        },
        {
            id: 'settings',
            label: 'Настройки',
            icon: FiSettings,
            description: 'Конфигурация проекта'
        }
    ];
    // Данные для DataStats
    const dashboardStats = [
        {
            title: 'Всего заказов',
            subtitle: 'За этот месяц',
            value: '1,234',
            change: { value: '+12.5%', type: 'increase' },
            percent: 85,
            color: '#13C296',
            icon: _jsx(FiShoppingCart, { className: "w-6 h-6" })
        },
        {
            title: 'Активные пользователи',
            subtitle: 'За последние 7 дней',
            value: '892',
            change: { value: '+8.2%', type: 'increase' },
            percent: 92,
            color: '#3758F9',
            icon: _jsx(FiUsers, { className: "w-6 h-6" })
        },
        {
            title: 'Доход',
            subtitle: 'За этот месяц',
            value: '$45,678',
            change: { value: '+15.3%', type: 'increase' },
            percent: 78,
            color: '#F2994A',
            icon: _jsx(FiTrendingUp, { className: "w-6 h-6" })
        },
        {
            title: 'Страницы',
            subtitle: 'Всего страниц',
            value: currentProject.pages?.length || 0,
            change: { value: '+2', type: 'increase' },
            percent: 65,
            color: '#9B51E0',
            icon: _jsx(FiFileText, { className: "w-6 h-6" })
        }
    ];
    // Данные для TableStack (пользователи)
    const usersData = [
        {
            id: 1,
            name: 'Иван Петров',
            position: 'Администратор',
            email: 'ivan@example.com',
            status: 'active',
            image: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/users-list/image-01.png'
        },
        {
            id: 2,
            name: 'Мария Сидорова',
            position: 'Менеджер',
            email: 'maria@example.com',
            status: 'active',
            image: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/users-list/image-02.png'
        },
        {
            id: 3,
            name: 'Алексей Козлов',
            position: 'Разработчик',
            email: 'alex@example.com',
            status: 'pending',
            image: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/users-list/image-03.png'
        }
    ];
    const handleCreatePage = async () => {
        if (!newPageTitle.trim())
            return;
        try {
            // Создаем новую страницу через SiteContext
            await actions.createPage({
                title: newPageTitle,
                slug: newPageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                content: [],
                meta: {
                    description: '',
                    keywords: [],
                    ogImage: ''
                },
                status: 'draft'
            });
            setShowCreatePageModal(false);
            setNewPageTitle('');
        }
        catch (error) {
            console.error('Error creating page:', error);
            alert('Ошибка создания страницы. Попробуйте еще раз.');
        }
    };
    const handleEditPage = (pageId) => {
        // Загружаем страницу в контекст
        actions.selectPage(pageId);
        // Переходим в режим редактора
        setIsEditorMode(true);
    };
    const renderDashboard = () => (_jsxs("div", { className: "space-y-6", children: [_jsx(DataStats, { cards: dashboardStats }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsx(TableStack, { title: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430", items: usersData, onItemClick: (item) => console.log('User clicked:', item) }) }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Button, { variant: "primary", onClick: () => setActiveSection('pages'), className: "w-full", children: [_jsx(FiPlus, { className: "mr-2" }), "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443"] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveSection('ecommerce'), className: "w-full", children: [_jsx(FiShoppingCart, { className: "mr-2" }), "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u043E\u0432\u0430\u0440\u0430\u043C\u0438"] }), _jsxs(Button, { variant: "outline", onClick: () => setActiveSection('analytics'), className: "w-full", children: [_jsx(FiBarChart, { className: "mr-2" }), "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0438"] })] })] })] }));
    const renderPages = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u043C\u0438 \u0432\u0430\u0448\u0435\u0433\u043E \u0441\u0430\u0439\u0442\u0430" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { onClick: () => navigate('/situs'), className: "flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [_jsx(FiArrowLeft, { className: "w-4 h-4" }), _jsx("span", { children: "\u041A \u043F\u0440\u043E\u0435\u043A\u0442\u0430\u043C" })] }), _jsxs("button", { onClick: () => setShowCreatePageModal(true), className: "flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(FiPlus, { className: "w-4 h-4" }), _jsx("span", { children: "\u041D\u043E\u0432\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430" })] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: currentProject.pages.map((page) => (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: page.title }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["/", page.slug] })] }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${page.status === 'published'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`, children: page.status === 'published' ? 'Опубликована' : 'Черновик' })] }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiEye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleEditPage(page.id), className: "p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiEdit, { className: "w-4 h-4" }) }), _jsx("button", { className: "p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiTrash2, { className: "w-4 h-4" }) })] }), _jsx("button", { onClick: () => handleEditPage(page.id), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" })] })] }) }, page.id))) })] }));
    const renderContent = () => {
        switch (activeSection) {
            case 'orders':
                return _jsx(OrdersSection, {});
            case 'dashboard':
                return renderDashboard();
            case 'pages':
                return _jsx(PagesSection, { onEditPage: () => setIsEditorMode(true) });
            case 'ecommerce':
                return _jsx(EcommerceSection, {});
            default:
                return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDEA7" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: navigationItems.find(item => item.id === activeSection)?.label }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: navigationItems.find(item => item.id === activeSection)?.description })] }));
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, { title: currentProject.name, showBalance: true, showUserMenu: true }), _jsxs("div", { className: "flex", children: [_jsxs("div", { className: `${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`, children: [_jsx("div", { className: "p-4", children: _jsx("button", { onClick: () => setSidebarCollapsed(!sidebarCollapsed), className: "w-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiGrid, { className: "w-5 h-5" }) }) }), _jsx("nav", { className: "px-2", children: navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (_jsxs("button", { onClick: () => setActiveSection(item.id), className: `w-full flex items-center justify-between px-3 py-3 rounded-lg mb-1 transition-colors ${activeSection === item.id
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`, title: sidebarCollapsed ? item.label : undefined, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Icon, { className: "w-5 h-5 flex-shrink-0" }), !sidebarCollapsed && (_jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm font-medium", children: item.label }), _jsx("div", { className: "text-xs opacity-75", children: item.description })] }))] }), !sidebarCollapsed && item.id === 'orders' && (_jsx("div", { className: "flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900 rounded-full", children: _jsx("span", { className: "text-xs font-medium text-red-600 dark:text-red-400", children: "3" }) }))] }, item.id));
                                }) }), _jsx("div", { className: "mt-auto", children: _jsx(InterfaceControls, { collapsed: sidebarCollapsed }) })] }), _jsx("div", { className: "flex-1 p-6", children: renderContent() })] }), showCreatePageModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }), _jsx("input", { type: "text", value: newPageTitle, onChange: (e) => setNewPageTitle(e.target.value), placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), newPageTitle && (_jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: ["URL: /", newPageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')] }))] }) }), _jsxs("div", { className: "flex items-center justify-end space-x-3 mt-6", children: [_jsx("button", { onClick: () => {
                                            setShowCreatePageModal(false);
                                            setNewPageTitle('');
                                        }, className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx("button", { onClick: handleCreatePage, disabled: !newPageTitle.trim(), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443" })] })] }) }) }))] }));
};
export default ProjectWorkspace;
//# sourceMappingURL=ProjectWorkspace.js.map