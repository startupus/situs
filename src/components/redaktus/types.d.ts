import * as React from 'react';
import React__default from 'react';
import { Descendant, Editor as Editor$1, BaseEditor, Element, Node } from 'slate';
import { RenderElementProps, RenderLeafProps, ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { Props } from 'react-inlinesvg';
import * as _tanstack_react_query from '@tanstack/react-query';
import { UseQueryResult } from '@tanstack/react-query';
export { v4 as uuid } from 'uuid';

declare namespace types {
    export const EmbedProp = "RB_PAGE_EMBED";
    export const EmbedContent = "RB_PAGE_EMBED_CONTENT";
    /**
     * Type of Sidebar control
     */
    export enum SideEditPropType {
        Text = "TEXT",
        Textarea = "TEXTAREA",
        Number = "NUMBER",
        Date = "DATE",
        Range = "RANGE",
        Boolean = "BOOLEAN",
        Select = "SELECT",
        Autocomplete = "AUTOCOMPLETE",
        Image = "IMAGE",
        Custom = "CUSTOM",
        Relationship = "RELATIONSHIP",
        IconSelector = "ICON-SELECTOR"
    }
    /**
     * How to display the options
     */
    export enum OptionsDisplay {
        Select = "SELECT",
        Radio = "RADIO",
        Color = "COLOR"
    }
    /**
     * Features for RichText: see also the new RichTextExt
     */
    export enum RichTextFeatures {
        Bold = "BOLD",
        Italic = "ITALIC",
        Code = "CODE",
        Highlight = "HIGHLIGHT",
        Subscript = "SUB",
        Superscript = "SUP",
        Link = "LINK",
        UnorderedList = "UL",
        OrderedList = "OL",
        Heading1 = "H1",
        Heading2 = "H2",
        Heading3 = "H3",
        Heading4 = "H4",
        Heading5 = "H5",
        Heading6 = "H6",
        Quote = "QUOTE"
    }
    /**
     * Supported Icon Sets
     */
    export enum IconSets {
        Lucide = "lu",
        HeroIconSolid = "hi-solid",
        HeroIconOutline = "hi-outline",
        FontAwesome = "fa6",
        Feather = "fi"
    }
    /**
     * Page status
     */
    export enum PageStatus {
        Draft = "DRAFT",
        Published = "PUBLISHED"
    }
    /**
     * Approval status
     */
    export enum EditStatus {
        Merged = "MERGED",
        Working = "WORKING",
        MergeRequested = "MERGE_REQUESTED"
    }
    /**
     * Device type for responsive preview (for the icon)
     */
    export enum DeviceType {
        Desktop = "DESKTOP",
        Tablet = "TABLET",
        Phone = "PHONE"
    }
    /**
     * Corner for the click-to-edit button
     */
    export enum ClickToEditSide {
        BottomRight = "BOTTOM-RIGHT",
        BottomLeft = "BOTTOM-LEFT",
        TopRight = "TOP-RIGHT",
        TopLeft = "TOP-LEFT",
        None = "NONE"
    }
    export enum BlockIconsPosition {
        InsideBlock = "INSIDE-BLOCK",
        OutsideBlock = "OUTSIDE-BLOCK"
    }
    /**
     * A Brick is a type of content block
     */
    export type Brick<T = {}> = React__default.FC<T> & {
        schema: IBlockType<T>;
    };
    /**
     * Bricks are types of content block
     */
    export type Bricks = {
        [key: string]: Brick<any>;
    };
    /**
     * A Category contains bricks
     */
    export type Category = {
        categoryName: string;
        bricks: Brick<any>[];
    };
    /**
     * A Theme contains categories and bricks
     */
    export type Theme = {
        themeName: string;
        categories: Category[];
    };
    /**
     * Custom role type
     */
    export type CustomRole = {
        id: string;
        name: string;
    };
    /**
     * The type of the user passed to permission functions
     */
    export type PermissionUser = {
        firstName: string;
        lastName: string;
        email: string;
        isAdmin: boolean;
        role: string;
        customRole?: CustomRole;
    };
    /**
     * The type of the page passed to permission functions
     */
    export type PermissionPage = {
        slug: string;
        pageType: string;
        language: string;
    };
    /**
     * The type of the brick passed to permission functions
     */
    export type PermissionBrick = {
        name: string;
        category: string;
        theme: string;
        tags: string[];
    };
    /**
     * The permission functions
     */
    export type Permissions = {
        canAddPage?: (user: PermissionUser, pageType: string) => boolean;
        canAddTranslation?: (user: PermissionUser, pageType: string, language: string) => boolean;
        canSeePageType?: (user: PermissionUser, pageType: string) => boolean;
        canSeePage?: (user: PermissionUser, page: Omit<PermissionPage, 'language'>) => boolean;
        canEditPage?: (user: PermissionUser, page: PermissionPage) => boolean;
        canDeletePage?: (user: PermissionUser, page: Omit<PermissionPage, 'language'>) => boolean;
        canDeleteTranslation?: (user: PermissionUser, page: PermissionPage) => boolean;
        canUseBrick?: (user: PermissionUser, brick: PermissionBrick) => boolean;
    };
    /**
     * The logged-in User
     */
    export type User = {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        company: string;
        avatarUrl?: string;
        isAdmin: boolean;
        token: string;
        appName: string;
        appId: string;
        appEnv: string;
        deployHookUrl?: string;
        deployHookMethod?: string;
        deployHookTriggerOnScheduledPublishing: boolean;
        deployHookStagingUrl?: string;
        deployHookStagingMethod?: string;
        deployHookStagingTriggerOnScheduledPublishing: boolean;
        deployHookDevUrl?: string;
        deployHookDevMethod?: string;
        deployHookDevTriggerOnScheduledPublishing: boolean;
        eventsHookUrl?: string;
        eventsHookAuthToken?: string;
        canCreatePage: boolean;
        canDeletePage: boolean;
        canDeploy: boolean;
        canDeployStaging: boolean;
        canDeployDev: boolean;
        canEditPageAttributes: boolean;
        canEditSeo: boolean;
        canApprove: boolean;
        role: string;
        customRole?: CustomRole;
        plan: string;
        isVerified: boolean;
        languages: Language[];
        defaultLanguage: string;
        hostname: string;
        useWorkingCopy: boolean;
        useApprovalWorkflow: boolean;
        subscription: {
            maxStories: number;
            collaboration: boolean;
            deployHookStaging: boolean;
            deployHookDev: boolean;
            scheduledPublishing: boolean;
            embedPages: boolean;
            lockBlocks: boolean;
            flexibleRoles: boolean;
            advancedSeo: boolean;
            eventsLog: boolean;
            maxFileSize: number;
            maxImageSize: number;
            maxFilesBatch: number;
            maxFilesConcurrency: number;
            diskSpace: number;
            advancedDam: boolean;
            workingCopy: boolean;
            approvalWorkflow: boolean;
            template: boolean;
            externalData: boolean;
            richTextExt: boolean;
            aiText: boolean;
            aiGen: boolean;
            aiSeo: boolean;
        };
    } | null;
    /**
     * Translation for a Page
     */
    export type Translation = {
        language: string;
        slug: string;
        name: string;
        status: PageStatus;
        editStatus: EditStatus;
        isLocked: boolean;
        scheduledForPublishingOn: string;
    };
    /**
     * The page editing User
     */
    export type EditingUser = {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        company: string;
        avatarUrl?: string;
    };
    /**
     * Date and User of last edit
     */
    export type LastEditedBy = {
        date: string;
        user: EditingUser;
    };
    /**
     * A React Bricks Page
     */
    export type Page = {
        id: string;
        type: string;
        name: string;
        slug: string;
        meta: IMeta;
        customValues?: Props;
        externalData?: Props;
        content: IContentBlock[];
        workingContent?: IContentBlock[];
        committedContent?: IContentBlock[];
        authorId?: string;
        author: Author;
        invalidBlocksTypes?: string[];
        status: PageStatus;
        editStatus: EditStatus;
        isLocked: boolean;
        tags: string[];
        category?: string;
        createdAt: string;
        publishedAt?: string;
        scheduledForPublishingOn?: string;
        language: string;
        translations: Translation[];
        lastEditedBy: LastEditedBy;
    };
    /**
     * Page fields (without content)
     */
    export type PageValues = Omit<Page, 'content'>;
    /**
     * A Page with all optional fields, used for the patch
     */
    export type PartialPage = Partial<Page>;
    /**
     * Page from a list (no content)
     */
    export type PageFromList = Omit<Page, 'content'>;
    /**
     * Page from a list with pagination
     */
    export type PagesFromListWithPagination = {
        items: PageFromList[];
        pagination: {
            page: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
        };
    };
    /**
     * The Author of a Page
     */
    export type Author = {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
        company?: string;
    };
    export type BrickStory<T = Props> = {
        id: string;
        name: string;
        showAsBrick?: boolean;
        previewImageUrl?: string;
        props: T;
    };
    type RepeaterItemDefault = IContentBlock | Omit<IContentBlock, 'id'> | Props;
    export type RepeaterItems<T = RepeaterItemDefault> = Array<T>;
    /**
     * A Language for i18n
     */
    export type Language = {
        code: string;
        name: string;
    };
    /**
     * Render function for local links (should use the app's Router)
     */
    interface LocalLinkProps {
        href: string;
        target?: string;
        className?: string;
        activeClassName?: string;
        isAdmin?: boolean;
        tabIndex?: number;
    }
    type LocalLinkPropsReal = React__default.PropsWithChildren<Omit<React__default.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LocalLinkProps> & LocalLinkProps>;
    export type RenderLocalLink = ({ href, target, className, activeClassName, isAdmin, tabIndex, children, }: LocalLinkPropsReal) => React__default.ReactElement;
    /**-
     * The type of Text and RichText value
     */
    export type TextValue = Descendant[] | string;
    /**
     * Props of a content block
     */
    export type Props = {
        [key: string]: any;
    };
    /**
     * Options passed to the fetch function
     */
    export type FetchOptions = {
        cache?: string;
        next?: {
            [key: string]: any;
        };
    };
    /**
     * Interface for the Schema of a Brick
     */
    export interface IBlockType<T = Props> {
        name: string;
        label: string;
        description?: string;
        getDefaultProps?: () => Partial<T>;
        hideFromAddMenu?: boolean;
        sideEditProps?: Array<ISideEditProp<T> | ISideGroup<T>>;
        repeaterItems?: IRepeaterItem<T>[];
        newItemMenuOpen?: boolean;
        groupByRepeater?: boolean;
        mapExternalDataToProps?: (externalData: Props, brickProps?: T) => Partial<T>;
        getData?: (page: Page, brickProps?: T, args?: any) => Promise<Partial<T>>;
        getExternalData?: (page: Page, brickProps?: T, args?: any) => Promise<Partial<T>>;
        playgroundLinkUrl?: string;
        playgroundLinkLabel?: string;
        theme?: string;
        category?: string;
        tags?: string[];
        previewImageUrl?: string;
        previewIcon?: React__default.ReactElement;
        stories?: BrickStory<Partial<T>>[];
        astroInteractivity?: 'load' | {
            load: true;
        } | 'idle' | {
            idle: true;
        } | {
            idle: {
                timeout: number;
            };
        } | 'visible' | {
            visible: true;
        } | {
            visible: {
                rootMargin: string;
            };
        } | {
            media: string;
        } | {
            only: string;
        };
    }
    /**
     * Item of a Repeater
     */
    export interface IRepeaterItem<T = any> {
        name: string;
        label?: string;
        itemType?: string;
        itemLabel?: string;
        defaultOpen?: boolean;
        min?: number;
        max?: number;
        getDefaultProps?: () => Props;
        show?: (props: T, page?: Page, user?: User) => boolean;
        items?: {
            type: string;
            label?: string;
            min?: number;
            max?: number;
            getDefaultProps?: () => Props;
            show?: (props: T, page?: Page, user?: User) => boolean;
        }[];
    }
    /**
     * The content of a block (instance of a Brick)
     */
    export interface IContentBlock {
        id: string;
        type: string;
        props: Props;
        locked?: boolean;
        canAddAfter?: boolean;
        canAddBefore?: boolean;
        canEditContent?: boolean;
    }
    /**
     * Option of a select sidebar prop
     */
    export type RepeatserItems<T = RepeaterItemDefault> = Array<T>;
    export interface IOption<T = any> {
        value: T;
        label: string;
        [otherProps: string]: unknown;
    }
    /**
     * Interface for Props of a Custom sidebar component
     */
    export interface ICustomKnobProps {
        id: string;
        value: any;
        onChange: any;
        isValid: boolean;
        errorMessage?: string;
    }
    /**
     * Sidebar edit Props for a Page
     */
    export interface ISideEditPropPage<T = Props> {
        name: string;
        label: string;
        type: SideEditPropType;
        component?: React__default.FC<ICustomKnobProps>;
        validate?: (value: any, props?: T) => boolean | string;
        show?: (props: T, page?: Page, user?: User) => boolean;
        helperText?: string;
        textareaOptions?: {
            height?: number;
        };
        imageOptions?: {
            maxWidth?: number;
            quality?: number;
            aspectRatio?: number;
        };
        rangeOptions?: {
            min?: number;
            max?: number;
            step?: number;
        };
        selectOptions?: {
            options?: IOption[];
            getOptions?: (props: Props) => IOption[] | Promise<IOption[]>;
            display: OptionsDisplay;
        };
        autocompleteOptions?: {
            placeholder?: string;
            getOptions: (input: string, props: Props) => any[] | Promise<any[]>;
            getKey: (option: any) => string | number;
            getLabel: (option: any) => string;
            renderOption?: ({ option, selected, focus, }: {
                option: any;
                selected: boolean;
                focus: boolean;
            }) => React__default.ReactElement;
            debounceTime?: number;
            getNoOptionsMessage?: (input?: string) => string;
        };
        iconSelectorOptions?: {
            iconSets?: IconSets[];
        };
        relationshipOptions?: {
            label?: string;
            references: string;
            multiple: boolean;
            embedValues?: boolean;
        };
    }
    /**
     * Sidebar Edit Props
     */
    export interface ISideEditProp<T = Props> extends ISideEditPropPage<T> {
        shouldRefreshText?: boolean;
        shouldRefreshStyles?: boolean;
    }
    /**
     * A collapsible Group of sidebar Props
     */
    export interface ISideGroup<T = Props> {
        groupName: string;
        defaultOpen?: boolean;
        show?: (props: T, page?: Page, user?: User) => boolean;
        props: ISideEditProp<T>[] | ISideEditPropPage<T>[];
    }
    /**
     * Image Crop interface
     */
    export interface ICrop {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    /**
     * Image Transform interface
     */
    export interface ITransform {
        rotate?: number;
        flip?: {
            horizontal: boolean;
            vertical: boolean;
        };
    }
    /**
     * Image value interface
     */
    export interface IImageSource {
        src: string;
        srcSet?: string;
        type?: string;
        fallbackSrc?: string;
        fallbackSrcSet?: string;
        fallbackType?: string;
        placeholderSrc?: string;
        alt?: string;
        seoName?: string;
        width?: number;
        height?: number;
        highPriority?: boolean;
        hashId?: string;
        crop?: ICrop;
        transform?: ITransform;
    }
    /**
     * File value interface
     */
    export interface IFileSource {
        name: string;
        url: string;
        size: number;
        extension: string;
        pagesNum: number;
        title?: string | undefined;
        alt?: string | undefined;
        copyright?: string | undefined;
        source?: string | undefined;
    }
    /**
     * A Color for a Select sidebar prop
     */
    export interface IColor {
        color: string;
        [propName: string]: any;
    }
    export interface IBrickStory {
        brickName: string;
        storyName: string;
        locked?: boolean;
        canAddAfter?: boolean;
        canAddBefore?: boolean;
    }
    /**
     * TemplateSlot type
     */
    export type TemplateSlot = {
        slotName: string;
        label: string;
        min?: number;
        max?: number;
        allowedBlockTypes?: string[];
        excludedBlockTypes?: string[];
        editable?: boolean;
        getDefaultContent?: () => (string | IBrickStory | IContentBlock)[];
    };
    export type RenderEnvironment = 'Frontend' | 'Preview' | 'Admin';
    export interface IRenderWrapperArgs {
        children: React__default.ReactElement;
        page: PageValues;
        renderEnvironment: RenderEnvironment;
    }
    /**
     * Page type
     */
    export interface IPageType {
        name: string;
        pluralName: string;
        isEntity?: boolean;
        allowedBlockTypes?: string[];
        excludedBlockTypes?: string[];
        defaultLocked?: boolean;
        defaultStatus?: PageStatus;
        defaultFeaturedImage?: string;
        getDefaultContent?: () => (string | IBrickStory | IContentBlock)[];
        customFields?: Array<ISideEditPropPage | ISideGroup>;
        getExternalData?: (page: Page, args?: any) => Promise<Props>;
        getDefaultMeta?: (page: PageFromList, externalData: Props) => Partial<IMeta>;
        metaImageAspectRatio?: number;
        categories?: ICategory[];
        slugPrefix?: ISlugPrefix;
        template?: Array<TemplateSlot>;
        headlessView?: boolean;
        isEmail?: boolean;
        renderWrapper?: (args: IRenderWrapperArgs) => React__default.ReactElement;
    }
    /**
     * Structure returned by the cleanBlocks function
     */
    export interface ICleanBlocks {
        blocks: IContentBlock[];
        invalidBlocksTypes: string[];
    }
    /**
     * Responsive breakpoint for preview
     */
    export interface ResponsiveBreakpoint {
        type: DeviceType;
        width: number | string;
        label: string;
    }
    /**
     * Login UI customization
     */
    export interface LoginUI {
        sideImage?: string;
        logo?: string;
        logoWidth?: number;
        logoHeight?: number;
        welcomeText?: string;
        welcomeTextStyle?: React__default.CSSProperties;
    }
    /**
     * MenuItem interface
     */
    export interface IMenuItem {
        label: string;
        path?: string;
    }
    /**
     * The ReactBricks configuration
     */
    export interface ReactBricksConfig {
        appId: string;
        apiKey: string;
        environment?: string;
        bricks?: types.Brick<any>[] | types.Theme[];
        pageTypes?: types.IPageType[];
        logo?: string;
        loginUI?: LoginUI;
        contentClassName?: string;
        defaultTheme?: string;
        renderLocalLink: types.RenderLocalLink;
        navigate: (path: string) => void;
        loginPath?: string;
        editorPath?: string;
        mediaLibraryPath?: string;
        playgroundPath?: string;
        appSettingsPath?: string;
        previewPath?: string;
        getAdminMenu?: (args: {
            isAdmin: boolean;
        }) => IMenuItem[];
        isDarkColorMode?: boolean;
        toggleColorMode?: () => void;
        useCssInJs?: boolean;
        appRootElement: string | HTMLElement;
        clickToEditSide?: ClickToEditSide;
        customFields?: Array<ISideEditPropPage | ISideGroup>;
        responsiveBreakpoints?: ResponsiveBreakpoint[];
        enableAutoSave?: boolean;
        disableSaveIfInvalidProps?: boolean;
        enablePreview?: boolean;
        blockIconsPosition?: BlockIconsPosition;
        enablePreviewImage?: boolean;
        enablePreviewIcon?: boolean;
        enableUnsplash?: boolean;
        unsplashApiKey?: string;
        enableDefaultEmbedBrick?: boolean;
        permissions?: Permissions;
        allowAccentsInSlugs?: boolean;
        warningIfLowBattery?: boolean;
        rtlLanguages?: Array<string>;
    }
    /**
     * The ReactBricks context
     */
    export interface IReactBricksContext {
        version: string;
        appId: string;
        apiKey: string;
        environment?: string;
        bricks: Bricks;
        themes: types.Theme[];
        pageTypes: IPageType[];
        logo: string;
        loginUI: LoginUI;
        contentClassName: string;
        defaultTheme: string;
        renderLocalLink: RenderLocalLink;
        navigate: (path: string) => void;
        loginPath: string;
        editorPath: string;
        mediaLibraryPath: string;
        playgroundPath: string;
        appSettingsPath: string;
        previewPath: string;
        getAdminMenu?: (args: {
            isAdmin: boolean;
        }) => IMenuItem[];
        isDarkColorMode?: boolean;
        toggleColorMode?: () => void;
        useCssInJs?: boolean;
        appRootElement: string | HTMLElement;
        clickToEditSide?: ClickToEditSide;
        customFields?: Array<ISideEditPropPage | ISideGroup>;
        responsiveBreakpoints: ResponsiveBreakpoint[];
        enableAutoSave: boolean;
        disableSaveIfInvalidProps: boolean;
        enablePreview: boolean;
        browserSupport: {
            webP: boolean;
            lazyLoading: boolean;
        };
        blockIconsPosition: BlockIconsPosition;
        enablePreviewImage: boolean;
        enablePreviewIcon: boolean;
        enableUnsplash: boolean;
        unsplashApiKey?: string;
        enableDefaultEmbedBrick: boolean;
        permissions?: Permissions;
        allowAccentsInSlugs: boolean;
        warningIfLowBattery: boolean;
        isRtlLanguage: ({ language }: {
            language: string;
        }) => boolean;
        rtlLanguages: string[];
    }
    /**
     * The current page in Admin
     */
    export interface ICurrentPage {
        pageId: string;
        language?: string;
    }
    /**
     * The Admin context returned from useAdminContext
     */
    export interface IReadAdminContext {
        isAdmin: boolean;
        previewMode: boolean;
        currentPage: ICurrentPage;
        showRichTextModal: ShowRichTextModal;
    }
    /**
     * Opengraph type
     */
    export type OpenGraphType = 'article' | 'website' | 'profile' | 'book' | 'video' | 'music';
    /**
     * OpenGraph data
     */
    export type OpenGraphData = {
        url?: string;
        type?: OpenGraphType;
        title?: string;
        description?: string;
        image?: types.IImageSource;
    };
    /**
     * Twitter card type
     */
    export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';
    /**
     * Data for Twitter card
     */
    export type TwitterCardData = {
        card?: TwitterCardType;
        site?: string;
        creator?: string;
        title?: string;
        description?: string;
        image?: types.IImageSource;
    };
    /**
     * Meta Fields type
     * */
    export type MetaData = {
        title?: string;
        description?: string;
        keywords?: string;
        featuredImage?: string;
        image?: IImageSource;
    };
    /**
     * Meta fields on Page
     */
    export interface IMeta extends MetaData {
        language?: string;
        openGraph?: OpenGraphData;
        twitterCard?: TwitterCardData;
        schemaOrg?: SchemaOrgData;
    }
    /**
     * Category on categories (pageTypes)
     */
    export interface ICategory {
        category?: string;
    }
    /**
     * A RichTextExt Plugin
     */
    export interface RichTextPlugin {
        type: 'Mark' | 'Block' | 'List';
        name: string;
        isInline?: boolean;
        itemName?: string;
        label: string;
        hotKey?: string;
        renderElement?: (props: RenderElementProps) => React__default.ReactElement;
        renderItemElement?: (props: RenderElementProps) => React__default.ReactElement;
        renderLeaf?: (props: RenderLeafProps) => React__default.ReactElement;
        toggle: (editor: Editor$1, plugins: RichTextPlugin[], showRichTextModal: types.ShowRichTextModal) => void;
        button?: {
            icon: React__default.ReactElement;
            isActive: (editor: Editor$1) => boolean;
        };
        enhanceEditor?: (editor: Editor$1) => Editor$1;
    }
    /**
     * Definition for a Mark plugin
     */
    export interface MarkPlugin {
        name: string;
        label?: string;
        hotKey?: string;
        render: (props: RenderLeafProps) => React__default.ReactElement;
        icon?: React__default.ReactElement;
    }
    /**
     * Constructor for a Mark plugin
     */
    export type MarkPluginConstructor = (markPlugin: MarkPlugin) => RichTextPlugin;
    /**
     * Definition for a Block plugin
     */
    export interface BlockPlugin {
        name: string;
        isInline?: boolean;
        itemName?: string;
        label?: string;
        hotKey?: string;
        render: (props: RenderElementProps) => React__default.ReactElement;
        renderItem?: (props: RenderElementProps) => React__default.ReactElement;
        icon?: React__default.ReactElement;
    }
    export type BlockWithModalPlugin = BlockPlugin & {
        getDefaultProps?: () => Props;
        renderAdmin?: (props: RenderElementProps) => React__default.ReactElement;
        renderItemAdmin?: (props: RenderElementProps) => React__default.ReactElement;
        pluginCustomFields: Array<types.ISideEditPropPage | types.ISideGroup>;
    };
    /**
     * Constructor for a Block plugin
     */
    export type BlockPluginConstructor = (blockPlugin: BlockPlugin) => RichTextPlugin;
    /**
     * Constructor for a Block with Modal plugin
     */
    export type BlockWithModalPluginConstructor = (blockPlugin: BlockWithModalPlugin) => RichTextPlugin;
    /**
     * Icon
     */
    export type Icon = {
        name: string;
        svg: string;
        url: string;
        set: string;
    };
    export {  };
}

declare const useAdminContext: () => types.IReadAdminContext;

/**
 * Props for Link component
 */
interface LinkProps {
    href: string;
    target?: string;
    className?: string;
    activeClassName?: string;
    simpleAnchor?: boolean;
}
type LinkPropsReal = React.PropsWithChildren<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps>;
declare const Link: React.FC<LinkPropsReal>;

/**
 * Props for Text
 */
interface FileProps {
    propName: string;
    renderBlock: (props: types.IFileSource | null) => React__default.ReactElement;
    allowedExtensions?: string[];
    /**
     * Field used with React Server Components
     */
    source?: types.IFileSource;
}
declare const File$1: React__default.FC<FileProps>;

/**
 * Arguments for the renderWrapper function
 */
interface IRenderWrapperArgs {
    children: React.ReactNode;
    width?: number;
    height?: number;
}
/**
 * renderWrapper function type
 */
type RenderWrapper = (args: IRenderWrapperArgs) => React.ReactElement;
interface PlaceholderProps {
    aspectRatio?: number;
    maxWidth?: number;
    isDarkColorMode?: boolean;
    isAdmin: boolean;
}
interface SharedImageProps {
    readonly?: boolean;
    alt: string;
    noLazyLoad?: boolean;
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
    imageClassName?: string;
    imageStyle?: React.CSSProperties;
    noWrapper?: boolean;
    quality?: number;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    renderWrapper?: RenderWrapper;
    useNativeLazyLoading?: boolean;
    useWebP?: boolean;
    placeholder?: (props: PlaceholderProps) => string;
    /**
     * Field used with React Server Components
     */
    source?: types.IImageSource;
}
interface EditableImage extends SharedImageProps {
    readonly?: false;
    propName?: string;
    metaFieldName?: 'image';
    customFieldName?: string;
    aspectRatio?: number;
    maxWidth?: number;
}
interface ReadOnlyImage extends SharedImageProps {
    readonly: true;
    source: types.IImageSource;
}
/**
 * Props for Image
 */
type ImageProps = EditableImage | ReadOnlyImage;
declare const Image$1: React.FC<ImageProps>;

/**
 * Props for Repeater
 */
interface RepeaterProps {
    propName: string;
    itemProps?: types.Props;
    renderWrapper?: (items: React.ReactElement) => React.ReactElement;
    renderItemWrapper?: (item: React.ReactElement, index: number, itemsCount: number) => React.ReactElement;
    /**
     * Field used with React Server Components
     */
    items?: types.RepeaterItems;
}
declare const Repeater: React.FC<RepeaterProps>;

/**
 * Props for renderLink render function
 */
interface RenderLinkElementProps extends RenderElementProps {
    href: string;
    target?: string;
    rel?: string;
}
interface BaseRichTextProps {
    renderBlock?: (props: RenderElementProps) => React__default.ReactElement;
    placeholder?: string;
    renderPlaceholder?: (props: {
        children: any;
    }) => React__default.ReactElement;
    multiline?: boolean;
    softLineBreak?: boolean;
    allowedFeatures?: types.RichTextFeatures[];
    shouldRefreshStyles?: boolean;
    renderBold?: (props: RenderLeafProps) => React__default.ReactElement;
    renderItalic?: (props: RenderLeafProps) => React__default.ReactElement;
    renderHighlight?: (props: RenderLeafProps) => React__default.ReactElement;
    renderCode?: (props: RenderLeafProps) => React__default.ReactElement;
    renderSub?: (props: RenderLeafProps) => React__default.ReactElement;
    renderSup?: (props: RenderLeafProps) => React__default.ReactElement;
    renderLink?: (props: RenderLinkElementProps) => React__default.ReactElement;
    renderUL?: (props: RenderElementProps) => React__default.ReactElement;
    renderOL?: (props: RenderElementProps) => React__default.ReactElement;
    renderLI?: (props: RenderElementProps) => React__default.ReactElement;
    renderH1?: (props: RenderElementProps) => React__default.ReactElement;
    renderH2?: (props: RenderElementProps) => React__default.ReactElement;
    renderH3?: (props: RenderElementProps) => React__default.ReactElement;
    renderH4?: (props: RenderElementProps) => React__default.ReactElement;
    renderH5?: (props: RenderElementProps) => React__default.ReactElement;
    renderH6?: (props: RenderElementProps) => React__default.ReactElement;
    renderQuote?: (props: RenderElementProps) => React__default.ReactElement;
}
interface RichTextPropsWithPropName extends BaseRichTextProps {
    propName: string;
    /**
     * Field used with React Server Components
     */
    value?: Descendant[] | string;
    metaFieldName?: never;
    customFieldName?: never;
    customFieldPlainText?: never;
}
interface RichTextPropsWithMetaFieldName extends BaseRichTextProps {
    propName?: never;
    value?: never;
    metaFieldName: 'title' | 'description' | 'language';
    customFieldName?: never;
    customFieldPlainText?: never;
}
interface RichTextPropsWithCustomFieldName extends BaseRichTextProps {
    propName?: never;
    value?: never;
    metaFieldName?: never;
    customFieldName: string;
    customFieldPlainText?: boolean;
}
/**
 * Props for RichText component
 */
type RichTextProps$1 = RichTextPropsWithPropName | RichTextPropsWithMetaFieldName | RichTextPropsWithCustomFieldName;
declare const CompatibleRichText: React__default.FC<RichTextProps$1>;

/**
 * Props for RichTextExt (v3)
 */
interface RichTextProps {
    renderBlock?: (props: RenderElementProps) => React.ReactElement;
    placeholder?: string;
    renderPlaceholder?: (props: {
        children: any;
    }) => React.ReactElement;
    plugins?: types.RichTextPlugin[];
    multiline?: boolean;
    softLineBreak?: boolean;
    propName?: string;
    /**
     * Field used with React Server Components
     */
    value?: Descendant[] | string;
    metaFieldName?: 'title' | 'description' | 'language';
    customFieldName?: string;
    customFieldPlainText?: boolean;
    shouldRefreshStyles?: boolean;
}
declare const RichText: React.FC<RichTextProps>;

/**
 * CustomElement for Slate
 */
type CustomElement = {
    type: string;
    element?: Element;
    children: CustomText[];
    [key: string]: any;
};
/**
 * CustomText for Slate
 */
type CustomText = {
    text?: string;
    [key: string]: any;
};
declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}
interface BaseTextProps {
    renderBlock?: (props: RenderElementProps) => React.ReactElement;
    placeholder?: string;
    renderPlaceholder?: (props: {
        children: any;
    }) => React.ReactElement;
    multiline?: boolean;
    softLineBreak?: boolean;
}
interface TextPropsWithPropName extends BaseTextProps {
    propName: string;
    /**
     * Field used with React Server Components
     */
    value?: Descendant[] | string;
    metaFieldName?: never;
    customFieldName?: never;
}
interface TextPropsWithMetaFieldName extends BaseTextProps {
    propName?: never;
    value?: never;
    metaFieldName: 'title' | 'description' | 'language';
    customFieldName?: never;
}
interface TextPropsWithCustomFieldName extends BaseTextProps {
    propName?: never;
    value?: never;
    metaFieldName?: never;
    customFieldName: string;
}
/**
 * Props for Text component
 */
type TextProps = TextPropsWithPropName | TextPropsWithMetaFieldName | TextPropsWithCustomFieldName;
declare const Text: React.FC<TextProps>;

declare const usePageValues: () => [types.PageValues, (pageData: types.PartialPage) => void];

declare const useVisualEdit: (propName: string) => [any, (value: any) => void, boolean];

declare const blockPluginConstructor: types.BlockPluginConstructor;

declare const blockWithModalPluginConstructor: types.BlockWithModalPluginConstructor;

declare const markPluginConstructor: types.MarkPluginConstructor;

/**
 * Props for PageViewer
 */
interface PreviewProps {
    renderWrapper?: (args: types.IRenderWrapperArgs) => React.ReactElement;
}
declare const Preview: React.FC<PreviewProps>;

declare const ReactBricks: React.FC<types.ReactBricksConfig & {
    children: React.ReactNode;
}>;

/**
 * Icon Props
 */
interface IconProps extends Omit<Props, 'src'> {
    icon: types.Icon;
}
/**
 * Component to render an Icon from an IconSelector sideEditProp
 */
declare const Icon: React.FC<IconProps>;

/**
 * Props for PageViewer
 */
interface PageViewerProps {
    page: types.Page | null | undefined;
    main?: boolean;
    showClickToEdit?: boolean;
    preview?: boolean;
}
declare const PageViewer: React.FC<PageViewerProps>;

declare const Slot: React__default.FC<SlotProps>;

interface JsonLdProps {
    page: types.Page;
}
declare const JsonLd: React__default.FC<JsonLdProps>;

declare const getSchemaOrgData: (page: types.Page) => string | null;

declare const renderJsonLd: React__default.FC<types.Page>;

interface MetaProps {
    page: types.Page;
}
declare const Meta: React.FC<MetaProps>;

declare const renderMeta: React.FC<types.Page>;

declare const usePage$1: (pageId: string, language?: string) => _tanstack_react_query.UseQueryResult<types.Page, Error>;

declare const usePage: (slug: string, language?: string) => _tanstack_react_query.UseQueryResult<types.Page, Error>;

/**
 * Values returned from usePages
 */
interface UsePagesType {
    <T extends boolean>({ type, types, tag, language, page, pageSize, sort, filterBy, usePagination, }: {
        type?: string;
        types?: string[];
        tag?: string;
        language: string;
        page?: number;
        pageSize?: number;
        sort?: string;
        filterBy?: {
            [key: string]: any;
        };
        usePagination: T;
    }): UseQueryResult<T extends true ? types.PagesFromListWithPagination : types.PageFromList[], unknown>;
    ({ type, types, tag, language, page, pageSize, sort, filterBy, }: {
        type?: string;
        types?: string[];
        language: string;
        tag?: string;
        page?: number;
        pageSize?: number;
        sort?: string;
        filterBy?: {
            [key: string]: any;
        };
    }): UseQueryResult<types.PageFromList[], unknown>;
    (): UseQueryResult<types.PageFromList[], unknown>;
}
declare const usePages: UsePagesType;

/**
 * Values returned from the public usePage
 */
interface UsePagesPublicType {
    <T extends boolean>({ type, types, tag, language, page, pageSize, sort, filterBy, usePagination, }: {
        type?: string;
        types?: string[];
        tag?: string;
        language?: string;
        page?: number;
        pageSize?: number;
        sort?: string;
        filterBy?: {
            [key: string]: any;
        };
        usePagination: T;
    }): UseQueryResult<T extends true ? types.PagesFromListWithPagination : types.PageFromList[], unknown>;
    ({ type, types, tag, language, page, pageSize, sort, filterBy, }: {
        type?: string;
        types?: string[];
        tag?: string;
        language?: string;
        page?: number;
        pageSize?: number;
        sort?: string;
        filterBy?: {
            [key: string]: any;
        };
    }): UseQueryResult<types.PageFromList[], unknown>;
    (): UseQueryResult<types.PageFromList[], unknown>;
}
declare const usePagesPublic: UsePagesPublicType;

declare const useTagsPublic: (page?: number, pageSize?: number, options?: {
    q?: string;
    language?: string;
}) => _tanstack_react_query.UseQueryResult<{
    items: string[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}, Error>;

declare const useReactBricksContext: () => types.IReactBricksContext;

declare function fetchPage({ slug, language, getExternalDataArgs, config, }: {
    slug: string;
    language?: string;
    getExternalDataArgs?: any;
    config: types.ReactBricksConfig;
}): Promise<types.Page>;
declare function fetchPage(slug: string, apiKey: string, language?: string, pageTypes?: types.IPageType[], getExternalDataArgs?: any): Promise<types.Page>;

declare function fetchPages<T extends boolean>(apiKey: string, { type, types, tag, language, page, pageSize, sort, filterBy, usePagination, }: {
    type?: string;
    types?: string[];
    tag?: string;
    language?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    filterBy?: {
        [key: string]: any;
    };
    usePagination: T;
}): Promise<T extends true ? types.PagesFromListWithPagination : types.PageFromList[]>;
declare function fetchPages(apiKey: string, { type, types, tag, language, page, pageSize, filterBy, sort, }: {
    type?: string;
    types?: string[];
    tag?: string;
    language?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    filterBy?: {
        [key: string]: any;
    };
}): Promise<types.PageFromList[]>;
declare function fetchPages(apiKey: string): Promise<types.PageFromList[]>;
declare function fetchPages<T extends boolean>(options: {
    type?: string;
    types?: string[];
    tag?: string;
    language?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    filterBy?: {
        [key: string]: any;
    };
    usePagination: T;
    fetchExternalData?: boolean;
    getExternalDataArgs?: any;
    config: types.ReactBricksConfig;
}): Promise<T extends true ? types.PagesFromListWithPagination : types.PageFromList[]>;
declare function fetchPages<T extends boolean>(options: {
    type?: string;
    types?: string[];
    tag?: string;
    language?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    filterBy?: {
        [key: string]: any;
    };
    fetchExternalData?: boolean;
    getExternalDataArgs?: any;
    config: types.ReactBricksConfig;
}): Promise<types.PageFromList[]>;

declare const fetchTags: (apiKey: string, page?: number, pageSize?: number, options?: {
    q?: string;
    language?: string;
}) => Promise<{
    items: string[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}>;

declare const _default: {
    serialize: (nodes: Node[]) => string;
    serializeLight: (nodes: any[]) => string | any[];
    deserialize: (input: string) => Descendant[];
    isText: (value: any) => boolean;
    isSlateContent: (value: any) => boolean;
};

declare const cleanPage: (page: types.Page, pageTypes: types.IPageType[], bricks: types.Bricks) => types.Page;

declare const getPagePlainText: (blocks: types.IContentBlock[]) => string[];

declare const plugin$f: types.RichTextPlugin;

declare const plugin$e: types.RichTextPlugin;

declare const plugin$d: types.RichTextPlugin;

declare const plugin$c: types.RichTextPlugin;

declare const plugin$b: types.RichTextPlugin;

declare const plugin$a: types.RichTextPlugin;

declare const plugin$9: types.RichTextPlugin;

declare const plugin$8: types.RichTextPlugin;

declare const plugin$7: types.RichTextPlugin;

declare const plugin$6: types.RichTextPlugin;

declare const plugin$5: types.RichTextPlugin;

declare const plugin$4: types.RichTextPlugin;

declare const plugin$3: types.RichTextPlugin;

declare const plugin$2: types.RichTextPlugin;

declare const plugin$1: types.RichTextPlugin;

declare const plugin: types.RichTextPlugin;

declare namespace index {
  export { plugin$f as bold, plugin$d as code, plugin$8 as heading1, plugin$7 as heading2, plugin$6 as heading3, plugin$5 as heading4, plugin$4 as heading5, plugin$3 as heading6, plugin$c as highlight, plugin$e as italic, plugin$9 as link, plugin$1 as orderedList, plugin$2 as quote, plugin$b as sub, plugin$a as sup, plugin as unorderedList };
}

declare const AppSettings: React.FC;

declare const Editor: React.FC;

/**
 * File
 */
type File = {
    id: string;
    name: string;
    extension: string;
    title?: string;
    alt?: string;
    copyright?: string;
    source?: string;
    url: string;
    size: number;
    createdAt: string;
    deleted: boolean;
    deletedAt: Date | null;
    pagesNum: number;
};

/**
 * Image
 */
type Image = {
    id: string;
    hashId: string;
    name: string;
    title?: string;
    alt?: string;
    extension: string;
    copyright?: string;
    source?: string;
    imageUrl: string;
    width: number;
    height: number;
    size: number;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    deletedAt: Date | null;
    croppedImagesNum: number;
    pagesNum: number;
};

interface MediaLibraryProps {
    onSelect?: (media: Image | File, crop?: types.ICrop, transform?: types.ITransform) => void;
    popup?: 'image' | 'file';
}
declare const MediaLibrary: React__default.FC<MediaLibraryProps>;

declare const Playground: () => React.JSX.Element;

/**
 * Props of Admin component
 */
interface AdminProps extends React.PropsWithChildren {
    isLogin?: boolean;
    isPublicDesignSystem?: boolean;
    designSystemTitle?: string;
}
declare const Admin: React.FC<AdminProps>;

declare const Login: React.FC;

declare const SsoLogin: React.FC;

declare const SsoLoginFailure: React__default.FC;

declare const SsoLoginSuccess: React__default.FC;

type EmailPasswordLoginUserCredentials = {
    email: string;
    password: string;
    keepLoggedIn: boolean;
};
type LoginUserCredentials = EmailPasswordLoginUserCredentials | SsoLoginUserCredentials;
declare const useAuth: () => {
    loginUser: (credentials: LoginUserCredentials) => Promise<({
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        company: string;
        avatarUrl?: string;
        isAdmin: boolean;
        token: string;
        appName: string;
        appId: string;
        appEnv: string;
        deployHookUrl?: string;
        deployHookMethod?: string;
        deployHookTriggerOnScheduledPublishing: boolean;
        deployHookStagingUrl?: string;
        deployHookStagingMethod?: string;
        deployHookStagingTriggerOnScheduledPublishing: boolean;
        deployHookDevUrl?: string;
        deployHookDevMethod?: string;
        deployHookDevTriggerOnScheduledPublishing: boolean;
        eventsHookUrl?: string;
        eventsHookAuthToken?: string;
        canCreatePage: boolean;
        canDeletePage: boolean;
        canDeploy: boolean;
        canDeployStaging: boolean;
        canDeployDev: boolean;
        canEditPageAttributes: boolean;
        canEditSeo: boolean;
        canApprove: boolean;
        role: string;
        customRole?: types.CustomRole;
        plan: string;
        isVerified: boolean;
        languages: types.Language[];
        defaultLanguage: string;
        hostname: string;
        useWorkingCopy: boolean;
        useApprovalWorkflow: boolean;
        subscription: {
            maxStories: number;
            collaboration: boolean;
            deployHookStaging: boolean;
            deployHookDev: boolean;
            scheduledPublishing: boolean;
            embedPages: boolean;
            lockBlocks: boolean;
            flexibleRoles: boolean;
            advancedSeo: boolean;
            eventsLog: boolean;
            maxFileSize: number;
            maxImageSize: number;
            maxFilesBatch: number;
            maxFilesConcurrency: number;
            diskSpace: number;
            advancedDam: boolean;
            workingCopy: boolean;
            approvalWorkflow: boolean;
            template: boolean;
            externalData: boolean;
            richTextExt: boolean;
            aiText: boolean;
            aiGen: boolean;
            aiSeo: boolean;
        };
    } & {
        authToken: string;
    }) | null>;
    isLoggingIn: boolean;
    ssoStartLogin: (uniqueAppIdentifier: string) => Promise<{
        result: "OK" | "KO";
        redirectUrl: string;
    } | null>;
    isLogginInSso: boolean;
    logoutUser: () => void;
};

export { Admin, AppSettings, Editor, File$1 as File, Icon, Image$1 as Image, JsonLd, Link, Login, MediaLibrary, Meta, PageViewer, _default as Plain, Playground, Preview, ReactBricks, Repeater, CompatibleRichText as RichText, RichText as RichTextExt, Slot, SsoLogin, SsoLoginFailure, SsoLoginSuccess, Text, blockPluginConstructor, blockWithModalPluginConstructor, cleanPage, fetchPage, fetchPages, fetchTags, getPagePlainText, getSchemaOrgData, markPluginConstructor, index as plugins, renderJsonLd, renderMeta, types, useAdminContext, useAuth, usePage$1 as usePage, usePage as usePagePublic, usePageValues, usePages, usePagesPublic, useReactBricksContext, useTagsPublic, useVisualEdit };
