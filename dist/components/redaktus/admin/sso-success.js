import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Admin, SsoLoginSuccess } from 'redaktus';
const AdminSsoSuccess = () => {
    useEffect(() => {
        document.title = 'SSO Login Success';
    }, []);
    return (_jsx(Admin, { isLogin: true, children: _jsx(SsoLoginSuccess, {}) }));
};
export default AdminSsoSuccess;
//# sourceMappingURL=sso-success.js.map