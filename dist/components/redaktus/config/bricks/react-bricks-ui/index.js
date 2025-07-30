// Импорт всех website компонентов
import website from '../../../website';
import blog from '../../../blog';
const allBricks = {
    themeName: 'Redaktus UI',
    categories: [
        {
            categoryName: 'Hero Sections',
            bricks: website.filter(brick => brick.schema?.name?.includes('hero') ||
                brick.schema?.name?.includes('Hero')),
        },
        {
            categoryName: 'Content',
            bricks: website.filter(brick => brick.schema?.name?.includes('Text') ||
                brick.schema?.name?.includes('Feature') ||
                brick.schema?.name?.includes('Image')),
        },
        {
            categoryName: 'Call to Action',
            bricks: website.filter(brick => brick.schema?.name?.includes('CallToAction') ||
                brick.schema?.name?.includes('Button')),
        },
        {
            categoryName: 'Testimonials',
            bricks: website.filter(brick => brick.schema?.name?.includes('Testimonial') ||
                brick.schema?.name?.includes('Customer')),
        },
        {
            categoryName: 'Forms',
            bricks: website.filter(brick => brick.schema?.name?.includes('Form') ||
                brick.schema?.name?.includes('Newsletter')),
        },
        {
            categoryName: 'Layout',
            bricks: website.filter(brick => brick.schema?.name?.includes('Spacer') ||
                brick.schema?.name?.includes('Rule') ||
                brick.schema?.name?.includes('Table')),
        },
        {
            categoryName: 'Blog',
            bricks: blog,
        },
    ],
};
export default allBricks;
//# sourceMappingURL=index.js.map