import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { projectsApi } from '../../../api/services/projects.api';
import { ProjectData } from '../../../types/project';
import { useProject } from '../../../contexts/ProjectContext';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectPageProps {}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadProject } = (() => {
    try {
      return useProject();
    } catch {
      return { loadProject: async () => {} } as any;
    }
  })();
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const navigate = useNavigate();

  // Локальные списки: верхние плитки (продукты) и виджеты (ниже)
  const [productsOrder, setProductsOrder] = useState<Array<{ id: string; name: string; type: string }>>([]);
  const [widgetsOrder, setWidgetsOrder] = useState<Array<{ id: string; title: string }>>([
    { id: 'w-currency', title: 'Курсы валют' },
    { id: 'w-weather', title: 'Погода' },
    { id: 'w-clock-moscow', title: 'Часы: Москва' },
    { id: 'w-clock-hk', title: 'Часы: Гонконг' },
  ]);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const response = await projectsApi.getProject(projectId);
        setProject(response as any);
        const prods = ((response as any)?.products || []).map((p: any) => ({ id: p.id, name: p.type, type: p.type }));
        setProductsOrder(prods);
      } catch (error) {
        console.error('Ошибка загрузки проекта:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Синхронизируем ProjectContext, чтобы верхняя панель показывала название проекта
  useEffect(() => {
    if (projectId) {
      // не блокируем UI
      Promise.resolve(loadProject(projectId)).catch(() => {});
    }
  }, [projectId]);

  // DnD компоненты
  const SortableTile: React.FC<{ item: { id: string; name: string; type?: string } }> = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.85 : 1 };
    const go = () => {
      if (!projectId) return;
      if (item.type === 'WEBSITE') navigate(`/projects/${projectId}/website`);
      else if (item.type === 'ECOMMERCE') navigate(`/projects/${projectId}/store`);
      else navigate(`/projects/${projectId}`);
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4 shadow-sm select-none"
        onClick={go}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-body-color dark:text-dark-6">Компонент</div>
            <div className="text-lg font-semibold text-dark dark:text-white">{item.name}</div>
          </div>
          {/* Drag handle */}
          <button
            type="button"
            aria-label="Перетащить"
            className="cursor-grab active:cursor-grabbing text-body-color dark:text-dark-6 p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-3"
            onClick={(e) => e.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        </div>
      </div>
    );
  };

  const SortableWidget: React.FC<{ item: { id: string; title: string } }> = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.85 : 1 };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4 shadow-sm cursor-grab active:cursor-grabbing h-32">
        <div className="text-sm text-body-color dark:text-dark-6">Виджет</div>
        <div className="text-lg font-semibold text-dark dark:text-white">{item.title}</div>
      </div>
    );
  };

  const onTilesDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = productsOrder.findIndex((p) => p.id === active.id);
    const newIndex = productsOrder.findIndex((p) => p.id === over.id);
    setProductsOrder(arrayMove(productsOrder, oldIndex, newIndex));
    // TODO: при необходимости сохранение порядка на бэке аналогично списку проектов (settings.orderIndex на уровне продукта)
  };

  const onWidgetsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = widgetsOrder.findIndex((w) => w.id === active.id);
    const newIndex = widgetsOrder.findIndex((w) => w.id === over.id);
    setWidgetsOrder(arrayMove(widgetsOrder, oldIndex, newIndex));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-dark-3 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-3 rounded w-1/2 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-dark-3 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-dark-3 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
          Проект не найден
        </h2>
        <p className="text-body-color dark:text-dark-6 mb-4">
          Проект с указанным ID не существует
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          title="Назад к проектам"
        >
          <FiArrowLeft aria-hidden />
        </Link>
      </div>
    );
  }

  // временно нет действий в хедере

  return (
    <div className="p-6 space-y-8">
      {/* Верх: плитки компонентов проекта (перетаскиваемые) */}
      <section>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Компоненты проекта</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onTilesDragEnd}>
          <SortableContext items={productsOrder.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productsOrder.map((item) => (
                <SortableTile key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay />
        </DndContext>
      </section>

      {/* Низ: дашборд‑виджеты с перетаскиванием (референс главной) */}
      <section>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Виджеты</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onWidgetsDragEnd}>
          <SortableContext items={widgetsOrder.map((w) => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {widgetsOrder.map((w) => (
                <SortableWidget key={w.id} item={w} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay />
        </DndContext>
      </section>
    </div>
  );
};

export default ProjectPage;
