import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { Repeater, RichText } from 'redaktus/core';
import { BackgroundColorsSideEditProps, ContainerSizeSideEditProps, } from 'website/LayoutSideProps';
import blockNames from '../blockNames';
import { bgColors, textColors } from '../colors';
import Container from '../layout/Container';
import Section from '../layout/Section';
const CallToAction = ({ bg = bgColors.white.value, width = 'sm', }) => {
    return (_jsx(Section, { bg: bg, children: _jsxs(Container, { size: width, className: classNames('py-12 flex flex-col sm:flex-row items-center text-center sm:text-left'), children: [_jsx("div", { className: "flex-1 sm:pr-12 mb-4 sm:mb-0", children: _jsx(RichText, { propName: "text", renderBlock: (props) => (_jsx("span", { className: classNames('font-extrabold text-xl sm:text-2xl leading-6 sm:leading-8', textColors.gray800), ...props.attributes, children: props.children })), placeholder: "Call to action text" }) }), _jsx("div", { children: _jsx(Repeater, { propName: "buttons", itemProps: { padding: 'small' } }) })] }) }));
};
CallToAction.schema = {
    name: blockNames.CallToAction,
    label: 'Call to action',
    playgroundLinkLabel: 'View source code on Github',
    category: 'rb-ui website',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/CallToAction/CallToAction.tsx',
    getDefaultProps: () => ({
        bg: {
            color: '#fff',
            className: 'bg-white dark:bg-gray-900',
        },
        borderTop: 'boxed',
        borderBottom: 'none',
        width: 'sm',
        text: 'Redaktus is great for developers and marketing.',
        buttons: [
            {
                text: 'Get started',
                variant: 'pink',
                type: 'solid',
                href: '',
                isTargetBlank: false,
                isBigButton: false,
            }
        ],
    }),
    repeaterItems: [
        {
            name: 'buttons',
            label: 'Buttons',
            itemType: blockNames.Button,
            itemLabel: 'Button',
            min: 0,
            max: 1,
        }
    ],
    sideEditProps: [
        BackgroundColorsSideEditProps, ContainerSizeSideEditProps
    ],
};
export default CallToAction;
//# sourceMappingURL=CallToAction.js.map