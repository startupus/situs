import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'
import './i18n' // Инициализация i18n
import { SiteProvider } from './contexts/SiteContext'
import { StudioInterface } from './components/StudioInterface'
import { useTheme } from './hooks/useTheme'

function App() {
  const { resolvedTheme } = useTheme()

  return (
    <HelmetProvider>
      <SiteProvider>
        <div 
          className={`min-h-screen w-screen max-w-none overflow-x-hidden transition-colors duration-200 ${
            resolvedTheme === 'dark' ? 'bg-dark text-gray-1' : 'bg-gray text-black'
          }`}
          style={{ width: '100vw', maxWidth: 'none' }}
        >
          <StudioInterface />
        </div>
      </SiteProvider>
    </HelmetProvider>
  )
}

export default App 