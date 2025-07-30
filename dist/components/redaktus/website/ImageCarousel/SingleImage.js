import { jsx as _jsx } from "react/jsx-runtime";
import { Image } from 'redaktus/core';
import blockNames from '../blockNames';
const SingleImage = () => {
    return (_jsx("div", { className: "flex justify-center", children: _jsx(Image, { propName: "image", alt: "altText", maxWidth: 1200, aspectRatio: 2, imageClassName: "object-cover object-center transition-all duration-300" }) }));
};
SingleImage.schema = {
    name: blockNames.SingleImage,
    label: 'Single Image',
    category: 'rb-ui website',
    hideFromAddMenu: true,
    sideEditProps: [],
};
export default SingleImage;
//# sourceMappingURL=SingleImage.js.map