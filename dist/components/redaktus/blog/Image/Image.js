import { jsx as _jsx } from "react/jsx-runtime";
import { Image } from 'redaktus/core';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
const BlogImage = () => {
    return (_jsx(Section, { children: _jsx(Container, { children: _jsx(Image, { propName: "image", aspectRatio: 1.78, alt: "" }) }) }));
};
BlogImage.schema = {
    name: blockNames.BlogImage,
    label: 'Image',
    category: 'rb-ui blog',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Image/Image.tsx',
    getDefaultProps: () => ({
        image: {
            src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            srcSet: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            width: 3385,
            height: 1902,
            alt: '',
            seoName: '',
        },
    }),
};
export default BlogImage;
//# sourceMappingURL=Image.js.map