import React, { useState, useEffect } from 'react';
import { FiTag, FiStar, FiX } from 'react-icons/fi';
import {
  WebCategoryData,
  getWebsiteCategories,
  assignPageCategories,
  setPagePrimaryCategory,
} from '../../../services/projectApi';

interface PageCategorySelectorProps {
  projectId: string;
  pageId?: string;
  selectedCategories?: string[];
  primaryCategoryId?: string;
  onChange?: (categories: string[], primaryId?: string) => void;
  disabled?: boolean;
}

export const PageCategorySelector: React.FC<PageCategorySelectorProps> = ({
  projectId,
  pageId,
  selectedCategories = [],
  primaryCategoryId,
  onChange,
  disabled = false,
}) => {
  const [categories, setCategories] = useState<WebCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка категорий
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getWebsiteCategories(projectId, false);
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [projectId]);

  // Фильтрация категорий по поиску
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Получение категории по ID
  const getCategoryById = (id: string) => categories.find((cat) => cat.id === id);

  // Добавление категории
  const handleAddCategory = async (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) return;

    const newSelected = [...selectedCategories, categoryId];
    const newPrimary = primaryCategoryId || categoryId; // Первая добавленная становится основной

    if (onChange) {
      onChange(newSelected, newPrimary);
    }

    // Если есть pageId, сохраняем на сервере
    if (pageId) {
      try {
        await assignPageCategories(pageId, { add: [categoryId] });
        if (!primaryCategoryId) {
          await setPagePrimaryCategory(pageId, categoryId);
        }
      } catch (error) {
        console.error('Failed to assign category:', error);
      }
    }

    setSearchTerm('');
    setShowDropdown(false);
  };

  // Удаление категории
  const handleRemoveCategory = async (categoryId: string) => {
    if (categoryId === primaryCategoryId) {
      alert('Нельзя удалить основную категорию. Сначала выберите другую основную категорию.');
      return;
    }

    const newSelected = selectedCategories.filter((id) => id !== categoryId);

    if (onChange) {
      onChange(newSelected, primaryCategoryId);
    }

    // Если есть pageId, сохраняем на сервере
    if (pageId) {
      try {
        await assignPageCategories(pageId, { remove: [categoryId] });
      } catch (error) {
        console.error('Failed to remove category:', error);
      }
    }
  };

  // Установка основной категории
  const handleSetPrimary = async (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      alert('Категория должна быть назначена странице, чтобы стать основной.');
      return;
    }

    if (onChange) {
      onChange(selectedCategories, categoryId);
    }

    // Если есть pageId, сохраняем на сервере
    if (pageId) {
      try {
        await setPagePrimaryCategory(pageId, categoryId);
      } catch (error) {
        console.error('Failed to set primary category:', error);
      }
    }
  };

  // Построение пути категории
  const getCategoryPath = (category: WebCategoryData): string => {
    const path = [category.name];
    let current = category;

    while (current.parentId) {
      const parent = getCategoryById(current.parentId);
      if (!parent) break;
      path.unshift(parent.name);
      current = parent;
    }

    return path.join(' > ');
  };

  if (loading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Загрузка категорий...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Выбранные категории */}
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Назначенные категории</label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = getCategoryById(categoryId);
              if (!category) return null;

              const isPrimary = categoryId === primaryCategoryId;

              return (
                <div
                  key={categoryId}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    isPrimary
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <FiTag className="w-3 h-3" />
                  <span>{category.name}</span>
                  {isPrimary && (
                    <FiStar className="w-3 h-3 text-blue-600 dark:text-blue-400" title="Основная категория" />
                  )}
                  {!isPrimary && !disabled && (
                    <button
                      onClick={() => handleSetPrimary(categoryId)}
                      className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Сделать основной"
                    >
                      <FiStar className="w-3 h-3" />
                    </button>
                  )}
                  {!disabled && (
                    <button
                      onClick={() => handleRemoveCategory(categoryId)}
                      className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      title="Удалить"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Добавление категорий */}
      {!disabled && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Добавить категорию</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Поиск категорий..."
            />

            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCategories.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Категории не найдены' : 'Нет доступных категорий'}
                  </div>
                ) : (
                  filteredCategories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    const isPrimary = category.id === primaryCategoryId;

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleAddCategory(category.id)}
                        disabled={isSelected}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                          isSelected ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {getCategoryPath(category)} • /{category.slug}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {isPrimary && <FiStar className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                          {isSelected && <span className="text-xs text-green-600 dark:text-green-400">Выбрана</span>}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Закрытие dropdown при клике вне */}
          {showDropdown && <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(false)} />}
        </div>
      )}

      {/* Подсказка об основной категории */}
      {selectedCategories.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <FiStar className="w-3 h-3 inline mr-1" />
          Основная категория используется для построения URL страницы.
          {!primaryCategoryId && selectedCategories.length > 1 && (
            <span className="text-amber-600 dark:text-amber-400 ml-1">Выберите основную категорию.</span>
          )}
        </div>
      )}
    </div>
  );
};
