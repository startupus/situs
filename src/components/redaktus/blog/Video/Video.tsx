import React from 'react'
import * as types from 'redaktus/types'
import blockNames from '../blockNames'
import Container from '../layout/Container'
import Section from '../layout/Section'

const videoUrlPrefix: { [key: string]: string } = Object.freeze({
  youtube: 'https://www.youtube.com/embed/',
  vimeo: 'https://player.vimeo.com/video/',
})

export interface VideoProps {
  url: string
  platform: string
}

const Video: types.Brick<VideoProps> = ({ platform, url }) => {
  return (
    <Section>
      <Container>
        <div className="aspect-video">
          <iframe
            key="video iframe"
            width="100%"
            height="100%"
            src={`${videoUrlPrefix[platform]}${url}?rel=0`}
          />
        </div>
      </Container>
    </Section>
  )
}
Video.schema = {
  name: blockNames.Video,
  label: 'Video',
  category: 'rb-ui blog',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Video/Video.tsx',
  getDefaultProps: () => ({
    url: 'A60xWr-nqv0',
    platform: 'youtube',
  }),
  sideEditProps: [
    {
      name: 'platform',
      label: 'Video platform',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: 'youtube', label: 'YouTube' },
          { value: 'vimeo', label: 'Vimeo' },
        ],
      },
    },
    {
      name: 'url',
      label: 'Video ID (i.e. "A60xWr-nqv0")',
      type: types.SideEditPropType.Text,
    },
  ],
}
export default Video
