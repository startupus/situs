import { jsx as _jsx } from "react/jsx-runtime";
import { RichText } from 'redaktus/core';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
const Quote = () => {
    return (_jsx(Section, { children: _jsx(Container, { children: _jsx("div", { className: "text-2xl my-8 pl-6 py-1 border-l-4 border-pink-500 dark:border-pink-400", children: _jsx(RichText, { propName: "quote", placeholder: "Insert a quote", renderBlock: ({ children }) => (_jsx("p", { className: "text-2xl italic text-gray-500 dark:text-gray-200", children: children })) }) }) }) }));
};
Quote.schema = {
    name: blockNames.Quote,
    label: 'Quote',
    category: 'rb-ui blog',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Quote/Quote.tsx',
    getDefaultProps: () => ({
        quote: 'Innovation distinguishes between a leader and a follower.',
    }),
};
export default Quote;
//# sourceMappingURL=Quote.js.map