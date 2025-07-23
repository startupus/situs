import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'
import './i18n' // Инициализация i18n
import RedaktusEditor from './components/RedaktusEditor'
import { useTheme } from './hooks/useTheme'

function App() {
  const { resolvedTheme } = useTheme()

  return (
    <HelmetProvider>
      <div 
        className={`min-h-screen w-screen max-w-none overflow-x-hidden transition-colors duration-200 ${
          resolvedTheme === 'dark' ? 'bg-dark text-gray-1' : 'bg-gray text-black'
        }`}
        style={{ width: '100vw', maxWidth: 'none' }}
      >
        <RedaktusEditor mode="editor" />
      </div>
    </HelmetProvider>
  )
}

export default App 