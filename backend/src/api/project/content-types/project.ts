export default {
  kind: 'collectionType',
  collectionName: 'projects',
  info: {
    singularName: 'project',
    pluralName: 'projects',
    displayName: 'Project',
    description: 'Project management for Situs platform'
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {
    i18n: {
      localized: true,
    },
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 100,
    },
    description: {
      type: 'text',
    },
    domain: {
      type: 'string',
      unique: true,
      pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$',
    },
    template: {
      type: 'enumeration',
      enum: ['website', 'ecommerce', 'blog', 'landing', 'app'],
      default: 'website',
    },
    settings: {
      type: 'json',
    },
    isPublic: {
      type: 'boolean',
      default: false,
    },
    status: {
      type: 'enumeration',
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    pages: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::page.page',
      mappedBy: 'project',
    },
    owner: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'plugin::users-permissions.user',
    },
    collaborators: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'plugin::users-permissions.user',
    },
    publishedAt: {
      type: 'datetime',
    },
  },
}; 