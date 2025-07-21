import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Admin, AppSettings } from 'redaktus/core'

const AdminAppSettings: React.FC = () => {
  return (
    <Admin>
      <Helmet>
        <title>Redaktus Settings</title>
      </Helmet>
      <AppSettings />
    </Admin>
  )
}

export default AdminAppSettings
