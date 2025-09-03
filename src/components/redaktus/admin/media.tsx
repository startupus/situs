import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Admin, MediaLibrary } from 'redaktus/core';

const AdminMediaLibrary: React.FC = () => {
  return (
    <Admin>
      <Helmet>
        <title>Redaktus Media</title>
      </Helmet>
      <MediaLibrary />
    </Admin>
  );
};

export default AdminMediaLibrary;
