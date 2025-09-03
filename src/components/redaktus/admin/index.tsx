import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Admin, Login } from 'redaktus/core';

const AdminLogin: React.FC = () => {
  return (
    <Admin isLogin>
      <Helmet>
        <title>Redaktus Login</title>
      </Helmet>
      <Login />
    </Admin>
  );
};

export default AdminLogin;
