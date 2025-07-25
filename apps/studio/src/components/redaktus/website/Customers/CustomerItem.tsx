import * as React from 'react'
import { Image } from 'redaktus/core'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'


export interface CustomerProps {
  grayscale?: boolean
}

const Customer: types.Brick<CustomerProps> = ({ grayscale = true }) => {
  return (
    <div className="px-6 py-4 w-1/2 sm:w-1/3 md:w-1/6 flex justify-center items-center text-gray-300">
      <Image
        propName="image"
        alt="customer"
        imageClassName="w-32 h-16"
        imageStyle={
          grayscale
            ? { filter: 'opacity(0.5) grayscale(100%)' } //only grayscale
            : {}
        }
      />
    </div>
  )
}

Customer.schema = {
  name: blockNames.Customer,
  label: 'Customer',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Customers/CustomerItem.tsx',

  getDefaultProps: () => ({
    image: {
      src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
        'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
      alt: 'Redaktus Icon',
      seoName: 'redaktus-icon',
    },
  }),
}

export default Customer
