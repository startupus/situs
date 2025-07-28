import React from 'react'
import { Image } from 'redaktus/core'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'

export interface SingleImageProps {
  image?: any
  altText?: string
}

const SingleImage: types.Brick<SingleImageProps> = () => {
  return (
    <div className="flex justify-center">
      <Image
        propName="image"
        alt="altText"
        maxWidth={1200}
        aspectRatio={2}
        imageClassName="object-cover object-center transition-all duration-300"
      />
    </div>
  )
}

SingleImage.schema = {
  name: blockNames.SingleImage,
  label: 'Single Image',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  sideEditProps: [],
}

export default SingleImage
