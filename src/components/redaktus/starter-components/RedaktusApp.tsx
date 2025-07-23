import { useEffect } from 'react'
import { Redaktus } from 'redaktus/core'
import { useTheme } from '../../../hooks/useTheme'
import { initEditorTheme, setEditorTheme } from '../editor-theme-utils'

import config from '../config/config'

// Vite-совместимые типы
interface AppProps {
  Component: React.ComponentType<any>
  pageProps: Record<string, any>
}

const RedaktusApp = ({ Component, pageProps }: AppProps) => {
  console.log('RedaktusApp render - Component:', Component, 'pageProps:', pageProps)

  const { resolvedTheme, isDark } = useTheme()

  console.log('RedaktusApp resolvedTheme:', resolvedTheme, 'isDark:', isDark)

  // Синхронизируем тему редактора с основной темой приложения
  useEffect(() => {
    const editorTheme = isDark ? 'dark' : 'light'
    setEditorTheme(editorTheme)
    console.log('🎨 Editor theme synchronized with app theme:', editorTheme)
  }, [isDark])

  const redaktusConfig = {
    ...config,
    isDarkColorMode: isDark, // Используем тему из основного приложения
    contentClassName: `antialiased font-inter ${isDark ? 'dark bg-dark text-gray-1' : 'light bg-gray text-black'}`,
  }

  console.log('RedaktusApp redaktusConfig:', redaktusConfig)
  console.log('About to render Redaktus provider')

  useEffect(() => {
    initEditorTheme();
  }, []);

  return (
    <Redaktus {...redaktusConfig}>
      {(() => {
        console.log('Inside Redaktus provider - rendering Component')
        return <Component {...pageProps} />
      })()}
    </Redaktus>
  )
}

export default RedaktusApp
