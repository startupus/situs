import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaGlobe, FaStore, FaBlog, FaCubes, FaFileAlt, FaFolderOpen } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, arrayMove, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiChevronLeft, FiChevronRight, FiPauseCircle } from 'react-icons/fi';
import { useSite } from '../../../contexts/SiteContext';
import { ProjectData } from '../../../types/project';
import { projectsApi } from '../../../api/services/projects.api';
import { testIds } from '../../ui/testids';

interface ProjectsListProps {
  onCreateProject: () => void;
  refreshKey?: number;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ onCreateProject, refreshKey = 0 }) => {
  const { state } = useSite();
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [orderedProjects, setOrderedProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [loading, setLoading] = useState(false);

  // Загружаем данные проектов с продуктами
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const response = await projectsApi.getProjects();
        setProjectsData(response.projects || []);
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [refreshKey]);

  // Перезагрузка данных по требованию (для SSE)
  const reloadProjects = useCallback(async () => {
    try {
      const response = await projectsApi.getProjects();
      setProjectsData(response.projects || []);
    } catch (e) {
      // глушим
    }
  }, []);

  // Используем данные из API вместо SiteContext
  const projects = useMemo(() => {
    const mapped = projectsData.map((project: any) => {
      const settingsObj = (() => {
        try { return typeof project.settings === 'string' ? JSON.parse(project.settings) : (project.settings || {}); } catch { return {}; }
      })();
      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        description: project.description,
        status: project.status || 'ACTIVE', // Сохраняем оригинальный статус
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        products: project.products || [],
        settings: project.settings,
        orderIndex: typeof settingsObj.orderIndex === 'number' ? settingsObj.orderIndex : null,
        domain: project.domain || null,
        isSystemAdmin: Boolean(settingsObj?.isSystemAdmin) || project.slug === 'situs-admin',
      } as any;
    });
    // Сортировка по orderIndex, если он есть; остальные в конце, сохраняем относительный порядок
    return mapped
      .map((p: any, i: number) => ({ ...p, __orig: i }))
      .sort((a: any, b: any) => {
        const ai = a.orderIndex; const bi = b.orderIndex;
        if (ai == null && bi == null) return a.__orig - b.__orig;
        if (ai == null) return 1;
        if (bi == null) return -1;
        return ai - bi;
      })
      .map(({ __orig, ...rest }: any) => rest);
  }, [projectsData]);

  useEffect(() => {
    setOrderedProjects(projects);
    setCurrentPage(1);
  }, [projects]);

  const totalPages = Math.max(1, Math.ceil(orderedProjects.length / pageSize));
  const clampedPage = Math.min(currentPage, totalPages);
  const startIndex = (clampedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedProjects = orderedProjects.slice(startIndex, endIndex);

  useEffect(() => {
    // Если сменили размер страницы — откатываемся на первую
    setCurrentPage(1);
  }, [pageSize]);

  const error = state.error;

  // Утилита сортировки по orderIndex с сохранением относительного порядка прочих элементов
  const sortByOrderIndex = useCallback((arr: any[]) => {
    return arr
      .map((p: any, i: number) => ({ ...p, __orig: i }))
      .sort((a: any, b: any) => {
        const ai = a.orderIndex; const bi = b.orderIndex;
        if (ai == null && bi == null) return a.__orig - b.__orig;
        if (ai == null) return 1;
        if (bi == null) return -1;
        return ai - bi;
      })
      .map(({ __orig, ...rest }: any) => rest);
  }, []);

  const handleDelete = async (projectId: string, projectName: string) => {
    const confirmName = window.prompt(`Для удаления проекта введите его точное название:\n${projectName}`);
    const normalizedInput = (confirmName || '').trim().replace(/^"|"$/g, '');
    const normalizedName = (projectName || '').trim();
    if (!normalizedInput || normalizedInput.localeCompare(normalizedName, undefined, { sensitivity: 'base' }) !== 0) {
      alert('Название не совпало. Удаление отменено.');
      return;
    }
    try {
      const { projectsApi } = await import('../../../api/services/projects.api');
      await projectsApi.deleteProject(projectId);
      // Перезагрузим список
      window.location.reload();
    } catch (e: any) {
      alert(e?.message || 'Ошибка удаления');
    }
  };

  const handleToggleActive = async (projectId: string, nextActive: boolean) => {
    // Оптимистично обновляем UI без перезагрузки
    setOrderedProjects((prev) => prev.map(p => p.id === projectId ? { ...p, status: nextActive ? 'ACTIVE' : 'SUSPENDED' } : p));
    try {
      const { projectsApi } = await import('../../../api/services/projects.api');
      await projectsApi.updateProjectStatus(projectId, nextActive ? 'ACTIVE' : 'SUSPENDED');
      // Рассылаем событие, чтобы другие вкладки синхронизировались
      try {
        localStorage.setItem('situs:project-status', JSON.stringify({ id: projectId, at: Date.now(), active: nextActive }));
        // Также отправим BroadcastChannel, если поддерживается
        if ('BroadcastChannel' in window) {
          const ch = new BroadcastChannel('situs-projects');
          ch.postMessage({ type: 'status', id: projectId, active: nextActive });
          ch.close();
        }
      } catch {}
    } catch (e: any) {
      // Откат на ошибке
      setOrderedProjects((prev) => prev.map(p => p.id === projectId ? { ...p, status: !nextActive ? 'active' : 'inactive' } : p));
      alert(e?.message || 'Не удалось изменить статус проекта');
    }
  };

  const handleRestoreProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Отправить запрос на восстановление проекта "${projectName}"?`)) {
      return;
    }
    
    try {
      const { projectsApi } = await import('../../../api/services/projects.api');
      await projectsApi.updateProjectStatus(projectId, 'ACTIVE');
      alert(`Запрос на восстановление проекта "${projectName}" отправлен администратору.`);
      // Перезагрузим список
      window.location.reload();
    } catch (e: any) {
      alert(e?.message || 'Ошибка отправки запроса на восстановление');
    }
  };

  // DnD
  const sensors = useSensors(
    // Небольшая задержка и толеранс делают перетаскивание нативнее и уменьшают случайные перетаскивания
    useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Индексы считаем по всему списку, даже если перетаскиваем в рамках текущей страницы
    const oldIndex = orderedProjects.findIndex((p) => p.id === active.id);
    const newIndex = orderedProjects.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(orderedProjects, oldIndex, newIndex);
    setOrderedProjects(newOrder);
    // Пытаемся сохранить порядок в settings.orderIndex (персональный порядок пользователя)
    try {
      const { projectsApi } = await import('../../../api/services/projects.api');
      await Promise.all(
        newOrder.map((p, idx) => {
          const settingsObj = (() => {
            try { return typeof p.settings === 'string' ? JSON.parse(p.settings) : (p.settings || {}); } catch { return {}; }
          })();
          return projectsApi.updateProject(p.id, { settings: { ...settingsObj, orderIndex: idx } } as any);
        })
      );
    } catch {
      // Молча — UI уже перерисован; при ошибке порядок не сохранится на сервере
    }
  };

  // Sync между вкладками/окнами
  useEffect(() => {
    const apply = (id: string, active: boolean) => setOrderedProjects((prev) => prev.map(p => p.id === id ? { ...p, status: active ? 'active' : 'inactive' } : p));
    // Дебаунс общего обновления по SSE
    const reloadTimerRef = { current: 0 as any } as React.MutableRefObject<any>;
    const scheduleReload = () => {
      if (reloadTimerRef.current) return;
      reloadTimerRef.current = window.setTimeout(async () => {
        reloadTimerRef.current = 0;
        await reloadProjects();
      }, 300);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'situs:project-status' || !e.newValue) return;
      try { const { id, active } = JSON.parse(e.newValue); apply(id, active); } catch {}
    };
    window.addEventListener('storage', onStorage);
    let bc: BroadcastChannel | undefined;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel('situs-projects');
      bc.onmessage = (msg) => { const d = msg?.data; if (d?.type === 'status') apply(d.id, d.active); };
    }
    // Универсальная подписка на SSE/Fetch-стрим (работает в Chrome и FF)
    const unsubscribe = projectsApi.subscribeEvents((evt: any) => {
      const t = (evt?.type || '').toString();
      if (t === 'project_status') {
        apply(evt.payload?.id, (evt.payload?.status || '').toUpperCase() === 'ACTIVE');
        return;
      }
      if (t === 'project_reordered') {
        const id = evt?.payload?.id as string;
        const orderIndex = evt?.payload?.orderIndex as number | undefined;
        if (id && typeof orderIndex === 'number') {
          setOrderedProjects((prev) => sortByOrderIndex(prev.map((p) => p.id === id ? { ...p, orderIndex } : p)));
        }
        return;
      }
      if (t === 'project_created' || t === 'project_updated' || t === 'project_deleted') {
        scheduleReload();
      }
    });
    return () => { window.removeEventListener('storage', onStorage); try { bc?.close(); } catch {}; try { unsubscribe(); } catch {}; if (reloadTimerRef.current) { try { clearTimeout(reloadTimerRef.current); } catch {} } };
  }, []);

  // (удалено) Дублирующая подписка на SSE была объединена в единый эффект выше

  const SortableCard: React.FC<{ project: any }> = ({ project }) => {
    const navigate = useNavigate();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.85 : 1,
    };

    const activeProducts = (project.products || []).filter((p: any) => (p.status || '').toString().toUpperCase() === 'ACTIVE');

    const ActiveSwitcher: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => {
      return (
        <label className="flex cursor-pointer select-none items-center">
          <div className="relative">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only peer"
              disabled={disabled}
            />
            <div className={`block h-6 w-10 rounded-full border ${disabled ? 'border-gray-300 bg-gray-200' : 'border-[#BFCEFF] bg-[#EAEEFB]'} peer-checked:bg-green-500/90 transition-colors`}></div>
            <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4 pointer-events-none ${disabled ? 'opacity-60' : ''}`} />
          </div>
        </label>
      );
    };

    const isInactive = project.status !== 'ACTIVE';
    const isSystem = Boolean((project as any).isSystemAdmin);
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`rounded-xl border transition-all duration-200 shadow-sm cursor-grab active:cursor-grabbing flex flex-col h-full 
          ${isInactive ? 'bg-gray-100/70 border-gray-200 dark:bg-dark-3 dark:border-dark-4 opacity-80 pointer-events-auto' : 'bg-white dark:bg-dark-2 border-stroke dark:border-dark-3 hover:border-primary/50 dark:hover:border-primary/50'}`}
        data-testid={testIds.projects.card}
      >
        <div
          className="p-4 flex-1"
          role="button"
          tabIndex={0}
          onClick={() => { if (!isDragging && project.status !== 'DELETED') navigate(`/projects/${project.id}`); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && project.status !== 'DELETED') navigate(`/projects/${project.id}`); }}
        >
          {/* Верхняя строка: иконка + тумблер */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${project.status === 'DELETED' ? 'bg-red-100/50' : isInactive ? 'bg-gray-300/30' : 'bg-primary/10'}`}>
              {project.status === 'DELETED' ? (
                <FiTrash2 className="w-6 h-6 text-red-500" />
              ) : isInactive ? (
                <FiPauseCircle className="w-6 h-6 text-gray-500" />
              ) : (
                <FaFolderOpen className="w-6 h-6 text-primary" />
              )}
            </div>
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} data-testid={testIds.projects.statusToggle}>
              {project.status === 'DELETED' ? (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              ) : (
                <ActiveSwitcher checked={project.status === 'ACTIVE'} onChange={(v) => handleToggleActive(project.id, v)} disabled={isSystem} />
              )}
            </div>
          </div>

          {/* Сведения */}
          <div className="mb-0">
            <h3 className={`text-lg font-semibold mb-1 ${isInactive ? 'text-gray-500 dark:text-dark-6' : 'text-dark dark:text-white'}`}>
              {project.name}
              {isSystem && (
                <span className="ml-2 inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 align-middle uppercase">system</span>
              )}
            </h3>
            <div className={`${isInactive ? 'text-gray-400 dark:text-dark-5' : 'text-body-color dark:text-dark-6'} text-sm mb-3`}>
              <div className="flex items-center justify-between">
                {project.domain ? (
                  <span className="text-xs">{project.domain}</span>
                ) : (
                  <span className="text-xs ${isInactive ? 'text-gray-400' : 'text-body-color/70'}">домен не настроен</span>
                )}
              </div>
            </div>

            <div className={`flex items-center justify-between text-sm ${isInactive ? 'text-gray-400 dark:text-dark-5' : 'text-body-color dark:text-dark-6'}`}>
              <div className="flex items-center gap-1">
                {(activeProducts.length ? activeProducts : []).map((p: any) => (
                  <a key={p.id} href={`/projects/${project.id}`} title={p.type} className={`inline-flex items-center justify-center w-7 h-7 rounded ${isInactive ? 'bg-gray-300/30 text-gray-500' : 'bg-primary/10 text-primary hover:bg-primary/20'}`} data-testid={testIds.projects.detailLink}>
                    {getProductTypeIcon((p.type || '').toString().toUpperCase())}
                  </a>
                ))}
              </div>
              <div className="text-right"></div>
            </div>
          </div>
        </div>

        {/* Нижняя панель действий под разделителем */}
          <div className={`border-t rounded-b-xl px-4 py-2.5 flex items-center justify-between ${isInactive || project.status === 'DELETED' ? 'border-gray-200 bg-gray-100/60 dark:border-dark-4 dark:bg-dark-3/50' : 'border-stroke dark:border-dark-3 bg-gray-50/60 dark:bg-dark-3/50'}`}>
          {project.status === 'DELETED' ? (
            <button onClick={(e)=> { e.stopPropagation(); handleRestoreProject(project.id, project.name); }} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors">
              Восстановить
            </button>
          ) : (
            <Link to={`/projects/${project.id}`} onClick={(e)=> e.stopPropagation()} className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isInactive ? 'bg-gray-200 text-gray-600 dark:bg-dark-4/60 dark:text-dark-6 pointer-events-none' : 'bg-gray-100 dark:bg-dark-4 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark transition-colors'}`}>
              Подробнее
            </Link>
          )}
          {isSystem ? (
            <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-[11px] font-medium text-purple-700 bg-purple-50">system</span>
          ) : (
            <button onClick={(e)=>{ e.stopPropagation(); handleDelete(project.id, project.name); }} className={`inline-flex items-center justify-center w-9 h-9 rounded-md ${isInactive || project.status === 'DELETED' ? 'text-body-color hover:text-red-600 hover:bg-red-50/40 dark:hover:bg-red-900/10' : 'text-body-color hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'} transition-colors`} title="Удалить проект">
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-dark-2 rounded-lg p-6 border border-stroke dark:border-dark-3 animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-dark-3 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-3 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-dark-3 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 dark:bg-dark-3 rounded w-16"></div>
                <div className="h-3 bg-gray-200 dark:bg-dark-3 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="fill-current text-red-500 mx-auto mb-4"
          >
            <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C21.177 52 12 42.823 12 32C12 21.177 21.177 12 32 12C42.823 12 52 21.177 52 32C52 42.823 42.823 52 32 52Z"/>
            <path d="M32 20C25.373 20 20 25.373 20 32C20 38.627 25.373 44 32 44C38.627 44 44 38.627 44 32C44 25.373 38.627 20 32 20ZM32 40C27.589 40 24 36.411 24 32C24 27.589 27.589 24 32 24C36.411 24 40 27.589 40 32C40 36.411 36.411 40 32 40Z"/>
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
            Ошибка загрузки проектов
          </h3>
          <p className="text-body-color dark:text-dark-6 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="fill-current text-gray-400 dark:text-dark-6 mx-auto mb-4"
          >
            <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C21.177 52 12 42.823 12 32C12 21.177 21.177 12 32 12C42.823 12 52 21.177 52 32C52 42.823 42.823 52 32 52Z"/>
            <path d="M16 16H48V48H16V16ZM18 18V46H46V18H18Z"/>
            <path d="M24 24H40V32H24V24ZM24 36H40V44H24V36Z"/>
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
            Проекты не найдены
          </h3>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Создайте свой первый проект
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6" data-testid={testIds.projects.list}>
      {/* Список проектов */}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={pagedProjects.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedProjects.map((project) => (
              <SortableCard key={project.id} project={project} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={{ duration: 150 }} />
      </DndContext>

      {/* Нижняя панель: размер страницы + пагинация под списком */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
        <div className="flex items-center gap-3 order-2 md:order-1">
          <label className="text-sm text-body-color dark:text-dark-6">На странице:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-9 rounded-md border border-stroke bg-white px-2 text-sm dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value={3}>3</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>

        {totalPages > 1 && (
          <div className="order-1 md:order-2 w-full md:w-auto flex items-center justify-center">
            <div className="inline-flex gap-1 rounded-full border border-stroke p-3 dark:border-white/10">
              <ul className="flex items-center gap-1">
                <li>
                  <button
                    className="flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-white/5 disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={clampedPage <= 1}
                    aria-label="Предыдущая страница"
                  >
                    <FiChevronLeft />
                  </button>
                </li>

                {Array.from({ length: totalPages }).map((_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || (n >= clampedPage - 2 && n <= clampedPage + 2))
                  .map((n) => (
                    <li key={n}>
                      <button
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full px-2 ${
                          n === clampedPage ? 'bg-primary text-white' : 'text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-white/5'
                        }`}
                        onClick={() => setCurrentPage(n)}
                      >
                        {n}
                      </button>
                    </li>
                  ))}

                <li>
                  <button
                    className="flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-white/5 disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={clampedPage >= totalPages}
                    aria-label="Следующая страница"
                  >
                    <FiChevronRight />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Вспомогательные функции
const getProductTypeIcon = (type: string) => {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'WEBSITE':
      return <FaGlobe className={cls} />;
    case 'STORE':
      return <FaStore className={cls} />;
    case 'BLOG':
      return <FaBlog className={cls} />;
    case 'APP':
      return <FaCubes className={cls} />;
    case 'LANDING':
      return <FaFileAlt className={cls} />;
    default:
      return <FaCubes className={cls} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'SUSPENDED':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    case 'DELETED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // По умолчанию активный
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Активен';
    case 'SUSPENDED':
      return 'Неактивен';
    case 'DELETED':
      return 'Удален';
    default:
      return status;
  }
};

export default ProjectsList;
