import React from 'react';
import { FaEye, FaEdit, FaTimes } from 'react-icons/fa';

interface PreviewModeProps {
  page: any;
  isPreview: boolean;
  onTogglePreview: () => void;
  className?: string;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ page, isPreview, onTogglePreview, className = '' }) => {
  // Функция для рендеринга блоков в режиме предварительного просмотра
  const renderPreviewBlock = (block: any) => {
    const { type, props } = block;

    // Простой рендеринг без элементов редактирования
    switch (type) {
      case 'hero-unit':
        return (
          <div className="py-12 px-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h1 className="text-4xl font-bold mb-4">{props.title || 'Welcome'}</h1>
            <p className="text-xl mb-6">{props.text || 'Create beautiful content'}</p>
            {props.imageUrl && (
              <img src={props.imageUrl} alt="Hero" className="mx-auto max-w-md rounded-lg shadow-lg" />
            )}
          </div>
        );

      case 'text-block':
        return (
          <div className={`py-6 px-4 ${getAlignmentClass(props.alignment)}`}>
            <div className={`max-w-4xl mx-auto ${getFontSizeClass(props.fontSize)}`}>
              {props.content || 'Type your text here...'}
            </div>
          </div>
        );

      case 'heading-block':
        const HeadingTag = props.level || 'h2';
        return (
          <div className={`py-4 ${getAlignmentClass(props.alignment)}`}>
            <HeadingTag className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {props.text || 'Heading Text'}
            </HeadingTag>
          </div>
        );

      case 'image-block':
        return (
          <div className={`py-6 ${getAlignmentClass(props.alignment)}`}>
            <div className="max-w-4xl mx-auto">
              {props.imageUrl ? (
                <div className="relative">
                  <img
                    src={props.imageUrl}
                    alt={props.alt || 'Image'}
                    className={`mx-auto ${getImageSizeClass(props.size)} rounded-lg shadow-md`}
                  />
                  {props.caption && (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{props.caption}</p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
                  No image selected
                </div>
              )}
            </div>
          </div>
        );

      case 'quote-block':
        return (
          <div className="py-6 px-4">
            <div className="max-w-4xl mx-auto">
              <blockquote className="py-6 px-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                  "{props.text || 'Quote text here...'}"
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">— {props.author || 'Author Name'}</span>
                  {props.source && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{props.source}</span>
                    </>
                  )}
                </div>
              </blockquote>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-4 px-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-gray-500 dark:text-gray-400">Block type "{type}" not supported in preview</p>
          </div>
        );
    }
  };

  // Вспомогательные функции для стилизации
  const getAlignmentClass = (alignment: string = 'left') => {
    switch (alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const getFontSizeClass = (size: string = 'medium') => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getImageSizeClass = (size: string = 'medium') => {
    switch (size) {
      case 'small':
        return 'max-w-sm';
      case 'large':
        return 'max-w-2xl';
      case 'full':
        return 'w-full';
      default:
        return 'max-w-lg';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Кнопка переключения режима */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={onTogglePreview}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow-lg transition-colors ${
            isPreview ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
        >
          {isPreview ? (
            <>
              <FaEdit size={14} />
              <span>Edit Mode</span>
            </>
          ) : (
            <>
              <FaEye size={14} />
              <span>Preview Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Контент */}
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {isPreview ? (
          // Режим предварительного просмотра
          <div className="preview-content">
            {page.content && page.content.length > 0 ? (
              page.content.map((block: any, index: number) => (
                <div key={block.id || index}>{renderPreviewBlock(block)}</div>
              ))
            ) : (
              <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FaEye className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No content to preview</h3>
                  <p className="text-sm">Add some blocks to see them in preview mode</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Обычный режим редактирования
          <div className="edit-content">
            {/* Здесь будет обычный контент редактора */}
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Switch to preview mode to see how your page will look
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewMode;
