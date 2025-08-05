import HeroUnit from './custom/MyHeroUnit';
import Pokemon from './custom/Pokemon';
import reactBricksUITheme from './react-bricks-ui';
const bricks = [
    reactBricksUITheme, // Redaktus UI
    {
        themeName: 'React Pro Components',
        categories: [
            {
                categoryName: 'Hero Sections',
                bricks: [
                    {
                        name: 'hero-1-pro',
                        label: 'Hero 1 Pro - Startup Landing',
                        description: 'Готовый Hero компонент из React Pro Components с inline editing',
                        tags: ['hero', 'landing', 'startup', 'pro'],
                        sideEditProps: [],
                        repeaterItems: [],
                        getDefaultProps: () => ({
                            title: 'Kickstart Startup Website with TailGrids',
                            subtitle: 'With TailGrids, business and students thrive together. Business can perfectly match their staffing to changing demand throughout the dayed.',
                            primaryButtonText: 'Get Started',
                            primaryButtonUrl: '#',
                            secondaryButtonText: 'Download App',
                            secondaryButtonUrl: '#',
                            clientsLabel: 'Some Of Our Clients'
                        })
                    }
                ]
            },
            {
                categoryName: 'Legacy',
                bricks: [HeroUnit, Pokemon], // Custom Bricks
            },
        ],
    },
];
export default bricks;
//# sourceMappingURL=index.js.map