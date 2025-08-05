import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HeroBlock from './blocks/HeroBlock';
import TestimonialBlock from './blocks/TestimonialBlock';
import ServicesBlock from './blocks/ServicesBlock';
// Оригинальный блок из React Pro Components
import { Hero1OriginalBlock } from './blocks/Hero1OriginalBlock';
// Реестр блоков - оригинальные React Pro Components + TailGrids
const blockRegistry = {
    // Оригинальный блок из React Pro Components
    'hero-1-original': Hero1OriginalBlock,
    // Старые блоки для совместимости
    'hero-block': HeroBlock,
    'testimonial-block': TestimonialBlock,
    'services-block': ServicesBlock,
    // Заглушки для остальных блоков
    'hero-split': () => _jsx("div", { className: "p-4 bg-gray-100 dark:bg-gray-800 rounded", children: "Hero Split Block (Coming Soon)" }),
    'hero-video': () => _jsx("div", { className: "p-4 bg-gray-100 dark:bg-gray-800 rounded", children: "Hero Video Block (Coming Soon)" }),
    'list-block': () => _jsx("div", { className: "p-4 bg-gray-100 dark:bg-gray-800 rounded", children: "List Block (Coming Soon)" }),
    'gallery-block': () => _jsx("div", { className: "p-4 bg-gray-100 dark:bg-gray-800 rounded", children: "Gallery Block (Coming Soon)" }),
    'video-block': () => _jsx("div", { className: "p-4 bg-gray-100 dark:bg-gray-800 rounded", children: "Video Block (Coming Soon)" }),
    'container-block': () => _jsx("div", { className: "p-4 bg-gray-100 dark:bg-gray-800 rounded", children: "Container Block (Coming Soon)" }),
    'columns-block': () => _jsx("div", { className: "p-4 bg-gray-100 dark:bg-gray-800 rounded", children: "Columns Block (Coming Soon)" })
};
const RedaktusPageViewer = ({ page, main = false, className = '', onBlockUpdate, onBlockDelete }) => {
    if (!page || !page.content) {
        return (_jsx("div", { className: `flex items-center justify-center min-h-64 ${className}`, children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCC4" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "\u041F\u0443\u0441\u0442\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430" }), _jsx("p", { className: "text-sm", children: "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0431\u043B\u043E\u043A\u0438 \u0441\u044E\u0434\u0430 \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430" })] }) }));
    }
    const renderBlock = (brick, index) => {
        const BlockComponent = blockRegistry[brick.type];
        if (!BlockComponent) {
            return (_jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-4", children: [_jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0431\u043B\u043E\u043A: ", brick.type] }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("p", { className: "text-gray-700", children: "\u042D\u0442\u043E\u0442 \u0442\u0438\u043F \u0431\u043B\u043E\u043A\u0430 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F" }) })] }, brick.id || index));
        }
        const handleBlockUpdate = (newProps) => {
            onBlockUpdate?.(brick.id, newProps);
        };
        const handleBlockDelete = () => {
            onBlockDelete?.(brick.id);
        };
        return (_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10", children: _jsx("div", { className: "bg-blue-500 text-white text-xs px-2 py-1 rounded", children: brick.type }) }), _jsxs("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-1", children: [_jsx("button", { className: "bg-gray-500 text-white text-xs px-2 py-1 rounded hover:bg-gray-600", children: "\u2B06\uFE0F" }), _jsx("button", { className: "bg-gray-500 text-white text-xs px-2 py-1 rounded hover:bg-gray-600", children: "\u2B07\uFE0F" }), _jsx("button", { onClick: handleBlockDelete, className: "bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600", children: "\uD83D\uDDD1\uFE0F" })] }), _jsx("div", { className: "block-container border-0", children: _jsx(BlockComponent, { ...brick.props, onUpdate: handleBlockUpdate }) })] }, brick.id || index));
    };
    return (_jsx("div", { className: className, children: page.content.length === 0 ? (_jsx("div", { className: "flex items-center justify-center min-h-64", children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCC4" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "\u041F\u0443\u0441\u0442\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430" }), _jsx("p", { className: "text-sm", children: "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0431\u043B\u043E\u043A\u0438 \u0441\u044E\u0434\u0430 \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430" })] }) })) : (_jsx("div", { className: "space-y-0", children: page.content.map((brick, index) => renderBlock(brick, index)) })) }));
};
export default RedaktusPageViewer;
//# sourceMappingURL=PageViewer.js.map