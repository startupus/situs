// Redaktus Frontend - полностью независимое решение

import website from '../components/redaktus/website/index'
import blog from '../components/redaktus/blog/index'

// Types - из types.ts
export { types } from './types'

// Основные компоненты - из redaktus-core
export { 
  Admin, 
  Editor, 
  Login, 
  Playground, 
  AppSettings, 
  MediaLibrary,
  useRedaktus, 
  RedaktusContext,
  SsoLogin,
  SsoLoginFailure,
  SsoLoginSuccess
} from '../components/redaktus/redaktus-core'

// Компоненты контента - из redaktus-core
export { 
  File, 
  Icon, 
  Image, 
  Link, 
  Meta, 
  PageViewer, 
  Preview, 
  Repeater, 
  RichText, 
  RichTextExt, 
  Slot, 
  Text 
} from '../components/redaktus/redaktus-core'

// Хуки и контекст - из redaktus-core
export { 
  useAdminContext,
  usePage,
  usePagePublic,
  usePageValues,
  usePages,
  usePagesPublic,
  useRedaktusContext,
  useTagsPublic,
  useVisualEdit
} from '../components/redaktus/redaktus-core'

// Утилиты - из redaktus-core
export { 
  fetchPage,
  fetchPages,
  fetchTags,
  renderJsonLd,
  renderMeta,
  cleanPage,
  getPagePlainText,
  getSchemaOrgData
} from '../components/redaktus/redaktus-core'

// Плагины - из redaktus-core
export { 
  blockPluginConstructor,
  blockWithModalPluginConstructor,
  markPluginConstructor,
  plugins
} from '../components/redaktus/redaktus-core'

// Дополнительные компоненты - из redaktus-core
export { 
  JsonLd,
  Plain
} from '../components/redaktus/redaktus-core'

// SSO компоненты - из redaktus-core
export { 
  useAuth
} from '../components/redaktus/redaktus-core'

// Утилиты - из redaktus-core
export { 
  uuid
} from '../components/redaktus/redaktus-core'

// Inline Edit компоненты - из inline-edit
export { InlineEdit, InputType } from '../components/redaktus/inline-edit'

// Website компоненты - из website
export { default as website } from '../components/redaktus/website/index'

// Blog компоненты - из blog
export { default as blog } from '../components/redaktus/blog/index'

// Все компоненты вместе
const allBricks = [...website, ...blog]
export default allBricks

// Главный провайдер - Redaktus
export { Redaktus } from '../components/redaktus/redaktus-core' 