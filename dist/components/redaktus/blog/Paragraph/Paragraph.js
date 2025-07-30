import { jsx as _jsx } from "react/jsx-runtime";
import { Link, RichText } from 'redaktus/core';
import * as types from 'redaktus/types';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
const Paragraph = () => {
    return (_jsx(Section, { children: _jsx(Container, { children: _jsx(RichText, { propName: "text", placeholder: "Paragraph...", renderBlock: ({ children }) => (_jsx("p", { className: "text-lg leading-relaxed mb-2 text-gray-700 dark:text-gray-200", children: children })), allowedFeatures: [
                    types.RichTextFeatures.h2,
                    types.RichTextFeatures.h3,
                    types.RichTextFeatures.h4,
                    types.RichTextFeatures.bold,
                    types.RichTextFeatures.italic,
                    types.RichTextFeatures.link,
                    types.RichTextFeatures.code,
                    types.RichTextFeatures.highlight,
                    types.RichTextFeatures.ul,
                    types.RichTextFeatures.ol,
                ], renderH2: ({ children }) => {
                    return (_jsx("h2", { className: "font-content text-4xl font-black text-gray-900 dark:text-gray-100 mb-3 pt-10", children: children }));
                }, renderH3: ({ children }) => {
                    return (_jsx("h3", { className: "font-content text-3xl font-black text-gray-900 dark:text-gray-100 mb-3 pt-8", children: children }));
                }, renderH4: ({ children }) => {
                    return (_jsx("h3", { className: "font-content text-2xl font-black text-gray-900 dark:text-gray-100 mb-3 pt-8", children: children }));
                }, renderUL: ({ children }) => (_jsx("ul", { className: "list-disc list-outside ml-5 mt-4 text-lg text-gray-700 dark:text-gray-200", children: children })), renderOL: ({ children }) => (_jsx("ol", { className: "list-decimal list-outside ml-5 mt-4 text-lg text-gray-700 dark:text-gray-200", children: children })), renderLink: ({ children, href }) => (_jsx(Link, { href: href, className: "text-blue-500 underline dark:text-blue-300", children: children })) }) }) }));
};
Paragraph.schema = {
    name: blockNames.Paragraph,
    label: 'Paragraph',
    category: 'rb-ui blog',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Paragraph/Paragraph.tsx',
    getDefaultProps: () => ({
        text: [
            {
                type: 'h2',
                children: [
                    {
                        text: 'Lorem ipsum dolor sit title',
                    },
                ],
            },
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat sagittis faucibus.',
                    },
                ],
            },
        ],
    }),
};
export default Paragraph;
//# sourceMappingURL=Paragraph.js.map