import React, { useEffect, useMemo, useState } from 'react';
import { ProjectData } from '../../../types/project';
import { projectsApi } from '../../../api/services/projects.api';

interface ProjectSettingsProps {
  project: ProjectData;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project }) => {
  // Основные поля проекта (UI-модель)
  const [settings, setSettings] = useState({
    name: project.name,
    description: project.description || '',
    template: project.template || 'website',
    status: project.status || 'active',
    isPublic: project.isPublic || false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Доменные настройки проекта
  const [domainBase, setDomainBase] = useState<string>((project as any).domain || '');
  const [customDomain, setCustomDomain] = useState<string>((project as any).customDomain || '');
  const [isDomainSaving, setIsDomainSaving] = useState(false);
  const domainChanged = useMemo(
    () => domainBase !== ((project as any).domain || '') || customDomain !== ((project as any).customDomain || ''),
    [domainBase, customDomain, project],
  );

  // Доступы к проекту
  const [accesses, setAccesses] = useState<
    Array<{
      id: string;
      userId: string;
      role: string;
      grantedAt?: string;
      user?: { email?: string; username?: string };
    }>
  >([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantRole, setGrantRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('EDITOR');
  const [accessSubmitting, setAccessSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Здесь будет логика сохранения настроек
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // Загрузка доступов
  const loadAccesses = async () => {
    setAccessLoading(true);
    try {
      const data = await projectsApi.listAccesses(project.id);
      setAccesses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Не удалось загрузить доступы:', e);
    } finally {
      setAccessLoading(false);
    }
  };

  useEffect(() => {
    loadAccesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  // Сохранение доменов
  const handleSaveDomains = async () => {
    setIsDomainSaving(true);
    try {
      await projectsApi.updateProjectDomains(project.id, {
        domain: domainBase || undefined,
        customDomain: customDomain || undefined,
      });
      alert('Доменные настройки обновлены');
    } catch (e: any) {
      alert(e?.message || 'Не удалось обновить домены');
    } finally {
      setIsDomainSaving(false);
    }
  };

  // Выдача доступа
  const handleGrantAccess = async () => {
    if (!grantEmail || !grantRole) {
      alert('Укажите email и роль');
      return;
    }
    setAccessSubmitting(true);
    try {
      await projectsApi.grantAccess(project.id, { userEmail: grantEmail, role: grantRole });
      setGrantEmail('');
      await loadAccesses();
    } catch (e: any) {
      alert(e?.message || 'Не удалось выдать доступ');
    } finally {
      setAccessSubmitting(false);
    }
  };

  // Смена роли доступа
  const handleChangeRole = async (accessId: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER') => {
    try {
      await projectsApi.updateAccess(project.id, accessId, role);
      await loadAccesses();
    } catch (e: any) {
      alert(e?.message || 'Не удалось изменить роль');
    }
  };

  // Отзыв доступа
  const handleRevoke = async (accessId: string) => {
    if (!confirm('Отозвать доступ?')) return;
    try {
      await projectsApi.revokeAccess(project.id, accessId);
      await loadAccesses();
    } catch (e: any) {
      alert(e?.message || 'Не удалось отозвать доступ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Основные настройки */}
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Основные настройки</h2>
        <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Название проекта</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="Введите название проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Тип проекта</label>
              <select
                value={settings.template}
                onChange={(e) => setSettings({ ...settings, template: e.target.value })}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="website">Сайт</option>
                <option value="store">Магазин</option>
                <option value="blog">Блог</option>
                <option value="landing">Лендинг</option>
                <option value="app">Приложение</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Описание</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="Введите описание проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Статус</label>
              <select
                value={settings.status}
                onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
                <option value="archived">Архив</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={settings.isPublic}
                onChange={(e) => setSettings({ ...settings, isPublic: e.target.checked })}
                className="w-4 h-4 text-primary border-stroke dark:border-dark-3 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-dark dark:text-white">
                Публичный проект
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Настройки внешнего вида */}
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Настройки внешнего вида</h2>
        <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Основной цвет</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={project.settings?.primaryColor || '#3B82F6'}
                  className="w-12 h-10 border border-stroke dark:border-dark-3 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={project.settings?.primaryColor || '#3B82F6'}
                  className="flex-1 px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Тема</label>
              <select
                value={project.settings?.theme || 'auto'}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="auto">Автоматически</option>
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Логотип</label>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-dark-3 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current text-gray-400">
                    <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" />
                    <path d="M10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6ZM10 10C9.45 10 9 9.55 9 9C9 8.45 9.45 8 10 8C10.55 8 11 8.45 11 9C11 9.55 10.55 10 10 10Z" />
                  </svg>
                </div>
                <button className="px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-sm text-dark dark:text-white hover:border-primary transition-colors">
                  Загрузить
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Иконка сайта</label>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-dark-3 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current text-gray-400">
                    <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" />
                    <path d="M10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6ZM10 10C9.45 10 9 9.55 9 9C9 8.45 9.45 8 10 8C10.55 8 11 8.45 11 9C11 9.55 10.55 10 10 10Z" />
                  </svg>
                </div>
                <button className="px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-sm text-dark dark:text-white hover:border-primary transition-colors">
                  Загрузить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Доменные настройки */}
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Доменные настройки</h2>
        <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Базовый домен (субдомен системы)
              </label>
              <input
                type="text"
                value={domainBase}
                onChange={(e) => setDomainBase(e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="example.situs.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Пользовательский домен</label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="example.com"
              />
              <p className="text-xs text-body-color dark:text-dark-6 mt-2">
                При наличии customDomain базовый домен должен отдавать 301 редирект.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveDomains}
              disabled={isDomainSaving || !domainChanged}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isDomainSaving ? 'Сохранение...' : 'Сохранить домены'}
            </button>
          </div>
        </div>
      </div>

      {/* Управление доступами */}
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Доступы к проекту</h2>
        <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">Email пользователя</label>
              <input
                type="email"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="user@example.com"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={grantRole}
                onChange={(e) => setGrantRole(e.target.value as any)}
                className="flex-1 px-3 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="ADMIN">Администратор</option>
                <option value="EDITOR">Редактор</option>
                <option value="VIEWER">Просмотр</option>
              </select>
              <button
                onClick={handleGrantAccess}
                disabled={accessSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {accessSubmitting ? 'Добавление...' : 'Выдать доступ'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-dark dark:text-white border-b border-stroke dark:border-dark-3">
                  <th className="py-2 pr-4">Пользователь</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Роль</th>
                  <th className="py-2 pr-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {accessLoading ? (
                  <tr>
                    <td className="py-3" colSpan={4}>
                      Загрузка...
                    </td>
                  </tr>
                ) : accesses.length === 0 ? (
                  <tr>
                    <td className="py-3 text-body-color dark:text-dark-6" colSpan={4}>
                      Доступы не назначены
                    </td>
                  </tr>
                ) : (
                  accesses.map((a) => (
                    <tr key={a.id} className="border-b border-stroke/60 dark:border-dark-3/60">
                      <td className="py-2 pr-4">{a.user?.username || a.userId}</td>
                      <td className="py-2 pr-4">{a.user?.email || '—'}</td>
                      <td className="py-2 pr-4">
                        <select
                          value={(a.role || '').toUpperCase()}
                          onChange={(e) => handleChangeRole(a.id, e.target.value as any)}
                          className="px-2 py-1 border border-stroke dark:border-dark-3 rounded bg-white dark:bg-dark-2 text-dark dark:text-white"
                        >
                          <option value="ADMIN">Администратор</option>
                          <option value="EDITOR">Редактор</option>
                          <option value="VIEWER">Просмотр</option>
                        </select>
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <button
                          onClick={() => handleRevoke(a.id)}
                          className="px-3 py-1.5 border border-stroke dark:border-dark-3 rounded text-dark dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          Отозвать
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Опасная зона */}
      <div>
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Опасная зона</h2>
        <div className="bg-white dark:bg-dark-2 rounded-lg border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Удалить проект</h3>
              <p className="text-sm text-body-color dark:text-dark-6 mt-1">
                Это действие нельзя отменить. Проект и все его данные будут удалены навсегда.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Удалить проект
            </button>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-3">
        <button className="px-6 py-2 border border-stroke dark:border-dark-3 rounded-lg text-sm font-medium text-dark dark:text-white hover:border-primary transition-colors">
          Отмена
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
};

export default ProjectSettings;
