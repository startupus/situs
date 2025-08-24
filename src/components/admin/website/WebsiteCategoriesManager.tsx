import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMove, FiEye, FiEyeOff, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { 
  WebCategoryData, 
  CreateWebCategoryRequest, 
  UpdateWebCategoryRequest,
  getWebsiteCategories,
  createWebsiteCategory,
  updateWebsiteCategory,
  deleteWebsiteCategory,
  reorderWebsiteCategories
} from '../../../services/projectApi';

interface WebsiteCategoriesManagerProps {
  projectId: string;
}

interface CategoryTreeNode extends WebCategoryData {
  children: CategoryTreeNode[];
  isExpanded?: boolean;
}

export const WebsiteCategoriesManager: React.FC<WebsiteCategoriesManagerProps> = ({ projectId }) => {
  const [categories, setCategories] = useState<WebCategoryData[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<WebCategoryData | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);

  // Загрузка категорий
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getWebsiteCategories(projectId, includeInactive);
      setCategories(data);
      setCategoryTree(buildCategoryTree(data));
    } catch (error) {
      console.error('Failed to load website categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [projectId, includeInactive]);

  // Построение дерева категорий
  const buildCategoryTree = (flatCategories: WebCategoryData[]): CategoryTreeNode[] => {
    const categoryMap = new Map<string, CategoryTreeNode>();
    const rootCategories: CategoryTreeNode[] = [];

    // Создаем узлы
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [], isExpanded: true });
    });

    // Строим дерево
    flatCategories.forEach(cat => {
      const node = categoryMap.get(cat.id)!;
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId)!.children.push(node);
      } else {
        rootCategories.push(node);
      }
    });

    // Сортируем по orderIndex
    const sortByOrder = (nodes: CategoryTreeNode[]) => {
      nodes.sort((a, b) => a.orderIndex - b.orderIndex);
      nodes.forEach(node => sortByOrder(node.children));
    };
    sortByOrder(rootCategories);

    return rootCategories;
  };

  // Создание категории
  const handleCreateCategory = async (data: CreateWebCategoryRequest) => {
    try {
      await createWebsiteCategory(projectId, data);
      await loadCategories();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Ошибка создания категории');
    }
  };

  // Обновление категории
  const handleUpdateCategory = async (categoryId: string, data: UpdateWebCategoryRequest) => {
    try {
      await updateWebsiteCategory(categoryId, data);
      await loadCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Ошибка обновления категории');
    }
  };

  // Удаление категории
  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Удалить категорию "${categoryName}"?`)) return;
    
    try {
      await deleteWebsiteCategory(categoryId);
      await loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Ошибка удаления категории');
    }
  };

  // Переключение видимости узла дерева
  const toggleNodeExpansion = (categoryId: string) => {
    const updateTree = (nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
      return nodes.map(node => {
        if (node.id === categoryId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        return { ...node, children: updateTree(node.children) };
      });
    };
    setCategoryTree(updateTree(categoryTree));
  };

  // Рендер узла дерева
  const renderCategoryNode = (node: CategoryTreeNode, depth = 0) => {
    const hasChildren = node.children.length > 0;
    const indent = depth * 20;

    return (
      <div key={node.id} className="border-b border-gray-100 dark:border-gray-700">
        <div 
          className="flex items-center py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          style={{ paddingLeft: `${16 + indent}px` }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleNodeExpansion(node.id)}
            className={`mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
              hasChildren ? 'visible' : 'invisible'
            }`}
          >
            {hasChildren && node.isExpanded ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Статус активности */}
          <div className="mr-3">
            {node.isActive ? (
              <FiEye className="w-4 h-4 text-green-500" />
            ) : (
              <FiEyeOff className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* Информация о категории */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {node.name}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                /{node.slug}
              </span>
              {!node.isPublished && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                  Черновик
                </span>
              )}
            </div>
            {node.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                {node.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Уровень: {node.level}</span>
              <span>Порядок: {node.orderIndex}</span>
              {node._count && (
                <>
                  <span>Страниц: {node._count.pageLinks}</span>
                  <span>Основная для: {node._count.primaryPages}</span>
                </>
              )}
            </div>
          </div>

          {/* Действия */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setEditingCategory(node)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              title="Редактировать"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteCategory(node.id, node.name)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Удалить"
              disabled={hasChildren || (node._count?.primaryPages || 0) > 0}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Переместить"
            >
              <FiMove className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Дочерние категории */}
        {hasChildren && node.isExpanded && (
          <div>
            {node.children.map(child => renderCategoryNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Категории Website
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Управление рубриками для страниц сайта
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">Показать неактивные</span>
          </label>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Создать категорию
          </button>
        </div>
      </div>

      {/* Дерево категорий */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {categoryTree.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              Категории не созданы
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Создать первую категорию
            </button>
          </div>
        ) : (
          <div>
            {categoryTree.map(node => renderCategoryNode(node))}
          </div>
        )}
      </div>

      {/* Модалы */}
      {showCreateModal && (
        <CategoryFormModal
          title="Создать категорию"
          categories={categories}
          onSubmit={handleCreateCategory}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingCategory && (
        <CategoryFormModal
          title="Редактировать категорию"
          categories={categories}
          initialData={editingCategory}
          onSubmit={(data) => handleUpdateCategory(editingCategory.id, data)}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
};

// Модал формы категории
interface CategoryFormModalProps {
  title: string;
  categories: WebCategoryData[];
  initialData?: WebCategoryData;
  onSubmit: (data: CreateWebCategoryRequest | UpdateWebCategoryRequest) => void;
  onClose: () => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  title,
  categories,
  initialData,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    parentId: initialData?.parentId || '',
    isActive: initialData?.isActive ?? true,
    isPublished: initialData?.isPublished ?? true,
    language: initialData?.language || '*',
  });

  // Автогенерация slug из name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('Заполните обязательные поля');
      return;
    }
    onSubmit({
      ...formData,
      parentId: formData.parentId || undefined,
    });
  };

  // Доступные родительские категории (исключаем текущую и её потомков)
  const availableParents = categories.filter(cat => {
    if (initialData && cat.id === initialData.id) return false;
    // TODO: исключить потомков текущей категории
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Название категории"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="url-slug"
              pattern="^[a-z0-9-]+$"
              title="Только строчные буквы, цифры и дефисы"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Описание категории"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Родительская категория
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Корневая категория</option>
              {availableParents.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {'  '.repeat(cat.level - 1)}{cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Активна</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Опубликована</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {initialData ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
