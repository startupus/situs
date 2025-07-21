// Redaktus Types - собственные типы без зависимости от react-bricks

export interface RedaktusConfig {
  appId?: string
  apiKey?: string
  environment?: string
  bricks: Theme[]
  pageTypes: PageType[]
  customFields?: CustomField[]
  logo?: string
  loginUI?: LoginUIConfig
  contentClassName?: string
  renderLocalLink?: (props: any) => React.ReactElement
  navigate?: (path: string) => void
  loginPath?: string
  editorPath?: string
  playgroundPath?: string
  appSettingsPath?: string
  previewPath?: string
  getAdminMenu?: () => AdminMenuItem[]
  isDarkColorMode?: boolean
  toggleColorMode?: () => void
  useCssInJs?: boolean
  appRootElement?: string
  clickToEditSide?: ClickToEditSide
  responsiveBreakpoints?: ResponsiveBreakpoint[]
  enableAutoSave?: boolean
  disableSaveIfInvalidProps?: boolean
  enablePreview?: boolean
  blockIconsPosition?: BlockIconsPosition
  enableUnsplash?: boolean
  unsplashApiKey?: string
  enablePreviewImage?: boolean
  enableDefaultEmbedBrick?: boolean
}

export interface Theme {
  themeName: string
  categories: Category[]
}

export interface Category {
  categoryName: string
  bricks: Brick[]
}

export interface Brick<T = any> extends React.FC<T> {
  schema?: BrickSchema
}

export interface BrickSchema {
  name: string
  label: string
  category?: string
  hideFromAddMenu?: boolean
  playgroundLinkLabel?: string
  playgroundLinkUrl?: string
  getDefaultProps?: () => any
  sideEditProps?: SideEditProp[]
  repeaterItems?: RepeaterItem[]
}

export interface SideEditProp {
  name: string
  label: string
  type: SideEditPropType
  selectOptions?: SelectOptions
  groupName?: string
  defaultOpen?: boolean
  component?: React.ComponentType<any>
}

export enum SideEditPropType {
  Text = 'TEXT',
  Textarea = 'TEXTAREA', 
  Number = 'NUMBER',
  Boolean = 'BOOLEAN',
  Select = 'SELECT',
  Color = 'COLOR',
  Image = 'IMAGE',
  RichText = 'RICHTEXT',
  Repeater = 'REPEATER',
  Date = 'DATE',
  Custom = 'CUSTOM',
  Range = 'RANGE'
}

export interface SelectOptions {
  display: OptionsDisplay
  options: { value: string; label: string }[]
}

export enum OptionsDisplay {
  Dropdown = 'dropdown',
  Radio = 'radio',
  Buttons = 'buttons',
  Select = 'select'
}

export interface RepeaterItem {
  name: string
  label: string
  itemType: string
  itemLabel?: string
  min?: number
  max?: number
}

export interface PageType {
  name: string
  pluralName: string
  defaultLocked?: boolean
  defaultStatus?: PageStatus
  defaultLanguage?: string
  allowedBlockTypes?: string[]
  excludedBlockTypes?: string[]
  customFields?: CustomField[]
  getDefaultContent?: () => any[]
}

export interface CustomField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'date' | 'number'
  selectOptions?: string[]
  validation?: (value: any) => boolean | string
}

export enum PageStatus {
  Published = 'PUBLISHED',
  Draft = 'DRAFT',
  Deleted = 'DELETED'
}

export interface LoginUIConfig {
  logo?: string
  companyName?: string
  primaryColor?: string
  backgroundColor?: string
}

export interface AdminMenuItem {
  label: string
  href?: string
  icon?: React.ComponentType
  isActive?: boolean
  subItems?: AdminMenuItem[]
}

export interface ResponsiveBreakpoint {
  type: DeviceType
  width: number
  label: string
}

export enum DeviceType {
  Phone = 'PHONE',
  Tablet = 'TABLET',
  Desktop = 'DESKTOP'
}

export enum BlockIconsPosition {
  TopLeft = 'TOP_LEFT',
  TopRight = 'TOP_RIGHT',
  BottomLeft = 'BOTTOM_LEFT',
  BottomRight = 'BOTTOM_RIGHT',
  OutsideBlock = 'OUTSIDE_BLOCK'
}

export enum ClickToEditSide {
  BottomRight = 'BottomRight',
  BottomLeft = 'BottomLeft',
  TopRight = 'TopRight',
  TopLeft = 'TopLeft'
}

export const RichTextFeatures = {
  bold: 'bold',
  italic: 'italic',
  highlight: 'highlight',
  code: 'code',
  link: 'link',
  ul: 'ul',
  ol: 'ol',
  quote: 'quote',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6'
} as const

export interface PageValues {
  id: string
  name: string
  slug: string
  meta: {
    title?: string
    description?: string
    language?: string
    image?: string
  }
  content: any[]
  customValues?: Record<string, any>
  tags?: string[]
  author?: string
  publishedAt?: string
  status: PageStatus
  isLocked: boolean
}

export interface Page {
  id: string
  type: string
  name: string
  slug: string
  meta: {
    title?: string
    description?: string
    language?: string
    image?: string
  }
  content: any[]
  customValues?: Record<string, any>
  tags?: Tag[]
  author?: string
  publishedAt?: string
  status: PageStatus
  isLocked: boolean
  createdAt: string
  updatedAt: string
}

export type RenderLocalLink = (props: {
  href: string
  className?: string
  activeClassName?: string
  isAdmin?: boolean
  children: React.ReactNode
}) => React.ReactElement

export interface Tag {
  id: string
  name: string
  slug: string
} 