import React, { useState } from 'react';
import { FiCode, FiCopy, FiEye, FiEyeOff, FiInfo } from 'react-icons/fi';

interface ComponentDisplayProps {
  id: string;
  title: string;
  component: React.ReactNode;
  category: string;
  subcategory: string;
  filePath?: string;
  description?: string;
}

const ComponentDisplay: React.FC<ComponentDisplayProps> = ({
  id,
  title,
  component,
  category,
  subcategory,
  filePath,
  description
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyFilePath = () => {
    if (filePath) {
      navigator.clipboard.writeText(filePath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 overflow-hidden">
      {/* Header с ID и метаинформацией */}
      <div className="border-b border-stroke dark:border-dark-3 bg-gray-50 dark:bg-dark-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              {title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded font-mono">
                {category}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                {subcategory}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-gray-500 hover:text-primary transition-colors"
              title="Показать информацию"
            >
              <FiInfo className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ID и путь к файлу */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">ID:</span>
            <code className="px-2 py-1 bg-gray-100 dark:bg-dark text-xs font-mono text-dark dark:text-white rounded">
              {id}
            </code>
            <button
              onClick={copyId}
              className="p-1 text-gray-400 hover:text-primary transition-colors"
              title="Копировать ID"
            >
              <FiCopy className="w-3 h-3" />
            </button>
            {copied && (
              <span className="text-xs text-green-600">Скопировано!</span>
            )}
          </div>
          
          {filePath && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Файл:</span>
              <code className="px-2 py-1 bg-gray-100 dark:bg-dark text-xs font-mono text-dark dark:text-white rounded">
                {filePath}
              </code>
              <button
                onClick={copyFilePath}
                className="p-1 text-gray-400 hover:text-primary transition-colors"
                title="Копировать путь к файлу"
              >
                <FiCopy className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Дополнительная информация */}
        {showInfo && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Информация о компоненте
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p><strong>Категория:</strong> {category}</p>
              <p><strong>Подкатегория:</strong> {subcategory}</p>
              <p><strong>ID:</strong> {id}</p>
              {filePath && <p><strong>Файл:</strong> {filePath}</p>}
              {description && <p><strong>Описание:</strong> {description}</p>}
              <p><strong>Поддержка темы:</strong> Светлая/Темная</p>
              <p><strong>Responsive:</strong> Да</p>
              <p><strong>TypeScript:</strong> Да</p>
            </div>
          </div>
        )}
      </div>

      {/* Компонент */}
      <div className="p-6">
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          {component}
        </div>
      </div>
    </div>
  );
};

export default ComponentDisplay;