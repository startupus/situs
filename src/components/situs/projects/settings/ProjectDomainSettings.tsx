import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsApi } from '../../../../api/services/projects.api';
import { Project } from '../../../../types/project';

/**
 * Компонент настроек домена проекта
 * - Управление базовым доменом (domain)
 * - Управление кастомным доменом (customDomain)
 * - Проверка доступности доменов
 * - Валидация доменов
 */
const ProjectDomainSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Форма доменов
  const [domainForm, setDomainForm] = useState({
    domain: '',
    customDomain: '',
  });

  // Валидация доменов
  const [domainValidation, setDomainValidation] = useState({
    domain: { isValid: true, message: '' },
    customDomain: { isValid: true, message: '' },
  });

  // Проверка доступности доменов
  const [domainAvailability, setDomainAvailability] = useState({
    domain: { checking: false, available: true },
    customDomain: { checking: false, available: true },
  });

  // Загрузка данных проекта
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);

        // Устанавливаем dev-token для тестирования
        if (typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
          localStorage.setItem('auth_token', 'dev-token');
        }

        // Для демонстрации используем моковые данные
        const mockProject = typeof window !== 'undefined' ? localStorage.getItem('mock_project') : null;
        if (mockProject) {
          const projectData = JSON.parse(mockProject);
          setProject(projectData);
          setDomainForm({
            domain: projectData.domain || '',
            customDomain: projectData.customDomain || '',
          });
          setLoading(false);
          return;
        }

        const projectData = await projectsApi.getProject(projectId);
        setProject(projectData);

        // Заполняем форму данными проекта
        setDomainForm({
          domain: projectData.domain || '',
          customDomain: projectData.customDomain || '',
        });
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки проекта');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Валидация домена
  const validateDomain = (domain: string): { isValid: boolean; message: string } => {
    if (!domain.trim()) {
      return { isValid: true, message: '' };
    }

    // Простая валидация домена
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/;

    if (!domainRegex.test(domain)) {
      return { isValid: false, message: 'Некорректный формат домена' };
    }

    if (domain.length > 253) {
      return { isValid: false, message: 'Домен слишком длинный (максимум 253 символа)' };
    }

    return { isValid: true, message: '' };
  };

  // Проверка доступности домена
  const checkDomainAvailability = async (domain: string, field: 'domain' | 'customDomain') => {
    if (!domain.trim()) {
      setDomainAvailability((prev) => ({
        ...prev,
        [field]: { checking: false, available: true },
      }));
      return;
    }

    setDomainAvailability((prev) => ({
      ...prev,
      [field]: { checking: true, available: true },
    }));

    try {
      const available = await projectsApi.checkDomainAvailability(domain, projectId);
      setDomainAvailability((prev) => ({
        ...prev,
        [field]: { checking: false, available },
      }));
    } catch (err) {
      setDomainAvailability((prev) => ({
        ...prev,
        [field]: { checking: false, available: false },
      }));
    }
  };

  // Обработка изменения домена
  const handleDomainChange = (field: 'domain' | 'customDomain', value: string) => {
    setDomainForm((prev) => ({ ...prev, [field]: value }));

    // Валидация
    const validation = validateDomain(value);
    setDomainValidation((prev) => ({
      ...prev,
      [field]: validation,
    }));

    // Проверка доступности (с задержкой)
    if (validation.isValid && value.trim()) {
      const timeoutId = setTimeout(() => {
        checkDomainAvailability(value, field);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  };

  // Сохранение настроек домена
  const handleSave = async () => {
    if (!projectId) return;

    // Проверяем валидацию
    const domainValid = validateDomain(domainForm.domain);
    const customDomainValid = validateDomain(domainForm.customDomain);

    if (!domainValid.isValid || !customDomainValid.isValid) {
      setError('Исправьте ошибки в полях доменов');
      return;
    }

    // Проверяем доступность кастомного домена
    if (domainForm.customDomain.trim() && !domainAvailability.customDomain.available) {
      setError('Кастомный домен уже используется другим проектом');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await projectsApi.updateProjectDomains(projectId, {
        domain: domainForm.domain.trim() || undefined,
        customDomain: domainForm.customDomain.trim() || undefined,
      });

      setSuccess('Настройки домена успешно сохранены');

      // Обновляем данные проекта
      const updatedProject = await projectsApi.getProject(projectId);
      setProject(updatedProject);
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении настроек домена');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-dark dark:text-white mb-2">Настройки домена</h2>
          <p className="text-body-color dark:text-dark-6">
            Управляйте доменными настройками вашего проекта. Настройте базовый домен и добавьте кастомный домен для
            публикации.
          </p>
        </div>

        {/* Сообщения об ошибках и успехе */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Базовый домен */}
          <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">Базовый домен</h3>
              <p className="text-sm text-body-color dark:text-dark-6">
                Основной домен для доступа к вашему проекту. Обычно это поддомен платформы.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="domain" className="block text-sm font-medium text-dark dark:text-white">
                Домен
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="domain"
                  value={domainForm.domain}
                  onChange={(e) => handleDomainChange('domain', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    !domainValidation.domain.isValid
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-stroke dark:border-dark-3'
                  } dark:bg-dark dark:text-white`}
                  placeholder="example.situs.local"
                />
                {domainAvailability.domain.checking && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>

              {!domainValidation.domain.isValid && (
                <p className="text-sm text-red-600 dark:text-red-400">{domainValidation.domain.message}</p>
              )}

              {domainForm.domain && !domainAvailability.domain.checking && (
                <p
                  className={`text-sm ${
                    domainAvailability.domain.available
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {domainAvailability.domain.available ? '✓ Домен доступен' : '✗ Домен уже используется'}
                </p>
              )}
            </div>
          </div>

          {/* Кастомный домен */}
          <div className="bg-white dark:bg-dark-2 rounded-lg border border-stroke dark:border-dark-3 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">Кастомный домен</h3>
              <p className="text-sm text-body-color dark:text-dark-6">
                Ваш собственный домен для проекта. После настройки DNS записей ваш сайт будет доступен по этому домену.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="customDomain" className="block text-sm font-medium text-dark dark:text-white">
                Кастомный домен
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="customDomain"
                  value={domainForm.customDomain}
                  onChange={(e) => handleDomainChange('customDomain', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    !domainValidation.customDomain.isValid
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-stroke dark:border-dark-3'
                  } dark:bg-dark dark:text-white`}
                  placeholder="example.com"
                />
                {domainAvailability.customDomain.checking && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>

              {!domainValidation.customDomain.isValid && (
                <p className="text-sm text-red-600 dark:text-red-400">{domainValidation.customDomain.message}</p>
              )}

              {domainForm.customDomain && !domainAvailability.customDomain.checking && (
                <p
                  className={`text-sm ${
                    domainAvailability.customDomain.available
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {domainAvailability.customDomain.available ? '✓ Домен доступен' : '✗ Домен уже используется'}
                </p>
              )}
            </div>

            {/* Инструкции по настройке DNS */}
            {domainForm.customDomain && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Инструкции по настройке DNS
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>1. Войдите в панель управления вашего доменного регистратора</p>
                  <p>2. Добавьте CNAME запись:</p>
                  <div className="ml-4 font-mono bg-blue-100 dark:bg-blue-800 p-2 rounded">
                    <div>Имя: {domainForm.customDomain}</div>
                    <div>Значение: situs.local</div>
                  </div>
                  <p>3. Дождитесь распространения DNS записей (обычно 5-30 минут)</p>
                </div>
              </div>
            )}
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setDomainForm({
                  domain: project?.domain || '',
                  customDomain: project?.customDomain || '',
                });
                setError(null);
                setSuccess(null);
              }}
              className="px-4 py-2 text-sm font-medium text-body-color dark:text-dark-6 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !domainValidation.domain.isValid || !domainValidation.customDomain.isValid}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDomainSettings;
