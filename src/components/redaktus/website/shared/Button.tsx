import * as React from 'react'
import classNames from 'classnames'
import { Link } from 'redaktus/core'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'

export interface ButtonProps {
  text: string
  href: string
  isTargetBlank: boolean
  isBigButton: boolean
  variant?: 'pink' | 'sky'
  type?: 'solid' | 'outline'
  padding: 'normal' | 'small'
  className?: string
}

const Button: types.Brick<ButtonProps> = ({
  text,
  href,
  isTargetBlank = false,
  isBigButton = false,
  variant = 'pink',
  type = 'solid',
  padding = 'normale',
  className,
}) => {
  const target = isTargetBlank
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Link
      href={href}
      {...target}
      className={classNames(
        'py-3 mx-2 my-2 rounded-full font-bold leading-none translate-hover-2 hover:shadow-lg transition-all ease-in-out duration-150',
        padding === 'normal' ? 'px-8' : 'px-5',
        isBigButton && ' w-3/5 text-center rounded-full',
        {
          'bg-pink-500 text-white hover:bg-pink-600 hover:text-white':
            variant === 'pink' && type === 'solid',
        },
        {
          'bg-sky-500 text-white hover:bg-sky-600 hover:text-white':
            variant === 'sky' && type === 'solid',
        },
        {
          'border border-pink-600 text-pink-600 hover:text-pink-600 dark:border-pink-500 dark:text-pink-500':
            variant === 'pink' && type === 'outline',
        },
        {
          'border border-sky-600 text-sky-600 hover:text-sky-600 dark:border-sky-500 dark:text-sky-500':
            variant === 'sky' && type === 'outline',
        },
        className
      )}
    >
      {text}
    </Link>
  )
}

Button.schema = {
  name: blockNames.Button,
  label: 'Button',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/shared/Button.tsx',

  getDefaultProps: () => ({
    text: 'Click me',
    href: '',
    isTargetBlank: false,
    variant: 'sky',
    type: 'solid',
    isBigButton: false,
  }),
  sideEditProps: [
    {
      name: 'text',
      label: 'Button text',
      type: types.SideEditPropType.Text,
    },
    {
      name: 'isBigButton',
      label: 'Full width button',
      type: types.SideEditPropType.Boolean,
    },
    {
      name: 'variant',
      label: 'Variant',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: 'sky', label: 'Sky' },
          { value: 'pink', label: 'Pink' },
        ],
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'outline', label: 'Outline' },
        ],
      },
    },
    {
      name: 'href',
      label: 'Link (external or path)',
      type: types.SideEditPropType.Text,
    },
    {
      name: 'isTargetBlank',
      label: 'Open in new window',
      type: types.SideEditPropType.Boolean,
    },
  ],
}

export default Button
