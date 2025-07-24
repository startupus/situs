// Redaktus Types - собственные типы без зависимости от react-bricks

export namespace types {
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
    Custom = 'CUSTOM'
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
    itemType: string
    itemLabel: string
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
  }

  export interface CustomField {
    name: string
    label: string
    type: CustomFieldType
    validation?: any
  }

  export enum CustomFieldType {
    Text = 'text',
    Number = 'number',
    Boolean = 'boolean',
    Date = 'date',
    Image = 'image',
    Reference = 'reference'
  }

  export interface LoginUIConfig {
    logo?: string
    backgroundColor?: string
    textColor?: string
    primaryColor?: string
  }

  export interface AdminMenuItem {
    name: string
    path: string
    icon: string
  }

  export enum ClickToEditSide {
    BottomLeft = 'bottom-left',
    BottomRight = 'bottom-right',
    TopLeft = 'top-left',
    TopRight = 'top-right'
  }

  export interface ResponsiveBreakpoint {
    type: DeviceType
    width: number
    label: string
  }

  export enum DeviceType {
    Phone = 'phone',
    Tablet = 'tablet',
    Desktop = 'desktop'
  }

  export enum BlockIconsPosition {
    OutsideBlock = 'outside-block',
    InsideBlock = 'inside-block'
  }

  export enum PageStatus {
    Published = 'published',
    Draft = 'draft',
    Private = 'private'
  }

  // RichText Features для совместимости
  export const RichTextFeatures = {
    Bold: 'bold',
    Italic: 'italic',
    Underline: 'underline',
    Strikethrough: 'strikethrough',
    Code: 'code',
    Link: 'link',
    Unlink: 'unlink',
    BulletList: 'bullet-list',
    NumberedList: 'numbered-list',
    Quote: 'quote',
    Heading1: 'heading-1',
    Heading2: 'heading-2',
    Heading3: 'heading-3',
    Heading4: 'heading-4',
    Heading5: 'heading-5',
    Heading6: 'heading-6'
  }

  // Дополнительные типы для совместимости
  export interface PageValues {
    [key: string]: any
  }

  export interface Page {
    id: string
    slug: string
    title: string
    content: any
    meta: any
    publishedAt?: string
    author?: string
  }

  export interface Tag {
    id: string
    name: string
    slug: string
  }
} 