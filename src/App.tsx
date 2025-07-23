import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import RedaktusEditor from './components/RedaktusEditor'
import StatusPage from './pages/StatusPage'
import { useTheme } from './hooks/useTheme'

function App() {
  const { isDark } = useTheme()

  return (
    <HelmetProvider>
      <Router>
        <div className={`min-h-screen transition-colors duration-200 ${
          isDark ? 'bg-dark text-gray-1' : 'bg-gray text-black'
        }`}>
          <Routes>
            <Route path="/" element={<RedaktusEditor mode="editor" />} />
            <Route path="/status" element={<StatusPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App 