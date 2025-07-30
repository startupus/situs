import { types } from 'redaktus/frontend';
const pageTypes = [
    {
        name: 'page',
        pluralName: 'pages',
        defaultLocked: false,
        defaultStatus: types.PageStatus.Published,
        getDefaultContent: () => [],
    },
    {
        name: 'blog',
        pluralName: 'Blog',
        defaultLocked: false,
        defaultStatus: types.PageStatus.Published,
        getDefaultContent: () => [],
        allowedBlockTypes: [
            'title',
            'paragraph',
            'big-image',
            'video',
            'code',
            'tweet',
            'tweet-light',
            'blog-title',
            'newsletter-subscribe',
        ],
    },
    {
        name: 'layout',
        pluralName: 'layout',
        defaultLocked: false,
        defaultStatus: types.PageStatus.Published,
        getDefaultContent: () => [],
        // isEntity: true,
        allowedBlockTypes: ['header', 'footer'],
    },
];
export default pageTypes;
//# sourceMappingURL=pageTypes.js.map