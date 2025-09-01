import { types } from 'redaktus/frontend'
import React from 'react'

const config: types.RedaktusConfig = {
  appId: 'redaktus-local',
  apiKey: 'local-development',
  pageTypes: [
    {
      name: 'website',
      pluralName: 'websites',
      defaultLocked: false,
      defaultStatus: types.PageStatus.Published,
      getDefaultContent: () => [],
      allowedBlockTypes: [
        'hero',
        'features',
        'testimonials',
        'cta',
        'content',
      ],
    },
  ],
  renderLocalLink: () => React.createElement('div'),
  navigate: () => {},
  appRootElement: '#root',
  enableAutoSave: true,
  disableSaveIfInvalidProps: false,
  enablePreview: true,
  // Отключаем внешние API
  enableAPI: false,
  enableCloud: false,
}

export default config 