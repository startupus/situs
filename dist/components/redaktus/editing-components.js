import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const RichText = ({ propName, placeholder = "Type text...", allowedFeatures = [], renderBlock, renderHighlight, renderLink, renderCode, value = "", onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const handleDoubleClick = () => {
        setIsEditing(true);
        setEditValue(value);
    };
    const handleSave = () => {
        setIsEditing(false);
        onChange?.(editValue);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditValue(value);
    };
    if (isEditing) {
        return (_jsxs("div", { className: "relative", children: [_jsx("textarea", { value: editValue, onChange: (e) => setEditValue(e.target.value), className: "w-full p-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: placeholder, autoFocus: true }), _jsxs("div", { className: "absolute top-2 right-2 flex space-x-1", children: [_jsx("button", { onClick: handleSave, className: "px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600", children: "\u2713" }), _jsx("button", { onClick: handleCancel, className: "px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600", children: "\u2715" })] })] }));
    }
    const content = value || placeholder;
    if (renderBlock) {
        return renderBlock({
            children: content,
            onDoubleClick: handleDoubleClick,
            className: "cursor-pointer hover:bg-blue-50 p-1 rounded"
        });
    }
    return (_jsx("div", { onDoubleClick: handleDoubleClick, className: "cursor-pointer hover:bg-blue-50 p-1 rounded", children: content }));
};
export const Text = ({ propName, placeholder = "Type text...", renderBlock, value = "", onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const handleDoubleClick = () => {
        setIsEditing(true);
        setEditValue(value);
    };
    const handleSave = () => {
        setIsEditing(false);
        onChange?.(editValue);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditValue(value);
    };
    if (isEditing) {
        return (_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: editValue, onChange: (e) => setEditValue(e.target.value), className: "w-full p-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: placeholder, autoFocus: true }), _jsxs("div", { className: "absolute top-2 right-2 flex space-x-1", children: [_jsx("button", { onClick: handleSave, className: "px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600", children: "\u2713" }), _jsx("button", { onClick: handleCancel, className: "px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600", children: "\u2715" })] })] }));
    }
    const content = value || placeholder;
    if (renderBlock) {
        return renderBlock({
            children: content,
            onDoubleClick: handleDoubleClick,
            className: "cursor-pointer hover:bg-blue-50 p-1 rounded"
        });
    }
    return (_jsx("span", { onDoubleClick: handleDoubleClick, className: "cursor-pointer hover:bg-blue-50 p-1 rounded", children: content }));
};
export const Image = ({ propName, alt = "Image", maxWidth = 800, aspectRatio, imageClassName = "", value = "", onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const handleDoubleClick = () => {
        setIsEditing(true);
        setEditValue(value);
    };
    const handleSave = () => {
        setIsEditing(false);
        onChange?.(editValue);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditValue(value);
    };
    if (isEditing) {
        return (_jsxs("div", { className: "relative", children: [_jsx("input", { type: "url", value: editValue, onChange: (e) => setEditValue(e.target.value), className: "w-full p-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter image URL...", autoFocus: true }), _jsxs("div", { className: "absolute top-2 right-2 flex space-x-1", children: [_jsx("button", { onClick: handleSave, className: "px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600", children: "\u2713" }), _jsx("button", { onClick: handleCancel, className: "px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600", children: "\u2715" })] })] }));
    }
    if (!value) {
        return (_jsx("div", { onDoubleClick: handleDoubleClick, className: `w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-blue-50 ${imageClassName}`, children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx("div", { className: "text-2xl mb-1", children: "\uD83D\uDDBC\uFE0F" }), _jsx("div", { className: "text-xs", children: "\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u043A\u043B\u0438\u043A \u0434\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F" })] }) }));
    }
    return (_jsx("img", { src: value, alt: alt, onDoubleClick: handleDoubleClick, className: `cursor-pointer hover:opacity-80 transition-opacity ${imageClassName}`, style: {
            maxWidth: maxWidth,
            aspectRatio: aspectRatio
        } }));
};
export const Repeater = ({ propName, renderWrapper, children }) => {
    if (renderWrapper) {
        return renderWrapper(children);
    }
    return _jsx("div", { className: "space-y-2", children: children });
};
//# sourceMappingURL=editing-components.js.map