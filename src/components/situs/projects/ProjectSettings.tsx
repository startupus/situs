import React, { useState } from 'react';
import { ProjectData } from '../../../services/projectApi';

interface ProjectSettingsProps {
  project: ProjectData;
  onUpdate: (project: ProjectData) => void;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'domain' | 'seo' | 'advanced'>('general');
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    domain: project.domain || '',
    customDomain: project.customDomain || '',
    metaTitle: project.metaTitle || '',
    metaDescription: project.metaDescription || '',
    metaKeywords: project.metaKeywords || '',
    primaryColor: project.primaryColor || '#4F46E5',
    secondaryColor: project.secondaryColor || '#10B981',
    fontFamily: project.fontFamily || 'Inter'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tabs = [
    { id: 'general', name: 'Основные', icon: '⚙️' },
    { id: 'domain', name: 'Домен', icon: '🌐' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'advanced', name: 'Дополнительно', icon: '🛠️' }
  ];

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Здесь будет API вызов для обновления проекта
      const response = await fetch(`http://localhost:3001/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления проекта');
      }

      const updatedProject = await response.json();
      onUpdate(updatedProject.data);
      setMessage({ type: 'success', text: 'Настройки успешно сохранены' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Ошибка сохранения'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
            Настройки проекта
          </h2>
          <p className="text-body-color dark:text-dark-6">
            Управляйте настройками и конфигурацией проекта
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? '💾 Сохранение...' : '💾 Сохранить'}
        </button>
      </div>

      {/* Сообщения */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Вкладки */}
      <div className="border-b border-stroke dark:border-dark-3 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Содержимое вкладок */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Название проекта *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Тип проекта
                </label>
                <input
                  type="text"
                  value={project.type}
                  disabled
                  className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-gray-50 dark:bg-dark-3 text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors resize-none"
                placeholder="Краткое описание проекта"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Основной цвет
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-12 h-10 border border-stroke dark:border-dark-3 rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Вторичный цвет
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 border border-stroke dark:border-dark-3 rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'domain' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Системный домен
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
                placeholder="example.situs.com"
              />
              <p className="text-sm text-body-color dark:text-dark-6 mt-1">
                Домен в системе Situs
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Пользовательский домен
              </label>
              <input
                type="text"
                value={formData.customDomain}
                onChange={(e) => handleInputChange('customDomain', e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
                placeholder="example.com"
              />
              <p className="text-sm text-body-color dark:text-dark-6 mt-1">
                Ваш собственный домен (требует настройки DNS)
              </p>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Мета-заголовок
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
                placeholder="SEO-заголовок для поисковых систем"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Мета-описание
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors resize-none"
                placeholder="Описание сайта для поисковых систем"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Ключевые слова
              </label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white placeholder-body-color dark:placeholder-dark-6 focus:border-primary focus:outline-none transition-colors"
                placeholder="ключевые, слова, через, запятую"
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Шрифт
              </label>
              <select
                value={formData.fontFamily}
                onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={project.hasEcommerce}
                    disabled
                    className="rounded"
                  />
                  <label className="text-sm font-medium text-dark dark:text-white">
                    E-commerce
                  </label>
                </div>
                <p className="text-xs text-body-color dark:text-dark-6">
                  Функции интернет-магазина
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={project.hasBlog}
                    disabled
                    className="rounded"
                  />
                  <label className="text-sm font-medium text-dark dark:text-white">
                    Блог
                  </label>
                </div>
                <p className="text-xs text-body-color dark:text-dark-6">
                  Система управления контентом
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={project.hasAnalytics}
                    disabled
                    className="rounded"
                  />
                  <label className="text-sm font-medium text-dark dark:text-white">
                    Аналитика
                  </label>
                </div>
                <p className="text-xs text-body-color dark:text-dark-6">
                  Отслеживание посетителей
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-dark-3 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={project.hasContactForm}
                    disabled
                    className="rounded"
                  />
                  <label className="text-sm font-medium text-dark dark:text-white">
                    Формы
                  </label>
                </div>
                <p className="text-xs text-body-color dark:text-dark-6">
                  Контактные формы
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Зона опасности
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                Удаление проекта приведет к безвозвратной потере всех данных.
              </p>
              <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                🗑️ Удалить проект
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSettings;
