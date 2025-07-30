import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Repeater } from 'redaktus/core';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import Slider from 'react-slick';
import Container from 'website/layout/Container';
import Section from 'website/layout/Section';
import { BackgroundColorsSideEditProps, ContainerSizeSideEditProps, } from 'website/LayoutSideProps';
import blockNames from '../blockNames';
import Slick from './slick';
import SlickTheme from './slick-theme';
const NextArrow = ({ onClick }) => {
    return (_jsx("button", { onClick: onClick, className: "absolute top-[calc(50%-10px)] right-6 cursor-pointer bg-pink-50 w-10 h-10 border border-pink-400 rounded-full z-10", children: _jsx(MdArrowRight, { className: "w-full h-full text-pink-400" }) }));
};
const PreviousArrow = ({ onClick }) => {
    return (_jsx("button", { onClick: onClick, className: "absolute top-[calc(50%-10px)] left-6 cursor-pointer bg-pink-50 w-10 h-10 border border-pink-400 rounded-full z-10", children: _jsx(MdArrowLeft, { className: "w-full h-full text-pink-400" }) }));
};
const Carousel = ({ repeaterElement }) => {
    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: _jsx(NextArrow, {}),
        prevArrow: _jsx(PreviousArrow, {}),
        fade: true,
    };
    return (_jsxs(_Fragment, { children: [_jsx(SlickTheme, {}), _jsx(Slick, {}), _jsx("style", { children: `
      .slick-slide .p-2{
        height: 0px
      }
      .slick-current{
       z-index:1;
      }
      .slick-current .p-2{
        height: 100%;
      }
    ` }), _jsx(Slider, { ...settings, children: repeaterElement?.props?.children?.map((child, index) => {
                    return (_jsx("div", { className: "h-96 p-0 overflow-hidden", children: child }, index));
                }) })] }));
};
const ImageCarousel = ({ bg, width }) => {
    const [hasMount, setHasMount] = useState(false);
    useEffect(() => {
        setHasMount(true);
    }, []);
    const repeaterElement = Repeater({ propName: 'singleImage' });
    if (!hasMount) {
        return null;
    }
    if (width === 'full') {
        return (_jsx("div", { className: "my-2", children: _jsx(Carousel, { repeaterElement: repeaterElement }) }));
    }
    return (_jsx(Section, { bg: bg, children: _jsx(Container, { size: width, children: _jsx(Carousel, { repeaterElement: repeaterElement }) }) }));
};
ImageCarousel.schema = {
    name: blockNames.ImageCarousel,
    label: 'Image carousel',
    category: 'rb-ui website',
    getDefaultProps: () => ({
        singleImage: [
            {
                image: {
                    src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
                    placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
                    srcSet: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
                    width: 3385,
                    height: 1693,
                    alt: 'altText',
                    seoName: '',
                },
            }
        ],
    }),
    repeaterItems: [
        {
            name: 'singleImage',
            label: 'SingleImage',
            itemType: blockNames.SingleImage,
            itemLabel: 'Image',
            min: 1,
            max: 5,
        }
    ],
    sideEditProps: [
        BackgroundColorsSideEditProps, ContainerSizeSideEditProps
    ],
};
export default ImageCarousel;
//# sourceMappingURL=ImageCarousel.js.map