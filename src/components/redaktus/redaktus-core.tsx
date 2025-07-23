import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import {
  FaCube,
  FaSearch,
  FaPalette,
  FaBox,
  FaLink,
  FaChartBar,
  FaWrench,
  FaUser,
  FaHome,
  FaCircle,
  FaSyncAlt,
  FaMobile,
  FaLaptop,
  FaDesktop,
  FaExternalLinkAlt,
  FaExpand,
  FaSave,
  FaChevronDown,
  FaPlay,
  FaClipboard,
  FaFile,
  FaPlus,
  FaFolder,
  FaBlog
} from 'react-icons/fa'

// Импорт новых TailGrids компонентов
import VerticalNavbar from '../tailgrids/VerticalNavbar'
import EditorNavbar from '../tailgrids/EditorNavbar'
import CanvasToolbar from '../tailgrids/CanvasToolbar'
import SettingsPanel from '../tailgrids/SettingsPanel'

// Redaktus Core - полностью независимое решение без react-bricks

// Redaktus компоненты - полностью независимые
export const Admin: React.FC<{ children: React.ReactNode; isLogin?: boolean }> = ({
  children,
  isLogin = false
}) => {
  console.log('Admin component render - isLogin:', isLogin)
  return (
    <div className="redaktus-admin w-full h-full" data-login={isLogin}>
      {children}
    </div>
  )
}

// Импорт конфигурации блоков
import config from './config/config'

const EditorContent: React.FC = () => {
  console.log('🎯 Editor component render - START')
  console.log('🎯 Editor component - rendering area should be visible')

  // Состояние для второй панели
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Получаем все доступные блоки из конфигурации
  const allBricks = config.bricks?.flatMap(theme =>
    theme.categories?.flatMap(category => category.bricks || []) || []
  ) || []

  console.log('🎯 Available bricks:', allBricks.length)

  const handleSave = () => {
    console.log('Saving page...')
    // Здесь будет логика сохранения
  }

  const handlePreview = () => {
    console.log('Opening preview...')
  }

  const handleCode = () => {
    console.log('Opening code view...')
  }

  const handleUndo = () => {
    console.log('Undo...')
  }

  const handleRedo = () => {
    console.log('Redo...')
  }

  return (
    <div 
      className="redaktus-editor h-screen flex flex-col transition-colors duration-200 bg-gray-50 dark:bg-gray-900"
      data-editor-container
    >
      {/* Верхняя панель над всем редактором */}
      <EditorNavbar 
        currentPage="Home"
        onSave={handleSave}
        autosaveEnabled={true}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Левая панель с компонентами */}
        <VerticalNavbar availableBricks={allBricks} />

        {/* Центральная область с холстом */}
        <div className="flex-1 flex flex-col transition-colors duration-200 bg-gray-100 dark:bg-gray-800">
          {/* Вторая панель ТОЛЬКО над холстом */}
          <CanvasToolbar
            currentDevice={currentDevice}
            onDeviceChange={setCurrentDevice}
            onPreview={handlePreview}
            onCode={handleCode}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSave={handleSave}
          />

          {/* Область редактирования - ВСЕГДА СВЕТЛАЯ */}
          <div className="flex-1 overflow-y-auto !bg-white">
            {/* Редактируемая страница - с улучшенным дизайном */}
            <div 
              className="min-h-full"
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('ring-2', 'ring-gray-400', 'ring-opacity-50')
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('ring-2', 'ring-gray-400', 'ring-opacity-50')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('ring-2', 'ring-gray-400', 'ring-opacity-50')

                const brickType = e.dataTransfer.getData('text/plain')
                console.log('🎯 Dropped brick type:', brickType)

                if (brickType) {
                  // Здесь будет логика добавления блока
                  console.log('🎯 Adding brick to canvas:', brickType)
                }
              }}
            >
              {/* Пример контента страницы */}
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Hero Section */}
                  <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                      Great <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DX</span> for Developers, great <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">UX</span> for Content editors.
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                      Redaktus provides a powerful visual editor that makes content management intuitive and
                    </p>
                    <div className="flex justify-center space-x-4">
                              <button className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
          Visual Website Builder
        </button>
                    </div>
                  </div>

                  {/* Feature Section */}
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Visual Content Management
                      </h2>
                      <p className="text-lg text-gray-600 mb-6">
                        Create and edit content visually with our intuitive drag-and-drop interface. No coding required.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          Drag and drop components
                        </li>
                        <li className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          Real-time preview
                        </li>
                        <li className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          Responsive design
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-purple-100 p-8 rounded-lg">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">🎨</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Visual Content Management
                        </h3>
                        <p className="text-gray-600">
                          Create beautiful content without touching code
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель настроек */}
        <SettingsPanel currentPage="Home" />
      </div>
    </div>
  )
}

export const Editor: React.FC = () => {
  return <EditorContent />
}

console.log('🎯 Editor component render - END')

export const Login: React.FC = () => {
  console.log('Login component render')
  
  return (
    <div className="redaktus-login h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <FaCube className="text-gray-600 dark:text-gray-300" size={32} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold transition-colors duration-200 text-gray-900 dark:text-gray-100">
            Sign in to Redaktus
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-t-md"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-b-md"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const Playground: React.FC = () => {
  console.log('Playground component render')
  
  return (
    <div className="redaktus-playground h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaWrench className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100">Playground</h3>
        <p className="mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">Test your blocks here</p>
      </div>
    </div>
  )
}

export const AppSettings: React.FC = () => {
  console.log('AppSettings component render')
  
  return (
    <div className="redaktus-app-settings h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaWrench className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100">App Settings</h3>
        <p className="mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">Configure your application</p>
      </div>
    </div>
  )
}

export const MediaLibrary: React.FC = () => {
  console.log('MediaLibrary component render')
  
  return (
    <div className="redaktus-media h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaLink className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100">Media Library</h3>
        <p className="mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">Manage your media files</p>
      </div>
    </div>
  )
}

// Утилиты для текста - оставляем как есть для совместимости
export const Text: React.FC<any> = (props) => {
  return <span {...props} />
}

export const RichText: React.FC<any> = (props) => {
  return <div {...props} />
}

export const RichTextExt: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Image: React.FC<any> = (props) => {
  return <img {...props} />
}

export const File: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Icon: React.FC<any> = (props) => {
  return <span {...props} />
}

export const Meta: React.FC<any> = (props) => {
  return <meta {...props} />
}

export const PageViewer: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Preview: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Repeater: React.FC<any> = ({ children }) => {
  return <div className="redaktus-repeater">{children}</div>
}

export const Slot: React.FC<any> = ({ children }) => {
  return <div className="redaktus-slot">{children}</div>
}

export const Link: React.FC<any> = (props) => {
  return <a {...props} />
}

// Хуки
export const useRedaktus = () => ({
  isDarkColorMode: false,
  toggleColorMode: () => {}
})

export const useVisualEdit = (initialValue: string = '') => {
  const [value, setValue] = React.useState(initialValue)
  const [isEditing, setIsEditing] = React.useState(false)
  
  return [
    value,
    (newValue: string) => setValue(newValue),
    false // isReadOnly - для редактора всегда false
  ] as const
}

// Контекст
export const RedaktusContext = React.createContext({
  isDarkColorMode: false
})

// SSO компоненты
export const SsoLogin: React.FC = () => {
  return <div>SSO Login</div>
}

export const SsoLoginSuccess: React.FC = () => {
  return <div>SSO Login Success</div>
}

export const SsoLoginFailure: React.FC = () => {
  return <div>SSO Login Failure</div>
}

// Дополнительные хуки
export const useAdminContext = () => ({
  isAdmin: false,
  isLogin: false
})

export const usePage = () => ({
  page: null,
  loading: false
})

export const usePagePublic = () => ({
  page: null,
  loading: false
})

export const usePageValues = () => ({
  values: {},
  setValues: () => {}
})

export const usePages = () => ({
  pages: [],
  loading: false
})

export const usePagesPublic = () => ({
  pages: [],
  loading: false
})

export const useRedaktusContext = () => ({
  isDarkColorMode: false,
  toggleColorMode: () => {}
})

export const useTagsPublic = () => ({
  tags: [],
  loading: false
})

// Утилиты
export const fetchPage = async () => null
export const fetchPages = async () => []
export const fetchTags = async () => []
export const renderJsonLd = () => null
export const renderMeta = () => null
export const cleanPage = () => null
export const getPagePlainText = () => ''
export const getSchemaOrgData = () => null

// Плагины
export const blockPluginConstructor = () => null
export const blockWithModalPluginConstructor = () => null
export const markPluginConstructor = () => null
export const plugins = []

// Дополнительные компоненты
export const JsonLd: React.FC = () => null
export const Plain: React.FC = () => null

// SSO
export const useAuth = () => ({
  isAuthenticated: false,
  user: null
})

// Утилиты
export const uuid = () => 'redaktus-' + Math.random().toString(36).substr(2, 9)

// Главный провайдер Redaktus
export const Redaktus: React.FC<any> = ({ 
  children, 
  appId,
  apiKey,
  pageTypes,
  customFields,
  loginUI,
  contentClassName,
  renderLocalLink,
  loginPath,
  editorPath,
  playgroundPath,
  appSettingsPath,
  previewPath,
  isDarkColorMode,
  toggleColorMode,
  useCssInJs,
  appRootElement,
  clickToEditSide,
  enableAutoSave,
  disableSaveIfInvalidProps,
  enablePreview,
  blockIconsPosition,
  enableUnsplash,
  unsplashApiKey,
  enablePreviewImage,
  enableDefaultEmbedBrick,
  navigate,
  ...domProps
}) => {
  console.log('Redaktus Provider render')
  console.log('Redaktus children:', children)
  console.log('Redaktus appId:', appId)
  
  // Сохраняем конфигурацию в контексте, но не передаём в DOM
  const config = {
    appId,
    apiKey,
    pageTypes,
    customFields,
    loginUI,
    contentClassName,
    renderLocalLink,
    loginPath,
    editorPath,
    playgroundPath,
    appSettingsPath,
    previewPath,
    isDarkColorMode: isDarkColorMode || false,
    toggleColorMode,
    useCssInJs,
    appRootElement,
    clickToEditSide,
    enableAutoSave,
    disableSaveIfInvalidProps,
    enablePreview,
    blockIconsPosition,
    enableUnsplash,
    unsplashApiKey,
    enablePreviewImage,
    enableDefaultEmbedBrick,
    navigate
  }

  console.log('Redaktus config:', config)

  return (
    <RedaktusContext.Provider value={config}>
      <div className="redaktus-provider" {...domProps}>
        {children}
      </div>
    </RedaktusContext.Provider>
  )
} 