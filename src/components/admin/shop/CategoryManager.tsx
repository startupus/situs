import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Менеджер категорий Shop по аналогии с MenuManager
 * Использует ту же логику и компоненты
 */
interface CategoryData {
  id: string;
  name: string;
  alias: string;
  description?: string;
  level: number;
  orderIndex: number;
  parentId: string | null;
  isPublished: boolean;
  language: string;
  itemsCount: number;
  childrenCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateCategoryRequest {
  name: string;
  alias: string;
  description?: string;
  parentId?: string;
  productId: string;
  language: string;
  isPublished: boolean;
}

const CategoryManager: React.FC = () => {
  const { projectId, productId } = useParams<{ projectId: string; productId: string }>();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Загрузка категорий
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/api/categories?productId=${productId}`);
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
        setLastUpdate(new Date());
      } else {
        setError(result.error || 'Ошибка загрузки категорий');
      }
    } catch (err) {
      setError('Ошибка сети при загрузке категорий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadCategories();
    }
  }, [productId]);

  // Создание категории
  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      const response = await fetch('http://localhost:3002/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setShowCreateModal(false);
        loadCategories(); // Перезагружаем список
      } else {
        alert(result.error || 'Ошибка создания категории');
      }
    } catch (err) {
      alert('Ошибка сети при создании категории');
    }
  };

  // Удаление категории
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;

    try {
      const response = await fetch(`http://localhost:3002/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        loadCategories(); // Перезагружаем список
      } else {
        alert(result.error || 'Ошибка удаления категории');
      }
    } catch (err) {
      alert('Ошибка сети при удалении категории');
    }
  };

  // Подсчет статистики
  const getStats = () => {
    const totalCategories = categories.length;
    const publishedCategories = categories.filter((c) => c.isPublished).length;
    const totalItems = categories.reduce((sum, c) => sum + c.itemsCount, 0);
    const categoriesByLevel = categories.reduce(
      (acc, c) => {
        acc[c.level] = (acc[c.level] || 0) + 1;
        return acc;
      },
      {} as { [key: number]: number },
    );

    return {
      totalCategories,
      publishedCategories,
      totalItems,
      categoriesByLevel,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-body-color dark:text-dark-6">Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Ошибка</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">🛒 Категории товаров</h1>
            <p className="text-body-color dark:text-dark-6">
              Иерархическая система категоризации товаров по аналогии с меню
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-body-color dark:text-dark-6">Обновлено</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body-color dark:text-dark-6">Всего категорий</p>
              <p className="text-2xl font-bold text-dark dark:text-white">{stats.totalCategories}</p>
            </div>
            <div className="text-2xl">📂</div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body-color dark:text-dark-6">Опубликовано</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.publishedCategories}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body-color dark:text-dark-6">Всего товаров</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalItems}</p>
            </div>
            <div className="text-2xl">📦</div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-2 rounded-lg p-4 border border-stroke dark:border-dark-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body-color dark:text-dark-6">Макс. уровень</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.max(...Object.keys(stats.categoriesByLevel).map(Number), 0)}
              </p>
            </div>
            <div className="text-2xl">🌳</div>
          </div>
        </div>
      </div>

      {/* Кнопка создания */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span>➕</span>
          Создать категорию
        </button>
      </div>

      {/* Список категорий */}
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3">
        <div className="p-4 border-b border-stroke dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">Иерархический список категорий</h3>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-lg font-medium text-dark dark:text-white mb-2">Категории не найдены</h3>
            <p className="text-body-color dark:text-dark-6 mb-4">Создайте первую категорию для организации товаров</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Создать категорию
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stroke dark:divide-dark-3">
            {categories.map((category) => (
              <div key={category.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Отступ по уровню */}
                    <div style={{ marginLeft: `${(category.level - 1) * 20}px` }} className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">L{category.level}</span>
                      <h4 className="font-medium text-dark dark:text-white">{category.name}</h4>
                      <span className="text-sm text-body-color dark:text-dark-6">({category.alias})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Статистика */}
                    <div className="flex items-center gap-3 text-sm text-body-color dark:text-dark-6">
                      <span>📦 {category.itemsCount}</span>
                      <span>📂 {category.childrenCount}</span>
                      <span className={category.isPublished ? 'text-green-600' : 'text-red-600'}>
                        {category.isPublished ? '✅' : '❌'}
                      </span>
                      <span>🌍 {category.language}</span>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-body-color dark:text-dark-6 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-body-color dark:text-dark-6 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {category.description && (
                  <p
                    className="text-sm text-body-color dark:text-dark-6 mt-2"
                    style={{ marginLeft: `${(category.level - 1) * 20 + 40}px` }}
                  >
                    {category.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно создания */}
      {showCreateModal && (
        <CreateCategoryModal
          productId={productId!}
          parentCategories={categories.filter((c) => c.level < 3)} // Максимум 3 уровня
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCategory}
        />
      )}

      {/* Модальное окно редактирования */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdate={(updatedCategory) => {
            setCategories((cats) => cats.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)));
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

// Модальное окно создания категории (заглушка)
interface CreateCategoryModalProps {
  productId: string;
  parentCategories: CategoryData[];
  onClose: () => void;
  onCreate: (data: CreateCategoryRequest) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  productId,
  parentCategories,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    description: '',
    parentId: '',
    language: '*',
    isPublished: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      productId,
      parentId: formData.parentId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-2 rounded-lg w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-dark dark:text-white mb-4">Создание категории</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Название категории *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const alias = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  setFormData((prev) => ({ ...prev, name, alias }));
                }}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Alias (для URL)</label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData((prev) => ({ ...prev, alias: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white focus:border-primary focus:outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Родительская категория</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none"
              >
                <option value="">Корневая категория (1 уровень)</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {'  '.repeat(cat.level - 1)}
                    {cat.name} (L{cat.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                className="w-4 h-4 text-primary border-stroke dark:border-dark-3 rounded focus:ring-primary"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-dark dark:text-white">
                Опубликовать категорию
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-body-color dark:text-dark-6 hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Модальное окно редактирования (заглушка)
interface EditCategoryModalProps {
  category: CategoryData;
  onClose: () => void;
  onUpdate: (category: CategoryData) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-2 rounded-lg p-6 w-full max-w-md">
        <div className="text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-medium text-dark dark:text-white mb-2">Редактирование: {category.name}</h3>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Функция редактирования будет реализована аналогично EditMenuItemModal.
          </p>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
