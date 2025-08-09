import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaGlobe, FaCog, FaEye, FaEdit, FaTrash, FaSearch, FaSort } from 'react-icons/fa'
import projectsApi from '../api/services/projects.api'

interface Project {
  id: string
  name: string
  description?: string
  domain?: string
  customDomain?: string
  status: 'DRAFT' | 'DEVELOPMENT' | 'STAGING' | 'PUBLISHED' | 'ARCHIVED'
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectsListProps {
  user: any
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created'>('updated')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const result = await projectsApi.getProjects({ page: 1, limit: 50 })
      setProjects(result.projects as any)
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'STAGING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'DEVELOPMENT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      case 'ARCHIVED': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Опубликован'
      case 'STAGING': return 'Тестирование'
      case 'DEVELOPMENT': return 'Разработка'
      case 'DRAFT': return 'Черновик'
      case 'ARCHIVED': return 'Архив'
      default: return status
    }
  }

  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'created': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updated': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        default: return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загружаем проекты...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Хедер */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Мои проекты
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Добро пожаловать, {user?.username || user?.email}
              </p>
            </div>
            <Link
              to="/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FaPlus size={14} />
              <span>Создать проект</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Фильтры и поиск */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Поиск проектов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FaSort className="text-gray-400" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updated">По обновлению</option>
              <option value="created">По дате создания</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>

        {/* Список проектов */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGlobe className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? 'Проекты не найдены' : 'Пока нет проектов'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? 'Попробуйте изменить критерии поиска' 
                : 'Создайте свой первый сайт с помощью Situs'
              }
            </p>
            {!searchQuery && (
              <Link
                to="/projects/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
              >
                <FaPlus size={16} />
                <span>Создать первый проект</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Хедер карточки */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  {/* Домен */}
                  {(project.domain || project.customDomain) && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <FaGlobe size={12} />
                        <span>{project.customDomain || project.domain}</span>
                      </div>
                    </div>
                  )}

                  {/* Даты */}
                  <div className="mb-4 text-xs text-gray-500 dark:text-gray-500">
                    Обновлен: {new Date(project.updatedAt).toLocaleDateString('ru-RU')}
                  </div>

                  {/* Действия */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/projects/${project.id}/dashboard`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        title="Управление"
                      >
                        <FaCog size={16} />
                      </Link>
                      {project.isPublished && (
                        <a
                          href={`https://${project.customDomain || project.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 dark:text-green-400"
                          title="Просмотр сайта"
                        >
                          <FaEye size={16} />
                        </a>
                      )}
                    </div>
                    
                    <Link
                      to={`/projects/${project.id}/dashboard`}
                      className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition-colors"
                    >
                      Открыть
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsList 