import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Admin } from 'redaktus/core'
import { Editor } from '../redaktus-core'

const AdminEditor: React.FC = () => {
  return (
    <Admin>
      <Helmet>
        <title>Redaktus Editor</title>
      </Helmet>
      
      {/* Кнопка статуса */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          to="/status"
          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm opacity-70 hover:opacity-100"
        >
          📊 Статус
        </Link>
      </div>
      
      <Editor />
    </Admin>
  )
}

export default AdminEditor
