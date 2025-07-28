import * as React from 'react'
import { Image } from 'redaktus/core'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'

const TextImageLogo: types.Brick = () => {
  return (
    <div>
      <Image
        propName="imageSource"
        alt="logo"
        imageClassName="w-12 h-12 lg:w-16 lg:h-16"
        renderWrapper={({ children }: any) => (
          <div className="w-16 h-16 lg:w-24 lg:h-24 mx-3 mb-6 p-2 flex justify-center items-center bg-white rounded-full shadow-xl">
            {children}
          </div>
        )}
      />
    </div>
  )
}

TextImageLogo.schema = {
  name: blockNames.TextImageLogo,
  label: 'Logo',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/TextImage/TextImageLogo.tsx',

  getDefaultProps: () => ({
    imageSource: {
      src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
        'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
    },
  }),
}

export default TextImageLogo
