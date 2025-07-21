// 🎨 NEW Left Sidebar - Powered by Component Registry
import React, { useState, useEffect, useMemo } from 'react';
import { componentRegistry } from '../../components-registry';
import type { ComponentMetadata, ComponentSearchQuery, ComponentCategory } from '../../components-registry';

interface LeftSidebarNewProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  darkMode?: boolean;
}

const LeftSidebarNew: React.FC<LeftSidebarNewProps> = ({
  collapsed,
  setCollapsed,
  darkMode = false
}) => {
  // 🏛️ State управления
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [panelLevel, setPanelLevel] = useState<1 | 2 | 3>(1);

  // 📊 Данные из Registry
  const [registry, setRegistry] = useState(componentRegistry.getRegistry());
  const [components, setComponents] = useState<ComponentMetadata[]>([]);

  // 🔄 Обновление данных при изменениях
  useEffect(() => {
    const updateRegistry = () => {
      setRegistry(componentRegistry.getRegistry());
    };

    componentRegistry.on('registry:synced', updateRegistry);
    componentRegistry.on('component:added', updateRegistry);
    
    return () => {
      // Cleanup listeners
    };
  }, []);

  // 🔍 Поиск компонентов
  const searchResults = useMemo(() => {
    const query: ComponentSearchQuery = {
      query: searchQuery || undefined,
      category: selectedCategory || undefined,
      subcategory: selectedSubcategory || undefined,
      sortBy: 'popularity',
      sortOrder: 'desc',
      limit: 50
    };

    return componentRegistry.searchComponents(query);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  // 📋 Категории для отображения
  const categories = Object.entries(registry.categories).map(([key, category]) => ({
    key: key as ComponentCategory,
    ...category
  }));

  // 🔄 Обработчики навигации
  const handleCategorySelect = (category: ComponentCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setPanelLevel(2);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setPanelLevel(3);
  };

  const handleBackToLevel = (level: 1 | 2) => {
    setPanelLevel(level);
    if (level === 1) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else if (level === 2) {
      setSelectedSubcategory(null);
    }
  };

  // 🎯 Drag & Drop
  const handleDragStart = (e: React.DragEvent, component: ComponentMetadata) => {
    const dragData = {
      id: component.id,
      name: component.name,
      componentName: component.id, // Используем ID как componentName
      props: component.component.props,
      category: component.category,
      subcategory: component.subcategory
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  };

  // 🎨 Иконки категорий
  const getCategoryIcon = (category: ComponentCategory) => {
    const iconClass = "w-5 h-5";
    const currentColor = selectedCategory === category ? "#2563eb" : darkMode ? "#9ca3af" : "#6b7280";
    
    switch (category) {
      case 'core':
        return (
          <svg className={iconClass} fill={currentColor} viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        );
      case 'pro':
        return (
          <svg className={iconClass} fill={currentColor} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'templates':
        return (
          <svg className={iconClass} fill={currentColor} viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
          </svg>
        );
      case 'custom':
        return (
          <svg className={iconClass} fill={currentColor} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill={currentColor} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
    }
  };

  // 🔄 Навигационные иконки
  const ChevronLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border-r transition-all duration-300 flex ${
      collapsed ? 'w-0' : 'w-96'
    }`}>
      {!collapsed && (
        <>
          {/* 📊 Header с поиском */}
          <div className="flex flex-col w-full">
            <div className={`p-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Component Registry
                </h3>
              </div>
              
              {/* 🔍 Поиск */}
              <div className="relative">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Поиск компонентов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <div className="absolute left-2 top-2.5">
                  <SearchIcon />
                </div>
              </div>
              
              {/* 📊 Статистика */}
              <div className="mt-3 text-xs text-gray-500">
                Всего: {registry.stats.totalComponents} компонентов
              </div>
            </div>

            {/* 🔄 Навигационные панели */}
            <div className="flex-1 flex">
              {/* Уровень 1: Категории */}
              <div className={`transition-all duration-300 border-r ${darkMode ? 'border-gray-600' : 'border-gray-100'} ${
                panelLevel === 1 ? 'w-full' : 'w-24'
              }`}>
                <div className="space-y-1 p-2">
                  {categories.map(category => (
                    <button
                      key={category.key}
                      onClick={() => handleCategorySelect(category.key)}
                      className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors text-sm ${
                        selectedCategory === category.key
                          ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                      }`}
                      title={category.label}
                    >
                      <span className="flex-shrink-0">
                        {getCategoryIcon(category.key)}
                      </span>
                      {panelLevel === 1 && (
                        <div className="ml-3 text-left">
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs opacity-70">{category.componentIds.length} компонентов</div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Уровень 2: Подкатегории */}
              {panelLevel >= 2 && selectedCategory && (
                <div className={`transition-all duration-300 border-r ${darkMode ? 'border-gray-600' : 'border-gray-100'} ${
                  panelLevel === 2 ? 'flex-1' : 'w-32'
                }`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-100'} flex items-center justify-between`}>
                    {panelLevel === 2 && (
                      <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {registry.categories[selectedCategory].label}
                      </h3>
                    )}
                    <button 
                      onClick={() => handleBackToLevel(1)}
                      className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                    >
                      <ChevronLeftIcon />
                    </button>
                  </div>
                  <div className="space-y-1 p-2">
                    {registry.categories[selectedCategory].subcategories.map(subcategory => {
                      const componentsInSubcategory = searchResults.components.filter(
                        comp => comp.subcategory === subcategory
                      ).length;
                      
                      return (
                        <button
                          key={subcategory}
                          onClick={() => handleSubcategorySelect(subcategory)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                            selectedSubcategory === subcategory
                              ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`
                              : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                          }`}
                        >
                          <div className={panelLevel === 2 ? '' : 'text-xs'}>
                            {panelLevel === 2 ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : subcategory.slice(0, 8)}
                            {panelLevel === 2 && (
                              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} block`}>
                                {componentsInSubcategory} компонентов
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Уровень 3: Компоненты */}
              {panelLevel === 3 && selectedSubcategory && (
                <div className="flex-1">
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-100'} flex items-center justify-between`}>
                    <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {selectedSubcategory} ({searchResults.components.filter(c => c.subcategory === selectedSubcategory).length})
                    </h3>
                    <button 
                      onClick={() => handleBackToLevel(2)}
                      className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                    >
                      <ChevronLeftIcon />
                    </button>
                  </div>
                  <div className="p-2 space-y-2 h-full overflow-y-auto">
                    {searchResults.components
                      .filter(comp => comp.subcategory === selectedSubcategory)
                      .map(component => (
                        <div
                          key={component.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, component)}
                          className={`${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                          } rounded-lg p-3 cursor-move transition-colors border group`}
                        >
                          <img
                            src={component.preview.thumbnail}
                            alt={component.name}
                            className="w-full h-20 object-cover rounded mb-2 bg-gradient-to-br from-blue-50 to-purple-50"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzNCODJGNiIgcng9IjgiLz48dGV4dCB4PSIxNTAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkNvbXBvbmVudDwvdGV4dD48L3N2Zz4=';
                            }}
                          />
                          <p className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {component.name}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            {component.description?.substring(0, 60)}...
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              component.source === 'pro' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {component.source}
                            </span>
                            {component.featured && (
                              <span className="text-xs text-yellow-500">⭐</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* 🔄 Кнопка сворачивания */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute top-1/2 -translate-y-1/2 -right-3 ${
          darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'
        } border rounded-full p-1 shadow-sm transition-colors z-10`}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>
    </div>
  );
};

export default LeftSidebarNew; 