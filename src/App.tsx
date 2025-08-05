import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './i18n' // Инициализация i18n
import { SiteProvider } from './contexts/SiteContext'
import { UserProvider } from './contexts/UserContext'
import { ProjectProvider } from './contexts/ProjectContext'
// Legacy components moved to legacy folder
import { StudioInterface } from './components/legacy/StudioInterface'
import RedaktusEditor from './components/legacy/RedaktusEditor'
import ProjectWorkspace from './components/legacy/ProjectWorkspace'
import ProjectSelector from './pages/ProjectSelector'
import { useTheme } from './hooks/useTheme'
import SitusApp from './components/situs/SitusApp'
import SitusNewApp from './components/situs-new/SitusApp'

function App() {
  const { resolvedTheme } = useTheme()

  console.log("App component rendered, theme:", resolvedTheme);

  return (
    <HelmetProvider>
      <UserProvider>
        <ProjectProvider>
          <Router>
          <div 
            className={`min-h-screen w-screen max-w-none overflow-x-hidden transition-colors duration-200 ${
              resolvedTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}
            style={{ width: '100vw', maxWidth: 'none' }}
          >
            <Routes>
              {/* Situs Platform - управление сайтами (1 уровень) */}
              <Route path="/situs" element={
                <SiteProvider>
                  <ProjectSelector />
                </SiteProvider>
              } />
              
              {/* Situs Platform - рабочая область проекта (2 уровень) */}
              <Route path="/situs/project/:projectId" element={
                <SiteProvider>
                  <ProjectWorkspace />
                </SiteProvider>
              } />
              
              {/* Redaktus Studio - сразу редактор */}
              <Route path="/redaktus" element={
                <div className="min-h-screen bg-white">
                  <RedaktusEditor mode="editor" />
                </div>
              } />
              
              {/* Studio Interface - интерфейс управления проектами */}
              <Route path="/studio/*" element={
                <SiteProvider>
                  <StudioInterface />
                </SiteProvider>
              } />
              
              {/* Новый интерфейс Situs (situs-new) */}
              <Route path="/situs-new/*" element={
                <SiteProvider>
                  <SitusNewApp />
                </SiteProvider>
              } />
              
              {/* Основной интерфейс Situs на основе Admino - обрабатывает все остальные роуты */}
              <Route path="/*" element={
                <SiteProvider>
                  <SitusApp />
                </SiteProvider>
              } />
            </Routes>
          </div>
        </Router>
        </ProjectProvider>
      </UserProvider>
    </HelmetProvider>
  )
}



export default App 