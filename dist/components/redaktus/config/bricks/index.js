import HeroUnit from './custom/MyHeroUnit';
import Pokemon from './custom/Pokemon';
const bricks = [
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
//# sourceMappingURL=index.js.map