import classNames from 'classnames'
import React from 'react'
import { Repeater } from 'redaktus/core'
import * as types from 'redaktus/types'
import {
  BackgroundColorsSideEditProps,
  ContainerSizeSideEditProps,
} from 'website/LayoutSideProps'
import blockNames from '../blockNames'
import Container, { Size } from '../layout/Container'
import Section, { Border } from '../layout/Section'
export interface DocumentsProps {
  bg?: { color: string; className: string }
  width: Size
}

const Documents: types.Brick<DocumentsProps> = ({ bg, width }) => {
  return (
    <Section bg={bg}>
      <Container
        size={width}
        className={classNames(
          'py-12 flex flex-wrap justify-center items-center'
        )}
      >
        <Repeater
          propName="files"
          renderWrapper={(items) => (
            <ul className="w-full p-6 grid grid-cols-3 gap-6 ">{items}</ul>
          )}
          renderItemWrapper={(item) => <li>{item}</li>}
        />
      </Container>
    </Section>
  )
}

Documents.schema = {
  name: blockNames.Documents,
  label: 'Documents',
  category: 'rb-ui website',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Documents/Documents.tsx',
  getDefaultProps: () => ({
    files: [
      {
        file: {
          name: 'Redaktus Setup Instructions',
          size: 234.321,
          url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
        },
      },
      {
        file: {
          name: 'Redaktus License',
          size: 12.456,
          url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
        },
      },
      {
        file: {
          name: 'Redaktus Roadmap',
          size: 98.765,
          url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
        },
      },
    ],
  }),
  sideEditProps: [BackgroundColorsSideEditProps, ContainerSizeSideEditProps],
  repeaterItems: [
    {
      name: 'files',
      itemType: blockNames.Document,
      itemLabel: 'Document',
    },
  ],
}

export default Documents
