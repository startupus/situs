import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiGlobe, FiClock, FiCheck } from 'react-icons/fi';
import { useProject } from '../../contexts/ProjectContext';
import Button from '../ui/Button';
const PagesSection = ({ onEditPage }) => {
    const { pages, currentPage, createPage, updatePage, deletePage, loadPage, publishPage, isLoading } = useProject();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    const [newPageSlug, setNewPageSlug] = useState('');
    const handleCreatePage = async (e) => {
        e.preventDefault();
        if (!newPageTitle.trim())
            return;
        try {
            const pageData = {
                title: newPageTitle.trim(),
                slug: newPageSlug.trim() || undefined
            };
            await createPage(pageData);
            setNewPageTitle('');
            setNewPageSlug('');
            setShowCreateForm(false);
        }
        catch (error) {
            console.error('Failed to create page:', error);
        }
    };
    const handleDeletePage = async (pageId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту страницу?')) {
            await deletePage(pageId);
        }
    };
    const handlePublishPage = async (pageId) => {
        await publishPage(pageId);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            case 'draft':
                return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
            case 'archived':
                return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
            default:
                return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'published':
                return _jsx(FiGlobe, { className: "w-3 h-3" });
            case 'draft':
                return _jsx(FiClock, { className: "w-3 h-3" });
            case 'archived':
                return _jsx(FiTrash2, { className: "w-3 h-3" });
            default:
                return _jsx(FiClock, { className: "w-3 h-3" });
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'published':
                return 'Опубликовано';
            case 'draft':
                return 'Черновик';
            case 'archived':
                return 'Архив';
            default:
                return 'Неизвестно';
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0441\u0430\u0439\u0442\u0430" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u043C\u0438 \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430" })] }), _jsxs(Button, { onClick: () => setShowCreateForm(true), variant: "primary", size: "md", disabled: isLoading, children: [_jsx(FiPlus, { className: "w-4 h-4 mr-2" }), "\u041D\u043E\u0432\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430"] })] }), showCreateForm && (_jsxs("div", { className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-4", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443" }), _jsxs("form", { onSubmit: handleCreatePage, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }), _jsx("input", { type: "text", value: newPageTitle, onChange: (e) => setNewPageTitle(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u041E \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "URL (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }), _jsx("input", { type: "text", value: newPageSlug, onChange: (e) => setNewPageSlug(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "about-company" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "\u0415\u0441\u043B\u0438 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D, \u0431\u0443\u0434\u0435\u0442 \u0441\u043E\u0437\u0434\u0430\u043D \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0438\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", disabled: isLoading, children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C" }), _jsx("button", { type: "button", onClick: () => {
                                            setShowCreateForm(false);
                                            setNewPageTitle('');
                                            setNewPageSlug('');
                                        }, className: "px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })] })] })), _jsx("div", { className: "space-y-3", children: pages.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx(FiEdit3, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "\u041D\u0435\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0434\u043B\u044F \u0432\u0430\u0448\u0435\u0433\u043E \u0441\u0430\u0439\u0442\u0430" }), _jsxs("button", { onClick: () => setShowCreateForm(true), className: "inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(FiPlus, { className: "w-4 h-4" }), _jsx("span", { children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443" })] })] })) : (pages.map((page) => (_jsx("div", { className: `bg-white dark:bg-gray-800 border rounded-lg p-4 transition-all ${currentPage?.id === page.id
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("h3", { className: "font-medium text-gray-900 dark:text-white", children: page.title }), _jsxs("span", { className: `inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`, children: [getStatusIcon(page.status), _jsx("span", { children: getStatusText(page.status) })] })] }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("span", { children: ["/", page.slug] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E ", page.updatedAt.toLocaleDateString()] }), page.publishedAt && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E ", page.publishedAt.toLocaleDateString()] })] }))] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => {
                                            loadPage(page.id);
                                            onEditPage?.(page.id);
                                        }, className: "p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors", title: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C", children: _jsx(FiEdit3, { className: "w-4 h-4" }) }), _jsx("button", { className: "p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors", title: "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440", children: _jsx(FiEye, { className: "w-4 h-4" }) }), page.status === 'draft' && (_jsx("button", { onClick: () => handlePublishPage(page.id), className: "p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors", title: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C", children: _jsx(FiCheck, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => handleDeletePage(page.id), className: "p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C", children: _jsx(FiTrash2, { className: "w-4 h-4" }) })] })] }) }, page.id)))) }), pages.length > 0 && (_jsx("div", { className: "bg-gray-50 dark:bg-gray-800 rounded-lg p-4", children: _jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: pages.length }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\u0412\u0441\u0435\u0433\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: pages.filter(p => p.status === 'published').length }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-yellow-600 dark:text-yellow-400", children: pages.filter(p => p.status === 'draft').length }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0438" })] })] }) }))] }));
};
export default PagesSection;
//# sourceMappingURL=PagesSection.js.map