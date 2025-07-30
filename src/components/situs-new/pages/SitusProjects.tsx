import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFolder, FiCalendar, FiUser, FiSearch, FiFilter } from 'react-icons/fi';
import apiClient from '../../../api/client/ApiClient';

/**
 * Интерфейс проекта
 */
interface Project {
  id: string;
  title: string;
  description?: string;
  slug: string;
  category?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  _count?: {
    pages: number;
  };
}

/**
 * Фильтры для проектов
 */
interface ProjectFilters {
  search?: string;
  category?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Компонент SitusProjects - Управление проектами
 */
const SitusProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    category: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Загрузка проектов
  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getProjects(filters);

      if (response.error) {
        setError(response.error);
        return;
      }

      setProjects(response.data?.projects || []);
      setTotalPages(Math.ceil((response.data?.total || 0) / (filters.limit || 10)));
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Ошибка загрузки проектов');
    } finally {
      setLoading(false);
    }
  };

  // Обработка поиска
  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  // Обработка фильтрации
  const handleFilter = (key: keyof ProjectFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  // Смена страницы
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  // Создание проекта
  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const response = await apiClient.createProject(projectData);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      setShowCreateModal(false);
      loadProjects();
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Ошибка создания проекта');
    }
  };

  // Обновление проекта
  const handleUpdateProject = async (projectId: string, projectData: Partial<Project>) => {
    try {
      const response = await apiClient.updateProject(projectId, projectData);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      setEditingProject(null);
      loadProjects();
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Ошибка обновления проекта');
    }
  };

  // Удаление проекта
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) {
      return;
    }

    try {
      const response = await apiClient.deleteProject(projectId);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      loadProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Ошибка удаления проекта');
    }
  };

  // Публикация/снятие с публикации
  const handleTogglePublished = async (project: Project) => {
    try {
      const response = project.isPublished 
        ? await apiClient.unpublishProject(project.id)
        : await apiClient.publishProject(project.id);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      loadProjects();
    } catch (err) {
      console.error('Error toggling project publication:', err);
      setError('Ошибка изменения статуса публикации');
    }
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Проекты</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Управление проектами и контентом
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="h-4 w-4" />
          Создать проект
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Поиск */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Поиск проектов..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Фильтр по категории */}
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilter('category', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все категории</option>
            <option value="website">Сайты</option>
            <option value="ecommerce">Магазины</option>
            <option value="landing">Лендинги</option>
            <option value="app">Приложения</option>
          </select>

          {/* Фильтр по статусу */}
          <select
            value={filters.isPublished === undefined ? '' : filters.isPublished ? 'published' : 'draft'}
            onChange={(e) => handleFilter('isPublished', e.target.value === '' ? undefined : e.target.value === 'published')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все статусы</option>
            <option value="published">Опубликованные</option>
            <option value="draft">Черновики</option>
          </select>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Таблица проектов */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Проект
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Автор
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Создан
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiFolder className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </div>
                        {project.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {project.description}
                          </div>
                        )}
                        {project._count && (
                          <div className="text-xs text-gray-400 mt-1">
                            {project._count.pages} страниц
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {project.category || 'Без категории'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      project.isPublished
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {project.isPublished ? 'Опубликован' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.user?.name || project.user?.email || 'Неизвестно'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="h-4 w-4 mr-2" />
                      {formatDate(project.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleTogglePublished(project)}
                        className={`p-2 rounded-lg ${
                          project.isPublished
                            ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                            : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                        }`}
                        title={project.isPublished ? 'Снять с публикации' : 'Опубликовать'}
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingProject(project)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                        title="Редактировать"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                        title="Удалить"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Страница {filters.page} из {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange((filters.page || 1) - 1)}
                disabled={(filters.page || 1) === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Назад
              </button>
              <button
                onClick={() => handlePageChange((filters.page || 1) + 1)}
                disabled={(filters.page || 1) === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Вперед
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Пустое состояние */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <FiFolder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Нет проектов
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {filters.search || filters.category 
              ? 'По вашему запросу ничего не найдено'
              : 'Создайте свой первый проект для начала работы'
            }
          </p>
          {!filters.search && !filters.category && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Создать проект
            </button>
          )}
        </div>
      )}

      {/* Модальные окна */}
      {showCreateModal && (
        <ProjectModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateProject}
        />
      )}

      {editingProject && (
        <ProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={(data) => handleUpdateProject(editingProject.id, data)}
        />
      )}
    </div>
  );
};

/**
 * Компонент модального окна для создания/редактирования проекта
 */
interface ProjectModalProps {
  project?: Project;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    slug: project?.slug || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {project ? 'Редактировать проект' : 'Создать проект'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите категорию</option>
              <option value="website">Сайты</option>
              <option value="ecommerce">Магазины</option>
              <option value="landing">Лендинги</option>
              <option value="app">Приложения</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="my-project"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {project ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SitusProjects;