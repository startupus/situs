import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useProject } from '../contexts/ProjectContext';
import RedaktusEditor from './legacy/RedaktusEditor';
const ProjectEditorView = ({ onBack }) => {
    const { currentPage, currentProject } = useProject();
    if (!currentProject) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "\u041F\u0440\u043E\u0435\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u0430" }), _jsx("button", { onClick: onBack, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u043F\u0440\u043E\u0435\u043A\u0442\u0430\u043C" })] }) }));
    }
    if (!currentPage) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u0430" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F" }), _jsx("button", { onClick: onBack, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u043F\u0440\u043E\u0435\u043A\u0442\u0443" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-white dark:bg-gray-900", children: _jsx(RedaktusEditor, { mode: "editor", onBack: onBack }) }));
};
export default ProjectEditorView;
//# sourceMappingURL=ProjectEditorView.js.map