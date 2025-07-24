import React from 'react'

// Redaktus Editor - НАГЛО СКОПИРОВАНО С REACTBRICKS!

// Импортируем скопированные админские компоненты
import AdminEditor from './redaktus/admin/editor'
import AdminLogin from './redaktus/admin/index'  
import AdminPlayground from './redaktus/admin/playground'
import AdminMedia from './redaktus/admin/media'
import AdminAppSettings from './redaktus/admin/app-settings'

// Импортируем конфигурацию
import config from './redaktus/config/config'

// Импортируем главный провайдер из starter
import RedaktusApp from './redaktus/starter-components/RedaktusApp'

interface RedaktusEditorProps {
  mode?: 'editor' | 'login' | 'playground' | 'media' | 'app-settings'
}

const RedaktusEditor: React.FC<RedaktusEditorProps> = ({ mode = 'editor' }) => {
  console.log('RedaktusEditor render - mode:', mode)
  console.log('RedaktusEditor config:', config)

  // Роутинг как в ReactBricks
  const renderAdminComponent = () => {
    console.log('renderAdminComponent called - mode:', mode)
    
    switch (mode) {
      case 'login':
        console.log('Rendering AdminLogin')
        return <AdminLogin />
      case 'playground':
        console.log('Rendering AdminPlayground')
        return <AdminPlayground />
      case 'media':
        console.log('Rendering AdminMedia')
        return <AdminMedia />
      case 'app-settings':
        console.log('Rendering AdminAppSettings')
        return <AdminAppSettings />
      default:
        console.log('Rendering AdminEditor (default)')
        return <AdminEditor />
    }
  }

  console.log('About to render RedaktusApp')
  return (
    <RedaktusApp
      Component={() => {
        console.log('RedaktusApp Component function called')
        return renderAdminComponent()
      }}
      pageProps={{}}
    />
  )
}

export default RedaktusEditor 