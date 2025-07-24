import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaGlobe, FaCog, FaRobot, FaHandPaper } from 'react-icons/fa'

interface CreateProjectProps {
  user: any
}

export const CreateProject: React.FC<CreateProjectProps> = ({ user }) => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creationType: 'manual', // 'manual' | 'ai'
    domainType: 'situs', // 'situs' | 'custom'
    customDomain: '',
    theme: 'auto' as 'light' | 'dark' | 'auto',
    language: 'ru' as 'ru' | 'en'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      const slug = generateSlug(formData.name)
      const situsSubdomain = `${slug}.situs.com`

      const projectData = {
        name: formData.name,
        description: formData.description,
        slug,
        domain: formData.domainType === 'situs' ? situsSubdomain : undefined,
        customDomain: formData.domainType === 'custom' ? formData.customDomain : undefined,
        status: 'DRAFT',
        settings: {
          theme: formData.theme,
          language: formData.language,
          creationType: formData.creationType
        }
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(projectData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка создания проекта')
      }

      const project = await response.json()

      if (formData.creationType === 'ai') {
        // Перенаправляем на AI-генерацию
        navigate(`/projects/${project.id}/ai-setup`)
      } else {
        // Перенаправляем в dashboard
        navigate(`/projects/${project.id}/dashboard`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания проекта')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Основная информация
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Расскажите о вашем проекте
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Название проекта
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Мой замечательный сайт"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Описание (необязательно)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Краткое описание проекта..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Способ создания
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('creationType', 'manual')}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              formData.creationType === 'manual'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <FaHandPaper className={`mb-3 ${formData.creationType === 'manual' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Создать вручную
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Начать с пустой страницы и создать сайт самостоятельно
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('creationType', 'ai')}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              formData.creationType === 'ai'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <FaRobot className={`mb-3 ${formData.creationType === 'ai' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Создать с помощью ИИ
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Позволить ИИ создать сайт на основе ваших требований
            </p>
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Настройка домена
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Выберите адрес для вашего сайта
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Тип домена
        </label>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleInputChange('domainType', 'situs')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              formData.domainType === 'situs'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Бесплатный поддомен Situs
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {generateSlug(formData.name) || 'your-site'}.situs.com
                </p>
              </div>
              <div className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded">
                Бесплатно
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('domainType', 'custom')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              formData.domainType === 'custom'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Собственный домен
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Подключить свой домен (example.com)
                </p>
              </div>
              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
                Премиум
              </div>
            </div>
          </button>
        </div>

        {formData.domainType === 'custom' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ваш домен
            </label>
            <input
              type="text"
              value={formData.customDomain}
              onChange={(e) => handleInputChange('customDomain', e.target.value)}
              placeholder="example.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Убедитесь, что у вас есть права на управление DNS записями этого домена
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Настройки проекта
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Последние штрихи
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Тема оформления
        </label>
        <select
          value={formData.theme}
          onChange={(e) => handleInputChange('theme', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="auto">Автоматически (как в браузере)</option>
          <option value="light">Светлая</option>
          <option value="dark">Темная</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Язык интерфейса
        </label>
        <select
          value={formData.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Превью */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
          Превью настроек
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Название:</span>
            <span className="text-gray-900 dark:text-gray-100">{formData.name || 'Не указано'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Домен:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formData.domainType === 'situs' 
                ? `${generateSlug(formData.name) || 'your-site'}.situs.com`
                : formData.customDomain || 'Не указан'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Создание:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formData.creationType === 'ai' ? 'С помощью ИИ' : 'Вручную'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Хедер */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/projects')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Создание нового проекта
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Шаг {step} из 3
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Прогресс */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex py-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum === step 
                    ? 'bg-blue-600 text-white'
                    : stepNum < step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {stepNum < step ? '✓' : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    stepNum < step ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Кнопки навигации */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Назад
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!formData.name || (step === 2 && formData.domainType === 'custom' && !formData.customDomain)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                Далее
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !formData.name}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
              >
                {isLoading ? 'Создание...' : 'Создать проект'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProject 