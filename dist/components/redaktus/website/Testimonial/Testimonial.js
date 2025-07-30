import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { Image, Text } from 'redaktus/core';
import { FiUser } from 'react-icons/fi';
import { BackgroundColorsSideEditProps } from 'website/LayoutSideProps';
import blockNames from '../blockNames';
import { bgColors } from '../colors';
import Container from '../layout/Container';
import Section from '../layout/Section';
const Testimonial = ({ authorName, authorJobTitle, avatarImage, logoImage, small = false, bg = bgColors.white.value, }) => {
    return (_jsx(Section, { bg: bg, children: _jsxs(Container, { size: "sm", className: classNames('pt-12 pb-20 flex flex-col justify-between ', small ? 'items-start' : 'items-center'), children: [_jsx(Text, { renderBlock: (props) => (_jsx("div", { className: classNames('flex-1 leading-relaxed text-center mb-6 text-gray-700 dark:text-gray-200 max-w-lg', small ? 'text-md text-left' : 'text-xl text-center'), children: props.children })), placeholder: "Quote...", renderPlaceholder: (props) => {
                        return _jsx("span", { children: props.children });
                    }, propName: "quote" }), _jsxs("div", { className: "flex items-center justify-center", children: [avatarImage ? (_jsx(Image, { alt: authorName, propName: "avatarImage", imageClassName: classNames('rounded-full', small ? 'w-8' : 'w-10') })) : (_jsx("div", { className: classNames('flex justify-center items-center rounded-full bg-gray-100 text-gray-500 text-xl', small ? 'w-8' : 'w-10'), children: _jsx(FiUser, {}) })), _jsxs("div", { className: "ml-3 dark:text-gray-200", children: [_jsx(Text, { renderBlock: (props) => (_jsx("div", { className: "text-sm font-bold", children: props.children })), placeholder: "Author name...", propName: "authorName" }), _jsx(Text, { renderBlock: (props) => (_jsx("div", { className: "text-xs", children: props.children })), placeholder: "Job title...", propName: "authorJobTitle" })] }), logoImage && (_jsx("div", { className: "ml-5 pl-5 border-l border-gray-300", children: _jsx(Image, { alt: authorJobTitle, propName: "logoImage", imageClassName: "w-12" }) }))] })] }) }));
};
Testimonial.schema = {
    name: blockNames.Testimonial,
    label: 'Testimonial',
    category: 'rb-ui website',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Testimonial/Testimonial.tsx',
    getDefaultProps: () => ({
        quote: 'F2.net is a skilled company who helped us define our production management application requirements and implemented it as a beautiful system that our users love. We are very satisfied.',
        authorName: 'Matteo Frana',
        authorJobTitle: 'Founder @ Redaktus',
        avatarImage: {
            src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            srcSet: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            alt: 'Matteo',
            seoName: 'matteo',
        },
        logoImage: {
            src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            srcSet: '',
            alt: 'Redaktus',
            seoName: 'redaktus',
        },
    }),
    sideEditProps: [
        BackgroundColorsSideEditProps
    ],
};
export default Testimonial;
//# sourceMappingURL=Testimonial.js.map