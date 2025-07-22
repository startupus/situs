"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorDataService = void 0;
const editor_1 = require("../types/editor");
/**
 * In-memory storage service для редактора Редактус
 * В будущем заменится на PostgreSQL/Prisma
 */
class EditorDataService {
    constructor() {
        this.pages = new Map();
        this.componentLibrary = new Map();
        this.nextPageId = 1;
        this.nextComponentId = 1;
        this.initializeDefaultData();
    }
    // === УПРАВЛЕНИЕ СТРАНИЦАМИ ===
    /**
     * Получить все страницы с пагинацией
     */
    getPages(page = 1, limit = 10, search) {
        let allPages = Array.from(this.pages.values());
        // Фильтрация по поиску
        if (search) {
            const searchLower = search.toLowerCase();
            allPages = allPages.filter(p => p.title.toLowerCase().includes(searchLower) ||
                p.slug.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower));
        }
        // Сортировка по дате обновления (новые сначала)
        allPages.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        // Пагинация
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPages = allPages.slice(startIndex, endIndex);
        return {
            items: paginatedPages,
            total: allPages.length,
            page,
            limit,
            hasNext: endIndex < allPages.length,
            hasPrev: page > 1
        };
    }
    /**
     * Получить страницу по ID
     */
    getPageById(id) {
        const page = this.pages.get(id);
        if (!page) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.PAGE_NOT_FOUND, `Страница с ID ${id} не найдена`, 404);
        }
        return page;
    }
    /**
     * Получить страницу по slug
     */
    getPageBySlug(slug) {
        const page = Array.from(this.pages.values()).find(p => p.slug === slug);
        if (!page) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.PAGE_NOT_FOUND, `Страница с slug ${slug} не найдена`, 404);
        }
        return page;
    }
    /**
     * Создать новую страницу
     */
    createPage(request, authorId) {
        const id = `page_${this.nextPageId++}`;
        const now = new Date().toISOString();
        // Генерация slug если не указан
        let slug = request.slug || this.generateSlugFromTitle(request.title);
        // Проверка уникальности slug
        if (this.isSlugExists(slug)) {
            slug = this.generateUniqueSlug(slug);
        }
        const newPage = {
            id,
            title: request.title,
            slug,
            status: 'draft',
            description: '',
            components: [],
            metadata: {
                seoTitle: request.title,
                seoDescription: '',
                seoKeywords: [],
            },
            settings: {
                template: request.template || 'default',
                theme: 'light',
                language: request.language || 'ru',
                isPrivate: false,
            },
            createdAt: now,
            updatedAt: now,
            authorId,
        };
        this.pages.set(id, newPage);
        return newPage;
    }
    /**
     * Обновить страницу
     */
    updatePage(id, request) {
        const page = this.getPageById(id);
        const now = new Date().toISOString();
        // Проверка уникальности slug при обновлении
        if (request.slug && request.slug !== page.slug && this.isSlugExists(request.slug)) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.SLUG_ALREADY_EXISTS, `Slug ${request.slug} уже используется`, 400);
        }
        const updatedPage = {
            ...page,
            ...request,
            metadata: request.metadata ? { ...page.metadata, ...request.metadata } : page.metadata,
            settings: request.settings ? { ...page.settings, ...request.settings } : page.settings,
            updatedAt: now,
        };
        this.pages.set(id, updatedPage);
        return updatedPage;
    }
    /**
     * Удалить страницу
     */
    deletePage(id) {
        const exists = this.pages.has(id);
        if (!exists) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.PAGE_NOT_FOUND, `Страница с ID ${id} не найдена`, 404);
        }
        return this.pages.delete(id);
    }
    // === УПРАВЛЕНИЕ КОМПОНЕНТАМИ НА СТРАНИЦЕ ===
    /**
     * Добавить компонент на страницу
     */
    addComponentToPage(pageId, request) {
        const page = this.getPageById(pageId);
        const componentTemplate = this.getComponentFromLibrary(request.type);
        const componentId = `component_${this.nextComponentId++}`;
        const now = new Date().toISOString();
        const newComponent = {
            id: componentId,
            type: request.type,
            name: componentTemplate.name,
            content: this.getDefaultContentForComponent(request.type),
            props: { ...componentTemplate.defaultProps, ...request.props },
            position: request.position,
            parentId: request.parentId,
            order: page.components.length,
            createdAt: now,
            updatedAt: now,
        };
        page.components.push(newComponent);
        page.updatedAt = now;
        this.pages.set(pageId, page);
        return newComponent;
    }
    /**
     * Обновить компонент на странице
     */
    updateComponent(pageId, componentId, request) {
        const page = this.getPageById(pageId);
        const componentIndex = page.components.findIndex(c => c.id === componentId);
        if (componentIndex === -1) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.COMPONENT_NOT_FOUND, `Компонент с ID ${componentId} не найден`, 404);
        }
        const existingComponent = page.components[componentIndex];
        const now = new Date().toISOString();
        const updatedComponent = {
            ...existingComponent,
            ...request,
            props: request.props ? { ...existingComponent.props, ...request.props } : existingComponent.props,
            position: request.position ? { ...existingComponent.position, ...request.position } : existingComponent.position,
            updatedAt: now,
        };
        page.components[componentIndex] = updatedComponent;
        page.updatedAt = now;
        this.pages.set(pageId, page);
        return updatedComponent;
    }
    /**
     * Удалить компонент со страницы
     */
    deleteComponent(pageId, componentId) {
        const page = this.getPageById(pageId);
        const componentIndex = page.components.findIndex(c => c.id === componentId);
        if (componentIndex === -1) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.COMPONENT_NOT_FOUND, `Компонент с ID ${componentId} не найден`, 404);
        }
        page.components.splice(componentIndex, 1);
        page.updatedAt = new Date().toISOString();
        this.pages.set(pageId, page);
        return true;
    }
    /**
     * Получить компонент со страницы
     */
    getComponentFromPage(pageId, componentId) {
        const page = this.getPageById(pageId);
        const component = page.components.find(c => c.id === componentId);
        if (!component) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.COMPONENT_NOT_FOUND, `Компонент с ID ${componentId} не найден`, 404);
        }
        return component;
    }
    // === БИБЛИОТЕКА КОМПОНЕНТОВ ===
    /**
     * Получить все компоненты из библиотеки
     */
    getComponentLibrary(category) {
        let components = Array.from(this.componentLibrary.values());
        if (category) {
            components = components.filter(c => c.category === category);
        }
        return components.sort((a, b) => a.name.localeCompare(b.name));
    }
    /**
     * Получить компонент из библиотеки
     */
    getComponentFromLibrary(type) {
        const component = this.componentLibrary.get(type);
        if (!component) {
            throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.INVALID_COMPONENT_TYPE, `Компонент типа ${type} не найден в библиотеке`, 400);
        }
        return component;
    }
    // === UTILITY МЕТОДЫ ===
    initializeDefaultData() {
        // Инициализация библиотеки компонентов
        this.initializeComponentLibrary();
        // Создание демо страницы
        this.createDemoPage();
    }
    initializeComponentLibrary() {
        const components = [
            {
                id: 'heading',
                name: 'Заголовок',
                type: 'heading',
                category: 'text',
                description: 'Заголовок различных уровней (H1-H6)',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48dGV4dCB4PSI1IiB5PSIyNSIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiPkg8L3RleHQ+PC9zdmc+',
                defaultProps: {
                    level: 1,
                    color: '#000000',
                    align: 'left',
                    fontFamily: 'Inter',
                },
                schema: {
                    props: [
                        { name: 'level', type: 'select', label: 'Уровень', defaultValue: 1, options: ['1', '2', '3', '4', '5', '6'], required: true },
                        { name: 'color', type: 'color', label: 'Цвет', defaultValue: '#000000' },
                        { name: 'align', type: 'select', label: 'Выравнивание', defaultValue: 'left', options: ['left', 'center', 'right'] },
                        { name: 'fontFamily', type: 'select', label: 'Шрифт', defaultValue: 'Inter', options: ['Inter', 'Arial', 'Georgia'] },
                    ]
                },
                tags: ['text', 'heading', 'title'],
                isCustom: false,
            },
            {
                id: 'paragraph',
                name: 'Текст',
                type: 'paragraph',
                category: 'text',
                description: 'Обычный текстовый блок',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48dGV4dCB4PSI1IiB5PSIxNSIgZm9udC1zaXplPSIxMiI+VGV4dDwvdGV4dD48L3N2Zz4=',
                defaultProps: {
                    fontSize: 16,
                    color: '#333333',
                    lineHeight: 1.5,
                    align: 'left',
                },
                schema: {
                    props: [
                        { name: 'fontSize', type: 'number', label: 'Размер шрифта', defaultValue: 16 },
                        { name: 'color', type: 'color', label: 'Цвет', defaultValue: '#333333' },
                        { name: 'lineHeight', type: 'number', label: 'Высота строки', defaultValue: 1.5 },
                        { name: 'align', type: 'select', label: 'Выравнивание', defaultValue: 'left', options: ['left', 'center', 'right', 'justify'] },
                    ]
                },
                tags: ['text', 'paragraph', 'content'],
                isCustom: false,
            },
            {
                id: 'button',
                name: 'Кнопка',
                type: 'button',
                category: 'interactive',
                description: 'Интерактивная кнопка',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIGZpbGw9IiMwMDdCRkYiIHJ4PSI1Ii8+PHRleHQgeD0iNTAiIHk9IjI1IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QnV0dG9uPC90ZXh0Pjwvc3ZnPg==',
                defaultProps: {
                    text: 'Кнопка',
                    backgroundColor: '#007BFF',
                    textColor: '#FFFFFF',
                    size: 'medium',
                    variant: 'solid',
                },
                schema: {
                    props: [
                        { name: 'text', type: 'string', label: 'Текст', defaultValue: 'Кнопка', required: true },
                        { name: 'backgroundColor', type: 'color', label: 'Цвет фона', defaultValue: '#007BFF' },
                        { name: 'textColor', type: 'color', label: 'Цвет текста', defaultValue: '#FFFFFF' },
                        { name: 'size', type: 'select', label: 'Размер', defaultValue: 'medium', options: ['small', 'medium', 'large'] },
                        { name: 'variant', type: 'select', label: 'Вариант', defaultValue: 'solid', options: ['solid', 'outline', 'ghost'] },
                    ]
                },
                tags: ['interactive', 'button', 'cta'],
                isCustom: false,
            },
            {
                id: 'image',
                name: 'Изображение',
                type: 'image',
                category: 'media',
                description: 'Изображение с настройками размера и выравнивания',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIGZpbGw9IiNFNUU1RTUiIHN0cm9rZT0iI0NDQyIvPjx0ZXh0IHg9IjUwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMCI+SW1hZ2U8L3RleHQ+PC9zdmc+',
                defaultProps: {
                    src: 'https://via.placeholder.com/400x300',
                    alt: 'Изображение',
                    width: 400,
                    height: 300,
                    objectFit: 'cover',
                },
                schema: {
                    props: [
                        { name: 'src', type: 'image', label: 'URL изображения', required: true },
                        { name: 'alt', type: 'string', label: 'Alt текст', defaultValue: 'Изображение' },
                        { name: 'width', type: 'number', label: 'Ширина', defaultValue: 400 },
                        { name: 'height', type: 'number', label: 'Высота', defaultValue: 300 },
                        { name: 'objectFit', type: 'select', label: 'Подгонка', defaultValue: 'cover', options: ['cover', 'contain', 'fill', 'scale-down'] },
                    ]
                },
                tags: ['media', 'image', 'visual'],
                isCustom: false,
            },
            {
                id: 'container',
                name: 'Контейнер',
                type: 'container',
                category: 'layout',
                description: 'Контейнер для группировки компонентов',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ii8+PHRleHQgeD0iNTAiIHk9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEwIj5Db250YWluZXI8L3RleHQ+PC9zdmc+',
                defaultProps: {
                    backgroundColor: 'transparent',
                    padding: 20,
                    margin: 0,
                    borderRadius: 0,
                    direction: 'column',
                },
                schema: {
                    props: [
                        { name: 'backgroundColor', type: 'color', label: 'Цвет фона', defaultValue: 'transparent' },
                        { name: 'padding', type: 'number', label: 'Отступы внутри', defaultValue: 20 },
                        { name: 'margin', type: 'number', label: 'Отступы снаружи', defaultValue: 0 },
                        { name: 'borderRadius', type: 'number', label: 'Радиус границ', defaultValue: 0 },
                        { name: 'direction', type: 'select', label: 'Направление', defaultValue: 'column', options: ['row', 'column'] },
                    ]
                },
                tags: ['layout', 'container', 'wrapper'],
                isCustom: false,
            }
        ];
        components.forEach(component => {
            this.componentLibrary.set(component.type, component);
        });
    }
    createDemoPage() {
        const demoPage = this.createPage({
            title: 'Главная страница',
            slug: 'home',
            template: 'landing',
            language: 'ru'
        });
        // Добавляем демо компоненты
        this.addComponentToPage(demoPage.id, {
            type: 'heading',
            position: { x: 50, y: 50 },
            props: { level: 1 }
        });
        this.addComponentToPage(demoPage.id, {
            type: 'paragraph',
            position: { x: 50, y: 120 },
        });
        this.addComponentToPage(demoPage.id, {
            type: 'button',
            position: { x: 50, y: 200 },
            props: { text: 'Начать работу' }
        });
    }
    generateSlugFromTitle(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    isSlugExists(slug) {
        return Array.from(this.pages.values()).some(page => page.slug === slug);
    }
    generateUniqueSlug(baseSlug) {
        let counter = 1;
        let newSlug = `${baseSlug}-${counter}`;
        while (this.isSlugExists(newSlug)) {
            counter++;
            newSlug = `${baseSlug}-${counter}`;
        }
        return newSlug;
    }
    getDefaultContentForComponent(type) {
        const defaultContent = {
            heading: 'Новый заголовок',
            paragraph: 'Введите текст здесь...',
            button: 'Кнопка',
            image: '',
            container: '',
        };
        return defaultContent[type] || '';
    }
    // === СТАТИСТИКА ===
    /**
     * Получить статистику сервиса
     */
    getStats() {
        return {
            totalPages: this.pages.size,
            totalComponents: Array.from(this.pages.values()).reduce((sum, page) => sum + page.components.length, 0),
            totalLibraryComponents: this.componentLibrary.size,
            pagesByStatus: {
                draft: Array.from(this.pages.values()).filter(p => p.status === 'draft').length,
                published: Array.from(this.pages.values()).filter(p => p.status === 'published').length,
                archived: Array.from(this.pages.values()).filter(p => p.status === 'archived').length,
            }
        };
    }
}
exports.EditorDataService = EditorDataService;
