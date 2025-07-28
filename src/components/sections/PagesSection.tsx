import React, { useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiGlobe, FiClock, FiCheck, FiFileText } from 'react-icons/fi';
import { useProject } from '../../contexts/ProjectContext';
import { CreatePageData } from '../../types/project';
import Button from '../ui/Button';
import StatsCard, { StatsGrid } from '../ui/StatsCard';

interface PagesSectionProps {
  onEditPage?: (pageId: string) => void;
}

const PagesSection: React.FC<PagesSectionProps> = ({ onEditPage }) => {
  const { 
    pages, 
    currentPage, 
    createPage, 
    updatePage, 
    deletePage, 
    loadPage, 
    publishPage,
    isLoading 
  } = useProject();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    try {
      const pageData: CreatePageData = {
        title: newPageTitle.trim(),
        slug: newPageSlug.trim() || undefined
      };
      
      await createPage(pageData);
      setNewPageTitle('');
      setNewPageSlug('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create page:', error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту страницу?')) {
      await deletePage(pageId);
    }
  };

  const handlePublishPage = async (pageId: string) => {
    await publishPage(pageId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'archived':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <FiGlobe className="w-3 h-3" />;
      case 'draft':
        return <FiClock className="w-3 h-3" />;
      case 'archived':
        return <FiTrash2 className="w-3 h-3" />;
      default:
        return <FiClock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Опубликовано';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка создания */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Страницы сайта
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Управляйте страницами вашего проекта
          </p>
        </div>
        
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
          size="md"
          disabled={isLoading}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Новая страница
        </Button>
      </div>

      {/* Форма создания страницы */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Создать новую страницу
          </h3>
          
          <form onSubmit={handleCreatePage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название страницы
              </label>
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Например: О компании"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL (необязательно)
              </label>
              <input
                type="text"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="about-company"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Если не указан, будет создан автоматически из названия
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                Создать
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPageTitle('');
                  setNewPageSlug('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список страниц */}
      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FiEdit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Нет страниц
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Создайте первую страницу для вашего сайта
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Создать страницу</span>
            </button>
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className={`bg-white dark:bg-gray-800 border rounded-lg p-4 transition-all ${
                currentPage?.id === page.id
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {page.title}
                    </h3>
                    
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}
                    >
                      {getStatusIcon(page.status)}
                      <span>{getStatusText(page.status)}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>/{page.slug}</span>
                    <span>•</span>
                    <span>Обновлено {page.updatedAt.toLocaleDateString()}</span>
                    {page.publishedAt && (
                      <>
                        <span>•</span>
                        <span>Опубликовано {page.publishedAt.toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Кнопка редактирования */}
                  <button
                    onClick={() => {
                      loadPage(page.id);
                      onEditPage?.(page.id);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                  
                  {/* Кнопка предпросмотра */}
                  <button
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Предпросмотр"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  
                  {/* Кнопка публикации */}
                  {page.status === 'draft' && (
                    <button
                      onClick={() => handlePublishPage(page.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Опубликовать"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Кнопка удаления */}
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Статистика */}
      {pages.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pages.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Всего страниц
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {pages.filter(p => p.status === 'published').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Опубликовано
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {pages.filter(p => p.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Черновики
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesSection; 