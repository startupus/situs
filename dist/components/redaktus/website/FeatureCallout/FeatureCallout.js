import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { Text, RichText, Image } from 'redaktus/core';
import * as types from 'redaktus/types';
import { bgColors, textColors } from '../colors';
import Section from '../layout/Section';
import Container from '../layout/Container';
import blockNames from '../blockNames';
import { BackgroundColorsSideEditProps, ContainerSizeSideEditProps, } from 'website/LayoutSideProps';
const FeatureCallout = ({ bg = bgColors.white.value, width = 'md', }) => {
    return (_jsx(Section, { bg: bg, borderTop: "none", borderBottom: "none", children: _jsxs(Container, { size: width, className: "flex flex-col lg:flex-row items-center justify-center lg:space-x-8 space-y-8 lg:space-y-0", children: [_jsx("div", { className: "flex-1", children: _jsx(Image, { propName: "image", alt: "Image", aspectRatio: 1.3, imageClassName: "object-cover object-center rounded-lg" }) }), _jsxs("div", { className: "flex-1", children: [_jsx(Text, { propName: "title", renderBlock: (props) => (_jsx("div", { className: classNames('font-extrabold text-xl leading-6 mb-1', textColors.gray900), ...props.attributes, children: props.children })), placeholder: "Title" }), _jsx(RichText, { propName: "text", renderBlock: (props) => (_jsx("span", { className: classNames('leading-6', textColors.gray700), ...props.attributes, children: props.children })), placeholder: "Text", allowedFeatures: [types.RichTextFeatures.link] })] })] }) }));
};
FeatureCallout.schema = {
    name: blockNames.FeatureCallout,
    label: 'Feature Callout',
    category: 'call to action',
    getDefaultProps: () => ({
        bg: {
            color: '#f7fafc',
            className: 'bg-gray-100',
        },
        width: 'lg',
        image: {
            src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            srcSet: '',
            alt: 'Content creators',
            seoName: 'content-creators',
        },
    }),
    sideEditProps: [
        BackgroundColorsSideEditProps,
        ContainerSizeSideEditProps
    ],
};
export default FeatureCallout;
//# sourceMappingURL=FeatureCallout.js.map