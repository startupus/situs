import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiFileText, FiShoppingCart, FiCompass, FiPenTool, FiSearch, FiGlobe, FiSettings, FiUsers, FiMapPin, FiX, FiShield } from 'react-icons/fi';

interface ProjectSidebarOverlayProps {
  projectId: string;
  panel: 'overview' | 'settings' | null;
  onClose: () => void;
}

const ProjectSidebarOverlay: React.FC<ProjectSidebarOverlayProps> = ({ projectId, panel, onClose }) => {
  const [activeSecond, setActiveSecond] = useState<string>('pages');
  const [pinned, setPinned] = useState<boolean>(false);
  const [shown, setShown] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    // плавное появление
    setShown(false);
    const t = setTimeout(() => setShown(true), 10);
    // загрузка сохранённых настроек
    try {
      const savedSecond = localStorage.getItem(`psb:selectedSecond:${projectId}`);
      if (savedSecond) setActiveSecond(savedSecond);
      const savedPinned = localStorage.getItem(`psb:pinned:${projectId}`);
      if (savedPinned) setPinned(savedPinned === '1');
    } catch {}

    if (panel === 'overview') {
      // Выбираем раздел по текущему урлу
      if (/\/projects\/.+\/store/.test(location.pathname)) setActiveSecond('store');
      else setActiveSecond('pages');
    }
    return () => clearTimeout(t);
  }, [panel, location.pathname, projectId]);

  useEffect(() => {
    try { localStorage.setItem(`psb:selectedSecond:${projectId}`, activeSecond); } catch {}
  }, [activeSecond, projectId]);
  useEffect(() => {
    try { localStorage.setItem(`psb:pinned:${projectId}`, pinned ? '1' : '0'); } catch {}
  }, [pinned, projectId]);

  if (!panel) return null;

  return (
    <div
      className={`fixed top-0 left-[90px] z-40 h-screen select-none transition-all duration-200 ${shown ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}
      onMouseLeave={() => { if (!pinned) onClose(); }}
      onMouseEnter={(e) => e.stopPropagation()}
    >
      {/* 2-й уровень */}
      <div className="h-full w-[260px] border-r border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 shadow-md">
        <div className="flex items-center justify-between px-3 py-2 border-b border-stroke dark:border-dark-3">
          <div className="text-xs uppercase tracking-wide text-body-color dark:text-dark-6">{panel === 'overview' ? 'Компоненты' : 'Настройки проекта'}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPinned(v => !v)}
              title={pinned ? 'Открепить' : 'Закрепить'}
              className={`p-1 rounded-md ${pinned ? 'text-primary' : 'text-body-color dark:text-dark-6'} hover:bg-gray-100 dark:hover:bg-dark-3`}
            >
              <FiMapPin aria-hidden />
            </button>
            {!pinned && (
              <button onClick={onClose} title="Закрыть" className="p-1 rounded-md text-body-color dark:text-dark-6 hover:bg-gray-100 dark:hover:bg-dark-3">
                <FiX aria-hidden />
              </button>
            )}
          </div>
        </div>
        {panel === 'overview' && (
          <div className="p-3">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveSecond('pages')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${activeSecond === 'pages' ? 'bg-primary text-white' : 'text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3'}`}
                >
                  <FiFileText size={16} aria-hidden /> Страницы
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSecond('store')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${activeSecond === 'store' ? 'bg-primary text-white' : 'text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3'}`}
                >
                  <FiShoppingCart size={16} aria-hidden /> Магазин
                </button>
              </li>
            </ul>
          </div>
        )}

        {panel === 'settings' && (
          <div className="p-3">
            <ul className="space-y-1">
              <li>
                <Link to={`/projects/${projectId}/settings/domain`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                  <FiGlobe size={16} aria-hidden /> Домен
                </Link>
              </li>
              <li>
                <Link to={`/projects/${projectId}/settings/seo`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                  <FiSearch size={16} aria-hidden /> SEO
                </Link>
              </li>
              <li>
                <Link to={`/projects/${projectId}/settings/theme`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                  <FiSettings size={16} aria-hidden /> Тема
                </Link>
              </li>
              <li>
                <Link to={`/projects/${projectId}/settings/team`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                  <FiUsers size={16} aria-hidden /> Команда
                </Link>
              </li>
              <li>
                <Link to={`/projects/${projectId}/settings/integrations`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                  <FiSettings size={16} aria-hidden /> Интеграции
                </Link>
              </li>
              <li>
                <Link to={`/projects/${projectId}/settings/access`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                  <FiShield size={16} aria-hidden /> Доступ и роли
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 3-й уровень (фильтры) */}
      {panel === 'overview' && (
        <div className="h-full w-[260px] bg-white dark:bg-dark-2 shadow-md border-r border-stroke dark:border-dark-3">
          {activeSecond === 'pages' && (
            <div className="p-3">
              <div className="text-xs uppercase tracking-wide text-body-color dark:text-dark-6 mb-2">Страницы</div>
              <ul className="space-y-1">
                <li>
                  <Link to={`/projects/${projectId}/pages`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                    <FiFileText size={16} aria-hidden /> Список
                  </Link>
                </li>
                <li>
                  <Link to={`/projects/${projectId}/pages`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                    <FiCompass size={16} aria-hidden /> Категории
                  </Link>
                </li>
                <li>
                  <Link to={`/projects/${projectId}/pages`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                    <FiPenTool size={16} aria-hidden /> Дизайн
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {activeSecond === 'store' && (
            <div className="p-3">
              <div className="text-xs uppercase tracking-wide text-body-color dark:text-dark-6 mb-2">Магазин</div>
              <ul className="space-y-1">
                <li>
                  <Link to={`/projects/${projectId}/store`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                    <FiShoppingCart size={16} aria-hidden /> Заказы
                  </Link>
                </li>
                <li>
                  <Link to={`/projects/${projectId}/store`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                    <FiCompass size={16} aria-hidden /> Категории
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectSidebarOverlay;


