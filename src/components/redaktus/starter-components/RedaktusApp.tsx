import { useEffect, useState } from 'react'
import { Redaktus } from 'redaktus/core'

import config from '../config/config'

// Vite-совместимые типы
interface AppProps {
  Component: React.ComponentType<any>
  pageProps: Record<string, any>
}

const RedaktusApp = ({ Component, pageProps }: AppProps) => {
  console.log('RedaktusApp render - Component:', Component, 'pageProps:', pageProps)

  // Color Mode Management для Vite
  const [colorMode, setColorMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('color-mode') || 'light'
    }
    return 'light'
  })

  console.log('RedaktusApp colorMode:', colorMode)

  const toggleColorMode = () => {
    const newColorMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(newColorMode)
    localStorage.setItem('color-mode', newColorMode)

    // Обновляем класс на body
    document.body.className = newColorMode === 'dark' ? 'dark' : 'light'
  }

  // Применяем тему при загрузке
  useEffect(() => {
    console.log('RedaktusApp useEffect - setting body class:', colorMode)
    document.body.className = colorMode === 'dark' ? 'dark' : 'light'
  }, [colorMode])

  const redaktusConfig = {
    ...config,
    isDarkColorMode: colorMode === 'dark',
    toggleColorMode,
    contentClassName: `antialiased font-sans ${colorMode} ${
      colorMode === 'dark' ? 'dark bg-gray-900' : 'light bg-white'
    }`,
  }

  console.log('RedaktusApp redaktusConfig:', redaktusConfig)
  console.log('About to render Redaktus provider')

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
