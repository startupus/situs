import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Text, usePageValues } from 'redaktus/core';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
import DefaultAvatar from './DefaultAvatar';
const Title = ({ size = 'large' }) => {
    const pageValues = usePageValues();
    return (_jsx(Section, { children: _jsxs(Container, { children: [_jsx("div", { className: classNames('text-3xl', { 'sm:text-5xl': size === 'large' }, { 'sm:text-4xl': size === 'medium' }), children: _jsx(Text, { propName: "title", renderBlock: (prop) => {
                            return (_jsx("h1", { className: classNames('text-left font-black text-gray-900 dark:text-gray-100 mb-3'), children: prop.children }));
                        }, placeholder: "Type a title..." }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [pageValues?.author?.avatarUrl ? (_jsx("img", { src: pageValues?.author?.avatarUrl, alt: "Author", className: "rounded-full w-12 h-12" })) : (_jsx(DefaultAvatar, { className: "rounded-full w-12 h-12" })), _jsxs("div", { className: "text-gray-700 dark:text-gray-200", children: [pageValues?.author?.firstName || 'John', ' ', pageValues?.author?.lastName || 'Doe', _jsx("span", { className: "text-sm text-gray-300 dark:text-gray-500 px-2", children: "\u2022" }), dayjs(pageValues?.publishedAt || new Date()).format('MMMM DD, YYYY')] })] })] }) }));
};
Title.schema = {
    name: blockNames.Title,
    label: 'Title',
    category: 'rb-ui blog',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Title/Title.tsx',
    getDefaultProps: () => ({
        title: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'This is the Blog title',
                    },
                ],
            },
        ],
    }),
};
export default Title;
//# sourceMappingURL=Title.js.map