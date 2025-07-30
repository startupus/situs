import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { Repeater, RichText } from 'redaktus/core';
import * as types from 'redaktus/types';
import { BackgroundColorsSideEditProps } from 'website/LayoutSideProps';
import blockNames from '../blockNames';
import { bgColors, gradients, textColors } from '../colors';
import Container from '../layout/Container';
import Section from '../layout/Section';
const HeroUnit = ({ bg = bgColors.white.value, textGradient = 'none', size = 'large', }) => {
    const titleColor = textColors.gray800;
    const textColor = textColors.gray700;
    const highlightColor = textColors.purple500;
    const titleStyle = textGradient !== 'none' ? { WebkitTextFillColor: 'transparent' } : {};
    return (_jsx(Section, { bg: bg, children: _jsx(Container, { size: "lg", className: "py-12 xl:py-20", children: _jsxs("div", { className: "max-w-xl mx-auto px-5", children: [_jsx(Repeater, { propName: "badge", renderWrapper: (items) => _jsx("div", { className: "mb-4", children: items }) }), _jsx("div", { className: classNames(titleColor, gradients[textGradient], 'text-3xl', { 'sm:text-5xl': size === 'large' }, { 'sm:text-4xl': size === 'medium' }), style: titleStyle, children: _jsx(RichText, { renderBlock: (props) => (_jsx("h1", { className: classNames('text-center font-black mb-4 pb-1 bg-clip-text bg-gradient-to-r', titleColor), style: { lineHeight: 1.1 }, ...props.attributes, children: props.children })), placeholder: "Type a title...", propName: "title", allowedFeatures: [types.RichTextFeatures.highlight], renderHighlight: (props) => (_jsx("span", { className: highlightColor, ...props.attributes, children: props.children })) }) }), _jsx(RichText, { renderBlock: (props) => (_jsx("p", { className: classNames('text-lg sm:text-xl text-center leading-7 sm:leading-8', textColor), ...props.attributes, children: props.children })), placeholder: "Type a text...", propName: "text", allowedFeatures: [
                            types.RichTextFeatures.bold,
                            types.RichTextFeatures.link
                        ] }), _jsx(Repeater, { propName: "buttons", renderWrapper: (items) => (_jsx("div", { className: "flex justify-center items-center flex-col sm:flex-row mt-6", children: items })) })] }) }) }));
};
HeroUnit.schema = {
    name: blockNames.HeroUnit,
    label: 'Hero Unit',
    category: 'rb-ui website',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Hero%20Unit/HeroUnit.tsx',
    getDefaultProps: () => ({
        bg: {
            color: '#fff',
            className: 'bg-white dark:bg-gray-900',
        },
        size: 'large',
        textGradient: 'none',
        title: 'We develop beautiful web applications',
        text: "We are a hi-tech web development company committed to deliver great products on time. We love to understand our customers' needs and exceed expectations.",
        badge: [
            {
                text: 'high tech',
                color: {
                    color: '#90cdf4',
                    className: 'text-blue-400 dark:text-blue-300',
                },
            }
        ],
        buttons: [
            {
                text: 'Get Started',
                href: '',
                isTargetBlank: false,
                variant: 'sky',
                type: 'solid',
            },
            {
                text: 'Learn more',
                href: '',
                isTargetBlank: false,
                variant: 'sky',
                type: 'outline',
            }
        ],
    }),
    repeaterItems: [
        {
            name: 'badge',
            label: 'Badge',
            itemType: blockNames.Badge,
            itemLabel: 'Badge',
            min: 0,
            max: 1,
        },
        {
            name: 'buttons',
            label: 'Buttons',
            itemType: blockNames.Button,
            itemLabel: 'Button',
            min: 0,
            max: 2,
        }
    ],
    sideEditProps: [
        BackgroundColorsSideEditProps,
        {
            name: 'textGradient',
            label: 'Text gradient',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Select,
                options: [
                    { value: 'none', label: 'None' },
                    { value: 'ocean', label: 'Ocean' },
                    { value: 'violet', label: 'Violet' },
                    { value: 'sun', label: 'Sunset' },
                ],
            },
        },
        {
            name: 'size',
            label: 'Title size',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Radio,
                options: [
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                ],
            },
        },
    ],
};
export default HeroUnit;
//# sourceMappingURL=HeroUnit.js.map