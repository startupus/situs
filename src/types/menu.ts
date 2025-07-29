// Централизованная система меню для Situs Platform
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: React.ComponentType<any>;
  iconSvg?: string;
  children?: MenuItem[];
  component?: React.ComponentType;
  isActive?: boolean;
  badge?: string | number;
  permission?: string;
  divider?: boolean;
  hidden?: boolean;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
  permission?: string;
  collapsed?: boolean;
}

export interface MenuRegistry {
  sections: MenuSection[];
  getMenuByPath: (path: string) => MenuItem | null;
  getActiveMenu: (currentPath: string) => MenuItem | null;
  generateRoutes: () => React.ReactNode;
  registerMenuItem: (sectionId: string, item: MenuItem) => void;
  updateMenuItem: (sectionId: string, itemId: string, updates: Partial<MenuItem>) => void;
}

export interface MenuItemComponent {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  layout?: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
} 