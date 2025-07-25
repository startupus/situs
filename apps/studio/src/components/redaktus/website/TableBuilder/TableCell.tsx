import React from 'react'
import { Text } from 'redaktus/core'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'

export interface TableCellProps {
  isHeader: boolean
}

const TableCell: types.Brick<TableCellProps> = ({ isHeader }) => {
  return isHeader ? (
    <th className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-left">
      <Text
        propName="cellText"
        placeholder="Insert text"
        renderBlock={({ children }) => (
          <span className="title-font tracking-wider font-medium text-gray-900 dark:text-white text-sm">
            {children}
          </span>
        )}
      />
    </th>
  ) : (
    <td className="px-4 py-3 border-b-2 border-gray-200">
      <Text
        propName="cellText"
        placeholder="Insert text"
        renderBlock={({ children }) => <span>{children}</span>}
      />
    </td>
  )
}

TableCell.schema = {
  name: blockNames.TableCell,
  label: 'Cell',
  category: 'Multilevel',
  hideFromAddMenu: true,

  // Defaults when a new brick is added
  getDefaultProps: () => ({
    cellText: 'Cell text default',
  }),

  // Sidebar Edit controls for props
  sideEditProps: [],
}

export default TableCell
