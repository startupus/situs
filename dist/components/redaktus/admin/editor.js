import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
import { Admin } from 'redaktus/core';
import { Editor } from '../redaktus-core';
const AdminEditor = () => {
    return (_jsxs(Admin, { children: [_jsx(Helmet, { children: _jsx("title", { children: "Redaktus Editor" }) }), _jsx(Editor, {})] }));
};
export default AdminEditor;
//# sourceMappingURL=editor.js.map