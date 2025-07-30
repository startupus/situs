import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Image, Text, types, useAdminContext, RichText, } from 'redaktus/core';
import { FaTwitter } from 'react-icons/fa';
import Section from '../layout/Section';
import blockNames from '../blockNames';
const TweetLight = ({ tweetLink, authorLink, }) => {
    const { isAdmin } = useAdminContext();
    const [isMouseOver, setIsMouseOver] = useState(false);
    const handleClick = (tweetLink) => (event) => {
        if (isAdmin) {
            return event.preventDefault();
        }
        if (typeof window !== undefined) {
            window.open(tweetLink);
        }
    };
    return (_jsx(Section, { children: _jsx("div", { className: "mx-auto max-w-lg px-6", children: _jsxs("div", { onClick: handleClick(tweetLink), className: "block font-sans p-4 bg-white hover:bg-gray-50 border dark:bg-black border-gray-300 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200 rounded-xl", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("a", { href: authorLink, rel: "noopener noreferrer", target: "_blank", className: "flex items-center", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "mr-2 w-12 h-12", children: _jsx(Image, { propName: "author", alt: "athor-name", imageClassName: "rounded-full filter hover:brightness-90" }) }), _jsxs("div", { className: "group", children: [_jsx(Text, { propName: "authorName", placeholder: "Author Name", renderBlock: ({ children }) => (_jsx("div", { className: "text-md text-gray-900 font-bold leading-tight group-hover:underline dark:text-neutral-300", children: children })) }), _jsx(Text, { propName: "authorTwitterHandle", placeholder: "Author @", renderBlock: ({ children }) => (_jsx("div", { className: "text-sm text-gray-500 font-medium tracking-tight", children: children })) })] })] }), _jsx("div", { className: "text-2xl dark:text-neutral-300", style: { color: '#1d9bf0' }, children: _jsx(FaTwitter, {}) })] }), _jsx(RichText, { propName: "tweetContent", placeholder: "tweet content", renderBlock: ({ children }) => (_jsx("div", { className: "mb-2 text-xl font-medium leading-tight dark:text-neutral-300", children: children })), allowedFeatures: [types.RichTextFeatures.link], renderLink: ({ children, href, attributes }) => (_jsx("a", { ...attributes, href: href, onClick: (event) => event.stopPropagation(), className: "hover:text-sky-600", onMouseEnter: () => setIsMouseOver(true), onMouseLeave: () => setIsMouseOver(false), style: { color: isMouseOver ? '#1a8cd8' : '#1d9bf0' }, target: "_blank", rel: "noopener noreferrer", children: children })) }), _jsx(Text, { propName: "date", placeholder: "Date", renderBlock: ({ children }) => (_jsx("div", { className: "inline-block font-normal text-gray-500 tracking-tight hover:underline", children: children })) })] }) }) }));
};
TweetLight.schema = {
    name: blockNames.TweetLight,
    label: 'Tweet light',
    category: 'rb-ui blog',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Tweet/TweetLight.tsx',
    getDefaultProps: () => ({
        authorName: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'John Doe',
                    },
                ],
            },
        ],
        author: {
            src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            srcSet: '',
            width: 1249.24,
            height: 1249.24,
            alt: 'Author name',
            seoName: 'author',
        },
        tweetLink: 'https://twitter.com/matfrana/status/1237840583982329857',
        authorLink: 'https://twitter.com/matfrana',
        authorTwitterHandle: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: '@JohnDoe',
                    },
                ],
            },
        ],
        tweetContent: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Lorem ipsum dolor sit amet ',
                    },
                    {
                        type: 'link',
                        url: 'https://twitter.com/Redaktus',
                        children: [
                            {
                                text: '@Redaktus',
                            },
                        ],
                    },
                    {
                        text: '',
                    },
                ],
            },
        ],
        date: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: '10:18 · Jan 04, 2022',
                    },
                ],
            },
        ],
    }),
    sideEditProps: [
        {
            name: 'helper',
            label: 'Why Tweet light?',
            type: types.SideEditPropType.Custom,
            component: () => (_jsx("div", { className: "text-sm", children: "This is a light version of the Tweet content block: it doesn't load the Twitter JavaScript, so it is much better performance-wise, but it requires manually entering the Tweet content and properties." })),
        },
        {
            name: 'tweetLink',
            label: 'Tweet Link',
            type: types.SideEditPropType.Text,
        },
        {
            name: 'authorLink',
            label: 'Author Link',
            type: types.SideEditPropType.Text,
        },
    ],
};
export default TweetLight;
//# sourceMappingURL=TweetLight.js.map