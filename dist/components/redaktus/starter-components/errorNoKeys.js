import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ErrorNoKeys = () => {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-6 py-20 text-gray-600", children: [_jsx("h1", { className: "text-2xl text-red-600 font-semibold mb-8", children: "Warning: missing App credentials" }), _jsxs("p", { className: "mb-6", children: [_jsx("code", { className: "text-sm text-black bg-gray-100 px-1 py-1 rounded-sm", children: "NEXT_PUBLIC_APP_ID" }), ' ', "and", ' ', _jsx("code", { className: "text-sm text-black bg-gray-100 px-1 py-1 rounded-sm", children: "API_KEY" }), ' ', "are not configured in your", ' ', _jsx("code", { className: "text-sm text-black bg-gray-100 px-1 py-1 rounded-sm", children: ".env.local" }), ' ', "file."] }), _jsxs("p", { className: "mb-2", children: ["Please create a", ' ', _jsx("code", { className: "text-sm text-black bg-gray-100 px-1 py-1 rounded-sm", children: ".env.local" }), ' ', "file with:"] }), _jsx("pre", { className: "bg-gray-900 text-white px-4 py-3 rounded-sm", children: `NEXT_PUBLIC_APP_ID=...
API_KEY=...` })] }));
};
export default ErrorNoKeys;
//# sourceMappingURL=errorNoKeys.js.map