// Централизованный реестр test-id селекторов для e2e и визуальных тестов
// Все компоненты админки должны использовать эти идентификаторы

export const testIds = {
  menu: {
    manager: 'menu-manager',
    item: 'menu-item',
    typeSelect: 'menu-type-select',
    preview: 'menu-preview',
    previewStyleSelect: 'menu-preview-style',
    previewRoleSelect: 'menu-preview-role',
    previewLanguageSelect: 'menu-preview-language',
    previewStats: 'menu-preview-stats',
    dragDrop: 'menu-dragdrop',
    dragHandle: 'menu-drag-handle',
  },
  projects: {
    list: 'projects-list',
    card: 'project-card',
    statusToggle: 'project-status-toggle',
    detailLink: 'project-detail-link',
  },
  pages: {
    container: 'project-pages',
    searchInput: 'pages-search-input',
    statusSelect: 'pages-status-select',
    pageCard: 'project-page-card',
    pageEditLink: 'project-page-edit',
  },
  products: {
    section: 'products-section',
    categoriesSection: 'products-categories-section',
    itemsSection: 'products-items-section',
    createCategoryButton: 'products-create-category',
    createItemButton: 'products-create-item',
    categoryRow: 'products-category-row',
    itemRow: 'products-item-row',
    tabs: {
      categories: 'products-tab-categories',
      items: 'products-tab-items',
    },
  },
  users: {
    container: 'users-container',
    searchInput: 'users-search-input',
    roleSelect: 'users-role-select',
    statusSelect: 'users-status-select',
    table: 'users-table',
    row: 'users-row',
    editButton: 'users-edit',
    permissionsButton: 'users-permissions',
    deleteButton: 'users-delete',
  },
};
