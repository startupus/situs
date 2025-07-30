import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Image, RichText, Text } from 'redaktus/frontend';
import * as types from 'redaktus/types';
//=============================
// Component to be rendered
//=============================
const MyHeroUnit = ({ padding }) => {
    return (_jsx("div", { className: `max-w-xl mx-auto px-6 ${padding === 'big' ? 'py-20' : 'py-12'}`, children: _jsxs("div", { children: [_jsx(Image, { propName: "icon", alt: "Icon", maxWidth: 200, aspectRatio: 1, imageClassName: "w-20 mb-5 mx-auto" }), _jsx(Text, { renderBlock: (props) => (_jsx("h1", { className: "text-3xl sm:text-4xl text-center font-black leading-tight mb-3 transition-colors duration-200 text-gray-900 dark:text-gray-100", children: props.children })), placeholder: "Type a title...", propName: "title" }), _jsx(RichText, { renderBlock: (props) => (_jsx("p", { className: "text-xl text-center leading-relaxed transition-colors duration-200 text-gray-700 dark:text-gray-100", children: props.children })), placeholder: "Type a text...", propName: "text", allowedFeatures: [
                        types.RichTextFeatures.bold,
                        types.RichTextFeatures.italic,
                        types.RichTextFeatures.highlight,
                        types.RichTextFeatures.code,
                        types.RichTextFeatures.link,
                    ], renderCode: (props) => (_jsx("code", { className: "text-sm py-1 px-2 rounded-sm transition-colors duration-200 bg-gray-200 dark:bg-gray-700", children: props.children })), renderLink: (props) => (_jsx("a", { href: props.href, target: props.target, rel: props.rel, className: "text-sky-500 hover:text-sky-600 transition-colors", children: props.children })) })] }) }));
};
//=============================
// Brick Schema
//=============================
MyHeroUnit.schema = {
    name: 'my-hero-unit',
    label: 'Custom Hero Unit',
    // previewImageUrl: `/bricks-preview-images/custom-hero-unit.png`,
    getDefaultProps: () => ({
        padding: 'big',
        title: 'This is a custom Hero Unit',
        text: "We are a hi-tech web development company committed to deliver great products on time. We love to understand our customers' needs and exceed expectations.",
    }),
    sideEditProps: [
        {
            name: 'padding',
            label: 'Padding',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Select,
                options: [
                    { value: 'big', label: 'Big Padding' },
                    { value: 'small', label: 'Small Padding' },
                ],
            },
        },
    ],
};
export default MyHeroUnit;
//# sourceMappingURL=MyHeroUnit.js.map