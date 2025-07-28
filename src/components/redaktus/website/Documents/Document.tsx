import classNames from 'classnames'
import React from 'react'
import { File } from 'redaktus/core'
import * as types from 'redaktus/types'
import { FiFile, FiFilePlus } from 'react-icons/fi'
import blockNames from '../blockNames'

export interface DocumentProps {
  color?: { color: string; className: string }
}

const Document: types.Brick<DocumentProps> = ({ color }) => {
  return (
    <div
      className={classNames(
        'flex justify-center bg-gray-50 border border-gray-200 rounded items-center py-2',
        color?.className
      )}
    >
      <File
        propName="file"
        renderBlock={(file: any) => {
          return file ? (
            <div className="flex font-semibold h-full items-center">
              <FiFile className="mr-2" />
              {file.name} - {file.size.toFixed(2)}MB
            </div>
          ) : (
            <div className="flex font-semibold h-full items-center">
              <FiFilePlus className="mr-2" />
              Add document
            </div>
          )
        }}
      />
    </div>
  )
}

Document.schema = {
  name: blockNames.Document,
  label: 'Document',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Documents/Document.tsx',
  getDefaultProps: () => ({
    file: {
      name: 'Redaktus Website.pdf',
      size: 521.929,
      url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
    },
  }),
  sideEditProps: [
    {
      name: 'color',
      label: 'Color',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Color,
        options: [
          {
            value: {
              color: '#c6f6d5',
              className: 'bg-green-100 dark:bg-gray-800',
            },
            label: 'Green',
          },
        ],
      },
    },
  ],
}
export default Document
