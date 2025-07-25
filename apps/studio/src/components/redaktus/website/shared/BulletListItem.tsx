import * as React from 'react'
import classNames from 'classnames'
import { FiCheck } from 'react-icons/fi'
import { Text } from 'redaktus/core'
import * as types from 'redaktus/types'
import { bulletColors } from '../colors'
import blockNames from '../blockNames'
import { BulletColorsSideEditProps } from 'website/LayoutSideProps'

export interface BulletListItemProps {
  color: { color: string; className: string; className2: string }
  className: string
  attributes: string
}

const BulletListItem: types.Brick<BulletListItemProps> = ({
  color = bulletColors.pinkLight.value,
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex justify-start items-center py-2 leading-tight',
        className
      )}
    >
      <div
        className={classNames(
          'flex justify-center items-center w-5 h-5 rounded-full mr-4 text-sm',
          color.className
        )}
        style={{ minWidth: '1.25rem' }}
      >
        <FiCheck />
      </div>
      <Text
        propName="text"
        renderBlock={(props) => (
          <span
            className={classNames('dark:text-gray-100', color.className2)}
            {...props.attributes}
          >
            {props.children}
          </span>
        )}
        placeholder="Type..."
      />
    </div>
  )
}

BulletListItem.schema = {
  name: blockNames.BulletListItem,
  label: 'List item',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/shared/BulletListItem.tsx',

  getDefaultProps: () => ({
    color: bulletColors.pinkLight.value,
    text: 'New item',
  }),
  sideEditProps: [BulletColorsSideEditProps],
}

export default BulletListItem
