import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProject } from "../../../contexts/ProjectContext";
import { FiMenu, FiArrowLeft, FiSearch, FiBell, FiX, FiPlus, FiSettings } from "react-icons/fi";
import { projectsApi } from "../../../api/services/projects.api";

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
    const match = location.pathname.match(/^\/projects\/([^\/]+)/);
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
    return () => { ignore = true; };
  }, [isProjectPage, projectId, currentProject?.id, currentProject?.name]);

  // Вспомогательные вычисления для заголовка/навигации
  const sectionTitle = useMemo(() => {
    // Спец-случай: страница продукта Website — показываем "Сайт"
    if (/^\/projects\/[^/]+\/website/.test(location.pathname)) return 'Сайт';
    // Спец-случай: страница меню — показываем заголовок в зависимости от вкладки
    if (/^\/projects\/[^/]+\/menus/.test(location.pathname)) {
      // Пытаемся определить активную вкладку из URL или localStorage
      const searchParams = new URLSearchParams(location.search);
      const tab = searchParams.get('tab');
      if (tab === 'types') return 'Управление типами меню';
      return 'Управление пунктами меню';
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

  const backHref = useMemo(() => {
    // Спец-случай: страница меню — возвращаемся в проект
    if (/^\/projects\/[^/]+\/menus/.test(location.pathname)) {
      const match = location.pathname.match(/^\/projects\/([^/]+)/);
      return match ? `/projects/${match[1]}` : '/projects';
    }
    if (isProjectPage) return '/projects';
    if (location.pathname.startsWith('/demo/components')) return '/section-settings/appearance';
    if (location.pathname !== '/') return '/';
    return undefined;
  }, [isProjectPage, location.pathname]);

  // Настройки доступны в левом сайдбаре — отдельной иконки в хедере не нужно

  // Правило отображения кнопки создания по разделам
  const canCreateHere = useMemo(() => {
    if (location.pathname.startsWith('/projects')) return true;
    if (location.pathname.startsWith('/users')) {
      // На странице пользователей кнопка + доступна только на вкладках "Пользователи" и "Роли"
      const searchParams = new URLSearchParams(location.search);
      const tab = searchParams.get('tab');
      return tab === 'users' || tab === 'roles' || !tab; // по умолчанию вкладка "users"
    }
    // можно расширить: orders etc.
    return false;
  }, [location.pathname, location.search]);
  const isWebsitePage = useMemo(() => /^\/projects\/[^/]+\/website/.test(location.pathname), [location.pathname]);

  // Состояние поиска в верхней панели
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (isSearchOpen) {
      // Фокус и обработка ESC
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

  const onSubmitSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      closeSearch();
      return;
    }
    // Навигация к странице с результатами поиска текущего раздела
    const base = isProjectPage ? `/projects/${projectId}` : `/${(location.pathname.split('/')[1] || '').replace(/\/$/, '')}`;
    const target = base && base !== '/' ? `${base}?search=${encodeURIComponent(q)}` : `/projects?search=${encodeURIComponent(q)}`;
    navigate(target);
    // Оставляем строку поиска открытой, но убираем фокус для визуального отклика
    searchInputRef.current?.blur();
  };
  return (
    <>
      <header className="w-full bg-white dark:bg-dark border-b border-stroke dark:border-dark-3">
        <div className="relative flex items-center justify-between bg-white dark:bg-dark min-h-[64px] py-4 pl-[70px] pr-4 md:pl-20 md:pr-8 xl:pl-8">
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
            <div className={`flex items-center justify-between w-full transition-opacity duration-150 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {/* Левая зона: стрелка назад (если не главная) + заголовок раздела */}
              <div className="flex items-center gap-3 min-w-0">
                {backHref && (
                  <Link to={backHref} className="text-body-color hover:text-primary dark:text-dark-6" title="Назад">
                    <FiArrowLeft aria-hidden />
                  </Link>
                )}
                <h1 className="text-xl md:text-2xl font-semibold text-dark dark:text-white truncate">
                  {sectionTitle}
                </h1>
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
                {isWebsitePage && (
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('situs:open-website-settings', { detail: { tab: 'menu' } }));
                    }}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-stroke text-body-color hover:text-primary hover:border-primary dark:border-dark-3 dark:text-dark-6 transition-colors"
                    title="Настройки сайта"
                  >
                    <FiSettings aria-hidden />
                  </button>
                )}
                {canCreateHere && (
                  <button
                    onClick={() => {
                      if (location.pathname.includes('/menus')) {
                        // Определяем активную вкладку из URL
                        const searchParams = new URLSearchParams(location.search);
                        const tab = searchParams.get('tab');
                        
                        if (tab === 'types') {
                          // На вкладке "Типы меню" создаем тип меню
                          window.dispatchEvent(new CustomEvent('situs:create-menu-type'));
                        } else {
                          // На вкладке "Пункты меню" создаем пункт меню
                          window.dispatchEvent(new CustomEvent('situs:create-menu-item'));
                        }
                      } else if (location.pathname.startsWith('/users')) {
                        // Определяем активную вкладку из URL
                        const searchParams = new URLSearchParams(location.search);
                        const tab = searchParams.get('tab');
                        
                        if (tab === 'roles') {
                          // На вкладке "Роли и права" создаем роль
                          window.dispatchEvent(new CustomEvent('situs:create-role'));
                        } else if (tab === 'users' || !tab) {
                          // На вкладке "Пользователи" создаем пользователя напрямую
                          window.dispatchEvent(new CustomEvent('situs:create-user'));
                        }
                        // На вкладках "Приглашения" и "Настройки" кнопка + не работает
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
              <div
                ref={searchWrapperRef}
                className="absolute inset-0 z-20 flex items-center justify-end px-3 md:px-8"
              >
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