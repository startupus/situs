import React from 'react';
import { MenuItemData, MenuTypeData } from '../../../types/menu';
import MenuItemsList from './MenuItemsList';
import MenuPreview from './MenuPreview';

interface MenuItemsTabProps {
  menuItems: MenuItemData[];
  menuTypes: MenuTypeData[];
  selectedMenuType: string;
  displayStyle: 'tree' | 'list';
  projectId: string;
  onEditItem: (item: MenuItemData) => void;
  onDeleteItem: (itemId: string) => Promise<void>;
  onCreateItem: () => void;
  onReorderItems: (items: any[]) => Promise<void>;
  onUpdateMenuItem: (id: string, updates: Partial<MenuItemData>) => Promise<void>;
  onMenuTypeChange: (typeId: string) => void;
  onMenuTypesUpdate: () => void;
  onDisplayStyleChange: (style: 'tree' | 'list') => void;
}

const MenuItemsTab: React.FC<MenuItemsTabProps> = ({
  menuItems,
  menuTypes,
  selectedMenuType,
  displayStyle,
  projectId,
  onEditItem,
  onDeleteItem,
  onCreateItem,
  onReorderItems,
  onUpdateMenuItem,
  onMenuTypeChange,
  onMenuTypesUpdate,
  onDisplayStyleChange
}) => {
  return (
    <div>
      <MenuItemsList
        menuItems={menuItems}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        onCreateItem={onCreateItem}
        onReorderItems={onReorderItems}
        onUpdateMenuItem={onUpdateMenuItem}
        displayStyle={displayStyle}
        selectedMenuType={selectedMenuType}
        onMenuTypeChange={onMenuTypeChange}
        menuTypes={menuTypes}
        onMenuTypesUpdate={onMenuTypesUpdate}
        projectId={projectId}
        onDisplayStyleChange={onDisplayStyleChange}
      />
      
      {/* Предпросмотр внизу */}
      {selectedMenuType && (
        <div className="mt-8">
          <MenuPreview 
            projectId={projectId}
            selectedMenuType={selectedMenuType}
            menuItems={menuItems}
          />
        </div>
      )}
    </div>
  );
};

export default MenuItemsTab;
