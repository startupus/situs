import { types } from 'redaktus/frontend';

import HeroUnit from './custom/MyHeroUnit';
import Pokemon from './custom/Pokemon';

const bricks: types.Theme[] = [
  {
    themeName: 'Redaktus UI',
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
];

export default bricks;
