import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItemData, MenuTypeData } from '../types/menu';

/**
 * Хук для управления состоянием MenuManager
 * Централизует всё состояние и обработчики событий
 */
export const useMenuManagerState = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ==================== СОСТОЯНИЕ ====================
  
  const [selectedMenuType, setSelectedMenuType] = useState<string>('');
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [displayStyle, setDisplayStyle] = useState<'tree' | 'list'>('tree');
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
  const [editingMenuType, setEditingMenuType] = useState<MenuTypeData | null>(null);
  const [deletingMenuType, setDeletingMenuType] = useState<MenuTypeData | null>(null);
  const [allMenuItems, setAllMenuItems] = useState<MenuItemData[]>([]);

  // ==================== URL И ВКЛАДКИ ====================

  // Определение активной вкладки из URL
  const searchParams = new URLSearchParams(location.search);
  const activeTab = (searchParams.get('tab') as 'items' | 'types') || 'items';

  // Функция для переключения вкладок с обновлением URL
  const setActiveTab = useCallback((tab: 'items' | 'types') => {
    const newSearchParams = new URLSearchParams(location.search);
    if (tab === 'items') {
      newSearchParams.delete('tab');
    } else {
      newSearchParams.set('tab', tab);
    }
    const newSearch = newSearchParams.toString();
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  }, [location, navigate]);

  // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

  // Обработчик кнопки "+" в верхней панели
  useEffect(() => {
    const handleCreateMenuItem = () => {
      setShowCreateItemModal(true);
    };

    const handleCreateMenuType = () => {
      setShowCreateTypeModal(true);
    };

    window.addEventListener('situs:create-menu-item', handleCreateMenuItem as EventListener);
    window.addEventListener('situs:create-menu-type', handleCreateMenuType as EventListener);
    
    return () => {
      window.removeEventListener('situs:create-menu-item', handleCreateMenuItem as EventListener);
      window.removeEventListener('situs:create-menu-type', handleCreateMenuType as EventListener);
    };
  }, []);

  // ==================== АВТОМАТИЧЕСКИЙ ВЫБОР ГЛАВНОГО МЕНЮ ====================

  const autoSelectMainMenu = useCallback((menuTypes: MenuTypeData[]) => {
    if (menuTypes.length > 0 && !selectedMenuType) {
      const mainMenu = menuTypes.find((mt: MenuTypeData) => mt.name === 'main');
      if (mainMenu) {
        setSelectedMenuType(mainMenu.id);
      }
    }
  }, [selectedMenuType]);

  // ==================== МОДАЛЬНЫЕ ОКНА ====================

  const closeCreateItemModal = useCallback(() => setShowCreateItemModal(false), []);
  const closeCreateTypeModal = useCallback(() => setShowCreateTypeModal(false), []);
  const closeEditItemModal = useCallback(() => setEditingItem(null), []);
  const closeEditTypeModal = useCallback(() => setEditingMenuType(null), []);
  const closeDeleteTypeModal = useCallback(() => setDeletingMenuType(null), []);

  const openCreateItemModal = useCallback(() => setShowCreateItemModal(true), []);
  const openCreateTypeModal = useCallback(() => setShowCreateTypeModal(true), []);
  const openEditItemModal = useCallback((item: MenuItemData) => setEditingItem(item), []);
  const openEditTypeModal = useCallback((type: MenuTypeData) => setEditingMenuType(type), []);
  const openDeleteTypeModal = useCallback((type: MenuTypeData) => setDeletingMenuType(type), []);

  return {
    // Состояние
    selectedMenuType,
    setSelectedMenuType,
    showCreateItemModal,
    editingItem,
    displayStyle,
    setDisplayStyle,
    showCreateTypeModal,
    editingMenuType,
    deletingMenuType,
    allMenuItems,
    setAllMenuItems,
    
    // URL и вкладки
    activeTab,
    setActiveTab,
    
    // Утилиты
    autoSelectMainMenu,
    
    // Модальные окна - закрытие
    closeCreateItemModal,
    closeCreateTypeModal,
    closeEditItemModal,
    closeEditTypeModal,
    closeDeleteTypeModal,
    
    // Модальные окна - открытие
    openCreateItemModal,
    openCreateTypeModal,
    openEditItemModal,
    openEditTypeModal,
    openDeleteTypeModal
  };
};
