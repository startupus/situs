export declare namespace types {
    interface RedaktusConfig {
        appId?: string;
        apiKey?: string;
        environment?: string;
        bricks: Theme[];
        pageTypes: PageType[];
        customFields?: CustomField[];
        logo?: string;
        loginUI?: LoginUIConfig;
        contentClassName?: string;
        renderLocalLink?: (props: any) => React.ReactElement;
        navigate?: (path: string) => void;
        loginPath?: string;
        editorPath?: string;
        playgroundPath?: string;
        appSettingsPath?: string;
        previewPath?: string;
        getAdminMenu?: () => AdminMenuItem[];
        isDarkColorMode?: boolean;
        toggleColorMode?: () => void;
        useCssInJs?: boolean;
        appRootElement?: string;
        clickToEditSide?: ClickToEditSide;
        responsiveBreakpoints?: ResponsiveBreakpoint[];
        enableAutoSave?: boolean;
        disableSaveIfInvalidProps?: boolean;
        enablePreview?: boolean;
        blockIconsPosition?: BlockIconsPosition;
        enableUnsplash?: boolean;
        unsplashApiKey?: string;
        enablePreviewImage?: boolean;
        enableDefaultEmbedBrick?: boolean;
    }
    interface Theme {
        themeName: string;
        categories: Category[];
    }
    interface Category {
        categoryName: string;
        bricks: Brick[];
    }
    interface Brick<T = any> extends React.FC<T> {
        schema?: BrickSchema;
    }
    interface BrickSchema {
        name: string;
        label: string;
        category?: string;
        hideFromAddMenu?: boolean;
        playgroundLinkLabel?: string;
        playgroundLinkUrl?: string;
        getDefaultProps?: () => any;
        sideEditProps?: SideEditProp[];
        repeaterItems?: RepeaterItem[];
    }
    interface SideEditProp {
        name: string;
        label: string;
        type: SideEditPropType;
        selectOptions?: SelectOptions;
        groupName?: string;
        defaultOpen?: boolean;
        component?: React.ComponentType<any>;
    }
    enum SideEditPropType {
        Text = "TEXT",
        Textarea = "TEXTAREA",
        Number = "NUMBER",
        Boolean = "BOOLEAN",
        Select = "SELECT",
        Color = "COLOR",
        Image = "IMAGE",
        RichText = "RICHTEXT",
        Repeater = "REPEATER",
        Date = "DATE",
        Custom = "CUSTOM"
    }
    interface SelectOptions {
        display: OptionsDisplay;
        options: {
            value: string;
            label: string;
        }[];
    }
    enum OptionsDisplay {
        Dropdown = "dropdown",
        Radio = "radio",
        Buttons = "buttons",
        Select = "select"
    }
    interface RepeaterItem {
        itemType: string;
        itemLabel: string;
        min?: number;
        max?: number;
    }
    interface PageType {
        name: string;
        pluralName: string;
        defaultLocked?: boolean;
        defaultStatus?: PageStatus;
        defaultLanguage?: string;
        allowedBlockTypes?: string[];
        excludedBlockTypes?: string[];
        customFields?: CustomField[];
    }
    interface CustomField {
        name: string;
        label: string;
        type: CustomFieldType;
        validation?: any;
    }
    enum CustomFieldType {
        Text = "text",
        Number = "number",
        Boolean = "boolean",
        Date = "date",
        Image = "image",
        Reference = "reference"
    }
    interface LoginUIConfig {
        logo?: string;
        backgroundColor?: string;
        textColor?: string;
        primaryColor?: string;
    }
    interface AdminMenuItem {
        name: string;
        path: string;
        icon: string;
    }
    enum ClickToEditSide {
        BottomLeft = "bottom-left",
        BottomRight = "bottom-right",
        TopLeft = "top-left",
        TopRight = "top-right"
    }
    interface ResponsiveBreakpoint {
        type: DeviceType;
        width: number;
        label: string;
    }
    enum DeviceType {
        Phone = "phone",
        Tablet = "tablet",
        Desktop = "desktop"
    }
    enum BlockIconsPosition {
        OutsideBlock = "outside-block",
        InsideBlock = "inside-block"
    }
    enum PageStatus {
        Published = "published",
        Draft = "draft",
        Private = "private"
    }
    const RichTextFeatures: {
        Bold: string;
        Italic: string;
        Underline: string;
        Strikethrough: string;
        Code: string;
        Link: string;
        Unlink: string;
        BulletList: string;
        NumberedList: string;
        Quote: string;
        Heading1: string;
        Heading2: string;
        Heading3: string;
        Heading4: string;
        Heading5: string;
        Heading6: string;
    };
    interface PageValues {
        [key: string]: any;
    }
    interface Page {
        id: string;
        slug: string;
        title: string;
        content: any;
        meta: any;
        publishedAt?: string;
        author?: string;
    }
    interface Tag {
        id: string;
        name: string;
        slug: string;
    }
}
//# sourceMappingURL=types.d.ts.map