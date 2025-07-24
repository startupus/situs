import * as React from 'react'
import { Repeater } from 'redaktus/core'
import * as types from 'redaktus/types'

import classNames from 'classnames'
import Container, { Size } from '../layout/Container'
import Section, { Border } from '../layout/Section'
import { bgColors } from '../colors'
import blockNames from '../blockNames'
import {
  BackgroundColorsSideEditProps,
  ContainerSizeSideEditProps,
} from 'website/LayoutSideProps'

export interface TeamProps {
  bg?: { color: string; className: string }
  width?: Size
}

const Team: types.Brick<TeamProps> = ({
  bg = bgColors.white.value,
  width = 'lg',
}) => {
  return (
    <Section bg={bg}>
      <Container
        size={width}
        className={classNames(
          'py-12 flex flex-wrap justify-center items-center'
        )}
      >
        <div className="flex w-full mx-auto mt-10 flex-wrap justify-center mb-6 w- max-w-4xl">
          <Repeater propName="teamItem" />
        </div>
      </Container>
    </Section>
  )
}
Team.schema = {
  name: blockNames.Team,
  label: 'Team',
  category: 'rb-ui website',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Team/Team.tsx',

  getDefaultProps: () => ({
    bg: {
      color: '#fff',
      className: 'bg-white dark:bg-gray-900',
    },
    borderTop: 'none',
    borderBottom: 'none',
    width: 'lg',
    teamItem: [
      {
        memberName: 'Matteo Frana',
        duty: 'Frontend Designer',
        picture: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
        },
        twitter: '',
        github: '',
        linkedin: '',
        role: 'Frontend Designer',
      },
      {
        memberName: 'Dario Ronzoni',
        role: 'Backend Designer',
        twitter: '',
        github: '',
        linkedin: '',
        picture: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
        },
      },
      {
        memberName: 'Cecilia Panicali',
        role: 'Frontend Designer',
        twitter: '',
        github: '',
        linkedin: '',
        picture: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
        },
      },
      {
        memberName: 'Roberta Ferrari',
        role: 'Marketing',
        twitter: '',
        github: '',
        linkedin: '',
        picture: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
        },
      },
      {
        memberName: 'Matteo Frana',
        role: 'Frontend Designer',
        twitter: '',
        github: '',
        linkedin: '',
        picture: {
          src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet:
            'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
        },
      },
    ],
  }),
  repeaterItems: [
    {
      name: 'teamItem',
      itemType: blockNames.TeamItem,
      itemLabel: 'Member',
      min: 0,
      max: 5,
    },
  ],
  sideEditProps: [
    {
      groupName: 'Layout',
      defaultOpen: true,
      props: [BackgroundColorsSideEditProps, ContainerSizeSideEditProps],
    },
  ],
}
export default Team
