import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useCanvasTheme } from '../../hooks/useCanvasTheme';
import { FaCube, FaLink, FaWrench } from 'react-icons/fa';
// Импорт новых TailGrids компонентов
import VerticalNavbar from '../tailgrids/VerticalNavbar';
import EditorNavbar from '../tailgrids/EditorNavbar';
import CanvasToolbar from '../tailgrids/CanvasToolbar';
import SettingsPanel from '../tailgrids/SettingsPanel';
import RedaktusPageViewer from './PageViewer';
// Redaktus Core - полностью независимое решение без react-bricks
// Redaktus компоненты - полностью независимые
export const Admin = ({ children, isLogin = false }) => {
    console.log('Admin component render - isLogin:', isLogin);
    return (_jsx("div", { className: "redaktus-admin w-full max-w-none h-full", "data-login": isLogin, children: children }));
};
// Импорт конфигурации блоков
import config from './config/config';
// Система схем блоков - только TailGrids
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
    'testimonial-block': {
        testimonials: { type: 'array', default: [
                {
                    image: 'https://cdn.tailgrids.com/2.0/image/marketing/images/testimonials/testimonial-01/image-01.jpg',
                    name: 'Larry Diamond',
                    position: 'Chief Executive Officer',
                    details: 'Velit est sit voluptas eum sapiente omnis! Porro, impedit minus quam reprehenderit tempore sint quaerat id! Mollitia perspiciatis est asperiores commodi labore!'
                },
                {
                    image: 'https://cdn.tailgrids.com/2.0/image/marketing/images/testimonials/testimonial-01/image-01.jpg',
                    name: 'Sarah Johnson',
                    position: 'Marketing Director',
                    details: 'Excellent service and amazing results! The team delivered exactly what we needed and exceeded our expectations.'
                },
                {
                    image: 'https://cdn.tailgrids.com/2.0/image/marketing/images/testimonials/testimonial-01/image-01.jpg',
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
const createDefaultProps = (blockType) => {
    const schema = blockSchemas[blockType];
    if (!schema)
        return {};
    const defaultProps = {};
    Object.entries(schema).forEach(([key, config]) => {
        defaultProps[key] = config.default;
    });
    return defaultProps;
};
const EditorContent = () => {
    const [currentDevice, setCurrentDevice] = useState('desktop');
    // Инициализируем Canvas Theme для переключения темы канваса
    const { theme: canvasTheme, resolvedTheme: canvasResolvedTheme } = useCanvasTheme();
    const [currentPage, setCurrentPage] = useState({
        id: 'home',
        type: 'page',
        slug: 'home',
        title: 'Home Page',
        content: [],
        meta: {}
    });
    // Функция сохранения страницы
    const savePage = async (pageData) => {
        // Здесь будет реальная логика сохранения в API
        console.log('💾 Saving page:', pageData);
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 1000));
        // В реальном приложении здесь будет fetch или axios запрос
        // const response = await fetch('/api/pages', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(pageData)
        // });
        return pageData;
    };
    // Автосохранение
    const { isSaving, lastSaved, saveError, saveNow } = useAutoSave(currentPage, {
        delay: 3000, // 3 секунды
        onSave: savePage,
        enabled: true
    });
    const addBrickToCanvas = (brickType) => {
        console.log('🎯 Adding brick to canvas:', brickType);
        // Создаем блок с дефолтными пропсами из схемы
        const defaultProps = createDefaultProps(brickType);
        const newBrick = {
            id: `brick-${Date.now()}`,
            type: brickType,
            props: defaultProps
        };
        setCurrentPage((prev) => ({
            ...prev,
            content: [...prev.content, newBrick]
        }));
    };
    const handleBlockUpdate = (blockId, newProps) => {
        console.log('🎯 Updating block:', blockId, newProps);
        setCurrentPage((prev) => ({
            ...prev,
            content: prev.content.map((brick) => brick.id === blockId
                ? { ...brick, props: { ...brick.props, ...newProps } }
                : brick)
        }));
    };
    const handleBlockDelete = (blockId) => {
        console.log('🎯 Deleting block:', blockId);
        setCurrentPage((prev) => ({
            ...prev,
            content: prev.content.filter((brick) => brick.id !== blockId)
        }));
    };
    console.log('🎯 Editor component render - START');
    console.log('🎯 Editor component - rendering area should be visible');
    // Получаем все доступные блоки из конфигурации
    const allBricks = config.bricks?.flatMap((theme) => theme.categories?.flatMap((category) => category.bricks || []) || []) || [];
    console.log('🎯 Available bricks:', allBricks.length);
    const handleSave = async () => {
        console.log('Saving page...');
        await saveNow();
    };
    const handlePreview = () => {
        console.log('Opening preview...');
    };
    const handleCode = () => {
        console.log('Opening code view...');
    };
    const handleUndo = () => {
        console.log('Undo...');
    };
    const handleRedo = () => {
        console.log('Redo...');
    };
    return (_jsxs("div", { className: "redaktus-editor h-screen w-screen max-w-none flex flex-col transition-colors duration-200 redaktus-interface", style: { width: '100vw', maxWidth: 'none' }, children: [_jsx(EditorNavbar, { currentPage: "Home", onSave: handleSave, autosaveEnabled: true, isSaving: isSaving, lastSaved: lastSaved, saveError: saveError }), isSaving && (_jsx("div", { className: "fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), _jsx("span", { children: "Saving..." })] }) })), saveError && (_jsx("div", { className: "fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { children: ["Save failed: ", saveError] }), _jsx("button", { onClick: () => saveNow(), className: "text-xs underline hover:no-underline", children: "Retry" })] }) })), lastSaved && !isSaving && !saveError && (_jsx("div", { className: "fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg opacity-0 animate-fade-in", children: _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("span", { children: ["\u2713 Saved at ", lastSaved.toLocaleTimeString()] }) }) })), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsx("div", { children: _jsx(VerticalNavbar, { availableBricks: allBricks }) }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0 transition-colors duration-200", children: [_jsx(CanvasToolbar, { currentDevice: currentDevice, onDeviceChange: setCurrentDevice, onPreview: handlePreview, onCode: handleCode, onUndo: handleUndo, onRedo: handleRedo, onSave: handleSave }), _jsx("div", { className: `flex-1 overflow-y-auto min-w-0 redaktus-canvas transition-colors duration-200 ${canvasResolvedTheme === 'dark' ? 'dark' : ''}`, style: {
                                    backgroundColor: canvasResolvedTheme === 'dark' ? '#111827' : '#ffffff',
                                    color: canvasResolvedTheme === 'dark' ? '#f9fafb' : '#1f2937',
                                    colorScheme: canvasResolvedTheme === 'dark' ? 'dark' : 'light'
                                }, children: _jsx("div", { className: "min-h-full", onDragOver: (e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-50');
                                    }, onDragLeave: (e) => {
                                        e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50');
                                    }, onDrop: (e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50');
                                        const brickType = e.dataTransfer.getData('text/plain');
                                        console.log('🎯 Dropped brick type:', brickType);
                                        if (brickType) {
                                            // Здесь будет логика добавления блока
                                            console.log('🎯 Adding brick to canvas:', brickType);
                                            addBrickToCanvas(brickType);
                                        }
                                    }, children: _jsx(RedaktusPageViewer, { page: currentPage, main: true, className: "min-h-full", onBlockUpdate: handleBlockUpdate, onBlockDelete: handleBlockDelete }) }) })] }), _jsx(SettingsPanel, { currentPage: "Home" })] })] }));
};
export const Editor = () => {
    return _jsx(EditorContent, {});
};
console.log('🎯 Editor component render - END');
export const Login = () => {
    console.log('Login component render');
    return (_jsx("div", { className: "redaktus-login h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("div", { className: "mx-auto h-12 w-12 flex items-center justify-center", children: _jsx(FaCube, { className: "text-gray-600 dark:text-gray-300", size: 32 }) }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold transition-colors duration-200 text-gray-900 dark:text-gray-100", children: "Sign in to Redaktus" })] }), _jsxs("form", { className: "mt-8 space-y-6", children: [_jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [_jsx("div", { children: _jsx("input", { type: "email", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-t-md", placeholder: "Email address" }) }), _jsx("div", { children: _jsx("input", { type: "password", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-b-md", placeholder: "Password" }) })] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500", children: "Sign in" }) })] })] }) }));
};
export const Playground = () => {
    console.log('Playground component render');
    return (_jsx("div", { className: "redaktus-playground h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx(FaWrench, { className: "mx-auto h-12 w-12 text-gray-400", size: 48 }), _jsx("h3", { className: "mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100", children: "Playground" }), _jsx("p", { className: "mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400", children: "Test your blocks here" })] }) }));
};
export const AppSettings = () => {
    console.log('AppSettings component render');
    return (_jsx("div", { className: "redaktus-app-settings h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx(FaWrench, { className: "mx-auto h-12 w-12 text-gray-400", size: 48 }), _jsx("h3", { className: "mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100", children: "App Settings" }), _jsx("p", { className: "mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400", children: "Configure your application" })] }) }));
};
export const MediaLibrary = () => {
    console.log('MediaLibrary component render');
    return (_jsx("div", { className: "redaktus-media h-screen flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx(FaLink, { className: "mx-auto h-12 w-12 text-gray-400", size: 48 }), _jsx("h3", { className: "mt-2 text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-gray-100", children: "Media Library" }), _jsx("p", { className: "mt-1 text-sm transition-colors duration-200 text-gray-500 dark:text-gray-400", children: "Manage your media files" })] }) }));
};
// Утилиты для текста - оставляем как есть для совместимости
export const Text = (props) => {
    return _jsx("span", { ...props });
};
export const RichText = (props) => {
    return _jsx("div", { ...props });
};
export const RichTextExt = (props) => {
    return _jsx("div", { ...props });
};
export const Image = (props) => {
    return _jsx("img", { ...props });
};
export const File = (props) => {
    return _jsx("div", { ...props });
};
export const Icon = (props) => {
    return _jsx("span", { ...props });
};
export const Meta = (props) => {
    return _jsx("meta", { ...props });
};
export const PageViewer = (props) => {
    return _jsx("div", { ...props });
};
export const Preview = (props) => {
    return _jsx("div", { ...props });
};
export const Repeater = ({ children }) => {
    return _jsx("div", { className: "redaktus-repeater", children: children });
};
export const Slot = ({ children }) => {
    return _jsx("div", { className: "redaktus-slot", children: children });
};
export const Link = (props) => {
    return _jsx("a", { ...props });
};
// Хуки
export const useRedaktus = () => ({
    isDarkColorMode: false,
    toggleColorMode: () => { }
});
export const useVisualEdit = (initialValue = '') => {
    const [value, setValue] = React.useState(initialValue);
    const [isEditing, setIsEditing] = React.useState(false);
    return [
        value,
        (newValue) => setValue(newValue),
        false // isReadOnly - для редактора всегда false
    ];
};
// Контекст
export const RedaktusContext = React.createContext({
    isDarkColorMode: false
});
// SSO компоненты
export const SsoLogin = () => {
    return _jsx("div", { children: "SSO Login" });
};
export const SsoLoginSuccess = () => {
    return _jsx("div", { children: "SSO Login Success" });
};
export const SsoLoginFailure = () => {
    return _jsx("div", { children: "SSO Login Failure" });
};
// Дополнительные хуки
export const useAdminContext = () => ({
    isAdmin: false,
    isLogin: false
});
export const usePage = () => ({
    page: null,
    loading: false
});
export const usePagePublic = () => ({
    page: null,
    loading: false
});
export const usePageValues = () => ({
    values: {},
    setValues: () => { }
});
export const usePages = () => ({
    pages: [],
    loading: false
});
export const usePagesPublic = () => ({
    pages: [],
    loading: false
});
export const useRedaktusContext = () => ({
    isDarkColorMode: false,
    toggleColorMode: () => { }
});
export const useTagsPublic = () => ({
    tags: [],
    loading: false
});
// Утилиты
export const fetchPage = async () => null;
export const fetchPages = async () => [];
export const fetchTags = async () => [];
export const renderJsonLd = () => null;
export const renderMeta = () => null;
export const cleanPage = () => null;
export const getPagePlainText = () => '';
export const getSchemaOrgData = () => null;
// Плагины
export const blockPluginConstructor = () => null;
export const blockWithModalPluginConstructor = () => null;
export const markPluginConstructor = () => null;
export const plugins = [];
// Дополнительные компоненты
export const JsonLd = () => null;
export const Plain = () => null;
// SSO
export const useAuth = () => ({
    isAuthenticated: false,
    user: null
});
// Утилиты
export const uuid = () => 'redaktus-' + Math.random().toString(36).substr(2, 9);
// Главный провайдер Redaktus
export const Redaktus = ({ children, appId, apiKey, pageTypes, customFields, loginUI, contentClassName, renderLocalLink, loginPath, editorPath, playgroundPath, appSettingsPath, previewPath, isDarkColorMode, toggleColorMode, useCssInJs, appRootElement, clickToEditSide, enableAutoSave, disableSaveIfInvalidProps, enablePreview, blockIconsPosition, enableUnsplash, unsplashApiKey, enablePreviewImage, enableDefaultEmbedBrick, navigate, ...domProps }) => {
    console.log('Redaktus Provider render');
    console.log('Redaktus children:', children);
    console.log('Redaktus appId:', appId);
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
    };
    console.log('Redaktus config:', config);
    return (_jsx(RedaktusContext.Provider, { value: config, children: _jsx("div", { className: "redaktus-provider", ...domProps, children: children }) }));
};
//# sourceMappingURL=redaktus-core.js.map