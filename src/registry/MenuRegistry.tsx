import React from 'react';
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLayout,
  FiShoppingCart,
  FiMessageSquare,
  FiTrendingUp,
  FiBarChart,
  FiShield,
  FiMail,
  FiUsers,
  FiGrid,
  FiCompass,
  FiPhone,
  FiBookmark,
  FiEye,
  FiSearch,
  FiTarget,
  FiShare2,
  FiCamera,
  FiEdit,
  FiBell,
  FiStar,
  FiHeart,
  FiActivity,
  FiMapPin,
  FiLock,
  FiClock,
  FiFlag,
  FiZap,
  FiGift,
  FiTool,
  FiRefreshCw,
  FiBox,
  FiCpu,
  FiWifi,
  FiGlobe,
  FiSun,
  FiMoon,
  FiPlayCircle,
  FiPauseCircle,
  FiStopCircle,
  FiShuffle,
  FiRepeat,
  FiMic,
  FiHeadphones,
  FiRadio,
  FiPhoneCall,
  FiVideoOff,
  FiAlignLeft,
  FiDownload,
  FiUpload,
  FiCloudRain,
} from 'react-icons/fi';

import SitusDashboard from '../components/situs-new/pages/SitusDashboard';
import SitusProjects from '../components/situs-new/pages/SitusProjects';
import SitusWebsites from '../components/situs-new/pages/SitusWebsites';
import SitusStores from '../components/situs-new/pages/SitusStores';
import SitusChatbots from '../components/situs-new/pages/SitusChatbots';
import SitusOrders from '../components/situs-new/pages/SitusOrders';
import SitusOrdersProducts from '../components/situs-new/pages/SitusOrdersProducts';
import SitusOrdersServices from '../components/situs-new/pages/SitusOrdersServices';
import SitusMarketing from '../components/situs-new/pages/SitusMarketing';
import SitusUsersNew from '../components/situs-new/pages/SitusUsersNew';
import SitusProfileSettings from '../components/situs-new/pages/SitusProfileSettings';
import SitusSectionSettings from '../components/situs-new/pages/SitusSectionSettings';
import SitusSupport from '../components/situs-new/pages/SitusSupport';

/**
 * Интерфейс элемента меню
 */
export interface MenuItem {
  id: string;
  title: string;
  icon?: React.ComponentType;
  path?: string;
  component?: React.ComponentType;
  children?: MenuItem[];
  badge?: string | number;
  isActive?: boolean;
  isNew?: boolean;
  permission?: string;
}

/**
 * Интерфейс группы меню
 */
export interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

/**
 * Реестр меню системы
 */
class MenuRegistry {
  private static instance: MenuRegistry;
  private menuItems: MenuGroup[] = [];

  private constructor() {
    this.initializeMenu();
  }

  public static getInstance(): MenuRegistry {
    if (!MenuRegistry.instance) {
      MenuRegistry.instance = new MenuRegistry();
    }
    return MenuRegistry.instance;
  }

  /**
   * Создание компонента-заглушки для страниц в разработке
   */
  private createPlaceholderComponent(title: string, description: string): React.ComponentType {
    return function PlaceholderComponent() {
      return (
        <div className="flex items-center justify-center min-h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="mb-4">
              <FiTool className="mx-auto h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {description}
            </p>
          </div>
        </div>
      );
    };
  }

  /**
   * Инициализация структуры меню
   */
  private initializeMenu(): void {
    this.menuItems = [
      // Основное
      {
        id: 'main',
        title: 'Основное',
        items: [
          {
            id: 'dashboard',
            title: 'Дашборд',
            icon: FiHome,
            path: '/dashboard',
            component: SitusDashboard
          },
          {
            id: 'projects',
            title: 'Проекты',
            icon: FiLayout,
            path: '/projects',
            component: SitusProjects
          },
          {
            id: 'websites',
            title: 'Сайты',
            icon: FiGlobe,
            path: '/websites',
            component: SitusWebsites
          },
          {
            id: 'stores',
            title: 'Интернет-магазины',
            icon: FiShoppingCart,
            path: '/stores',
            component: SitusStores
          },
          {
            id: 'chatbots',
            title: 'Чат-боты',
            icon: FiMessageSquare,
            path: '/chatbots',
            component: SitusChatbots
          },
          {
            id: 'landings',
            title: 'Лендинги',
            icon: FiCompass,
            path: '/landings',
            component: this.createPlaceholderComponent('Лендинги', 'Управление лендинг-страницами')
          },
          {
            id: 'apps',
            title: 'Приложения',
            icon: FiGrid,
            path: '/apps',
            component: this.createPlaceholderComponent('Приложения', 'Управление мобильными приложениями')
          }
        ]
      },

      // Продажи и заказы
      {
        id: 'sales',
        title: 'Продажи и заказы',
        items: [
          {
            id: 'orders',
            title: 'Заказы',
            icon: FiShoppingCart,
            path: '/orders',
            component: SitusOrders
          },
          {
            id: 'products',
            title: 'Товары',
            icon: FiBox,
            path: '/products',
            component: SitusOrdersProducts
          },
          {
            id: 'services',
            title: 'Услуги',
            icon: FiTool,
            path: '/services',
            component: SitusOrdersServices
          },
          {
            id: 'feedback',
            title: 'Обратная связь',
            icon: FiMail,
            path: '/feedback',
            component: this.createPlaceholderComponent('Обратная связь', 'Заявки из форм обратной связи')
          },
          {
            id: 'analytics-orders',
            title: 'Аналитика заказов',
            icon: FiBarChart,
            path: '/analytics/orders',
            component: this.createPlaceholderComponent('Аналитика заказов', 'Статистика и анализ заказов')
          }
        ]
      },

      // Маркетинг
      {
        id: 'marketing',
        title: 'Маркетинг',
        items: [
          {
            id: 'marketing-dashboard',
            title: 'Маркетинг дашборд',
            icon: FiTrendingUp,
            path: '/marketing',
            component: SitusMarketing
          },
          {
            id: 'seo',
            title: 'SEO продвижение',
            icon: FiSearch,
            path: '/seo',
            component: this.createPlaceholderComponent('SEO продвижение', 'Оптимизация для поисковых систем')
          },
          {
            id: 'advertising',
            title: 'Реклама',
            icon: FiTarget,
            path: '/advertising',
            component: this.createPlaceholderComponent('Реклама', 'Управление рекламными кампаниями')
          },
          {
            id: 'analytics-marketing',
            title: 'Аналитика маркетинга',
            icon: FiActivity,
            path: '/analytics/marketing',
            component: this.createPlaceholderComponent('Аналитика маркетинга', 'Анализ эффективности и поведения пользователей')
          },
          {
            id: 'email-marketing',
            title: 'Email маркетинг',
            icon: FiMail,
            path: '/email-marketing',
            component: this.createPlaceholderComponent('Email маркетинг', 'Автоматизация email-рассылок')
          },
          {
            id: 'social-media',
            title: 'Социальные сети',
            icon: FiShare2,
            path: '/social-media',
            component: this.createPlaceholderComponent('Социальные сети', 'SMM и продвижение в социальных сетях')
          }
        ]
      },

      // Пользователи и настройки
      {
        id: 'users-settings',
        title: 'Пользователи и настройки',
        items: [
          {
            id: 'users',
            title: 'Пользователи',
            icon: FiUsers,
            path: '/users',
            component: SitusUsersNew
          },
          {
            id: 'profile',
            title: 'Мой профиль',
            icon: FiUser,
            path: '/profile',
            component: SitusProfileSettings
          },
          {
            id: 'settings',
            title: 'Настройки',
            icon: FiSettings,
            path: '/settings',
            component: SitusSectionSettings
          },
          {
            id: 'permissions',
            title: 'Права доступа',
            icon: FiShield,
            path: '/permissions',
            component: SitusUsersNew
          }
        ]
      },

      // Поддержка
      {
        id: 'support',
        title: 'Поддержка',
        items: [
          {
            id: 'support-center',
            title: 'Центр поддержки',
            icon: FiHeart,
            path: '/support',
            component: SitusSupport
          }
        ]
      }
    ];
  }

  /**
   * Получение всех групп меню
   */
  public getMenuGroups(): MenuGroup[] {
    return this.menuItems;
  }

  /**
   * Получение группы меню по ID
   */
  public getMenuGroup(groupId: string): MenuGroup | undefined {
    return this.menuItems.find(group => group.id === groupId);
  }

  /**
   * Получение элемента меню по пути
   */
  public getMenuItemByPath(path: string): MenuItem | undefined {
    for (const group of this.menuItems) {
      for (const item of group.items) {
        if (item.path === path) {
          return item;
        }
        if (item.children) {
          const childItem = this.findInChildren(item.children, path);
          if (childItem) return childItem;
        }
      }
    }
    return undefined;
  }

  /**
   * Поиск в дочерних элементах
   */
  private findInChildren(children: MenuItem[], path: string): MenuItem | undefined {
    for (const child of children) {
      if (child.path === path) {
        return child;
      }
      if (child.children) {
        const found = this.findInChildren(child.children, path);
        if (found) return found;
      }
    }
    return undefined;
  }

  /**
   * Получение активных элементов меню
   */
  public getActiveMenuItems(): MenuItem[] {
    const activeItems: MenuItem[] = [];
    
    for (const group of this.menuItems) {
      for (const item of group.items) {
        if (item.isActive) {
          activeItems.push(item);
        }
        if (item.children) {
          const activeChildren = item.children.filter(child => child.isActive);
          activeItems.push(...activeChildren);
        }
      }
    }
    
    return activeItems;
  }

  /**
   * Обновление статуса активности элемента меню
   */
  public setActiveMenuItem(path: string): void {
    // Сначала деактивируем все элементы
    this.deactivateAllItems();
    
    // Затем активируем нужный
    const item = this.getMenuItemByPath(path);
    if (item) {
      item.isActive = true;
    }
  }

  /**
   * Деактивация всех элементов меню
   */
  private deactivateAllItems(): void {
    for (const group of this.menuItems) {
      for (const item of group.items) {
        item.isActive = false;
        if (item.children) {
          item.children.forEach(child => {
            child.isActive = false;
          });
        }
      }
    }
  }

  /**
   * Добавление нового элемента меню
   */
  public addMenuItem(groupId: string, menuItem: MenuItem): boolean {
    const group = this.getMenuGroup(groupId);
    if (group) {
      group.items.push(menuItem);
      return true;
    }
    return false;
  }

  /**
   * Удаление элемента меню
   */
  public removeMenuItem(groupId: string, itemId: string): boolean {
    const group = this.getMenuGroup(groupId);
    if (group) {
      const index = group.items.findIndex(item => item.id === itemId);
      if (index !== -1) {
        group.items.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Получение flat списка всех элементов меню для поиска
   */
  public getAllMenuItems(): MenuItem[] {
    const allItems: MenuItem[] = [];
    
    for (const group of this.menuItems) {
      for (const item of group.items) {
        allItems.push(item);
        if (item.children) {
          allItems.push(...item.children);
        }
      }
    }
    
    return allItems;
  }
}

// Экспорт singleton instance
export default MenuRegistry.getInstance(); 