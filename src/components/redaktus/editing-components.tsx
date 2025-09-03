import React, { useState } from 'react';

// RichText компонент для редактирования форматированного текста
interface RichTextProps {
  propName: string;
  placeholder?: string;
  allowedFeatures?: string[];
  renderBlock?: (props: any) => React.ReactElement;
  renderHighlight?: (props: any) => React.ReactElement;
  renderLink?: (props: any) => React.ReactElement;
  renderCode?: (props: any) => React.ReactElement;
  value?: string;
  onChange?: (value: string) => void;
}

export const RichText: React.FC<RichTextProps> = ({
  propName,
  placeholder = 'Type text...',
  allowedFeatures = [],
  renderBlock,
  renderHighlight,
  renderLink,
  renderCode,
  value = '',
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange?.(editValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full p-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          autoFocus
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
            ✓
          </button>
          <button onClick={handleCancel} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
            ✕
          </button>
        </div>
      </div>
    );
  }

  const content = value || placeholder;

  if (renderBlock) {
    return renderBlock({
      children: content,
      onDoubleClick: handleDoubleClick,
      className: '',
    });
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="">
      {content}
    </div>
  );
};

// Text компонент для редактирования простого текста
interface TextProps {
  propName: string;
  placeholder?: string;
  renderBlock?: (props: any) => React.ReactElement;
  value?: string;
  onChange?: (value: string) => void;
}

export const Text: React.FC<TextProps> = ({
  propName,
  placeholder = 'Type text...',
  renderBlock,
  value = '',
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange?.(editValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full p-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          autoFocus
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
            ✓
          </button>
          <button onClick={handleCancel} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
            ✕
          </button>
        </div>
      </div>
    );
  }

  const content = value || placeholder;

  if (renderBlock) {
    return renderBlock({
      children: content,
      onDoubleClick: handleDoubleClick,
      className: '',
    });
  }

  return (
    <span onDoubleClick={handleDoubleClick} className="">
      {content}
    </span>
  );
};

// Image компонент для редактирования изображений
interface ImageProps {
  propName: string;
  alt?: string;
  maxWidth?: number;
  aspectRatio?: number;
  imageClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const Image: React.FC<ImageProps> = ({
  propName,
  alt = 'Image',
  maxWidth = 800,
  aspectRatio,
  imageClassName = '',
  value = '',
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange?.(editValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          type="url"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full p-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter image URL..."
          autoFocus
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
            ✓
          </button>
          <button onClick={handleCancel} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-blue-50 ${imageClassName}`}
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-1">🖼️</div>
          <div className="text-xs">Двойной клик для добавления изображения</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={value}
      alt={alt}
      onDoubleClick={handleDoubleClick}
      className={`cursor-pointer hover:opacity-80 transition-opacity ${imageClassName}`}
      style={{
        maxWidth: maxWidth,
        aspectRatio: aspectRatio,
      }}
    />
  );
};

// Repeater компонент для повторяющихся блоков
interface RepeaterProps {
  propName: string;
  renderWrapper?: (items: React.ReactNode) => React.ReactElement;
  children?: React.ReactNode;
}

export const Repeater: React.FC<RepeaterProps> = ({ propName, renderWrapper, children }) => {
  if (renderWrapper) {
    return renderWrapper(children);
  }

  return <div className="space-y-2">{children}</div>;
};
