import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Admin, Playground } from 'redaktus/core'

const AdminPlayground: React.FC = () => {
  return (
    <Admin>
      <Helmet>
        <title>Redaktus Playground</title>
      </Helmet>
      <Playground />
    </Admin>
  )
}

export default AdminPlayground
