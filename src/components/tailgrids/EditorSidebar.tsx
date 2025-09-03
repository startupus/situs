import React, { useState } from 'react';
import {
  FaSearch,
  FaFile,
  FaCube,
  FaHome,
  FaCircle,
  FaChevronDown,
  FaPlus,
  FaFolder,
  FaBlog,
  FaSun,
  FaMoon,
  FaChevronUp,
} from 'react-icons/fa';
import { useInterfaceTheme } from '../../hooks/useInterfaceTheme';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../LanguageSwitcher';
import { PageData, ProjectData } from '../../types/project';

interface EditorSidebarProps {
  availableBricks?: any[];
  project?: ProjectData | null;
  currentPageId?: string;
  onPageSelect?: (pageId: string) => void;
  onCreatePage?: () => void;
  pages?: PageData[]; // Явный список страниц, если проект не содержит pages
}

interface NavSectionProps {
  title: string;
  icon: React.ReactNode;
  count?: number;
  submenu?: boolean;
  expanded?: boolean;
  children?: React.ReactNode;
}

interface PageItemProps {
  page: PageData;
  active?: boolean;
  onClick?: () => void;
}

const NavSection: React.FC<NavSectionProps> = ({ title, icon, count, submenu = false, expanded = false, children }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <li>
      <button
        onClick={() => submenu && setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1 px-2 text-xs font-medium rounded-sm hover:bg-primary/5 transition-colors"
        style={{ color: 'var(--interface-text)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--interface-text, #64748b)' }}>{icon}</span>
          <span className="font-inter">{title}</span>
          {count !== undefined && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--interface-border, #e5e7eb)',
                color: 'var(--interface-text-muted, #6b7280)',
              }}
            >
              {count}
            </span>
          )}
        </div>
        {submenu && (
          <span style={{ color: 'var(--interface-text-muted, #6b7280)' }}>
            {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
          </span>
        )}
      </button>
      {submenu && isExpanded && children && <ul className="ml-4 mt-1 space-y-1">{children}</ul>}
    </li>
  );
};

const PageItem: React.FC<PageItemProps> = ({ page, active = false, onClick }) => {
  const getPageIcon = (pageType: string, isHomePage: boolean) => {
    if (isHomePage) return <FaHome size={10} />;

    switch (pageType.toLowerCase()) {
      case 'blog':
        return <FaBlog size={10} />;
      default:
        return <FaFile size={10} />;
    }
  };

  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2 py-1 px-2 text-xs rounded-sm transition-colors font-inter ${
          active ? 'text-primary bg-primary/10' : 'hover:bg-primary/5'
        }`}
        style={{
          color: active ? 'var(--interface-primary, #1E40AF)' : 'var(--interface-text, #64748b)',
        }}
      >
        <span className="flex-shrink-0">{getPageIcon(page.pageType, page.isHomePage)}</span>
        <span className="flex-1 text-left truncate">{page.title}</span>
        {active && (
          <span
            className="text-[10px] px-1 py-0.5 rounded-sm bg-primary/10"
            style={{ color: 'var(--interface-primary)' }}
          >
            активная
          </span>
        )}
        <FaCircle
          size={6}
          style={{
            color:
              page.status === 'PUBLISHED' ? 'var(--interface-success, #10b981)' : 'var(--interface-warning, #f59e0b)',
          }}
        />
      </button>
    </li>
  );
};

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  availableBricks = [],
  project,
  currentPageId,
  onPageSelect,
  onCreatePage,
  pages,
}) => {
  const {
    theme: interfaceTheme,
    toggleTheme: toggleInterfaceTheme,
    resolvedTheme: interfaceResolvedTheme,
  } = useInterfaceTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pages' | 'entities'>('pages');
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleTheme = () => {
    console.log('🎨 EditorSidebar: Interface theme toggle clicked!');
    toggleInterfaceTheme();
  };

  const allPages: PageData[] = pages && pages.length > 0 ? pages : project?.pages || [];
  const filteredPages =
    allPages.filter(
      (page) =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const groupedBricks = availableBricks.reduce(
    (acc, brick) => {
      const category = brick.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(brick);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <section
      className="redaktus-interface-panel h-full border-r w-64 flex flex-col transition-colors duration-200 bg-white dark:bg-dark border-stroke dark:border-dark-3"
      style={{
        backgroundColor: 'var(--interface-bg, var(--color-gray-50, #ffffff))',
        color: 'var(--interface-text, var(--color-body-color, #64748b))',
        borderColor: 'var(--interface-border, var(--color-stroke, #e5e7eb))',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Заголовок проекта */}
        {project && (
          <div className="flex-shrink-0 p-3 border-b" style={{ borderColor: 'var(--interface-border)' }}>
            <h2 className="text-sm font-semibold font-inter truncate" style={{ color: 'var(--interface-text)' }}>
              {project.name}
            </h2>
            <p className="text-xs mt-1 truncate" style={{ color: 'var(--interface-text-muted, #6b7280)' }}>
              {pages?.length ?? project.pages?.length ?? 0} страниц • {project.type}
            </p>
          </div>
        )}

        {/* Навигационные табы */}
        <div
          className="flex-shrink-0 p-1"
          style={{
            backgroundColor: 'var(--interface-surface)',
            borderColor: 'var(--interface-border)',
          }}
        >
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('pages')}
              className={`py-1 px-2 text-sm font-medium font-inter flex-1 transition-all duration-200 rounded-sm ${
                activeTab === 'pages'
                  ? 'text-primary bg-primary/10'
                  : 'text-body-color hover:text-primary hover:bg-primary/5'
              }`}
              style={{
                color:
                  activeTab === 'pages'
                    ? 'var(--interface-primary, var(--color-primary, #1E40AF))'
                    : 'var(--interface-text, var(--color-body-color, #64748b))',
                backgroundColor:
                  activeTab === 'pages' ? 'var(--interface-primary, var(--color-primary, #1E40AF))10' : 'transparent',
              }}
            >
              {t('editor.panels.pages')}
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`py-1 px-2 text-sm font-medium font-inter flex-1 transition-all duration-200 rounded-sm ${
                activeTab === 'entities'
                  ? 'text-primary bg-primary/10'
                  : 'text-body-color hover:text-primary hover:bg-primary/5'
              }`}
              style={{
                color:
                  activeTab === 'entities'
                    ? 'var(--interface-primary, var(--color-primary, #1E40AF))'
                    : 'var(--interface-text, var(--color-body-color, #64748b))',
                backgroundColor:
                  activeTab === 'entities'
                    ? 'var(--interface-primary, var(--color-primary, #1E40AF))10'
                    : 'transparent',
              }}
            >
              {t('editor.panels.entities')}
            </button>
          </nav>
        </div>

        {/* Поиск */}
        <div className="p-2 border-b flex-shrink-0" style={{ borderColor: 'var(--interface-border)' }}>
          <div className="relative">
            <input
              type="text"
              placeholder={activeTab === 'pages' ? 'Поиск страниц...' : t('editor.buttons.searchPage')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              style={{
                backgroundColor: 'var(--interface-surface)',
                color: 'var(--interface-text)',
                borderColor: 'var(--interface-border)',
              }}
            />
            <FaSearch className="absolute left-2.5 top-2.5" size={14} style={{ color: 'var(--interface-text)' }} />
          </div>
        </div>

        {/* Контент табов */}
        <nav className="flex-1 overflow-y-auto min-h-0">
          {activeTab === 'pages' ? (
            <div className="p-2 space-y-2">
              {/* Кнопка создания страницы */}
              <button
                onClick={onCreatePage}
                className="w-full flex items-center gap-2 py-2 px-3 text-sm rounded-md border border-dashed transition-colors hover:bg-primary/5"
                style={{
                  borderColor: 'var(--interface-border)',
                  color: 'var(--interface-text)',
                }}
              >
                <FaPlus size={12} />
                <span className="font-inter">Создать страницу</span>
              </button>

              {/* Список страниц */}
              {filteredPages.length > 0 ? (
                <ul className="space-y-1">
                  <NavSection
                    title="Страницы сайта"
                    icon={<FaFile size={12} />}
                    count={filteredPages.length}
                    submenu
                    expanded
                  >
                    {filteredPages.map((page) => (
                      <PageItem
                        key={page.id}
                        page={page}
                        active={currentPageId === page.id}
                        onClick={() => onPageSelect?.(page.id)}
                      />
                    ))}
                  </NavSection>
                </ul>
              ) : project ? (
                <div className="text-center py-8">
                  <FaFile
                    size={24}
                    className="mx-auto mb-2 opacity-40"
                    style={{ color: 'var(--interface-text-muted)' }}
                  />
                  <p className="text-xs font-inter" style={{ color: 'var(--interface-text-muted)' }}>
                    {searchTerm ? 'Страницы не найдены' : 'Нет страниц'}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaFolder
                    size={24}
                    className="mx-auto mb-2 opacity-40"
                    style={{ color: 'var(--interface-text-muted)' }}
                  />
                  <p className="text-xs font-inter" style={{ color: 'var(--interface-text-muted)' }}>
                    Проект не загружен
                  </p>
                </div>
              )}
            </div>
          ) : (
            <ul className="p-2 space-y-1">
              {Object.entries(groupedBricks).map(([category, bricks]) => (
                <NavSection
                  key={category}
                  title={category}
                  icon={<FaCube size={12} />}
                  count={bricks.length}
                  submenu
                  expanded
                >
                  {bricks.map((brick, index) => (
                    <li key={index}>
                      <button
                        className="w-full flex items-center gap-2 py-1 px-2 text-xs rounded-sm hover:bg-primary/5 transition-colors font-inter"
                        style={{ color: 'var(--interface-text)' }}
                      >
                        <FaCube size={10} />
                        <span className="flex-1 text-left">{brick.name}</span>
                      </button>
                    </li>
                  ))}
                </NavSection>
              ))}
            </ul>
          )}
        </nav>

        {/* Нижняя панель */}
        <div
          className="flex-shrink-0 p-2 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--interface-border)' }}
        >
          <LanguageSwitcher />
          <button
            onClick={handleToggleTheme}
            className="p-1.5 rounded-md hover:bg-primary/5 transition-colors"
            style={{ color: 'var(--interface-text)' }}
            title={`Switch to ${interfaceResolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {interfaceResolvedTheme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default EditorSidebar;
