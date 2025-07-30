import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { Repeater } from 'redaktus/core';
import { BackgroundColorsSideEditProps, ContainerSizeSideEditProps, } from 'website/LayoutSideProps';
import blockNames from '../blockNames';
import { bgColors } from '../colors';
import Container from '../layout/Container';
import Section from '../layout/Section';
const Faq = ({ bg = bgColors.white.value, width = 'sm', }) => {
    return (_jsx(Section, { bg: bg, children: _jsx(Container, { size: width, className: classNames('pt-12'), children: _jsx(Repeater, { propName: "faqs" }) }) }));
};
Faq.schema = {
    name: blockNames.Faqs,
    label: 'Faq',
    category: 'rb-ui website',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Faq/Faq.tsx',
    getDefaultProps: () => ({
        bg: bgColors.white.value,
        borderTop: 'full',
        borderBottom: 'none',
        width: 'sm',
        faqs: [
            {
                question: 'Why you should change your CMS today?',
                answer: 'Because you want to have top user experience and top developer experience.',
            }
        ],
    }),
    repeaterItems: [
        {
            name: 'faqs',
            label: 'Faqs',
            itemType: blockNames.Faq,
            itemLabel: 'Question',
        }
    ],
    sideEditProps: [
        BackgroundColorsSideEditProps, ContainerSizeSideEditProps
    ],
};
export default Faq;
//# sourceMappingURL=Faq.js.map