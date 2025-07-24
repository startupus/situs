import * as React from 'react'
import { Image, Text } from 'redaktus/core'
import * as types from 'redaktus/types'
import { FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi'

import blockNames from '../blockNames'

export interface TeamItemProps {
  twitter?: string
  github?: string
  linkedin?: string
}

const TeamItem: types.Brick<TeamItemProps> = ({
  twitter,
  github,
  linkedin,
}) => {
  return (
    <div className="flex flex-col sm:w-1/3 w-1/2 p-6">
      <Image
        propName="picture"
        alt="team-item"
        // containerClassName="w-12 h-12 lg:w-16 lg:h-16 mx-4 mb-8 bg-white rounded-full p-2 shadow-md flex justify-center items-center"
        // imageClassName="w-6 h-6 lg:w-10 lg:h-10"
        imageClassName="w-24 h-24 rounded-full"
        renderWrapper={({ children }) => (
          <div className="w-24 h-24 mb-6 flex justify-center items-center bg-white rounded-full shadow-xl mx-auto">
            {children}
          </div>
        )}
      />
      <div className="text-center dark:text-gray-200 text-gray-500">
        <Text
          renderBlock={(props) => (
            <div className="text-sm font-bold">{props.children}</div>
          )}
          placeholder="Member name..."
          propName="memberName"
        />
        <Text
          renderBlock={(props) => (
            <div className="text-xs">{props.children}</div>
          )}
          placeholder="Role"
          propName="role"
        />
      </div>

      {(twitter || linkedin || github) && (
        <div className="flex flex-row justify-center space-x-2 mt-2 dark:text-sky-300 text-sky-400 ">
          {twitter && (
            <div>
              <a
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiTwitter />
              </a>
            </div>
          )}
          {linkedin && (
            <div>
              <a
                href={`https://linkedin.com/${linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiLinkedin />
              </a>
            </div>
          )}
          {github && (
            <div>
              <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

TeamItem.schema = {
  name: blockNames.TeamItem,
  label: 'Team Item',
  category: 'rb-ui website',
  hideFromAddMenu: true,
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Team/TeamItem.tsx',

  getDefaultProps: () => ({
    bg: {
      color: '#fff',
      className: 'bg-white dark:bg-gray-900',
    },
    borderTop: 'none',
    borderBottom: 'none',
    width: 'lg',
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
  }),
  sideEditProps: [
    {
      groupName: 'Social Media',
      defaultOpen: true,
      props: [
        {
          name: 'twitter',
          label: 'Twitter UserName',
          type: types.SideEditPropType.Text,
        },
        {
          name: 'linkedin',
          label: 'Linkedin UserName',
          type: types.SideEditPropType.Text,
        },
        {
          name: 'github',
          label: 'Github UserName',
          type: types.SideEditPropType.Text,
        },
      ],
    },
  ],
}

export default TeamItem
