import React from 'react'
import Link from 'next/link'
import { useEditorTheme } from '../editor-theme-context'

interface TagListItemProps {
  tag: string
}

const TagListItem: React.FC<TagListItemProps> = ({ tag }) => {
  const { isEditorDarkMode } = useEditorTheme();
  
  return (
    <Link
      href={`/blog/tag/${tag}`}
      className={`inline-block text-sm mr-2 mb-2 transform transition-all duration-200 hover:-translate-y-0.5 rounded-md py-1.5 px-2.5 ${
        isEditorDarkMode 
          ? '!text-gray-100 !bg-white/20 hover:!bg-sky-500/40 hover:!text-white'
          : '!text-sky-900 !bg-sky-100 hover:!bg-sky-200'
      }`}
    >
      {tag}
    </Link>
  )
}

export default TagListItem
