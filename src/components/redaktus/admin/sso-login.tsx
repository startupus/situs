import React, { useEffect } from 'react'
import { Admin, SsoLogin } from 'redaktus'

const AdminSSOLogin: React.FC = () => {
  useEffect(() => {
    document.title = 'SSO Login'
  }, [])

  return (
    <Admin isLogin>
      <SsoLogin />
    </Admin>
  )
}

export default AdminSSOLogin
