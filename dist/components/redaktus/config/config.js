// Redaktus Config - скопировано с ReactBricks
// import { types } from 'redaktus/core'
import NextLink from './NextLink';
import bricks from './bricks';
import pageTypes from './pageTypes';
const config = {
    appId: 'redaktus-demo',
    apiKey: 'redaktus-demo-key',
    environment: 'development',
    bricks,
    pageTypes,
    customFields: [],
    logo: '/logo.svg',
    loginUI: {},
    contentClassName: '',
    //defaultTheme: "",
    renderLocalLink: NextLink,
    navigate: (path) => {
        if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    },
    loginPath: '/admin',
    editorPath: '/admin/editor',
    playgroundPath: '/admin/playground',
    appSettingsPath: '/admin/app-settings',
    previewPath: '/preview',
    // getAdminMenu: () => [],
    isDarkColorMode: false,
    toggleColorMode: () => { },
    useCssInJs: false,
    appRootElement: '#__next',
    clickToEditSide: 'bottom-right',
    //responsiveBreakpoints: [{ type: types.DeviceType.Phone, width: 480, label: "Smartphone" },],
    enableAutoSave: true,
    disableSaveIfInvalidProps: false,
    enablePreview: true,
    blockIconsPosition: 'outside-block',
    enableUnsplash: true,
    unsplashApiKey: '',
    enablePreviewImage: true,
    enableDefaultEmbedBrick: true,
    //permissions,  Fine-grained permissions for enterprise plans
};
export default config;
//# sourceMappingURL=config.js.map