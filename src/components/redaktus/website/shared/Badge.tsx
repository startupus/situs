import * as React from 'react'
import classNames from 'classnames'
import { badgeColors } from '../colors'

import { Text } from 'redaktus/core'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'
import { BadgeColorsSideEditProps } from 'website/LayoutSideProps'

export interface BadgeProps {
  color?: { color: string; className: string }
  className?: string
}

const Badge: types.Brick<BadgeProps> = ({
  color = badgeColors.gray.value,
  className,
}) => {
  return (
    <div className="flex justify-center items-center">
      <Text
        renderBlock={(props) => (
          <span
            className={classNames(
              'text-sm font-black uppercase text-center',
              color.className,
              className
            )}
            style={{ letterSpacing: '0.35em' }}
          >
            {props.children}
          </span>
        )}
        placeholder="Badge..."
        propName="text"
      />
    </div>
  )
}

Badge.schema = {
  name: blockNames.Badge,
  label: 'Badge',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/shared/Badge.tsx',
  getDefaultProps: () => ({
    text: 'Special',
    color: badgeColors.gray.value,
  }),
  sideEditProps: [BadgeColorsSideEditProps],
}

export default Badge
