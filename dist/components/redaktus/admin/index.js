import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
import { Admin, Login } from 'redaktus/core';
const AdminLogin = () => {
    return (_jsxs(Admin, { isLogin: true, children: [_jsx(Helmet, { children: _jsx("title", { children: "Redaktus Login" }) }), _jsx(Login, {})] }));
};
export default AdminLogin;
//# sourceMappingURL=index.js.map