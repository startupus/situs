import React, { useState } from 'react';
import { CreateProductData, ProjectProduct } from '../../../types/project';

interface CreateProductModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: (product: ProjectProduct) => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ 
  projectId, 
  onClose, 
  onSuccess 
}) => {
  const [productData, setProductData] = useState<CreateProductData>({
    name: '',
    description: '',
    type: 'website'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productTypes = [
    { 
      id: 'website', 
      name: 'Сайт', 
      description: 'Корпоративный сайт с редактором', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
          <path d="M8 8H16V10H8V8ZM8 12H16V14H8V12Z"/>
        </svg>
      )
    },
    { 
      id: 'store', 
      name: 'Магазин', 
      description: 'Интернет-магазин с каталогом товаров', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M3 3V5H4V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V5H21V3H3ZM6 5H18V19H6V5Z"/>
          <path d="M8 7V9H9V7H8ZM12 7V9H13V7H12Z"/>
        </svg>
      )
    },
    { 
      id: 'school', 
      name: 'Школа', 
      description: 'Образовательная платформа', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
        </svg>
      )
    },
    { 
      id: 'chatbot', 
      name: 'Чатбот', 
      description: 'Бот для общения с клиентами', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
          <path d="M8 9.5C8 8.67 8.67 8 9.5 8S11 8.67 11 9.5S10.33 11 9.5 11S8 10.33 8 9.5ZM14.5 8C15.33 8 16 8.67 16 9.5S15.33 11 14.5 11S13 10.33 13 9.5S13.67 8 14.5 8Z"/>
          <path d="M12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z"/>
        </svg>
      )
    },
    { 
      id: 'blog', 
      name: 'Блог', 
      description: 'Платформа для публикации статей', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
          <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z"/>
          <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z"/>
        </svg>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Здесь будет API вызов для создания продукта
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания продукта');
      }

      const newProduct = await response.json();
      onSuccess(newProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-2 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-dark-3">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            Создать новый продукт
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Название продукта */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Название продукта *
            </label>
            <input
              type="text"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              placeholder="Введите название продукта"
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Описание
            </label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              placeholder="Краткое описание продукта"
              rows={3}
              className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Тип продукта */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-3">
              Тип продукта *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {productTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    productData.type === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-stroke dark:border-dark-3 hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="productType"
                    value={type.id}
                    checked={productData.type === type.id}
                    onChange={(e) => setProductData({ ...productData, type: e.target.value as any })}
                    className="sr-only"
                  />
                  <div className="text-primary flex-shrink-0">{type.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-dark dark:text-white mb-1">
                      {type.name}
                    </div>
                    <div className="text-sm text-body-color dark:text-dark-6">
                      {type.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 bg-gray-100 dark:bg-dark-3 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-4 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !productData.name}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Создание...' : 'Создать продукт'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
