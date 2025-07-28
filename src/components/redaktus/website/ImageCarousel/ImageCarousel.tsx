import React, { useEffect, useState } from 'react'
import { Repeater } from 'redaktus/core'
import * as types from 'redaktus/types'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'
import Slider from 'react-slick'
import { bgColors } from 'website/colors'
import Container, { Size } from 'website/layout/Container'
import Section, { Border } from 'website/layout/Section'
import {
  BackgroundColorsSideEditProps,
  ContainerSizeSideEditProps,
} from 'website/LayoutSideProps'
import blockNames from '../blockNames'
import Slick from './slick'

import SlickTheme from './slick-theme'
export interface ImageCarouselProps {
  bg?: { color: string; className: string }
  width?: Size
}
interface ArrowProps {
  onClick?: () => void
}
const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-[calc(50%-10px)] right-6 cursor-pointer bg-pink-50 w-10 h-10 border border-pink-400 rounded-full z-10"
    >
      <MdArrowRight className="w-full h-full text-pink-400" />
    </button>
  )
}
const PreviousArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-[calc(50%-10px)] left-6 cursor-pointer bg-pink-50 w-10 h-10 border border-pink-400 rounded-full z-10"
    >
      <MdArrowLeft className="w-full h-full text-pink-400" />
    </button>
  )
}

const Carousel = ({ repeaterElement }: any) => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
    fade: true,
  }
  return (
    <>
      <SlickTheme />
      <Slick />
      <style>{`
      .slick-slide .p-2{
        height: 0px
      }
      .slick-current{
       z-index:1;
      }
      .slick-current .p-2{
        height: 100%;
      }
    `}</style>
      <Slider {...settings}>
        {/* @ts-ignore */}
        {repeaterElement?.props?.children?.map((child, index) => {
          return (
            <div key={index} className="h-96 p-0 overflow-hidden">
              {child}
            </div>
          )
        })}
      </Slider>
    </>
  )
}

const ImageCarousel: types.Brick<ImageCarouselProps> = ({ bg, width }) => {
  const [hasMount, setHasMount] = useState(false)
  useEffect(() => {
    setHasMount(true)
  }, [])
  const repeaterElement = Repeater({ propName: 'singleImage' })

  if (!hasMount) {
    return null
  }
  if (width === 'full') {
    return (
      <div className="my-2">
        <Carousel repeaterElement={repeaterElement} />
      </div>
    )
  }
  return (
    <Section bg={bg}>
      <Container size={width}>
        <Carousel repeaterElement={repeaterElement} />
      </Container>
    </Section>
  )
}

ImageCarousel.schema = {
  name: blockNames.ImageCarousel,
  label: 'Image carousel',
  category: 'rb-ui website',
  getDefaultProps: () => ({
    singleImage: [
      {
        image: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      width: 3385,
          height: 1693,
          alt: 'altText',
          seoName: '',
        },
      }],
  }),
  repeaterItems: [
    {
      name: 'singleImage',
      label: 'SingleImage',
      itemType: blockNames.SingleImage,
      itemLabel: 'Image',
      min: 1,
      max: 5,
    }],
  sideEditProps: [
    BackgroundColorsSideEditProps, ContainerSizeSideEditProps],
}

export default ImageCarousel
