import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiUsers,
  FiSettings,
  FiMenu as FiMenuIcon,
  FiArrowLeft,
} from "react-icons/fi";
// Динамические наборы иконок для поддержки конфигурации из БД
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import ProjectSidebarOverlay from "./ProjectSidebarOverlay";
import UserMenuList from "../Header/UserMenuList";
import { useUser } from "../../../contexts/UserContext";
import { usersApi } from "../../../api/services/users.api";

interface SitusNavItem {
  divider: boolean;
  link?: string;
  text?: string;
  icon?: React.ReactNode;
}

interface SitusSidebarProps {
  // Текущий API компонента
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  // Совместимость с новым лейаутом
  isOpen?: boolean;
  onClose?: () => void;
}

type AdminItem = { title: string; to: string; params?: any; icon?: string; iconLibrary?: string };

const SitusSidebar: React.FC<SitusSidebarProps> = ({ sidebarOpen, setSidebarOpen, isOpen, onClose }) => {
  const location = useLocation();
  const { user } = (() => { try { return useUser(); } catch { return { user: null } as any; } })();
  const projectId = useMemo(() => {
    const m = location.pathname.match(/^\/projects\/([^\/]+)/);
    return m?.[1] || null;
  }, [location.pathname]);
  const [overlayPanel, setOverlayPanel] = useState<"overview" | "settings" | null>(null);
  const [adminItems, setAdminItems] = useState<AdminItem[] | null>(null);
  const [systemProjectItems, setSystemProjectItems] = useState<AdminItem[] | null>(null);
  const [projectItems, setProjectItems] = useState<AdminItem[] | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  // Резолв иконки из настроек пункта меню (icon + iconLibrary)
  const resolveIconNode = useCallback((item?: { icon?: string; iconLibrary?: string }, fallback?: React.ReactNode) => {
    const size = 18;
    const name = item?.icon || "";
    if (name) {
      const lib = (item?.iconLibrary || (name.startsWith("Fi") ? "fi" : name.startsWith("Fa") ? "fa" : name.startsWith("Md") ? "md" : "fi")).toLowerCase();
      const packs: Record<string, any> = { fi: FiIcons, fa: FaIcons, md: MdIcons };
      const pack = packs[lib];
      const Cmp = pack ? pack[name as keyof typeof pack] : undefined;
      if (Cmp) {
        try {
          const IconComp = Cmp as React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
          return <IconComp size={size} aria-hidden />;
        } catch {}
      }
    }
    return fallback ?? <FiGrid size={size} aria-hidden />;
  }, []);

  // Преобразование глобальных пунктов admin-sidebar в проектные маршруты текущего проекта
  const mapAdminToProject = useCallback((items: AdminItem[], pid: string): AdminItem[] => {
    const remap = (to: string): string => {
      if (!to || to === '/') return `/projects/${pid}`;
      if (to === '/projects') return `/projects/${pid}/pages`;
      if (to === '/orders') return `/projects/${pid}/store`;
      if (to === '/marketing') return `/projects/${pid}/settings/seo`;
      if (to === '/users') return `/projects/${pid}/settings/access`;
      if (to === '/support') return `/projects/${pid}/settings/integrations`;
      if (to === '/section-settings') return `/projects/${pid}/settings`;
      return to.startsWith('/projects/') ? to : `/projects/${pid}`;
    };
    return items.map((i) => ({ title: i.title, to: remap(i.to || '#') }));
  }, []);

  // Преобразование шаблона проектной навигации системного проекта ("/project/...") в маршруты текущего проекта
  const mapSystemProjectToProject = useCallback((items: AdminItem[], pid: string): AdminItem[] => {
    const remap = (to: string): string => {
      if (!to || to === '/project') return `/projects/${pid}`;
      // Заменяем префикс /project на /projects/:id
      return to.replace(/^\/project(\/|$)/, `/projects/${pid}$1`);
    };
    return items.map((i) => ({ title: i.title, to: remap(i.to || '#') }));
  }, []);

  // Всегда поддерживаем в состоянии adminItems как единый источник для админ-навигации
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/ui/admin-sidebar");
        const json = await res.json();
        if (!aborted && json?.success && Array.isArray(json.data)) {
          setAdminItems(json.data as AdminItem[]);
          if (!json.data.length) { try { console.warn('[SIDEBAR] admin-sidebar is empty at init'); } catch {} }
        } else {
          try { console.warn('[SIDEBAR] failed to load admin-sidebar at init'); } catch {}
        }
      } catch {}
    })();
    return () => { aborted = true; };
  }, []);

  // SSE автообновление меню (admin/project)
  useEffect(() => {
    // Закрываем предыдущее соединение
    try { sseRef.current?.close(); } catch {}
    const es = new EventSource('/api/realtime/projects');
    sseRef.current = es;
    es.onmessage = async (ev) => {
      try {
        const data = JSON.parse(ev.data || '{}');
        const t = data?.type as string;
        if (!t) return;
        try { console.debug('[SIDEBAR_SSE] event:', t); } catch {}
        if (t.startsWith('menu_')) {
          try {
            const r = await fetch('/api/ui/admin-sidebar');
            const j = await r.json().catch(() => null);
            if (j?.success && Array.isArray(j.data)) {
              setAdminItems(j.data as AdminItem[]);
              if (!j.data.length) { try { console.warn('[SIDEBAR] admin-sidebar is empty'); } catch {} }
            } else {
              try { console.warn('[SIDEBAR] failed to load admin-sidebar'); } catch {}
            }
          } catch {}
          try {
            const rp = await fetch('/api/ui/system-project-sidebar');
            const jp = await rp.json().catch(() => null);
            if (jp?.success && Array.isArray(jp.data)) {
              setSystemProjectItems(jp.data as AdminItem[]);
              if (!jp.data.length) { try { console.warn('[SIDEBAR] system-project-sidebar is empty'); } catch {} }
            } else {
              try { console.warn('[SIDEBAR] failed to load system-project-sidebar'); } catch {}
            }
          } catch {}
        }
      } catch {}
    };
    es.onerror = () => {
      try { es.close(); } catch {}
    };
    return () => { try { es.close(); } catch {}; sseRef.current = null; };
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setProjectItems(null);
      return;
    }
    let canceled = false;
    (async () => {
      try {
        const rp = await fetch('/api/ui/system-project-sidebar');
        const jp = await rp.json().catch(() => null);
        if (!canceled && jp?.success && Array.isArray(jp.data)) {
          setSystemProjectItems(jp.data as AdminItem[]);
        }
      } catch {}
      // Подстраховка: если по какой-то причине шаблон пуст — подхватим admin-sidebar (fallback)
      if (!systemProjectItems || systemProjectItems.length === 0) {
        try {
          const ra = await fetch('/api/ui/admin-sidebar');
          const ja = await ra.json().catch(() => null);
          if (!canceled && ja?.success && Array.isArray(ja.data)) setAdminItems(ja.data as AdminItem[]);
        } catch {}
      }
    })();
    return () => { canceled = true; };
  }, [projectId]);

  // Синхронизируем состояние проектных пунктов при обновлении adminItems
  useEffect(() => {
    if (!projectId) return;
    if (!adminItems || adminItems.length === 0) return;
    try {
      const mapped = mapAdminToProject(adminItems, projectId);
      setProjectItems(mapped);
    } catch {}
  }, [projectId, adminItems, mapAdminToProject]);

  // Вычисляем проектные пункты из adminItems (единый источник)
  const projectMappedItems: AdminItem[] = useMemo(() => {
    if (!projectId) return [];
    // Приоритет: шаблон проектной навигации из системного проекта
    if (systemProjectItems && systemProjectItems.length) {
      try { return mapSystemProjectToProject(systemProjectItems, projectId); } catch {}
    }
    // Fallback: маппинг admin-sidebar
    if (adminItems && adminItems.length) {
      try { return mapAdminToProject(adminItems, projectId); } catch {}
    }
    return projectItems || [];
  }, [projectId, systemProjectItems, adminItems, mapSystemProjectToProject, mapAdminToProject, projectItems]);

  // Системное вычисление ссылки "назад" (поднятие на уровень выше по URL)
  const backTarget = useMemo(() => {
    const pathOnly = location.pathname.split('?')[0].split('#')[0];
    const segments = pathOnly.split('/').filter(Boolean);
    if (segments.length === 0) return "/";
    // если на корне списка проектов → назад на дашборд
    if (segments.length === 1) return "/";
    // отсекаем последний сегмент пути
    const parentSegments = segments.slice(0, -1);
    const parentPath = '/' + parentSegments.join('/');
    return parentPath || "/";
  }, [location.pathname]);

  // Источник меню админки берём исключительно с бэкенда (`/api/ui/admin-sidebar`).
  // Локальный fallback навигации удалён по требованию: при отсутствии данных отображаем пустое меню.

  const topItems: SitusNavItem[] = useMemo(() => {
    if (projectId) return [];
    if (adminItems?.length) {
      const mapped = adminItems.map((mi) => {
        const fallback = mi.title === "Проекты" ? <FiFolder size={18} aria-hidden /> : mi.title === "Пользователи" ? <FiUsers size={18} aria-hidden /> : <FiGrid size={18} aria-hidden />;
        const iconNode = resolveIconNode(mi, fallback);
        return { divider: false, link: mi.to, text: mi.title, icon: iconNode } as SitusNavItem;
      });
      return mapped;
    }
    // Без локального фолбэка возвращаем пустой список, чтобы навигация полагалась только на API
    return [];
  }, [projectId, adminItems, resolveIconNode]);

  const computedOpen = typeof sidebarOpen === "boolean" ? sidebarOpen : !!isOpen;

  const handleSidebarToggle = () => {
    if (setSidebarOpen) {
      setSidebarOpen(!computedOpen);
      return;
    }
    if (onClose && computedOpen) {
      onClose();
    }
  };

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("АС");

  useEffect(() => {
    let canceled = false;
    const applyFromUser = (u: any) => {
      if (!u) return;
      const profile = u.profile && typeof u.profile === 'object' ? u.profile : undefined;
      const name: string = u.name || profile?.name || u.username || '';
      const initials = name
        ? name.trim().split(/\s+/).slice(0, 2).map((s: string) => s.charAt(0).toUpperCase()).join('')
        : 'АС';
      const av = u.avatar || profile?.avatar || null;
      if (!canceled) {
        setUserInitials(initials || 'АС');
        setAvatarUrl(av);
      }
    };

    if (user) {
      applyFromUser(user);
    } else {
      (async () => {
        try {
          const me = await usersApi.getCurrentUser();
          applyFromUser(me as any);
        } catch {
          // keep defaults
        }
      })();
    }
    return () => { canceled = true; };
  }, [user?.id]);

  return (
    <>
      <div
        className={`shadow-1 dark:bg-dark-2 dark:shadow-box-dark fixed top-0 left-0 z-40 flex h-screen w-[90px] flex-col bg-white duration-200 xl:translate-x-0 ${computedOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div>
          <div className="px-6 pt-6 pb-6">
            {projectId ? (
              <Link to={backTarget} title="Назад" className="h-8 w-8 rounded flex items-center justify-center border border-stroke dark:border-dark-3 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-3">
                <FiArrowLeft aria-hidden />
              </Link>
            ) : (
              <Link to="/">
                <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
              </Link>
            )}
          </div>
          <nav>
            <ul>
              {!projectId && topItems.map((item, index) => {
                if (item?.divider === false) {
                  const isProjects = item.link === "/projects";
                  const isActive = isProjects ? location.pathname.startsWith("/projects") : location.pathname === item.link;
                  return (
                    <React.Fragment key={index}>
                      <li className="group relative">
                        <Link
                          to={item.link || "#"}
                          className={`text-body-color hover:border-primary hover:bg-primary/5 hover:text-primary dark:text-dark-6 relative flex items-center justify-center border-r-4 border-transparent px-9 py-3 text-base font-medium duration-200 ${
                            isActive ? "border-primary bg-primary/5 text-primary" : ""
                          }`}
                        >
                          <span>{item.icon}</span>
                        </Link>
                        <span className="text-body-color shadow-1 dark:bg-dark-2 dark:text-dark-6 dark:shadow-box-dark invisible absolute top-1/2 left-[115%] -translate-y-1/2 rounded-[5px] bg-white px-[14px] py-[6px] text-sm whitespace-nowrap group-hover:visible">
                          <span className="dark:text-dark-2 absolute top-1/2 -left-2 -translate-y-1/2 text-white">
                            <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                              <path d="M1.23134 6.8294C0.642883 6.43303 0.642882 5.56697 1.23133 5.1706L7.44134 0.987699C8.10557 0.540292 9 1.01624 9 1.81709L9 10.1829C9 10.9838 8.10557 11.4597 7.44134 11.0123L1.23134 6.8294Z" />
                            </svg>
                          </span>
                          {item.text}
                        </span>
                      </li>
                    </React.Fragment>
                  );
                }
                return (
                  <li key={index}>
                    <div className="bg-stroke dark:bg-dark-3 mx-6 my-3 h-[1px]"></div>
                  </li>
                );
              })}
              {projectId && (
                <>
                  {/* Проектный режим: пункты из меню проекта (из admin-sidebar, смэппленные в контекст проекта) */}
                  {(projectMappedItems || []).map((mi, idx) => {
                    const isActive = mi.to === location.pathname || location.pathname.startsWith(mi.to + "/");
                    const fallback = /menus/.test(mi.to)
                      ? <FiMenuIcon size={18} aria-hidden />
                      : /settings/.test(mi.to)
                        ? <FiSettings size={18} aria-hidden />
                        : <FiGrid size={18} aria-hidden />;
                    const icon = resolveIconNode(mi, fallback);
                    return (
                      <li className="group relative" key={idx}>
                        <Link
                          to={mi.to || "#"}
                          className={`text-body-color hover:border-primary hover:bg-primary/5 hover:text-primary dark:text-dark-6 relative flex items-center justify-center border-r-4 border-transparent px-9 py-3 text-base font-medium duration-200 ${
                            isActive ? "border-primary bg-primary/5 text-primary" : ""
                          }`}
                        >
                          <span>{icon}</span>
                        </Link>
                        <span className="text-body-color shadow-1 dark:bg-dark-2 dark:text-dark-6 dark:shadow-box-dark invisible absolute top-1/2 left-[115%] -translate-y-1/2 rounded-[5px] bg-white px-[14px] py-[6px] text-sm whitespace-nowrap group-hover:visible">{mi.title}</span>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </nav>
          {projectId && overlayPanel && (
            <ProjectSidebarOverlay projectId={projectId} panel={overlayPanel} onClose={() => setOverlayPanel(null)} />)
          }
        </div>

        {/* Аватар фиксированно прижат к низу сайдбара и всегда на виду */}
        <div className="px-6 pt-5 pb-6 relative mt-auto">
          <div className="absolute left-1/2 bottom-4 -translate-x-1/2">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="h-[38px] w-[38px] rounded-full bg-gray-200 dark:bg-dark-3 flex items-center justify-center text-dark dark:text-white font-semibold shadow-sm"
              title="Профиль"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={userInitials} className="h-full w-full rounded-full object-cover" />
              ) : (
                userInitials
              )}
            </button>
            {userMenuOpen && (
              <div className="absolute left-[60px] bottom-0 z-50 w-56 rounded-md border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 shadow-md">
                <UserMenuList />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        onClick={handleSidebarToggle}
        className={`fixed top-0 left-0 z-30 h-screen w-full bg-black/80 xl:hidden ${computedOpen ? "-translate-x-full" : "translate-x-0"}`}
      ></div>
    </>
  );
};

export default SitusSidebar; 