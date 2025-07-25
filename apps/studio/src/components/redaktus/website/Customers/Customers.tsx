import classNames from 'classnames'
import * as React from 'react'
import { Repeater } from 'redaktus/core'
import * as types from 'redaktus/types'
import {
  BackgroundColorsSideEditProps,
  ContainerSizeSideEditProps,
} from 'website/LayoutSideProps'
import blockNames from '../blockNames'
import { bgColors } from '../colors'
import Container, { Size } from '../layout/Container'
import Section, { Border } from '../layout/Section'

export interface CustomersProps {
  bg?: { color: string; className: string }
  borderTop?: Border
  borderBottom?: Border
  size?: 'medium' | 'large'
  width?: Size
  grayscale?: boolean
}

const Customers: types.Brick<CustomersProps> = ({
  bg = bgColors.white.value,
  width = 'lg',
  grayscale = true,
}) => {
  return (
    <Section bg={bg}>
      <Container
        size={width}
        className={classNames(
          'py-12 flex flex-wrap justify-center items-center'
        )}
      >
        <Repeater propName="customers" itemProps={{ grayscale }} />
      </Container>
    </Section>
  )
}

Customers.schema = {
  name: blockNames.Customers,
  label: 'Customers',
  category: 'rb-ui website',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Customers/Customers.tsx',

  getDefaultProps: () => ({
    bg: {
      color: '#f7fafc',
      className: 'bg-gray-100 dark:bg-gray-800',
    },
    borderTop: 'none',
    borderBottom: 'none',
    width: 'lg',
    grayscale: true,
    customers: [
      {
        image: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
          alt: 'Airbnb',
          seoName: 'airbnb',
        },
      },
      {
        image: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
          alt: 'Dribble',
          seoName: 'dribble',
        },
      },
      {
        image: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
          alt: 'Netflix',
          seoName: 'netflix',
        },
      },
      {
        image: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
          alt: 'Pinterest',
          seoName: 'pinterest',
        },
      },
      {
        image: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
          alt: 'Next.js',
          seoName: 'next-js',
        },
      },
    ],
  }),
  repeaterItems: [
    {
      name: 'customers',
      itemType: blockNames.Customer,
      itemLabel: 'Customer',
      // addItemText: 'Add customer',
      // removeItemText: 'Remove customer',
      min: 0,
      max: 12,
    },
  ],
  sideEditProps: [
    {
      groupName: 'Layout',
      defaultOpen: false,
      props: [BackgroundColorsSideEditProps, ContainerSizeSideEditProps],
    },
    {
      groupName: 'Logos',
      defaultOpen: true,
      props: [
        {
          name: 'grayscale',
          label: 'Greyscale',
          type: types.SideEditPropType.Boolean,
        },
      ],
    },
  ],
}

export default Customers
