import classNames from 'classnames'
import * as React from 'react'
import { Image, Link, Repeater, RichText } from 'redaktus/core'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'
import { bgColors, textColors } from '../colors'
import Container, { Size } from '../layout/Container'
import Section, { Border } from '../layout/Section'
import {
  BackgroundColorsSideEditProps,
  ContainerSizeSideEditProps,
} from '../LayoutSideProps'

export interface TextImageProps {
  bg?: { color: string; className: string }
  width?: Size
  heroTitle?: boolean
  mobileTextCenter?: boolean
  multiple?: boolean
  imageSide?: 'left' | 'right'
  mobileImageTop?: boolean
  mobileIcon?: boolean
  hasShadow?: boolean
  isRounded?: boolean
  bulletsVariant?: { color: string; className: string }
}

const TextImage: types.Brick<TextImageProps> = ({
  bg = bgColors.white.value,
  width = 'lg',
  heroTitle = false,
  mobileTextCenter = false,
  multiple = false,
  imageSide = 'right',
  mobileImageTop = false,
  mobileIcon = false,
  hasShadow = false,
  isRounded = false,
  // bulletsVariant = bulletColors.pinkLight.value,
}) => {
  const titleColor = textColors.gray900
  const highlightColor = textColors.purple500
  const textColor = textColors.gray700

  return (
    <Section bg={bg}>
      <Container
        size={width}
        className={classNames(
          'py-12 lg:py-20 flex flex-no-wrap md:items-start md:space-x-8',
          mobileTextCenter ? 'items-center' : 'items-start',
          mobileImageTop ? 'flex-col-reverse' : 'flex-col',
          imageSide === 'right'
            ? 'md:flex-row'
            : 'md:flex-row-reverse md:space-x-reverse'
        )}
      >
        <div
          className={classNames(
            'w-full md:flex-1 flex flex-col',
            imageSide === 'right' ? 'md:pr-1/10' : 'md:pl-1/10'
          )}
        >
          <Repeater
            propName="badge"
            renderWrapper={(items) => (
              <div
                className={classNames('mb-4 flex', {
                  'justify-center md:justify-start': mobileTextCenter,
                })}
              >
                {items}
              </div>
            )}
          />

          <RichText
            propName="title"
            renderBlock={(props) => (
              <h2
                className={classNames(
                  'mt-0 mb-4',
                  titleColor,
                  {
                    'text-center md:text-left': mobileTextCenter,
                  },
                  heroTitle
                    ? 'text-3xl sm:text-4xl font-black'
                    : 'text-2xl sm:text-3xl font-extrabold'
                )}
                style={{ lineHeight: 1.125 }}
                {...props.attributes}
              >
                {props.children}
              </h2>
            )}
            placeholder="Type a title..."
            allowedFeatures={[types.RichTextFeatures.Highlight]}
            renderHighlight={(props) => (
              <span className={highlightColor} {...props.attributes}>
                {props.children}
              </span>
            )}
          />

          <RichText
            propName="text"
            renderBlock={(props) => (
              <p
                className={classNames('text-lg sm:text-xl mb-3', textColor, {
                  'text-center md:text-left': mobileTextCenter,
                })}
                style={{ lineHeight: 1.6 }}
                {...props.attributes}
              >
                {props.children}
              </p>
            )}
            placeholder="Type a text..."
            allowedFeatures={[
              types.RichTextFeatures.Bold,
              types.RichTextFeatures.Link,
            ]}
            renderLink={(props) => (
              <Link {...props} className="text-lg">
                {props.children}
              </Link>
            )}
          />

          <Repeater
            propName="bulletListItems"
            itemProps={{
              className: 'lg:w-2/5 text-lg',
            }}
            renderWrapper={(items) => (
              <div className="mt-4 w-full flex flex-col lg:flex-row lg:flex-wrap lg:justify-between">
                {items}
              </div>
            )}
          />
          <Repeater
            propName="buttons"
            renderWrapper={(items) => (
              <div className="flex items-center flex-col sm:flex-row mt-4">
                {items}
              </div>
            )}
          />
        </div>
        {multiple ? (
          <div className="flex w-full md:w-2/5 lg:w-1/2 max-w-xs md:max-w-sm mx-auto mt-10 md:mt-0 flex-wrap justify-center -mb-6">
            <Repeater propName="logos" />
          </div>
        ) : (
          <div
            className={classNames(
              mobileIcon ? 'w-24' : 'w-full',
              mobileImageTop ? 'mt-0 mb-10' : 'mt-10 mb-0',
              'md:w-2/5 md:mt-0 md:mb-0'
            )}
          >
            <Image
              propName="imageSource"
              alt="Image"
              imageClassName={classNames(
                { 'rounded-lg': isRounded },
                { 'shadow-2xl': hasShadow }
              )}
            />
          </div>
        )}
      </Container>
    </Section>
  )
}

TextImage.schema = {
  name: blockNames.TextImage,
  label: 'Text Image',
  category: 'rb-ui website',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/TextImage/TextImage.tsx',

  getDefaultProps: () => ({
    bg: {
      color: '#fff',
      className: 'bg-white dark:bg-gray-900',
    },
    borderTop: 'none',
    borderBottom: 'none',
    width: 'lg',
    title: 'We built hundreds of apps',
    heroTitle: false,
    mobileTextCenter: false,
    text: 'We create and host websites since 1997. We saw the Internet grow up as the standards evolved. We have built hundreds of successful web applications and we still have a lot of fun.',
    imageSource: {
      src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
        'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet:
        'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      alt: 'Dashboard',
      seoName: 'dashboard',
    },
    imageSide: 'right',
    multiple: false,
    mobileImageTop: false,
    mobileIcon: false,
    hasShadow: false,
    isRounded: false,
  }),
  sideEditProps: [
    {
      groupName: 'Layout',
      defaultOpen: false,
      props: [BackgroundColorsSideEditProps, ContainerSizeSideEditProps],
    },
    {
      groupName: 'Text',
      defaultOpen: false,
      props: [
        {
          name: 'heroTitle',
          label: 'Hero-size Title',
          type: types.SideEditPropType.Boolean,
          shouldRefreshText: true,
        },
        {
          name: 'mobileTextCenter',
          label: 'Text centered on mobile',
          type: types.SideEditPropType.Boolean,
          shouldRefreshText: true,
        },
      ],
    },
    {
      groupName: 'Image',
      defaultOpen: false,
      props: [
        {
          name: 'multiple',
          label: 'Multiple logos',
          type: types.SideEditPropType.Boolean,
        },
        {
          name: 'imageSide',
          label: 'Image side',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Radio,
            options: [
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ],
          },
        },
        {
          name: 'mobileImageTop',
          label: 'Image on top on mobile',
          type: types.SideEditPropType.Boolean,
        },
        {
          name: 'mobileIcon',
          label: 'Show as icon on mobile',
          type: types.SideEditPropType.Boolean,
          show: (props) => !props.multiple,
        },
        {
          name: 'hasShadow',
          label: 'Image shadow',
          type: types.SideEditPropType.Boolean,
          show: (props) => !props.multiple,
        },
        {
          name: 'isRounded',
          label: 'Image rounded corners',
          type: types.SideEditPropType.Boolean,
          show: (props) => !props.multiple,
        },
      ],
    },
  ],
  repeaterItems: [
    {
      name: 'badge',
      itemType: blockNames.Badge,
      itemLabel: 'Badge',
      min: 0,
      max: 1,
    },
    {
      name: 'bulletListItems',
      itemType: blockNames.BulletListItem,
      itemLabel: 'Feature',
      min: 0,
      max: 4,
    },
    {
      name: 'buttons',
      itemType: blockNames.Button,
      itemLabel: 'Button',
      min: 0,
      max: 1,
    },
    {
      name: 'logos',
      itemType: blockNames.TextImageLogo,
      itemLabel: 'Logo',
      min: 0,
      max: 6,
    },
  ],
}

export default TextImage
