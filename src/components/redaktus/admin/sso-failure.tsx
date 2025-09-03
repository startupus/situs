import React, { useEffect } from 'react';
import { Admin, SsoLoginFailure } from 'redaktus';

const AdminSsoFailure: React.FC = () => {
  useEffect(() => {
    document.title = 'SSO Login Failure';
  }, []);

  return (
    <Admin isLogin>
      <SsoLoginFailure />
    </Admin>
  );
};

export default AdminSsoFailure;
