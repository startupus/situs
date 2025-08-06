import React from 'react'
import HeroBlock from './blocks/HeroBlock'
import TestimonialBlock from './blocks/TestimonialBlock'
import ServicesBlock from './blocks/ServicesBlock'
// Оригинальный блок из React Pro Components
import { Hero1OriginalBlock } from './blocks/Hero1OriginalBlock'

interface RedaktusPageViewerProps {
  page: any
  main?: boolean
  className?: string
  onBlockUpdate?: (blockId: string, newProps: any) => void
  onBlockDelete?: (blockId: string) => void
}

// Реестр блоков - оригинальные React Pro Components + TailGrids
const blockRegistry: Record<string, React.ComponentType<any>> = {
  // Оригинальный блок из React Pro Components
  'hero-1-original': Hero1OriginalBlock,
  
  // Старые блоки для совместимости
  'hero-block': HeroBlock,
  'testimonial-block': TestimonialBlock,
  'services-block': ServicesBlock,
  // Заглушки для остальных блоков
  'hero-split': () => <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">Hero Split Block (Coming Soon)</div>,
  'hero-video': () => <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">Hero Video Block (Coming Soon)</div>,
  'list-block': () => <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">List Block (Coming Soon)</div>,
  'gallery-block': () => <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">Gallery Block (Coming Soon)</div>,
  'video-block': () => <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">Video Block (Coming Soon)</div>,
  'container-block': () => <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">Container Block (Coming Soon)</div>,
  'columns-block': () => <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">Columns Block (Coming Soon)</div>
}

const RedaktusPageViewer: React.FC<RedaktusPageViewerProps> = ({ page, main = false, className = '', onBlockUpdate, onBlockDelete }) => {
  if (!page || !page.content) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">Пустая страница</h3>
          <p className="text-sm">Перетащите блоки сюда для создания контента</p>
        </div>
      </div>
    )
  }

  const renderBlock = (brick: any, index: number) => {
    const BlockComponent = blockRegistry[brick.type]
    
    if (!BlockComponent) {
      return (
        <div key={brick.id || index} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-2">Неизвестный блок: {brick.type}</div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-700">Этот тип блока не поддерживается</p>
          </div>
        </div>
      )
    }

    const handleBlockUpdate = (newProps: any) => {
      onBlockUpdate?.(brick.id, newProps)
    }

    const handleBlockDelete = () => {
      onBlockDelete?.(brick.id)
    }

    return (
      <div key={brick.id || index} className="relative group">
        {/* Индикатор редактирования */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {brick.type}
          </div>
        </div>
        
        {/* Кнопки управления блоком */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-1">
          <button className="bg-gray-500 text-white text-xs px-2 py-1 rounded hover:bg-gray-600">
            ⬆️
          </button>
          <button className="bg-gray-500 text-white text-xs px-2 py-1 rounded hover:bg-gray-600">
            ⬇️
          </button>
          <button 
            onClick={handleBlockDelete}
            className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
          >
            🗑️
          </button>
        </div>

        {/* Сам блок с изоляцией стилей */}
        <div className="block-container border-0">
          <div className="site-content">
            <BlockComponent 
              {...brick.props} 
              onUpdate={handleBlockUpdate}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {page.content.length === 0 ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-medium mb-2">Пустая страница</h3>
            <p className="text-sm">Перетащите блоки сюда для создания контента</p>
          </div>
        </div>
      ) : (
        <div className="space-y-0">
          {page.content.map((brick: any, index: number) => renderBlock(brick, index))}
        </div>
      )}
    </div>
  )
}

export default RedaktusPageViewer 