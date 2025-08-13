import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAutoSave } from '../../hooks/useAutoSave'
import { useCanvasTheme } from '../../hooks/useCanvasTheme'
import { useInterfaceTheme } from '../../hooks/useInterfaceTheme'
import { AdminThemeProvider } from '../../contexts/AdminThemeContext'
import { EditorThemeProvider } from '../../contexts/EditorThemeContext'
import { ProjectThemeProvider } from '../../contexts/ProjectThemeContext'
import { LanguageProvider } from '../../contexts/LanguageContext'
import { ProjectManager, useProjectManager } from './ProjectManager'
import { PageData, ProjectData } from '../../types/project'
import { projectsApi } from '../../api/services/projects.api'

// Импорт изолированных CSS тем
import '../../styles/interface-themes.css'
import '../../styles/canvas-themes.css'

import {
  FaCube,
  FaSearch,
  FaPalette,
  FaBox,
  FaLink,
  FaChartBar,
  FaWrench,
  FaUser,
  FaHome,
  FaCircle,
  FaSyncAlt,
  FaMobile,
  FaLaptop,
  FaDesktop,
  FaExternalLinkAlt,
  FaExpand,
  FaSave,
  FaChevronDown,
  FaPlay,
  FaClipboard,
  FaFile,
  FaPlus,
  FaFolder,
  FaBlog
} from 'react-icons/fa'

// Импорт новых TailGrids компонентов
import EditorSidebar from '../tailgrids/EditorSidebar'
import EditorNavbar from '../tailgrids/EditorNavbar'
import CanvasToolbar from '../tailgrids/CanvasToolbar'
import SettingsPanel from '../tailgrids/SettingsPanel'
import RedaktusPageViewer from './PageViewer'

// Redaktus Core - полностью независимое решение без react-bricks

// Redaktus компоненты - полностью независимые
export const Admin: React.FC<{ children: React.ReactNode; isLogin?: boolean }> = ({
  children,
  isLogin = false
}) => {
  console.log('Admin component render - isLogin:', isLogin)
  return (
    <div className="redaktus-admin w-full max-w-none h-full" data-login={isLogin}>
      {children}
    </div>
  )
}

// Импорт конфигурации блоков
import config from './config/config'

// Система схем блоков - оригинальные React Pro Components + TailGrids
const safeJsonParse = (value: any, fallback: any) => {
  try {
    if (typeof value !== 'string') return value ?? fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};
const blockSchemas = {
  'hero-block': {
    title: { type: 'string', default: 'Kickstart Startup Website with TailGrids' },
    subtitle: { type: 'string', default: 'With TailGrids, business and students thrive together. Business can perfectly match their staffing to changing demand throughout the dayed.' },
    primaryButtonText: { type: 'string', default: 'Get Started' },
    primaryButtonUrl: { type: 'string', default: '#' },
    secondaryButtonText: { type: 'string', default: 'Download App' },
    secondaryButtonUrl: { type: 'string', default: '#' },
    heroImage: { type: 'string', default: 'https://cdn.tailgrids.com/1.0/assets/images/hero/hero-image-01.png' },
    clientLogos: { type: 'array', default: [
      'https://cdn.tailgrids.com/2.0/image/assets/images/brands/ayroui.svg',
      'https://cdn.tailgrids.com/2.0/image/assets/images/brands/graygrids.svg',
      'https://cdn.tailgrids.com/2.0/image/assets/images/brands/uideck.svg'
    ] }
  },
  'hero-1-original': {
    title: { type: 'string', default: 'Kickstart Startup Website with TailGrids' },
    subtitle: { type: 'string', default: 'With TailGrids, business and students thrive together. Business can perfectly match their staffing to changing demand throughout the dayed.' },
    primaryButtonText: { type: 'string', default: 'Get Started' },
    primaryButtonUrl: { type: 'string', default: '#' },
    secondaryButtonText: { type: 'string', default: 'Download App' },
    secondaryButtonUrl: { type: 'string', default: '#' },
    heroImage: { type: 'string', default: 'https://cdn.tailgrids.com/1.0/assets/images/hero/hero-image-01.png' },
    clientLogos: { type: 'array', default: [
      'https://cdn.tailgrids.com/2.0/image/assets/images/brands/ayroui.svg',
      'https://cdn.tailgrids.com/2.0/image/assets/images/brands/graygrids.svg',
      'https://cdn.tailgrids.com/2.0/image/assets/images/brands/uideck.svg'
    ] }
  },
  'testimonial-block': {
    testimonials: { type: 'array', default: [
      {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        name: 'Larry Diamond',
        position: 'Chief Executive Officer',
        details: 'Velit est sit voluptas eum sapiente omnis! Porro, impedit minus quam reprehenderit tempore sint quaerat id! Mollitia perspiciatis est asperiores commodi labore!'
      },
      {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        name: 'Sarah Johnson',
        position: 'Marketing Director',
        details: 'Excellent service and amazing results! The team delivered exactly what we needed and exceeded our expectations.'
      },
      {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        name: 'Michael Chen',
        position: 'Product Manager',
        details: 'Working with this platform has transformed our workflow. Highly recommended for any business looking to improve their online presence.'
      }
    ] }
  },
  'services-block': {
    sectionTitle: { type: 'string', default: 'What We Offer' },
    sectionSubtitle: { type: 'string', default: 'Our Services' },
    sectionDescription: { type: 'string', default: 'There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form.' },
    services: { type: 'array', default: [
      {
        title: 'Refreshing Design',
        details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
        icon: 'design'
      },
      {
        title: 'Based on Tailwind CSS',
        details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
        icon: 'tailwind'
      },
      {
        title: '100+ Components',
        details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
        icon: 'components'
      },
      {
        title: 'Speed Optimized',
        details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
        icon: 'speed'
      },
      {
        title: 'Fully Customizable',
        details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
        icon: 'customizable'
      },
      {
        title: 'Regular Updates',
        details: 'We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics.',
        icon: 'updates'
      }
    ] }
  },
  'image-block': {
    imageUrl: { type: 'string', default: '' },
    alt: { type: 'string', default: 'Image description' },
    caption: { type: 'string', default: '' },
    alignment: { type: 'select', options: ['left', 'center', 'right'], default: 'center' },
    size: { type: 'select', options: ['small', 'medium', 'large', 'full'], default: 'medium' }
  },
  'gallery-block': {
    images: { type: 'array', default: [] },
    columns: { type: 'select', options: ['2', '3', '4'], default: '3' },
    gap: { type: 'select', options: ['small', 'medium', 'large'], default: 'medium' }
  },
  'video-block': {
    videoUrl: { type: 'string', default: '' },
    title: { type: 'string', default: 'Video Title' },
    autoplay: { type: 'boolean', default: false },
    controls: { type: 'boolean', default: true }
  },
  'container-block': {
    maxWidth: { type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'], default: 'lg' },
    padding: { type: 'select', options: ['none', 'small', 'medium', 'large'], default: 'medium' },
    background: { type: 'select', options: ['transparent', 'light', 'dark'], default: 'transparent' }
  },
  'columns-block': {
    columns: { type: 'select', options: ['2', '3', '4'], default: '2' },
    gap: { type: 'select', options: ['small', 'medium', 'large'], default: 'medium' },
    alignment: { type: 'select', options: ['top', 'center', 'bottom'], default: 'top' }
  }
};

// Функция для создания дефолтных пропсов из схемы
const createDefaultProps = (blockType: string) => {
  const schema = blockSchemas[blockType as keyof typeof blockSchemas];
  if (!schema) return {};
  
  const defaultProps: any = {};
  Object.entries(schema).forEach(([key, config]) => {
    defaultProps[key] = config.default;
  });
  
  return defaultProps;
};

// Функция для получения параметров из URL
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    projectId: urlParams.get('project') || urlParams.get('projectId') || null, // Убираем жестко заданный fallback
    productId: urlParams.get('product') || urlParams.get('productId') || null,
    pageId: urlParams.get('pageId') || null
  };
};

const EditorContent: React.FC = () => {
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [urlParams] = useState(getUrlParams);
  
  // Используем изолированные хуки тем
  const { theme: canvasTheme, resolvedTheme: canvasResolvedTheme, toggleTheme: toggleCanvasTheme } = useCanvasTheme()
  const { theme: interfaceTheme, resolvedTheme: interfaceResolvedTheme, toggleTheme: toggleInterfaceTheme } = useInterfaceTheme()
  
  console.log('🎨 EditorContent themes - Canvas:', canvasTheme, 'Interface:', interfaceTheme)
  
  // Функция переключения языка страницы
  const handlePageLanguageChange = (languageCode: string) => {
    console.log('🌍 Переключение языка страницы:', languageCode);
    setCurrentPageLanguage(languageCode);
    
    // Обновляем заголовок страницы в зависимости от выбранного языка
    if (currentPage.languages[languageCode]) {
      setCurrentPage(prev => ({
        ...prev,
        title: prev.languages[languageCode].title,
        content: prev.languages[languageCode].content || prev.content
      }));
    }
  };
  
  const [currentPageLanguage, setCurrentPageLanguage] = useState<string>('ru'); // Язык текущей страницы
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [projectPages, setProjectPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState<any>({
    id: null,
    type: 'page',
    slug: '',
    languages: {
      ru: {
        title: '',
        content: []
      },
      en: {
        title: '',
        content: []
      },
      de: {
        title: '',
        content: []
      }
    },
    availableLanguages: ['ru', 'en', 'de'],
    defaultLanguage: 'ru',
    title: '',
    content: [],
    meta: {
      title: '',
      description: '',
      keywords: ''
    }
  });

  // Загрузка данных проекта
  useEffect(() => {
    const loadProjectData = async () => {
      if (!urlParams.projectId) {
        console.log('❌ Не указан ID проекта в URL');
        setLoading(false);
        return;
      }

      try {
        console.log('🚀 Загрузка проекта:', urlParams.projectId);

        // Загружаем проект
        const project = await projectsApi.getProject(urlParams.projectId);
        setCurrentProject(project);
        console.log('✅ Проект загружен:', project.name);

        // Загружаем страницы проекта
        try {
          const pages = await fetch(`/api/projects/${urlParams.projectId}/pages`).then(r=>r.json()).then(d=>d.data?.pages||[]);
          // Нормализуем content: может быть строкой из БД
          const normalized = pages.map((p:any)=>({
            ...p,
            content: safeJsonParse(p.content, { blocks: [] })
          }));
          console.log('📄 Загружены страницы проекта:', normalized.length, 'страниц');
          setProjectPages(normalized);

          // Загружаем конкретную страницу, если указана
          if (urlParams.pageId) {
            const pageToLoad = pages.find(p => p.id === urlParams.pageId);
            if (pageToLoad) {
              console.log('📄 Загружена страница по ID:', pageToLoad.title);
              // Конвертируем данные из API в формат редактора
              const editorPage = {
                id: pageToLoad.id,
                type: 'page',
                slug: pageToLoad.slug,
                title: pageToLoad.title,
                content: (pageToLoad.content?.blocks) || [],
                languages: {
                  ru: {
                    title: pageToLoad.title,
                    content: (pageToLoad.content?.blocks) || []
                  },
                  en: {
                    title: pageToLoad.title + ' (EN)',
                    content: []
                  },
                  de: {
                    title: pageToLoad.title + ' (DE)',
                    content: []
                  }
                },
                availableLanguages: ['ru', 'en', 'de'],
                defaultLanguage: 'ru',
                projectId: project.id,
                meta: {
                  title: pageToLoad.meta?.title || pageToLoad.title,
                  description: pageToLoad.meta?.description || '',
                  keywords: pageToLoad.meta?.keywords || ''
                }
              };
              setCurrentPage(editorPage);
            }
          }
        } catch {}

        setLoading(false);
      } catch (error) {
        console.error('❌ Ошибка загрузки данных проекта:', error);
        setLoading(false);
      }
    };

    loadProjectData();
  }, [urlParams.projectId, urlParams.pageId]);

  // Функция сохранения страницы
  const savePage = async (pageData: any) => {
    if (!currentPage?.id) {
      console.error('❌ Нет текущей страницы для сохранения');
      return { success: false, error: 'Нет страницы для сохранения' };
    }

    try {
      console.log('💾 Сохранение страницы:', currentPage.id);
      console.log('📄 Контент для сохранения:', currentPage.content);
      
      // Подготавливаем данные для API (строгий формат)
      const updateData = {
        title: pageData.title || currentPage.title,
        content: Array.isArray(currentPage.content) ? { blocks: currentPage.content } : (currentPage.content?.blocks ? currentPage.content : { blocks: [] }),
        metaTitle: pageData.meta?.title || currentPage.meta?.title || currentPage.metaTitle,
        metaDescription: pageData.meta?.description || currentPage.meta?.description || currentPage.metaDescription,
        metaKeywords: pageData.meta?.keywords || currentPage.meta?.keywords || currentPage.metaKeywords
      } as any;

      // Импортируем updatePage из API
      const updatedPage = await fetch(`/api/pages/${currentPage.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(updateData)}).then(r=>r.json()).then(d=>d.data);
      // Обновляем локальное состояние
      setCurrentPage((prev:any)=>({
        ...prev,
        title: updatedPage.title,
        content: safeJsonParse(updatedPage.content, { blocks: [] })?.blocks || prev.content,
        meta: {
          title: updatedPage.metaTitle || prev.meta?.title,
          description: updatedPage.metaDescription || prev.meta?.description,
          keywords: updatedPage.metaKeywords || prev.meta?.keywords,
        }
      }));
      
      console.log('✅ Страница сохранена:', updatedPage.title);
      return { success: true, data: updatedPage };
      
    } catch (error) {
      console.error('❌ Ошибка сохранения страницы:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      };
    }
  };

  // Автосохранение
  const { isSaving, lastSaved, saveError, saveNow } = useAutoSave(currentPage, {
    delay: 3000, // 3 секунды
    onSave: savePage,
    enabled: true
  });

  const addBrickToCanvas = (brickType: string) => {
    console.log('🎯 Adding brick to canvas:', brickType)
    
    // Создаем блок с дефолтными пропсами из схемы
    const defaultProps = createDefaultProps(brickType);
    
    const newBrick = {
      id: `brick-${Date.now()}`,
      type: brickType,
      props: defaultProps
    }
    
    setCurrentPage((prev: any) => ({
      ...prev,
      content: [...prev.content, newBrick]
    }))
  }

  const handleBlockUpdate = (blockId: string, newProps: any) => {
    console.log('🎯 Updating block:', blockId, newProps)
    
    setCurrentPage((prev: any) => ({
      ...prev,
      content: prev.content.map((brick: any) => 
        brick.id === blockId 
          ? { ...brick, props: { ...brick.props, ...newProps } }
          : brick
      )
    }))
  }

  const handleBlockDelete = (blockId: string) => {
    console.log('🎯 Deleting block:', blockId)
    
    setCurrentPage((prev: any) => ({
      ...prev,
      content: prev.content.filter((brick: any) => brick.id !== blockId)
    }))
  }

  console.log('🎯 Editor component render - START')
  console.log('🎯 Editor component - rendering area should be visible')

  // Получаем все доступные блоки из конфигурации
  const allBricks = config.bricks?.flatMap((theme: any) =>
    theme.categories?.flatMap((category: any) => category.bricks || []) || []
  ) || []

  console.log('🎯 Available bricks:', allBricks.length)

  const handleSave = async () => {
    console.log('Saving page...')
    await saveNow();
  }

  const handlePreview = () => {
    console.log('Opening preview...')
  }

  const handleCode = () => {
    console.log('Opening code view...')
  }

  const handleUndo = () => {
    console.log('Undo...')
  }

  const handleRedo = () => {
    console.log('Redo...')
  }

  const handlePageSelect = async (pageId: string) => {
    console.log('🔄 Переключение на страницу:', pageId);
    
    try {
      // Импортируем getPage из API
      const pageData = await fetch(`/api/pages/${pageId}`).then(r=>r.json()).then(d=>d.data);
      const contentObj = safeJsonParse(pageData.content, { blocks: [] });
      
      // Конвертируем данные из API в формат редактора
      const editorPage = {
        id: pageData.id,
        type: 'page',
        slug: pageData.slug,
        title: pageData.title,
        content: contentObj.blocks || [],
        languages: {
          ru: {
            title: pageData.title,
            content: contentObj.blocks || []
          },
          en: {
            title: pageData.title + ' (EN)',
            content: []
          },
          de: {
            title: pageData.title + ' (DE)',
            content: []
          }
        },
        availableLanguages: ['ru', 'en', 'de'],
        defaultLanguage: 'ru',
        projectId: pageData.projectId,
        meta: {
          title: pageData.metaTitle,
          description: pageData.metaDescription,
          keywords: pageData.metaKeywords
        }
      };

      setCurrentPage(editorPage);
      
      // Обновляем URL без перезагрузки страницы
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('pageId', pageId);
      window.history.pushState({}, '', newUrl.toString());
      
    } catch (error) {
      console.error('❌ Ошибка загрузки страницы:', error);
    }
  };

  const handleCreatePage = async () => {
    console.log('➕ Создание новой страницы');
    
    if (!currentProject) return;

    try {
      // Определяем Website продукт
      const website = currentProject.products?.find(p => p.type === 'WEBSITE');
      if (!website) throw new Error('Website продукт не найден');

      // Создаём через API
      const payload = {
        title: 'Новая страница',
        slug: `new-page-${Date.now()}`,
        content: { blocks: [] },
        status: 'DRAFT',
        productId: website.id,
        orderIndex: projectPages.length
      };
      const created = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(r=>r.json()).then(d=>d.data);

      const newPage = {
        id: created.id,
        title: created.title,
        slug: created.slug,
        content: created.content,
        status: created.status,
        meta: {},
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      } as any;

      setProjectPages([...projectPages, newPage]);
      await handlePageSelect(newPage.id);
      console.log('✅ Новая страница создана:', newPage.id);
    } catch (error) {
      console.error('❌ Ошибка при создании страницы:', error);
    }
  };

  // Показываем лоадер пока загружаются данные
  if (loading || !currentPage) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Загрузка проекта {urlParams.projectId}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <div 
        className={`redaktus-editor h-screen w-screen max-w-none flex flex-col transition-colors duration-200 redaktus-interface`} 
        style={{ width: '100vw', maxWidth: 'none' }}
        data-interface-theme={interfaceResolvedTheme}
      >
        {/* Верхняя панель над всем редактором - часть интерфейса */}
        <EditorNavbar 
          currentPage={currentPage?.title || 'Page'}
          onSave={handleSave}
          autosaveEnabled={true}
          isSaving={isSaving}
          lastSaved={lastSaved}
          saveError={saveError}
        />

      {/* Индикатор автосохранения */}
      {isSaving && (
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Saving...</span>
          </div>
        </div>
      )}

      {saveError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex items-center space-x-2">
            <span>Save failed: {saveError}</span>
            <button 
              onClick={() => saveNow()}
              className="text-xs underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {lastSaved && !isSaving && !saveError && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg opacity-0 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span>✓ Saved at {lastSaved.toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Основная область редактора */}
      <div className="flex-1 flex overflow-hidden">
        {/* Левая панель с компонентами - ЧАСТЬ ИНТЕРФЕЙСА */}
        <div className="redaktus-interface-panel" data-interface-theme={interfaceResolvedTheme}>
          <EditorSidebar 
            availableBricks={allBricks} 
            project={currentProject}
            currentPageId={currentPage?.id}
            onPageSelect={handlePageSelect}
            onCreatePage={handleCreatePage}
            pages={projectPages}
          />
        </div>

        {/* Центральная область с холстом - КАНВАС */}
        <div className="flex-1 flex flex-col min-w-0 transition-colors duration-200">
          {/* Панель канваса - ЧАСТЬ ИНТЕРФЕЙСА */}
          <div className="redaktus-interface-panel" data-interface-theme={interfaceResolvedTheme}>
            <CanvasToolbar
              currentDevice={currentDevice}
              onDeviceChange={setCurrentDevice}
              currentPageTitle={currentPage?.title || 'Home Page'}
              currentPageLanguage={currentPageLanguage}
              availablePageLanguages={currentPage?.availableLanguages || ['ru']}
              onLanguageChange={handlePageLanguageChange}
              onPreview={handlePreview}
              onCode={handleCode}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onSave={handleSave}
            />
          </div>

          {/* Область редактирования - изолированная тема канваса */}
          <div 
            className={`flex-1 overflow-y-auto min-w-0 redaktus-canvas transition-colors duration-200`}
            data-device={currentDevice}
            data-canvas-theme={canvasResolvedTheme}
            data-canvas-isolated="true"
          >
            {/* Динамический контент страницы */}
            <div 
              className="min-h-full"
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-50')
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50')

                const brickType = e.dataTransfer.getData('text/plain')
                console.log('🎯 Dropped brick type:', brickType)

                if (brickType) {
                  // Здесь будет логика добавления блока
                  console.log('🎯 Adding brick to canvas:', brickType)
                  addBrickToCanvas(brickType)
                }
              }}
            >
              {/* PageViewer для отображения блоков */}
              <RedaktusPageViewer 
                page={currentPage} 
                main 
                className="min-h-full"
                onBlockUpdate={handleBlockUpdate}
                onBlockDelete={handleBlockDelete}
              />
            </div>
          </div>
        </div>

        {/* Правая панель настроек - ЧАСТЬ ИНТЕРФЕЙСА */}
        <div className="redaktus-interface-panel" data-interface-theme={interfaceResolvedTheme}>
          <SettingsPanel currentPage={currentPage?.title || 'Page'} />
        </div>
      </div>
    </div>
    </LanguageProvider>
  )
}

export const Editor: React.FC = () => {
  return <EditorContent />
}

console.log('🎯 Editor component render - END')

export const Login: React.FC = () => {
  console.log('Login component render')
  
  return (
    <div className="redaktus-login h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <FaCube className="text-gray-600 dark:text-gray-300" size={32} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold transition-colors duration-200 text-gray-900 dark:text-gray-100">
            Sign in to Redaktus
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-t-md"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-b-md"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const Playground: React.FC = () => {
  console.log('Playground component render')
  
  return (
    <div className="redaktus-playground h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaWrench className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100">Playground</h3>
        <p className="mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">Test your blocks here</p>
      </div>
    </div>
  )
}

export const AppSettings: React.FC = () => {
  console.log('AppSettings component render')
  
  return (
    <div className="redaktus-app-settings h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaWrench className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100">App Settings</h3>
        <p className="mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">Configure your application</p>
      </div>
    </div>
  )
}

export const MediaLibrary: React.FC = () => {
  console.log('MediaLibrary component render')
  
  return (
    <div className="redaktus-media h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaLink className="mx-auto h-12 w-12 text-gray-400" size={48} />
        <h3 className="mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100">Media Library</h3>
        <p className="mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400">Manage your media files</p>
      </div>
    </div>
  )
}

// Утилиты для текста - оставляем как есть для совместимости
export const Text: React.FC<any> = (props) => {
  return <span {...props} />
}

export const RichText: React.FC<any> = (props) => {
  return <div {...props} />
}

export const RichTextExt: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Image: React.FC<any> = (props) => {
  return <img {...props} />
}

export const File: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Icon: React.FC<any> = (props) => {
  return <span {...props} />
}

export const Meta: React.FC<any> = (props) => {
  return <meta {...props} />
}

export const PageViewer: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Preview: React.FC<any> = (props) => {
  return <div {...props} />
}

export const Repeater: React.FC<any> = ({ children }) => {
  return <div className="redaktus-repeater">{children}</div>
}

export const Slot: React.FC<any> = ({ children }) => {
  return <div className="redaktus-slot">{children}</div>
}

export const Link: React.FC<any> = (props) => {
  return <a {...props} />
}

// Хуки
export const useRedaktus = () => ({
  isDarkColorMode: false,
  toggleColorMode: () => {}
})

export const useVisualEdit = (initialValue: string = '') => {
  const [value, setValue] = React.useState(initialValue)
  const [isEditing, setIsEditing] = React.useState(false)
  
  return [
    value,
    (newValue: string) => setValue(newValue),
    false // isReadOnly - для редактора всегда false
  ] as const
}

// Контекст
export const RedaktusContext = React.createContext({
  isDarkColorMode: false
})

// SSO компоненты
export const SsoLogin: React.FC = () => {
  return <div>SSO Login</div>
}

export const SsoLoginSuccess: React.FC = () => {
  return <div>SSO Login Success</div>
}

export const SsoLoginFailure: React.FC = () => {
  return <div>SSO Login Failure</div>
}

// Дополнительные хуки
export const useAdminContext = () => ({
  isAdmin: false,
  isLogin: false
})

export const usePage = () => ({
  page: null,
  loading: false
})

export const usePagePublic = () => ({
  page: null,
  loading: false
})

export const usePageValues = () => ({
  values: {},
  setValues: () => {}
})

export const usePages = () => ({
  pages: [],
  loading: false
})

export const usePagesPublic = () => ({
  pages: [],
  loading: false
})

export const useRedaktusContext = () => ({
  isDarkColorMode: false,
  toggleColorMode: () => {}
})

export const useTagsPublic = () => ({
  tags: [],
  loading: false
})

// Утилиты
export const fetchPage = async () => null
export const fetchPages = async () => []
export const fetchTags = async () => []
export const renderJsonLd = () => null
export const renderMeta = () => null
export const cleanPage = () => null
export const getPagePlainText = () => ''
export const getSchemaOrgData = () => null

// Плагины
export const blockPluginConstructor = () => null
export const blockWithModalPluginConstructor = () => null
export const markPluginConstructor = () => null
export const plugins = []

// Дополнительные компоненты
export const JsonLd: React.FC = () => null
export const Plain: React.FC = () => null

// SSO
export const useAuth = () => ({
  isAuthenticated: false,
  user: null
})

// Утилиты
export const uuid = () => 'redaktus-' + Math.random().toString(36).substr(2, 9)

// Главный провайдер Redaktus
export const Redaktus: React.FC<any> = ({ 
  children, 
  appId,
  apiKey,
  pageTypes,
  customFields,
  loginUI,
  contentClassName,
  renderLocalLink,
  loginPath,
  editorPath,
  playgroundPath,
  appSettingsPath,
  previewPath,
  isDarkColorMode,
  toggleColorMode,
  useCssInJs,
  appRootElement,
  clickToEditSide,
  enableAutoSave,
  disableSaveIfInvalidProps,
  enablePreview,
  blockIconsPosition,
  enableUnsplash,
  unsplashApiKey,
  enablePreviewImage,
  enableDefaultEmbedBrick,
  navigate,
  ...domProps
}) => {
  console.log('Redaktus Provider render')
  console.log('Redaktus children:', children)
  console.log('Redaktus appId:', appId)
  
  // Сохраняем конфигурацию в контексте, но не передаём в DOM
  const config = {
    appId,
    apiKey,
    pageTypes,
    customFields,
    loginUI,
    contentClassName,
    renderLocalLink,
    loginPath,
    editorPath,
    playgroundPath,
    appSettingsPath,
    previewPath,
    isDarkColorMode: isDarkColorMode || false,
    toggleColorMode,
    useCssInJs,
    appRootElement,
    clickToEditSide,
    enableAutoSave,
    disableSaveIfInvalidProps,
    enablePreview,
    blockIconsPosition,
    enableUnsplash,
    unsplashApiKey,
    enablePreviewImage,
    enableDefaultEmbedBrick,
    navigate
  }

  console.log('Redaktus config:', config)

  return (
    <AdminThemeProvider>
      <EditorThemeProvider>
        <ProjectThemeProvider>
          <RedaktusContext.Provider value={config}>
            <div className="redaktus-provider" {...domProps}>
              {children}
            </div>
          </RedaktusContext.Provider>
        </ProjectThemeProvider>
      </EditorThemeProvider>
    </AdminThemeProvider>
  )
}