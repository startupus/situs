import * as React from 'react'
import classNames from 'classnames'

import { Text, RichText, Image } from 'redaktus/core'
import * as types from 'redaktus/types'

import { bgColors, textColors } from '../colors'
import Section, { type Border } from '../layout/Section'
import Container, { type Size } from '../layout/Container'
import blockNames from '../blockNames'
import {
  BackgroundColorsSideEditProps,
  ContainerSizeSideEditProps,
} from 'website/LayoutSideProps'

export interface FeatureCalloutProps {
  bg?: { color: string; className: string }
  width?: Size
}

interface RenderBlockProps {
  attributes: React.HTMLAttributes<HTMLElement>
  children: React.ReactNode
}

const FeatureCallout: types.Brick<FeatureCalloutProps> = ({
  bg = bgColors.white.value,
  width = 'md',
}) => {
  return (
    <Section bg={bg} borderTop="none" borderBottom="none">
      <Container
        size={width}
        className="flex flex-col lg:flex-row items-center justify-center lg:space-x-8 space-y-8 lg:space-y-0"
      >
        <div className="flex-1">
          <Image
            propName="image"
            alt="Image"
            aspectRatio={1.3}
            imageClassName="object-cover object-center rounded-lg"
          />
        </div>
        <div className="flex-1">
          <Text
            propName="title"
            renderBlock={(props: RenderBlockProps) => (
              <div
                className={classNames(
                  'font-extrabold text-xl leading-6 mb-1',
                  textColors.gray900
                )}
                {...props.attributes}
              >
                {props.children}
              </div>
            )}
            placeholder="Title"
          />
          <RichText
            propName="text"
            renderBlock={(props: RenderBlockProps) => (
              <span
                className={classNames('leading-6', textColors.gray700)}
                {...props.attributes}
              >
                {props.children}
              </span>
            )}
            placeholder="Text"
            allowedFeatures={[types.RichTextFeatures.link]}
          />
        </div>
      </Container>
    </Section>
  )
}

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
      placeholderSrc:
        'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
      alt: 'Content creators',
      seoName: 'content-creators',
    },
  }),
  sideEditProps: [
    BackgroundColorsSideEditProps, 
    ContainerSizeSideEditProps
  ],
}

export default FeatureCallout
