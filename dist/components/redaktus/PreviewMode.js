import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FaEye, FaEdit } from 'react-icons/fa';
const PreviewMode = ({ page, isPreview, onTogglePreview, className = '' }) => {
    // Функция для рендеринга блоков в режиме предварительного просмотра
    const renderPreviewBlock = (block) => {
        const { type, props } = block;
        // Простой рендеринг без элементов редактирования
        switch (type) {
            case 'hero-unit':
                return (_jsxs("div", { className: "py-12 px-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: props.title || 'Welcome' }), _jsx("p", { className: "text-xl mb-6", children: props.text || 'Create beautiful content' }), props.imageUrl && (_jsx("img", { src: props.imageUrl, alt: "Hero", className: "mx-auto max-w-md rounded-lg shadow-lg" }))] }));
            case 'text-block':
                return (_jsx("div", { className: `py-6 px-4 ${getAlignmentClass(props.alignment)}`, children: _jsx("div", { className: `max-w-4xl mx-auto ${getFontSizeClass(props.fontSize)}`, children: props.content || 'Type your text here...' }) }));
            case 'heading-block':
                const HeadingTag = props.level || 'h2';
                return (_jsx("div", { className: `py-4 ${getAlignmentClass(props.alignment)}`, children: _jsx(HeadingTag, { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: props.text || 'Heading Text' }) }));
            case 'image-block':
                return (_jsx("div", { className: `py-6 ${getAlignmentClass(props.alignment)}`, children: _jsx("div", { className: "max-w-4xl mx-auto", children: props.imageUrl ? (_jsxs("div", { className: "relative", children: [_jsx("img", { src: props.imageUrl, alt: props.alt || 'Image', className: `mx-auto ${getImageSizeClass(props.size)} rounded-lg shadow-md` }), props.caption && (_jsx("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400 mt-2", children: props.caption }))] })) : (_jsx("div", { className: "bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400", children: "No image selected" })) }) }));
            case 'quote-block':
                return (_jsx("div", { className: "py-6 px-4", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("blockquote", { className: "py-6 px-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500", children: [_jsxs("p", { className: "text-lg italic text-gray-700 dark:text-gray-300 mb-4", children: ["\"", props.text || 'Quote text here...', "\""] }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("span", { className: "font-semibold", children: ["\u2014 ", props.author || 'Author Name'] }), props.source && (_jsxs(_Fragment, { children: [_jsx("span", { className: "mx-2", children: "\u2022" }), _jsx("span", { children: props.source })] }))] })] }) }) }));
            default:
                return (_jsx("div", { className: "py-4 px-4 bg-gray-100 dark:bg-gray-800 rounded", children: _jsxs("p", { className: "text-gray-500 dark:text-gray-400", children: ["Block type \"", type, "\" not supported in preview"] }) }));
        }
    };
    // Вспомогательные функции для стилизации
    const getAlignmentClass = (alignment = 'left') => {
        switch (alignment) {
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            default: return 'text-left';
        }
    };
    const getFontSizeClass = (size = 'medium') => {
        switch (size) {
            case 'small': return 'text-sm';
            case 'large': return 'text-lg';
            default: return 'text-base';
        }
    };
    const getImageSizeClass = (size = 'medium') => {
        switch (size) {
            case 'small': return 'max-w-sm';
            case 'large': return 'max-w-2xl';
            case 'full': return 'w-full';
            default: return 'max-w-lg';
        }
    };
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsx("div", { className: "fixed top-4 left-4 z-50", children: _jsx("button", { onClick: onTogglePreview, className: `flex items-center space-x-2 px-4 py-2 rounded-md shadow-lg transition-colors ${isPreview
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-800 text-white hover:bg-gray-900'}`, children: isPreview ? (_jsxs(_Fragment, { children: [_jsx(FaEdit, { size: 14 }), _jsx("span", { children: "Edit Mode" })] })) : (_jsxs(_Fragment, { children: [_jsx(FaEye, { size: 14 }), _jsx("span", { children: "Preview Mode" })] })) }) }), _jsx("div", { className: "min-h-screen bg-white dark:bg-gray-900", children: isPreview ? (
                // Режим предварительного просмотра
                _jsx("div", { className: "preview-content", children: page.content && page.content.length > 0 ? (page.content.map((block, index) => (_jsx("div", { children: renderPreviewBlock(block) }, block.id || index)))) : (_jsx("div", { className: "flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-400", children: _jsxs("div", { className: "text-center", children: [_jsx(FaEye, { className: "mx-auto h-12 w-12 mb-4" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No content to preview" }), _jsx("p", { className: "text-sm", children: "Add some blocks to see them in preview mode" })] }) })) })) : (
                // Обычный режим редактирования
                _jsx("div", { className: "edit-content", children: _jsx("div", { className: "p-4 text-center text-gray-500 dark:text-gray-400", children: "Switch to preview mode to see how your page will look" }) })) })] }));
};
export default PreviewMode;
//# sourceMappingURL=PreviewMode.js.map