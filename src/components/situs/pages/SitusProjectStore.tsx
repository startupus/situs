import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, ProjectData } from '../../../services/projectApi';
import { apiClient } from '../../../api/client';
import { testIds } from '../../ui/testids';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  orderIndex: number;
  isActive: boolean;
  _count: { items: number };
  children?: Category[];
  parent?: Category;
}

interface Item {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  quantity: number;
  status: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED' | 'ARCHIVED';
  images: string;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string };
}

const SitusProjectStore: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories');
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const navigate = useNavigate();

  // Функция для иерархического отображения категорий (аналог системы меню)
  const renderCategoriesHierarchy = (parentCategories: Category[], level = 1): React.ReactNode => {
    return parentCategories.map((category) => (
      <div
        key={category.id}
        className={`${level > 1 ? 'ml-6 border-l-2 border-gray-200 dark:border-gray-600 pl-4' : ''}`}
      >
        <div className="border border-stroke dark:border-dark-3 rounded-lg p-4 hover:shadow-md transition-shadow mb-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{level === 1 ? '📁' : level === 2 ? '📂' : '📄'}</span>
                <h4 className="font-medium text-dark dark:text-white">
                  {category.name}
                  <span className="text-xs text-body-color dark:text-dark-6 ml-2">(Уровень {level})</span>
                </h4>
              </div>
              {category.description && (
                <p className="text-sm text-body-color dark:text-dark-6 mt-1 line-clamp-2">{category.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-body-color dark:text-dark-6">{category._count.items} товаров</span>
                {category.children && category.children.length > 0 && (
                  <span className="text-body-color dark:text-dark-6">{category.children.length} подкатегорий</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-primary hover:text-primary/80 text-sm px-2 py-1 rounded">Редактировать</button>
              <button className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm px-2 py-1 rounded">
                Удалить
              </button>
            </div>
          </div>
        </div>

        {/* Рекурсивно отображаем дочерние категории */}
        {category.children && category.children.length > 0 && (
          <div className="mt-2">{renderCategoriesHierarchy(category.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setError('ID проекта не указан');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProject(projectId);
        setProject(data);

        // Найдем ECOMMERCE продукт
        const storeProduct = (data as any).products?.find((p: any) => p.type === 'ECOMMERCE');
        if (storeProduct) {
          await loadCategories(storeProduct.id);
          await loadItems(storeProduct.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки проекта');
        console.error('Ошибка загрузки проекта:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const loadCategories = async (productId: string) => {
    try {
      const response = await fetch(`/api/categories?productId=${productId}`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const loadItems = async (productId: string) => {
    try {
      const response = await fetch(`/api/items?productId=${productId}&limit=50`);
      const data = await response.json();
      if (data.success) {
        setItems(data.data.items);
      }
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Ошибка</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <p className="text-body-color dark:text-dark-6">Проект не найден</p>
      </div>
    );
  }

  const storeProduct = (project as any).products?.find((p: any) => p.type === 'ECOMMERCE');
  if (!storeProduct) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">Магазин не настроен</h3>
          <p className="text-yellow-600 dark:text-yellow-400">
            В этом проекте нет продукта типа "Магазин". Создайте его сначала.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-sm text-body-color dark:text-dark-6 mb-6">
        <button onClick={() => navigate('/projects')} className="hover:text-primary">
          Проекты
        </button>
        <span>/</span>
        <button onClick={() => navigate(`/projects/${projectId}`)} className="hover:text-primary">
          {project.name}
        </button>
        <span>/</span>
        <span className="text-dark dark:text-white">Магазин</span>
      </nav>

      <div className="flex-1">
        {/* Вкладки */}
        <div className="border-b border-stroke dark:border-dark-3 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'categories'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
              data-testid={testIds.products.tabs.categories}
            >
              Категории ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'items'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
              }`}
              data-testid={testIds.products.tabs.items}
            >
              Товары ({items.length})
            </button>
          </nav>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'categories' && (
          <div data-testid={testIds.products.categoriesSection}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-dark dark:text-white">Категории товаров</h3>
              <button
                onClick={() => setShowCreateCategoryModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                data-testid={testIds.products.createCategoryButton}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                  <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z" />
                </svg>
                Создать категорию
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-body-color dark:text-dark-6 mb-4">Категории не созданы</p>
                <button onClick={() => setShowCreateCategoryModal(true)} className="text-primary hover:text-primary/80">
                  Создать первую категорию
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Иерархическое отображение категорий (как в системе меню) */}
                {renderCategoriesHierarchy(categories.filter((cat) => !cat.parentId))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div data-testid={testIds.products.itemsSection}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-dark dark:text-white">Товары</h3>
              <button
                onClick={() => setShowCreateItemModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                data-testid={testIds.products.createItemButton}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                  <path d="M8 1C8.55228 1 9 1.44772 9 2V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V2C7 1.44772 7.44772 1 8 1Z" />
                </svg>
                Добавить товар
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-body-color dark:text-dark-6 mb-4">Товары не добавлены</p>
                <button onClick={() => setShowCreateItemModal(true)} className="text-primary hover:text-primary/80">
                  Добавить первый товар
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden">
                <div className="bg-gray-50 dark:bg-dark-3 px-4 py-2 text-xs font-medium text-body-color dark:text-dark-6 grid grid-cols-12 gap-2">
                  <div className="col-span-4">Товар</div>
                  <div className="col-span-2">Категория</div>
                  <div className="col-span-2">Цена</div>
                  <div className="col-span-1">Остаток</div>
                  <div className="col-span-1">Статус</div>
                  <div className="col-span-2 text-right">Действия</div>
                </div>
                <ul className="divide-y divide-stroke dark:divide-dark-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-dark-3"
                      data-testid={testIds.products.itemRow}
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        {item.images && JSON.parse(item.images)[0] ? (
                          <img
                            src={JSON.parse(item.images)[0]}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current text-gray-400">
                              <path d="M2 2h12v12H2V2zm2 2v8h8V4H4z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-dark dark:text-white">{item.name}</h4>
                          {item.sku && <p className="text-xs text-body-color dark:text-dark-6">SKU: {item.sku}</p>}
                        </div>
                      </div>
                      <div className="col-span-2 text-sm text-body-color dark:text-dark-6">{item.category.name}</div>
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-dark dark:text-white">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </div>
                        {item.comparePrice && (
                          <div className="text-xs text-body-color dark:text-dark-6 line-through">
                            {item.comparePrice.toLocaleString('ru-RU')} ₽
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 text-sm text-body-color dark:text-dark-6">{item.quantity}</div>
                      <div className="col-span-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : item.status === 'OUT_OF_STOCK'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {item.status === 'ACTIVE'
                            ? 'Активен'
                            : item.status === 'OUT_OF_STOCK'
                              ? 'Нет в наличии'
                              : item.status === 'DRAFT'
                                ? 'Черновик'
                                : item.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-right flex gap-2 justify-end">
                        <button className="text-xs text-primary hover:text-primary/80 px-2 py-1 rounded">
                          Редактировать
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded">
                          Удалить
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SitusProjectStore;
