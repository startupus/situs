import { types } from 'react-bricks/frontend'
import React from 'react'

const config: types.ReactBricksConfig = {
  appId: process.env.REACTBRICKS_APP_ID || 'your-app-id',
  apiKey: process.env.REACTBRICKS_API_KEY || 'your-api-key',
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
}

export default config 