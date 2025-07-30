interface RedaktusConfig {
    appId: string;
    apiKey: string;
    environment: string;
    bricks: any;
    pageTypes: any;
    customFields: any[];
    logo: string;
    loginUI: any;
    contentClassName: string;
    renderLocalLink: any;
    navigate: (path: string) => void;
    loginPath: string;
    editorPath: string;
    playgroundPath: string;
    appSettingsPath: string;
    previewPath: string;
    isDarkColorMode: boolean;
    toggleColorMode: () => void;
    useCssInJs: boolean;
    appRootElement: string;
    clickToEditSide: string;
    enableAutoSave: boolean;
    disableSaveIfInvalidProps: boolean;
    enablePreview: boolean;
    blockIconsPosition: string;
    enableUnsplash: boolean;
    unsplashApiKey: string;
    enablePreviewImage: boolean;
    enableDefaultEmbedBrick: boolean;
}
declare const config: RedaktusConfig;
export default config;
//# sourceMappingURL=config.d.ts.map