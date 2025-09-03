import React from 'react';
import { MenuSection, MenuItem, RouteConfig } from '../types/menu';

// Иконки для меню
import {
  FiHome,
  FiBriefcase,
  FiShoppingCart,
  FiMessageCircle,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiUser,
  FiSliders,
  FiGlobe,
  FiSmartphone,
  FiZap,
  FiPackage,
  FiMail,
  FiBarChart,
  FiTarget,
  FiShare2,
} from 'react-icons/fi';

// Импорт компонентов страниц
import SitusDashboard from '../components/situs/pages/SitusDashboard';
import SitusProjects from '../components/situs/pages/SitusProjects';
import SitusWebsites from '../components/situs/pages/SitusWebsites';
import SitusStores from '../components/situs/pages/SitusStores';
import SitusChatbots from '../components/situs/pages/SitusChatbots';
import SitusOrders from '../components/situs/pages/SitusOrders';
import SitusOrdersProducts from '../components/situs/pages/SitusOrdersProducts';
import SitusOrdersServices from '../components/situs/pages/SitusOrdersServices';
import SitusMarketing from '../components/situs/pages/SitusMarketing';
import SitusUsers from '../components/situs/pages/SitusUsers';
import SitusUsersNew from '../components/situs/pages/SitusUsersNew';
import SitusSupport from '../components/situs/pages/SitusSupport';
import SitusProfileSettings from '../components/situs/pages/SitusProfileSettings';
import SitusSectionSettings from '../components/situs/pages/SitusSectionSettings';

class SitusMenuRegistry {
  private sections: MenuSection[] = [];
  private routes: RouteConfig[] = [];

  constructor() {
    this.initializeDefaultMenu();
  }

  private initializeDefaultMenu() {
    // Главное меню
    this.addSection({
      id: 'main',
      title: 'Основные',
      items: [
        {
          id: 'dashboard',
          title: 'Дашборд',
          path: '/',
          icon: FiHome,
          component: SitusDashboard,
        },
      ],
    });

    // Проекты
    this.addSection({
      id: 'projects',
      title: 'Проекты',
      items: [
        {
          id: 'projects',
          title: 'Все проекты',
          path: '/projects',
          icon: FiBriefcase,
          component: SitusProjects,
        },
        {
          id: 'websites',
          title: 'Веб-сайты',
          path: '/projects/websites',
          icon: FiGlobe,
          component: SitusWebsites,
        },
        {
          id: 'stores',
          title: 'Интернет-магазины',
          path: '/projects/stores',
          icon: FiShoppingCart,
          component: SitusStores,
        },
        {
          id: 'chatbots',
          title: 'Чат-боты',
          path: '/projects/chatbots',
          icon: FiMessageCircle,
          component: SitusChatbots,
        },
        {
          id: 'landings',
          title: 'Лендинги',
          path: '/projects/landings',
          icon: FiZap,
          component: this.createPlaceholderComponent('Лендинги', 'Управление лендинг-страницами'),
        },
        {
          id: 'apps',
          title: 'Приложения',
          path: '/projects/apps',
          icon: FiSmartphone,
          component: this.createPlaceholderComponent('Приложения', 'Управление мобильными приложениями'),
        },
      ],
    });

    // Заказы
    this.addSection({
      id: 'orders',
      title: 'Заказы',
      items: [
        {
          id: 'orders-all',
          title: 'Все заказы',
          path: '/orders',
          icon: FiPackage,
          component: SitusOrders,
        },
        {
          id: 'orders-products',
          title: 'Товары',
          path: '/orders/products',
          icon: FiPackage,
          component: SitusOrdersProducts,
        },
        {
          id: 'orders-services',
          title: 'Услуги',
          path: '/orders/services',
          icon: FiPackage,
          component: SitusOrdersServices,
        },
        {
          id: 'orders-forms',
          title: 'Обратная связь',
          path: '/orders/forms',
          icon: FiMail,
          component: this.createPlaceholderComponent('Обратная связь', 'Заявки из форм обратной связи'),
        },
        {
          id: 'orders-analytics',
          title: 'Аналитика заказов',
          path: '/orders/analytics',
          icon: FiBarChart,
          component: this.createPlaceholderComponent('Аналитика заказов', 'Статистика и анализ заказов'),
        },
      ],
    });

    // Маркетинг
    this.addSection({
      id: 'marketing',
      title: 'Маркетинг',
      items: [
        {
          id: 'marketing-all',
          title: 'Обзор',
          path: '/marketing',
          icon: FiTrendingUp,
          component: SitusMarketing,
        },
        {
          id: 'marketing-seo',
          title: 'SEO продвижение',
          path: '/marketing/seo',
          icon: FiTarget,
          component: this.createPlaceholderComponent('SEO продвижение', 'Оптимизация для поисковых систем'),
        },
        {
          id: 'marketing-advertising',
          title: 'Реклама',
          path: '/marketing/advertising',
          icon: FiTarget,
          component: this.createPlaceholderComponent('Реклама', 'Управление рекламными кампаниями'),
        },
        {
          id: 'marketing-analytics',
          title: 'Аналитика маркетинга',
          path: '/marketing/analytics',
          icon: FiBarChart,
          component: this.createPlaceholderComponent(
            'Аналитика маркетинга',
            'Анализ эффективности и поведения пользователей',
          ),
        },
        {
          id: 'marketing-email',
          title: 'Email маркетинг',
          path: '/marketing/email',
          icon: FiMail,
          component: this.createPlaceholderComponent('Email маркетинг', 'Автоматизация email-рассылок'),
        },
        {
          id: 'marketing-social',
          title: 'Социальные сети',
          path: '/marketing/social',
          icon: FiShare2,
          component: this.createPlaceholderComponent('Социальные сети', 'SMM и продвижение в социальных сетях'),
        },
      ],
    });

    // Пользователи
    this.addSection({
      id: 'users',
      title: 'Пользователи',
      items: [
        {
          id: 'users-new',
          title: 'Управление пользователями',
          path: '/users-new',
          icon: FiUsers,
          component: SitusUsersNew,
        },
      ],
    });

    // Настройки
    this.addSection({
      id: 'settings',
      title: 'Настройки',
      items: [
        {
          id: 'profile-settings',
          title: 'Профиль',
          path: '/profile-settings',
          icon: FiUser,
          component: SitusProfileSettings,
        },
        {
          id: 'section-settings',
          title: 'Разделы',
          path: '/section-settings',
          icon: FiSliders,
          component: SitusSectionSettings,
        },
        {
          id: 'users-settings',
          title: 'Пользователи',
          path: '/users-new',
          icon: FiUsers,
          component: SitusUsersNew,
        },
      ],
    });

    // Поддержка
    this.addSection({
      id: 'support',
      title: 'Поддержка',
      items: [
        {
          id: 'support',
          title: 'Техподдержка',
          path: '/support',
          icon: FiMessageCircle,
          component: SitusSupport,
        },
      ],
    });

    this.generateRoutes();
  }

  private createPlaceholderComponent(title: string, description: string) {
    return () => (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-dark dark:text-white">{title}</h1>
        <p className="text-body-color dark:text-dark-6 mt-2">{description}</p>
      </div>
    );
  }

  addSection(section: MenuSection) {
    this.sections.push(section);
  }

  addMenuItem(sectionId: string, item: MenuItem & { component?: React.ComponentType }) {
    const section = this.sections.find((s) => s.id === sectionId);
    if (section) {
      section.items.push(item);
      if (item.component) {
        this.routes.push({
          path: item.path,
          component: item.component,
        });
      }
    }
  }

  getSections(): MenuSection[] {
    return this.sections;
  }

  getRoutes(): RouteConfig[] {
    return this.routes;
  }

  private generateRoutes() {
    this.routes = [];
    this.sections.forEach((section) => {
      section.items.forEach((item) => {
        if ((item as any).component) {
          this.routes.push({
            path: item.path,
            component: (item as any).component,
          });
        }
      });
    });
  }

  getMenuByPath(path: string): MenuItem | null {
    for (const section of this.sections) {
      for (const item of section.items) {
        if (item.path === path) {
          return item;
        }
      }
    }
    return null;
  }

  getActiveMenu(currentPath: string): MenuItem | null {
    return this.getMenuByPath(currentPath);
  }

  // Метод для получения меню для сайдбара (совместимость со старым форматом)
  getSidebarMenu() {
    return this.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        divider: false,
        link: item.path,
        text: item.title,
        icon: item.icon ? React.createElement(item.icon, { width: 18, height: 18, className: 'fill-current' }) : null,
        hasSubmenu: false,
        submenu: [],
      })),
    }));
  }
}

// Singleton экземпляр
export const menuRegistry = new SitusMenuRegistry();

export default menuRegistry;
