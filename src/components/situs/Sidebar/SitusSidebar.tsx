import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiShoppingCart,
  FiBarChart2,
  FiUsers,
  FiLifeBuoy,
  FiSettings,
  FiGlobe,
  FiMenu as FiMenuIcon,
  FiSearch,
  FiArrowLeft,
} from "react-icons/fi";
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

type AdminItem = { title: string; to: string };

const SitusSidebar: React.FC<SitusSidebarProps> = ({ sidebarOpen, setSidebarOpen, isOpen, onClose }) => {
  const location = useLocation();
  const { user } = (() => { try { return useUser(); } catch { return { user: null } as any; } })();
  const projectId = useMemo(() => {
    const m = location.pathname.match(/^\/projects\/([^\/]+)/);
    return m?.[1] || null;
  }, [location.pathname]);
  const [overlayPanel, setOverlayPanel] = useState<"overview" | "settings" | null>(null);
  const [adminItems, setAdminItems] = useState<AdminItem[] | null>(null);
  const [projectItems, setProjectItems] = useState<AdminItem[] | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (projectId) return;
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/ui/admin-sidebar");
        const json = await res.json();
        if (!aborted && json?.success && Array.isArray(json.data)) {
          setAdminItems(json.data as AdminItem[]);
        }
      } catch {
        // fallback остаётся на локальном меню
      }
    })();
    return () => { aborted = true; };
  }, [projectId]);

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
        if (t.startsWith('menu_')) {
          if (projectId) {
            // обновляем меню проекта
            try {
              const r1 = await fetch(`/api/ui/project-sidebar?projectId=${projectId}&type=project-sidebar`);
              const j1 = await r1.json().catch(() => null);
              if (j1?.success && Array.isArray(j1.data) && j1.data.length) {
                setProjectItems(j1.data as AdminItem[]);
              } else {
                const r2 = await fetch(`/api/ui/project-sidebar?projectId=${projectId}&type=admin-sidebar`);
                const j2 = await r2.json().catch(() => null);
                if (j2?.success && Array.isArray(j2.data)) setProjectItems(j2.data as AdminItem[]);
              }
            } catch {}
          } else {
            // обновляем глобальное меню админки
            try {
              const r = await fetch('/api/ui/admin-sidebar');
              const j = await r.json().catch(() => null);
              if (j?.success && Array.isArray(j.data)) setAdminItems(j.data as AdminItem[]);
            } catch {}
          }
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
    let aborted = false;
    (async () => {
      try {
        // Пытаемся загрузить project-sidebar
        const r1 = await fetch(`/api/ui/project-sidebar?projectId=${projectId}&type=project-sidebar`);
        const j1 = await r1.json().catch(() => null);
        if (!aborted && j1?.success && Array.isArray(j1.data) && j1.data.length) {
          setProjectItems(j1.data as AdminItem[]);
          return;
        }
        // Fallback: admin-sidebar для проекта
        const r2 = await fetch(`/api/ui/project-sidebar?projectId=${projectId}&type=admin-sidebar`);
        const j2 = await r2.json().catch(() => null);
        if (!aborted && j2?.success && Array.isArray(j2.data)) {
          setProjectItems(j2.data as AdminItem[]);
          return;
        }
        setProjectItems([]);
      } catch {
        setProjectItems([]);
      }
    })();
    return () => { aborted = true; };
  }, [projectId]);

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

  const navList: SitusNavItem[] = [
    {
      divider: false,
      link: "/",
      text: "Дашборд",
      icon: <FiGrid size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/projects",
      text: "Проекты",
      icon: <FiFolder size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/orders",
      text: "Заказы",
      icon: <FiShoppingCart size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/marketing",
      text: "Маркетинг",
      icon: <FiBarChart2 size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/users",
      text: "Пользователи",
      icon: <FiUsers size={18} aria-hidden />,
    },
    {
      divider: false,
      link: "/support",
      text: "Поддержка",
      icon: <FiLifeBuoy size={18} aria-hidden />,
    },
    {
      divider: true,
    },
    {
      divider: false,
      link: "/section-settings",
      text: "Настройки",
      icon: <FiSettings size={18} aria-hidden />,
    },
  ];

  const topItems: SitusNavItem[] = useMemo(() => {
    if (projectId) return [];
    if (adminItems?.length) {
      const mapped = adminItems.map((mi) => {
        let icon: React.ReactNode = <FiGrid size={18} aria-hidden />;
        if (mi.title === "Проекты") icon = <FiFolder size={18} aria-hidden />;
        if (mi.title === "Пользователи") icon = <FiUsers size={18} aria-hidden />;
        return { divider: false, link: mi.to, text: mi.title, icon } as SitusNavItem;
      });
      return mapped;
    }
    // fallback: локальная конфигурация
    return navList.filter((i) => i.divider === false);
  }, [projectId, adminItems]);

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
                  {/* Проектный режим: пункты из меню проекта */}
                  {(projectItems || []).map((mi, idx) => {
                    const isActive = mi.to === location.pathname || location.pathname.startsWith(mi.to + "/");
                    let icon: React.ReactNode = <FiGrid size={18} aria-hidden />;
                    if (/settings/.test(mi.to)) icon = <FiSettings size={18} aria-hidden />;
                    if (/menus/.test(mi.to)) icon = <FiMenuIcon size={18} aria-hidden />;
                    if (/projects\//.test(mi.to)) icon = <FiGrid size={18} aria-hidden />;
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