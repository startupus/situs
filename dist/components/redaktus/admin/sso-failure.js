import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Admin, SsoLoginFailure } from 'redaktus';
const AdminSsoFailure = () => {
    useEffect(() => {
        document.title = 'SSO Login Failure';
    }, []);
    return (_jsx(Admin, { isLogin: true, children: _jsx(SsoLoginFailure, {}) }));
};
export default AdminSsoFailure;
//# sourceMappingURL=sso-failure.js.map