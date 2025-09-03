import React from 'react';
import {
  FiHome,
  FiUser,
  FiUsers,
  FiSettings,
  FiInfo,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMenu,
  FiArrowRight,
  FiChevronDown,
  FiCompass,
  FiNavigation,
  FiShoppingCart,
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiTag,
  FiDollarSign,
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiFile,
  FiFolder,
  FiEdit,
  FiShare,
  FiMessageCircle,
  FiHeart,
  FiStar,
  FiThumbsUp,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiClock,
  FiBookmark,
  FiFlag,
  FiAward,
  FiTarget,
  FiTool,
  FiCpu,
  FiDatabase,
  FiServer,
  FiWifi,
  FiMonitor,
  FiX,
  FiCheck,
  FiPlus,
  FiMinus,
  FiRefreshCw,
  FiDownload,
  FiLock,
  FiBell,
  FiLogOut,
} from 'react-icons/fi';

interface IconPreviewProps {
  iconName?: string;
  iconLibrary?: string;
  size?: number;
  className?: string;
  fallbackIcon?: React.ComponentType<{ size?: number; className?: string }>;
}

// Маппинг названий иконок на компоненты
const ICON_COMPONENTS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  // Общие
  FiHome,
  FiUser,
  FiUsers,
  FiSettings,
  FiInfo,
  FiMail,
  FiPhone,
  FiMapPin,

  // Навигация
  FiMenu,
  FiArrowRight,
  FiChevronDown,
  FiCompass,
  FiNavigation,

  // E-commerce
  FiShoppingCart,
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiTag,
  FiDollarSign,

  // Контент
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiFile,
  FiFolder,
  FiEdit,

  // Социальные
  FiShare,
  FiMessageCircle,
  FiHeart,
  FiStar,
  FiThumbsUp,

  // Интерфейс
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiEye,
  FiEyeOff,

  // Время и события
  FiCalendar,
  FiClock,
  FiBookmark,
  FiFlag,
  FiAward,
  FiTarget,

  // Технические
  FiTool,
  FiCpu,
  FiDatabase,
  FiServer,
  FiWifi,
  FiMonitor,

  // Действия
  FiX,
  FiCheck,
  FiPlus,
  FiMinus,
  FiRefreshCw,
  FiDownload,
  // Дополнительные (доступ/уведомления/выход)
  FiLock,
  FiBell,
  FiLogOut,
};

/**
 * Компонент для отображения иконки по названию
 * Поддерживает fallback на дефолтную иконку при ошибках
 */
const IconPreview: React.FC<IconPreviewProps> = ({
  iconName,
  iconLibrary = 'fi',
  size = 20,
  className = '',
  fallbackIcon: FallbackIcon = FiHome,
}) => {
  // Если иконка не указана, показываем fallback
  if (!iconName) {
    return <FallbackIcon size={size} className={className} />;
  }

  // Пока поддерживаем только Feather Icons
  if (iconLibrary !== 'fi') {
    return <FallbackIcon size={size} className={className} />;
  }

  // Ищем компонент иконки
  const IconComponent = ICON_COMPONENTS[iconName];

  // Если иконка не найдена, показываем fallback
  if (!IconComponent) {
    console.warn(`Иконка ${iconName} из библиотеки ${iconLibrary} не найдена`);
    return <FallbackIcon size={size} className={className} />;
  }

  // Рендерим найденную иконку
  return <IconComponent size={size} className={className} />;
};

export default IconPreview;

/**
 * Хук для получения информации об иконке
 */
export const useIconInfo = (iconName?: string, iconLibrary?: string) => {
  const isValidIcon = iconName && iconLibrary === 'fi' && ICON_COMPONENTS[iconName];

  return {
    isValid: isValidIcon,
    component: iconName ? ICON_COMPONENTS[iconName] : null,
    displayName: iconName || 'Без иконки',
  };
};

/**
 * Утилита для получения дефолтной иконки по типу пункта меню
 */
export const getDefaultIconForMenuType = (type?: string, component?: string): string => {
  // По типу компонента
  if (component) {
    switch (component) {
      case 'Website':
        return 'FiHome';
      case 'Store':
        return 'FiShoppingCart';
      case 'Blog':
        return 'FiEdit';
      case 'Landing':
        return 'FiTarget';
      default:
        return 'FiHome';
    }
  }

  // По типу пункта меню
  switch (type) {
    case 'COMPONENT':
      return 'FiHome';
    case 'URL':
      return 'FiArrowRight';
    case 'HEADING':
      return 'FiFolder';
    case 'SEPARATOR':
      return 'FiMinus';
    default:
      return 'FiHome';
  }
};

// Экспорт для использования в других компонентах
export { ICON_COMPONENTS };
