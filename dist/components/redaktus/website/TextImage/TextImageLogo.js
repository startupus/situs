import { jsx as _jsx } from "react/jsx-runtime";
import { Image } from 'redaktus/core';
import blockNames from '../blockNames';
const TextImageLogo = () => {
    return (_jsx("div", { children: _jsx(Image, { propName: "imageSource", alt: "logo", imageClassName: "w-12 h-12 lg:w-16 lg:h-16", renderWrapper: ({ children }) => (_jsx("div", { className: "w-16 h-16 lg:w-24 lg:h-24 mx-3 mb-6 p-2 flex justify-center items-center bg-white rounded-full shadow-xl", children: children })) }) }));
};
TextImageLogo.schema = {
    name: blockNames.TextImageLogo,
    label: 'Logo',
    category: 'rb-ui website',
    hideFromAddMenu: true,
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/TextImage/TextImageLogo.tsx',
    getDefaultProps: () => ({
        imageSource: {
            src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
            srcSet: '',
        },
    }),
};
export default TextImageLogo;
//# sourceMappingURL=TextImageLogo.js.map