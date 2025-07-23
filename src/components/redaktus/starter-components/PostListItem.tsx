import React from 'react'
import { Image } from 'redaktus/frontend'
import * as types from 'redaktus/types'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useTheme } from '../../../hooks/useTheme'

interface PostListItemProps {
  title: string
  href: string
  content: string
  author: types.Author
  date: string
  featuredImg?: types.IImageSource
}

const PostListItem: React.FC<PostListItemProps> = ({
  title,
  href,
  content,
  author,
  date,
  featuredImg,
}) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="flex flex-col hover:-translate-y-2 transition-transform duration-300">
      <Image
        readonly
        source={featuredImg}
        alt="Blog article featured image"
        imageClassName="aspect-video object-cover rounded-xs"
      />

      {/* justify-between */}
      <div className="flex flex-col h-full">
        <div className="my-6">
          <h3 className={`font-bold text-xl transition-colors duration-200 ${
            resolvedTheme === 'dark' ? '!text-gray-100' : '!text-gray-900'
          }`}>{title}</h3>
          <p className={`mt-2 leading-6 transition-colors duration-200 ${
            resolvedTheme === 'dark' ? '!text-gray-100' : '!text-gray-800'
          }`}>
            {content}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <img
            src={author.avatarUrl}
            alt={author.firstName + ' ' + author.lastName}
            className="w-8 rounded-full"
          />
          <div>
            <div className={`text-sm transition-colors duration-200 ${
              resolvedTheme === 'dark' ? '!text-gray-100' : '!text-gray-800'
            }`}>
              {author.firstName} {author.lastName}
            </div>
            <div className={`text-xs transition-colors duration-200 ${
              resolvedTheme === 'dark' ? '!text-gray-400' : '!text-gray-500'
            }`}>
              {dayjs(date).format('DD MMM YYYY')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostListItem
