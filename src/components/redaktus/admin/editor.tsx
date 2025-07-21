import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Admin, Editor } from 'redaktus/core'

const AdminEditor: React.FC = () => {
  return (
    <Admin>
      <Helmet>
        <title>Redaktus Editor</title>
      </Helmet>
      <Editor />
    </Admin>
  )
}

export default AdminEditor
