import React, { useState } from 'react'
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

export const Editor: React.FC = () => {
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
    <div className="redaktus-editor h-screen flex flex-col bg-gray-50">
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
        <div className="flex-1 flex flex-col bg-gray-100">
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

          {/* Область редактирования */}
          <div className="flex-1 overflow-y-auto bg-white">
            {/* Редактируемая страница - с улучшенным дизайном */}
            <div 
              className="min-h-full"
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-50')
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50')

                try {
                  const data = JSON.parse(e.dataTransfer.getData('application/json'))
                  console.log('Block dropped:', data)

                  // Улучшенная демонстрация добавления блока
                  const dropZone = e.currentTarget
                  const newBlock = document.createElement('div')
                  newBlock.className = 'border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-400 transition-all duration-200'
                  newBlock.innerHTML = `
                    <div class="flex items-center justify-between mb-4 p-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-500 flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="font-semibold text-gray-800">${data.label}</h3>
                          <p class="text-sm text-gray-500">Новый блок добавлен</p>
                        </div>
                      </div>
                      <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Активен
                      </span>
                    </div>
                    <div class="bg-white p-4 border-t border-gray-200">
                      <p class="text-gray-700 leading-relaxed">
                        Это новый блок "${data.label}". Кликните здесь для редактирования содержимого. 
                        Вы можете изменить текст, добавить изображения и настроить стили.
                      </p>
                    </div>
                  `
                  newBlock.addEventListener('click', () => {
                    const content = newBlock.querySelector('p')
                    if (content) {
                      content.contentEditable = 'true'
                      content.focus()
                      content.style.outline = '2px solid #3B82F6'
                      content.style.outlineOffset = '2px'
                    }
                  })

                  dropZone.appendChild(newBlock)
                } catch (error) {
                  console.error('Error handling drop:', error)
                }
              }}
            >
              {/* Hero секция с улучшенным дизайном */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative max-w-7xl mx-auto px-8 py-20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        <FaCube className="mr-2" size={12} />
                        Visual Website Builder
                      </div>
                      
                      <h1 
                        className="text-5xl lg:text-6xl font-bold leading-tight hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-4 cursor-text transition-all p-2 -m-2"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onClick={(e) => e.currentTarget.focus()}
                      >
                        Great <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">DX</span> for
                        <br />
                        Developers, great
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">UX</span> for Content
                        <br />
                        editors.
                      </h1>
                      
                      <p 
                        className="text-xl text-gray-300 leading-relaxed hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-4 cursor-text transition-all p-2 -m-2"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onClick={(e) => e.currentTarget.focus()}
                      >
                        Redaktus provides a powerful visual editor that makes content management 
                        intuitive and efficient. Build beautiful websites with ease.
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                          Get Started
                        </button>
                        <button className="px-8 py-4 border border-gray-600 hover:bg-gray-800 text-white font-semibold transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 blur-2xl opacity-70"></div>
                      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 h-80 flex items-center justify-center border border-gray-200 hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-4 cursor-pointer transition-all">
                        <div className="text-center">
                          <FaPalette className="text-6xl text-orange-500 mx-auto mb-4" />
                          <p className="text-gray-700 font-medium">Visual Content Management</p>
                        </div>
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

console.log('🎯 Editor component render - END')

export const Login: React.FC = () => {
  console.log('Login component render')
  return (
    <div className="redaktus-login h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <FaCube className="text-blue-600" size={32} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Redaktus
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
    <div className="redaktus-playground h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaWrench className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Playground</h3>
        <p className="mt-1 text-sm text-gray-500">Test your blocks here</p>
      </div>
    </div>
  )
}

export const AppSettings: React.FC = () => {
  console.log('AppSettings component render')
  return (
    <div className="redaktus-app-settings h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaWrench className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium text-gray-900">App Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Configure your application</p>
      </div>
    </div>
  )
}

export const MediaLibrary: React.FC = () => {
  console.log('MediaLibrary component render')
  return (
    <div className="redaktus-media h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaLink className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Media Library</h3>
        <p className="mt-1 text-sm text-gray-500">Manage your media files</p>
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