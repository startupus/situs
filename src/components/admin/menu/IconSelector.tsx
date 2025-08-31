import React, { useState, useMemo } from 'react';
import { 
  FiHome, FiUser, FiUsers, FiSettings, FiInfo, FiMail, FiPhone, FiMapPin,
  FiMenu, FiArrowRight, FiChevronDown, FiCompass, FiNavigation,
  FiShoppingCart, FiShoppingBag, FiCreditCard, FiTruck, FiTag, FiDollarSign,
  FiFileText, FiImage, FiVideo, FiMusic, FiFile, FiFolder, FiEdit,
  FiShare, FiMessageCircle, FiHeart, FiStar, FiThumbsUp,
  FiSearch, FiFilter, FiGrid, FiList, FiEye, FiEyeOff,
  FiCalendar, FiClock, FiBookmark, FiFlag, FiAward, FiTarget,
  FiTool, FiCpu, FiDatabase, FiServer, FiWifi, FiMonitor,
  FiX, FiCheck, FiPlus, FiMinus, FiRefreshCw, FiDownload
} from 'react-icons/fi';

interface IconSelectorProps {
  selectedIcon?: string;
  selectedLibrary?: string;
  onSelect: (icon: string, library: string) => void;
  onClose: () => void;
}

interface IconData {
  name: string;
  component: React.ComponentType;
  category: string;
  keywords: string[];
}

// Коллекция доступных иконок с категоризацией
const AVAILABLE_ICONS: IconData[] = [
  // Общие
  { name: 'FiHome', component: FiHome, category: 'general', keywords: ['дом', 'главная', 'home', 'house'] },
  { name: 'FiUser', component: FiUser, category: 'general', keywords: ['пользователь', 'профиль', 'user', 'profile'] },
  { name: 'FiUsers', component: FiUsers, category: 'general', keywords: ['пользователи', 'команда', 'users', 'team'] },
  { name: 'FiSettings', component: FiSettings, category: 'general', keywords: ['настройки', 'конфигурация', 'settings', 'config'] },
  { name: 'FiInfo', component: FiInfo, category: 'general', keywords: ['информация', 'справка', 'info', 'help'] },
  { name: 'FiMail', component: FiMail, category: 'general', keywords: ['почта', 'email', 'письмо', 'mail'] },
  { name: 'FiPhone', component: FiPhone, category: 'general', keywords: ['телефон', 'звонок', 'phone', 'call'] },
  { name: 'FiMapPin', component: FiMapPin, category: 'general', keywords: ['адрес', 'карта', 'location', 'address'] },

  // Навигация
  { name: 'FiMenu', component: FiMenu, category: 'navigation', keywords: ['меню', 'навигация', 'menu', 'navigation'] },
  { name: 'FiArrowRight', component: FiArrowRight, category: 'navigation', keywords: ['стрелка', 'далее', 'arrow', 'next'] },
  { name: 'FiChevronDown', component: FiChevronDown, category: 'navigation', keywords: ['вниз', 'раскрыть', 'down', 'expand'] },
  { name: 'FiCompass', component: FiCompass, category: 'navigation', keywords: ['компас', 'направление', 'compass', 'direction'] },
  { name: 'FiNavigation', component: FiNavigation, category: 'navigation', keywords: ['навигация', 'маршрут', 'navigation', 'route'] },

  // E-commerce
  { name: 'FiShoppingCart', component: FiShoppingCart, category: 'ecommerce', keywords: ['корзина', 'покупки', 'cart', 'shopping'] },
  { name: 'FiShoppingBag', component: FiShoppingBag, category: 'ecommerce', keywords: ['сумка', 'покупки', 'bag', 'shopping'] },
  { name: 'FiCreditCard', component: FiCreditCard, category: 'ecommerce', keywords: ['карта', 'оплата', 'payment', 'card'] },
  { name: 'FiTruck', component: FiTruck, category: 'ecommerce', keywords: ['доставка', 'грузовик', 'delivery', 'truck'] },
  { name: 'FiTag', component: FiTag, category: 'ecommerce', keywords: ['тег', 'ярлык', 'tag', 'label'] },
  { name: 'FiDollarSign', component: FiDollarSign, category: 'ecommerce', keywords: ['деньги', 'цена', 'money', 'price'] },

  // Контент
  { name: 'FiFileText', component: FiFileText, category: 'content', keywords: ['документ', 'текст', 'document', 'text'] },
  { name: 'FiImage', component: FiImage, category: 'content', keywords: ['изображение', 'фото', 'image', 'photo'] },
  { name: 'FiVideo', component: FiVideo, category: 'content', keywords: ['видео', 'фильм', 'video', 'movie'] },
  { name: 'FiMusic', component: FiMusic, category: 'content', keywords: ['музыка', 'аудио', 'music', 'audio'] },
  { name: 'FiFile', component: FiFile, category: 'content', keywords: ['файл', 'документ', 'file', 'document'] },
  { name: 'FiFolder', component: FiFolder, category: 'content', keywords: ['папка', 'каталог', 'folder', 'directory'] },
  { name: 'FiEdit', component: FiEdit, category: 'content', keywords: ['редактировать', 'изменить', 'edit', 'modify'] },

  // Социальные
  { name: 'FiShare', component: FiShare, category: 'social', keywords: ['поделиться', 'share', 'социальные'] },
  { name: 'FiMessageCircle', component: FiMessageCircle, category: 'social', keywords: ['сообщение', 'чат', 'message', 'chat'] },
  { name: 'FiHeart', component: FiHeart, category: 'social', keywords: ['сердце', 'нравится', 'heart', 'like'] },
  { name: 'FiStar', component: FiStar, category: 'social', keywords: ['звезда', 'рейтинг', 'star', 'rating'] },
  { name: 'FiThumbsUp', component: FiThumbsUp, category: 'social', keywords: ['лайк', 'одобрение', 'like', 'approve'] },

  // Интерфейс
  { name: 'FiSearch', component: FiSearch, category: 'interface', keywords: ['поиск', 'найти', 'search', 'find'] },
  { name: 'FiFilter', component: FiFilter, category: 'interface', keywords: ['фильтр', 'сортировка', 'filter', 'sort'] },
  { name: 'FiGrid', component: FiGrid, category: 'interface', keywords: ['сетка', 'таблица', 'grid', 'table'] },
  { name: 'FiList', component: FiList, category: 'interface', keywords: ['список', 'перечень', 'list', 'items'] },
  { name: 'FiEye', component: FiEye, category: 'interface', keywords: ['просмотр', 'видеть', 'view', 'see'] },
  { name: 'FiEyeOff', component: FiEyeOff, category: 'interface', keywords: ['скрыть', 'hide', 'invisible'] },

  // Время и события
  { name: 'FiCalendar', component: FiCalendar, category: 'time', keywords: ['календарь', 'дата', 'calendar', 'date'] },
  { name: 'FiClock', component: FiClock, category: 'time', keywords: ['время', 'часы', 'time', 'clock'] },
  { name: 'FiBookmark', component: FiBookmark, category: 'time', keywords: ['закладка', 'сохранить', 'bookmark', 'save'] },
  { name: 'FiFlag', component: FiFlag, category: 'time', keywords: ['флаг', 'отметка', 'flag', 'mark'] },
  { name: 'FiAward', component: FiAward, category: 'time', keywords: ['награда', 'достижение', 'award', 'achievement'] },
  { name: 'FiTarget', component: FiTarget, category: 'time', keywords: ['цель', 'мишень', 'target', 'goal'] },

  // Технические
  { name: 'FiTool', component: FiTool, category: 'technical', keywords: ['инструмент', 'настройка', 'tool', 'config'] },
  { name: 'FiCpu', component: FiCpu, category: 'technical', keywords: ['процессор', 'производительность', 'cpu', 'performance'] },
  { name: 'FiDatabase', component: FiDatabase, category: 'technical', keywords: ['база данных', 'данные', 'database', 'data'] },
  { name: 'FiServer', component: FiServer, category: 'technical', keywords: ['сервер', 'хостинг', 'server', 'hosting'] },
  { name: 'FiWifi', component: FiWifi, category: 'technical', keywords: ['интернет', 'сеть', 'wifi', 'network'] },
  { name: 'FiMonitor', component: FiMonitor, category: 'technical', keywords: ['монитор', 'экран', 'monitor', 'screen'] },

  // Действия
  { name: 'FiX', component: FiX, category: 'actions', keywords: ['закрыть', 'удалить', 'close', 'delete'] },
  { name: 'FiCheck', component: FiCheck, category: 'actions', keywords: ['готово', 'подтвердить', 'done', 'confirm'] },
  { name: 'FiPlus', component: FiPlus, category: 'actions', keywords: ['добавить', 'создать', 'add', 'create'] },
  { name: 'FiMinus', component: FiMinus, category: 'actions', keywords: ['убрать', 'минус', 'remove', 'minus'] },
  { name: 'FiRefreshCw', component: FiRefreshCw, category: 'actions', keywords: ['обновить', 'перезагрузить', 'refresh', 'reload'] },
  { name: 'FiDownload', component: FiDownload, category: 'actions', keywords: ['скачать', 'загрузить', 'download', 'load'] },
];

const CATEGORIES = [
  { key: 'all', label: 'Все', emoji: '🎯' },
  { key: 'general', label: 'Общие', emoji: '🏠' },
  { key: 'navigation', label: 'Навигация', emoji: '🧭' },
  { key: 'ecommerce', label: 'E-commerce', emoji: '🛒' },
  { key: 'content', label: 'Контент', emoji: '📄' },
  { key: 'social', label: 'Социальные', emoji: '💬' },
  { key: 'interface', label: 'Интерфейс', emoji: '🎛️' },
  { key: 'time', label: 'Время', emoji: '⏰' },
  { key: 'technical', label: 'Технические', emoji: '⚙️' },
  { key: 'actions', label: 'Действия', emoji: '🎬' },
];

const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  selectedLibrary = 'fi',
  onSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Фильтрация иконок по поиску и категории
  const filteredIcons = useMemo(() => {
    let icons = AVAILABLE_ICONS;

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      icons = icons.filter(icon => icon.category === selectedCategory);
    }

    // Фильтр по поисковому запросу
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      icons = icons.filter(icon => 
        icon.name.toLowerCase().includes(search) ||
        icon.keywords.some(keyword => keyword.toLowerCase().includes(search))
      );
    }

    return icons;
  }, [searchTerm, selectedCategory]);

  const handleIconSelect = (iconName: string) => {
    onSelect(iconName, selectedLibrary);
    onClose();
  };

  const renderIcon = (iconData: IconData, size: number = 20) => {
    const IconComponent = iconData.component;
    return <IconComponent size={size} />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-2 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b border-stroke dark:border-dark-3">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            Выбор иконки для пункта меню
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Поиск и фильтры */}
        <div className="p-6 border-b border-stroke dark:border-dark-3">
          {/* Поиск */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-color dark:text-dark-6" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск иконок... (например: дом, пользователь, корзина)"
              className="w-full pl-10 pr-4 py-2 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Категории */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-dark-3 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-4'
                }`}
              >
                <span>{category.emoji}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка иконок */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredIcons.length === 0 ? (
            <div className="text-center py-12">
              <FiSearch size={48} className="mx-auto text-gray-300 dark:text-dark-6 mb-4" />
              <p className="text-body-color dark:text-dark-6 mb-2">
                Иконки не найдены
              </p>
              <p className="text-sm text-body-color dark:text-dark-6">
                Попробуйте изменить поисковый запрос или выбрать другую категорию
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {filteredIcons.map((iconData) => (
                <button
                  key={iconData.name}
                  onClick={() => handleIconSelect(iconData.name)}
                  onMouseEnter={() => setHoveredIcon(iconData.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                    selectedIcon === iconData.name
                      ? 'border-primary bg-primary text-white'
                      : 'border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 text-dark dark:text-white hover:border-primary hover:bg-primary/5'
                  }`}
                  title={iconData.name}
                >
                  {renderIcon(iconData, 20)}
                  
                  {/* Подсказка при наведении */}
                  {hoveredIcon === iconData.name && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-dark dark:bg-white text-white dark:text-dark px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                      {iconData.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark dark:border-t-white"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Предварительный просмотр и действия */}
        <div className="p-6 border-t border-stroke dark:border-dark-3">
          <div className="flex items-center justify-between">
            {/* Предварительный просмотр */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-body-color dark:text-dark-6">
                Предварительный просмотр:
              </div>
              {selectedIcon ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-dark-3 rounded-lg">
                  {(() => {
                    const iconData = AVAILABLE_ICONS.find(icon => icon.name === selectedIcon);
                    return iconData ? renderIcon(iconData, 20) : <FiHome size={20} />;
                  })()}
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {selectedIcon}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-dark-3 rounded-lg">
                  <FiHome size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Иконка не выбрана
                  </span>
                </div>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-stroke dark:border-dark-3 rounded-lg text-body-color dark:text-dark-6 hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
              >
                Отмена
              </button>
              {selectedIcon && (
                <button
                  onClick={() => onSelect('', '')}
                  className="px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Убрать иконку
                </button>
              )}
              <button
                onClick={() => selectedIcon && handleIconSelect(selectedIcon)}
                disabled={!selectedIcon}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Выбрать
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="mt-4 text-xs text-body-color dark:text-dark-6">
            Найдено иконок: {filteredIcons.length} из {AVAILABLE_ICONS.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconSelector;