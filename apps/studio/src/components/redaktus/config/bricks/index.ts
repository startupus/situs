import { types } from 'redaktus/frontend'

import HeroUnit from './custom/MyHeroUnit'
import Pokemon from './custom/Pokemon'
import reactBricksUITheme from './react-bricks-ui'

const bricks: types.Theme[] = [
  reactBricksUITheme, // Redaktus UI
  {
    themeName: 'Default',
    categories: [
      {
        categoryName: 'Hero sections',
        bricks: [HeroUnit], // Custom Bricks
      },
      {
        categoryName: 'Pokemon',
        bricks: [Pokemon], // External data Bricks
      },
    ],
  },
]

export default bricks
