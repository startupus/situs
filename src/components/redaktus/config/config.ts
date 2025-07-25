// Redaktus Config - скопировано с ReactBricks
// import { types } from 'redaktus/core'

import NextLink from './NextLink'
import bricks from './bricks'
import pageTypes from './pageTypes'

// Простая типизация для конфигурации
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

const config: RedaktusConfig = {
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
  navigate: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  },
  loginPath: '/admin',
  editorPath: '/admin/editor',
  playgroundPath: '/admin/playground',
  appSettingsPath: '/admin/app-settings',
  previewPath: '/preview',
  // getAdminMenu: () => [],
  isDarkColorMode: false,
  toggleColorMode: () => {},
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
}

export default config
