import React, { ReactNode } from 'react'
import { Nunito_Sans } from 'next/font/google'
import { useEditorTheme } from '../editor-theme-context'

interface LayoutProps {
  children?: ReactNode
}

const nunito = Nunito_Sans({
  adjustFontFallback: false,
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-nunito',
})

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isEditorDarkMode } = useEditorTheme();
  
  return (
    <div
      className={`flex flex-col h-screen justify-between font-sans antialiased`}
    >
      <main className={`mb-auto transition-colors duration-200 ${
        isEditorDarkMode ? '!bg-gray-900' : '!bg-white'
      }`}>{children}</main>
    </div>
  )
}

export default Layout
