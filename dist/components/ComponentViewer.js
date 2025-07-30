import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FiX, FiCopy, FiCode, FiEye, FiDownload } from 'react-icons/fi';
const ComponentViewer = ({ componentId, componentName, onClose }) => {
    const [activeTab, setActiveTab] = useState('preview');
    // Демо компоненты для разных категорий
    const getDemoComponent = () => {
        switch (componentId) {
            case 'buttons':
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors", children: "Primary Button" }), _jsx("button", { className: "bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors", children: "Secondary Button" }), _jsx("button", { className: "border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors", children: "Outline Button" })] }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors", children: "Rounded Button" }), _jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors", children: "Success Button" }), _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors", children: "Danger Button" })] })] }));
            case 'forms':
                return (_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Email Address" }), _jsx("input", { type: "email", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white", placeholder: "Enter your email" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Password" }), _jsx("input", { type: "password", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white", placeholder: "Enter your password" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Message" }), _jsx("textarea", { rows: 4, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white", placeholder: "Enter your message" })] }), _jsx("button", { className: "w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors", children: "Submit Form" })] }));
            case 'alerts':
                return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-blue-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium", children: "Info alert" }), _jsx("p", { className: "text-sm mt-1", children: "This is an informational alert." })] })] }) }), _jsx("div", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-green-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium", children: "Success alert" }), _jsx("p", { className: "text-sm mt-1", children: "Operation completed successfully." })] })] }) }), _jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium", children: "Error alert" }), _jsx("p", { className: "text-sm mt-1", children: "Something went wrong. Please try again." })] })] }) })] }));
            case 'cards':
                return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden", children: [_jsx("img", { className: "w-full h-48 object-cover", src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", alt: "Card" }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "Card Title" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "This is a sample card component with image and content." }), _jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "Learn More" })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-blue-600 dark:text-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Feature Card" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Amazing features" })] })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "This card showcases a feature with an icon and description." }), _jsx("button", { className: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium", children: "View Details \u2192" })] }), _jsxs("div", { className: "bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white", children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Gradient Card" }), _jsx("p", { className: "mb-4 opacity-90", children: "Beautiful gradient background with white text." }), _jsx("button", { className: "bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all", children: "Get Started" })] })] }));
            default:
                return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83C\uDFA8" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: componentName }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u041A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442 \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435" })] }));
        }
    };
    const getComponentCode = () => {
        switch (componentId) {
            case 'buttons':
                return `// Primary Button
<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  Primary Button
</button>

// Secondary Button  
<button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  Secondary Button
</button>

// Outline Button
<button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
  Outline Button
</button>`;
            case 'forms':
                return `// Form Input
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Enter your email"
  />
</div>

// Textarea
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Message
  </label>
  <textarea
    rows={4}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Enter your message"
  />
</div>`;
            case 'alerts':
                return `// Info Alert
<div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm font-medium">Info alert</p>
      <p className="text-sm mt-1">This is an informational alert.</p>
    </div>
  </div>
</div>`;
            default:
                return `// Component code will be available here
// This component is under development`;
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: componentName }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0438 \u0442\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiCopy, { className: "w-4 h-4" }) }), _jsx("button", { className: "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiDownload, { className: "w-4 h-4" }) }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(FiX, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "flex border-b border-gray-200 dark:border-gray-700", children: [_jsxs("button", { onClick: () => setActiveTab('preview'), className: `flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, children: [_jsx(FiEye, { className: "w-4 h-4" }), "\u041F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440"] }), _jsxs("button", { onClick: () => setActiveTab('code'), className: `flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'code'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, children: [_jsx(FiCode, { className: "w-4 h-4" }), "\u041A\u043E\u0434"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: activeTab === 'preview' ? (_jsx("div", { className: "p-6", children: _jsx("div", { className: "bg-gray-50 dark:bg-gray-900 rounded-lg p-8", children: getDemoComponent() }) })) : (_jsx("div", { className: "p-6", children: _jsx("pre", { className: "bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm", children: _jsx("code", { children: getComponentCode() }) }) })) }), _jsxs("div", { className: "flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\u041A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442 \u0438\u0437 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438 React Pro Components" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors", children: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043E\u0434" }), _jsx("button", { className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors", children: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442" })] })] })] }) }));
};
export default ComponentViewer;
//# sourceMappingURL=ComponentViewer.js.map