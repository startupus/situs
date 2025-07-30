import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Admin, SsoLogin } from 'redaktus';
const AdminSSOLogin = () => {
    useEffect(() => {
        document.title = 'SSO Login';
    }, []);
    return (_jsx(Admin, { isLogin: true, children: _jsx(SsoLogin, {}) }));
};
export default AdminSSOLogin;
//# sourceMappingURL=sso-login.js.map