export default {
  kind: 'collectionType',
  collectionName: 'users',
  info: {
    singularName: 'user',
    pluralName: 'users',
    displayName: 'User',
    description: 'User management for Situs platform'
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    firstName: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: 'email',
      required: true,
      unique: true,
    },
    username: {
      type: 'string',
      unique: true,
      minLength: 3,
      maxLength: 30,
    },
    password: {
      type: 'password',
      private: true,
      minLength: 6,
    },
    role: {
      type: 'enumeration',
      enum: ['admin', 'user', 'moderator'],
      default: 'user',
    },
    status: {
      type: 'enumeration',
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
    avatar: {
      type: 'media',
      multiple: false,
      allowedTypes: ['images'],
    },
    lastLoginAt: {
      type: 'datetime',
    },
    projects: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::project.project',
      mappedBy: 'owner',
    },
    collaboratedProjects: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::project.project',
      inversedBy: 'collaborators',
    },
    settings: {
      type: 'json',
    },
  },
}; 