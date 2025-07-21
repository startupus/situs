import * as React from 'react'
import { Image, Text, RichText } from 'redaktus/core'
import * as types from 'redaktus/types'
import classNames from 'classnames'
import blockNames from '../blockNames'

export type layoutType = 'base' | 'small' | 'small-3cols'

const getFontSize = (screenLayout: layoutType) => {
  switch (screenLayout) {
    case 'base':
      return 'text-lg md:text-xl md:leading-5 leading-5 text-gray-700 dark:text-gray-300 font-extrabold mb-2'
    default:
      return ' text-base leading-5 text-gray-700 dark:text-gray-400 font-extrabold mb-2'
  }
}

export interface FeatureItemProps {
  screenLayout: layoutType
  isTextCenter: boolean
}

const screen = (screenLayout: layoutType) => {
  switch (screenLayout) {
    case 'base':
      return 'md:w-80'
    case 'small':
      return 'md:w-72 md:-mx-2'
    case 'small-3cols':
      return 'md:px-8'
    default:
      return 'w-64'
  }
}
const FeatureItem: types.Brick<FeatureItemProps> = ({
  screenLayout,
  isTextCenter = false,

}) => {
  return (
    <div
      className={classNames(
        `flex md:flex-col ${screen(screenLayout)} mb-16`,
        isTextCenter && 'text-center items-center'
      )}
    >
      <Image
        propName="image"
        alt="feature"
        imageClassName={
          screenLayout === 'base'
            ? 'w-24 md:w-auto h-auto md:h-24'
            : 'w-12 md:w-auto h-auto md:h-12'
        }
        renderWrapper={({ children }) => {
          return <div className="my-auto mr-6 md:mr-0 md:mb-5">{children}</div>
        }}
      />

      <div className="flex-1">
        <Text
          propName="title"
          placeholder="title..."
          renderBlock={(props) => (
            <h3 className={classNames(getFontSize(screenLayout))}>
              {props.children}
            </h3>
          )}
        />
        <RichText
          propName="text"
          placeholder="text..."
          renderBlock={(props) => (
            <p className="text-gray-500 dark:text-gray-200 font-normal leading-6 text-base text">
              {props.children}
            </p>
          )}
        />
      </div>
    </div>
  )
}
FeatureItem.schema = {
  name: blockNames.FeatureItem,
  label: 'Feature',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Features/FeatureItem.tsx',

  getDefaultProps: () => ({
    isTextCenter: false,
    title: 'Front-end development',
    text: 'We are specialized in the development of React web applications. For public websites we use Next.js or Gatbsy, based on the type of project.',
    screenLayout: 'base',
    image: {
      src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
        'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
    },
  }),
  sideEditProps: [
    {
      name: 'isTextCenter',
      label: 'Center Feature',
      type: types.SideEditPropType.Boolean,
    },
  ],
}

export default FeatureItem
