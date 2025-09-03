import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect as useReactEffect } from 'react';
import { useProject } from '../../../contexts/ProjectContext';
import { FiMenu, FiSearch, FiBell, FiX, FiPlus, FiSettings } from 'react-icons/fi';
import { projectsApi } from '../../../api/services/projects.api';

interface SitusHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SitusHeader: React.FC<SitusHeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { currentProject } = (() => {
    try {
      return useProject();
    } catch {
      return { currentProject: null } as any;
    }
  })();
  const isProjectPage = /^\/projects\//.test(location.pathname);
  const navigate = useNavigate();

  // Извлекаем projectId из URL
  const projectId = useMemo(() => {
    const match = location.pathname.match(/^\/projects\/([^\/]*)/);
    return match?.[1] || null;
  }, [location.pathname]);

  // Локально подгружаем имя проекта, если контекст пуст и мы на странице проекта
  const [headerProjectName, setHeaderProjectName] = useState<string | null>(null);
  useEffect(() => {
    let ignore = false;
    async function loadName() {
      if (!isProjectPage || !projectId || currentProject?.id === projectId) {
        setHeaderProjectName(currentProject?.name || null);
        return;
      }
      try {
        const p = await projectsApi.getProject(projectId);
        if (!ignore) setHeaderProjectName(p?.name || null);
      } catch {
        if (!ignore) setHeaderProjectName(null);
      }
    }
    loadName();
    return () => {
      ignore = true;
    };
  }, [isProjectPage, projectId, currentProject?.id, currentProject?.name]);

  // Вспомогательные вычисления для заголовка/навигации
  const sectionTitle = useMemo(() => {
    // Спец-случай: страница продукта Pages — показываем "Страницы"
    if (/^\/projects\/[^/]+\/pages\/settings/.test(location.pathname)) return 'Настройки страниц';
    if (/^\/projects\/[^/]+\/pages(?!\/settings)/.test(location.pathname)) return 'Страницы';
    // Спец-случай: страница меню — показываем заголовок в зависимости от вкладки
    if (/^\/projects\/[^/]+\/menus/.test(location.pathname)) {
      const searchParams = new URLSearchParams(location.search);
      const tab = searchParams.get('tab');
      if (tab === 'types') return 'Управление типами меню';
      return 'Управление пунктами меню';
    }
    // Спец-случай: настройки проекта
    if (/^\/projects\/[^/]+\/settings/.test(location.pathname)) {
      const m = location.pathname.match(/^\/projects\/[^/]+\/settings\/([^/?#]+)/);
      const subsection = m?.[1] || null;
      const map: Record<string, string> = {
        domain: 'Домен и публикация',
        seo: 'SEO',
        theme: 'Тема',
        team: 'Команда',
        integrations: 'Интеграции',
        access: 'Доступ и роли',
        menu: 'Меню',
      };
      return subsection ? map[subsection] || 'Настройки проекта' : 'Настройки проекта';
    }
    if (isProjectPage) return headerProjectName || currentProject?.name || 'Проект';
    const path = location.pathname;
    if (path === '/' || path === '') return 'Панель управления Situs';
    if (path.startsWith('/projects')) return 'Проекты';
    if (path.startsWith('/orders')) return 'Заказы';
    if (path.startsWith('/marketing')) return 'Маркетинг';
    if (path.startsWith('/users')) return 'Пользователи';
    if (path.startsWith('/support')) return 'Поддержка';
    if (path.startsWith('/section-settings')) return 'Настройки';
    if (path.startsWith('/demo/components')) return 'Демонстрация компонентов';
    return 'Раздел';
  }, [isProjectPage, headerProjectName, currentProject?.name, location.pathname, location.search]);

  // Правило отображения кнопки создания по разделам
  const canCreateHere = useMemo(() => {
    if (location.pathname.startsWith('/projects')) return true;
    if (location.pathname.startsWith('/users')) {
      const searchParams = new URLSearchParams(location.search);
      const tab = searchParams.get('tab');
      return tab === 'users' || tab === 'roles' || !tab;
    }
    return false;
  }, [location.pathname, location.search]);
  const isPagesPage = useMemo(() => /^\/projects\/[^/]+\/pages/.test(location.pathname), [location.pathname]);
  const isProjectSettings = useMemo(() => /^\/projects\/[^/]+\/settings/.test(location.pathname), [location.pathname]);
  const settingsSubsection = useMemo(() => {
    const m = location.pathname.match(/^\/projects\/[^/]+\/settings\/([^/?#]+)/);
    return m?.[1] || null;
  }, [location.pathname]);

  // Состояние поиска в верхней панели
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; to?: string }>>([]);
  const [metaTitle, setMetaTitle] = useState<string | null>(null);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeSearch();
      };
      document.addEventListener('keydown', onKey);
      return () => {
        clearTimeout(t);
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!searchWrapperRef.current) return;
      if (!searchWrapperRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isSearchOpen]);

  // Загружаем крошки/метаданные из бэка для консистентности (полный переход на API /api/ui/meta)
  useReactEffect(() => {
    const load = async () => {
      const path = location.pathname;
      try {
        const res = await fetch(`/api/ui/meta?path=${encodeURIComponent(path)}`);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        const apiCrumbs = Array.isArray(data?.breadcrumbs) ? data.breadcrumbs : [];
        const apiTitle = typeof data?.title === 'string' && data.title.trim() ? data.title.trim() : null;
        if (apiCrumbs.length === 0 && path.startsWith('/projects') && projectId) {
          setBreadcrumbs([
            { label: 'Проекты', to: '/projects' },
            { label: headerProjectName || currentProject?.name || 'Проект', to: `/projects/${projectId}` },
          ]);
        } else {
          setBreadcrumbs(apiCrumbs);
        }
        setMetaTitle(apiTitle);
      } catch {
        // fallback на локальную базовую логику (без текущего leaf)
        const parts: Array<{ label: string; to?: string }> = [];
        if (path.startsWith('/projects') && projectId) {
          parts.push({ label: 'Проекты', to: '/projects' });
          parts.push({ label: headerProjectName || currentProject?.name || 'Проект', to: `/projects/${projectId}` });
          if (/^\/projects\/[^/]+\/settings\//.test(path)) {
            parts.push({ label: 'Настройки', to: `/projects/${projectId}/settings` });
          } else if (/^\/projects\/[^/]+\/pages\//.test(path)) {
            parts.push({ label: 'Страницы', to: `/projects/${projectId}/pages` });
          }
        }
        setBreadcrumbs(parts);
        setMetaTitle(null);
      }
    };
    load();
  }, [location.pathname, projectId, headerProjectName, currentProject?.name]);

  const onSubmitSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      closeSearch();
      return;
    }
    const base = isProjectPage
      ? `/projects/${projectId}`
      : `/${(location.pathname.split('/')[1] || '').replace(/\/$/, '')}`;
    const target =
      base && base !== '/' ? `${base}?search=${encodeURIComponent(q)}` : `/projects?search=${encodeURIComponent(q)}`;
    navigate(target);
    searchInputRef.current?.blur();
  };
  // Небольшая корректировка отступов хедера, чтобы добавить строку крошек и не увеличивать высоту заметно
  const showProjectBreadcrumbs = useMemo(() => /^\/projects\/[^/]+/.test(location.pathname), [location.pathname]);
  const headerPaddingY = showProjectBreadcrumbs ? 'py-3' : 'py-4';

  return (
    <>
      <header className="w-full bg-white dark:bg-dark border-b border-stroke dark:border-dark-3">
        <div
          className={`relative flex items-center justify-between bg-white dark:bg-dark min-h-[64px] ${headerPaddingY} pl-[70px] pr-4 md:pl-20 md:pr-8 xl:pl-8`}
        >
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}
            className="absolute left-4 top-1/2 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-lg
          border border-stroke bg-white text-dark hover:bg-gray dark:border-dark-3 dark:bg-dark-2 dark:text-white
          dark:hover:bg-dark-3 xl:hidden"
          >
            <FiMenu aria-hidden />
          </button>
          <div className="hidden sm:block w-full">
            <div
              className={`flex items-center justify-between w-full transition-opacity duration-150 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {/* Левая зона: заголовок и компактные крошки для страниц проекта */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold text-dark dark:text-white truncate">
                  {metaTitle || sectionTitle}
                </h1>
                {showProjectBreadcrumbs && (
                  <nav
                    className="hidden md:flex items-center gap-1 text-xs text-body-color dark:text-dark-6 leading-none truncate"
                    aria-label="Хлебные крошки"
                  >
                    {breadcrumbs.map((b, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span className="shrink-0">/</span>}
                        {b.to ? (
                          <Link to={b.to} className="hover:text-primary transition-colors truncate max-w-[240px]">
                            {b.label}
                          </Link>
                        ) : (
                          <span className="truncate shrink-0">{b.label}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </nav>
                )}
              </div>

              {/* Правая зона: поиск, уведомления, добавить, аккаунт */}
              <div className="hidden md:flex items-center gap-4">
                {/* Поиск слева от плюса */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`text-body-color hover:text-primary dark:text-dark-6 transition-transform duration-200 ${isSearchOpen ? 'translate-x-2 opacity-0 pointer-events-none' : ''}`}
                  title="Поиск"
                >
                  <FiSearch aria-hidden />
                </button>
                {/* Кнопка Добавить в акценте — крайняя справа */}
                {isPagesPage && (
                  <button
                    onClick={() => {
                      if (projectId) {
                        navigate(`/projects/${projectId}/pages/settings`);
                      }
                    }}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-stroke text-body-color hover:text-primary hover:border-primary dark:border-dark-3 dark:text-dark-6 transition-colors"
                    title="Настройки компонента Страницы"
                  >
                    <FiSettings aria-hidden />
                  </button>
                )}
                {canCreateHere && (
                  <button
                    onClick={() => {
                      // Менеджер меню доступен по двум путям: /projects/:id/menus и /projects/:id/settings/menu
                      if (
                        location.pathname.includes('/menus') ||
                        /\/projects\/[^/]+\/settings\/menu/.test(location.pathname)
                      ) {
                        const searchParams = new URLSearchParams(location.search);
                        const tab = searchParams.get('tab');
                        if (tab === 'types') {
                          window.dispatchEvent(new CustomEvent('situs:create-menu-type'));
                        } else {
                          window.dispatchEvent(new CustomEvent('situs:create-menu-item'));
                        }
                      } else if (location.pathname.startsWith('/users')) {
                        const searchParams = new URLSearchParams(location.search);
                        const tab = searchParams.get('tab');
                        if (tab === 'roles') {
                          window.dispatchEvent(new CustomEvent('situs:create-role'));
                        } else if (tab === 'users' || !tab) {
                          window.dispatchEvent(new CustomEvent('situs:create-user'));
                        }
                      } else if (location.pathname.startsWith('/projects')) {
                        window.dispatchEvent(new CustomEvent('situs:create-project'));
                      }
                    }}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors ml-2"
                    title="Добавить"
                  >
                    <FiPlus aria-hidden />
                  </button>
                )}
              </div>
            </div>

            {/* Поисковая панель поверх контента хедера (только в пределах хедера) */}
            {isSearchOpen && (
              <div ref={searchWrapperRef} className="absolute inset-0 z-20 flex items-center justify-end px-3 md:px-8">
                <form onSubmit={onSubmitSearch} className="relative w-full">
                  <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-body-color" aria-hidden />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по разделу..."
                    className="w-full bg-transparent py-2 pl-7 text-sm md:text-base text-dark dark:text-white placeholder:text-body-color/70 outline-none border-none"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    title="Закрыть поиск"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 text-body-color hover:text-primary transition-colors"
                  >
                    <FiX aria-hidden />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* overlay перенесён внутрь хедера */}
    </>
  );
};

export default SitusHeader;
