import React, { useEffect, useMemo, useState } from 'react';
import projectsApi from '../../../../api/services/projects.api';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';

interface BasicThemeFormProps {
  value: any;
  onChange: (next: any) => void;
}

const BasicThemeForm: React.FC<BasicThemeFormProps> = ({ value, onChange }) => {
  const variants: Array<'light' | 'dark'> = ['light', 'dark'];
  const colorKeys = ['primary','primaryHover','primaryActive','secondary','accent','success','warning','error','info','background','surface','text','textSecondary','border','borderLight'] as const;
  return (
    <div className="space-y-6">
      {variants.map(variant => (
        <div key={variant} className="border border-stroke dark:border-dark-3 rounded-xl p-4">
          <div className="font-semibold text-dark dark:text-white mb-3">{variant === 'light' ? 'Светлая палитра' : 'Тёмная палитра'}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorKeys.map((key) => (
              <div key={`${variant}-${key}`} className="space-y-1">
                <label className="block text-xs text-body-color dark:text-dark-6">{key}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value?.colors?.[variant]?.[key] || '#000000'}
                    onChange={(e) => onChange({
                      ...value,
                      colors: {
                        ...value.colors,
                        [variant]: {
                          ...value.colors?.[variant],
                          [key]: e.target.value,
                        }
                      }
                    })}
                    className="w-12 h-10 rounded border border-stroke"
                  />
                  <input
                    type="text"
                    value={value?.colors?.[variant]?.[key] || ''}
                    onChange={(e) => onChange({
                      ...value,
                      colors: {
                        ...value.colors,
                        [variant]: {
                          ...value.colors?.[variant],
                          [key]: e.target.value,
                        }
                      }
                    })}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 border border-stroke rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectThemeManager: React.FC = () => {
  const { projectId } = useParams();
  const { currentTheme, isDarkMode, updateTheme, toggleDarkMode, saveThemeSettings } = useTheme();
  const [serverTheme, setServerTheme] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveProjectId = useMemo(() => projectId as string, [projectId]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!effectiveProjectId) return;
      setLoading(true);
      setError(null);
      try {
        const theme = await projectsApi.getProjectTheme(effectiveProjectId);
        if (!mounted) return;
        setServerTheme(theme);
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки темы');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [effectiveProjectId]);

  const handleSave = async () => {
    if (!effectiveProjectId || !serverTheme) return;
    setSaving(true);
    setError(null);
    try {
      await projectsApi.updateProjectTheme(effectiveProjectId, serverTheme);
      await saveThemeSettings();
    } catch (e: any) {
      setError(e?.message || 'Ошибка сохранения темы');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-body-color dark:text-dark-6">Загрузка темы...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!serverTheme) {
    return <div className="p-6 text-body-color dark:text-dark-6">Тема недоступна</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Глобальная тема проекта</h1>
          <p className="text-body-color dark:text-dark-6">Переключение предустановленных тем, настройка палитры и сохранение</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="px-3 py-2 border border-stroke rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            {isDarkMode ? 'Темный режим: вкл' : 'Темный режим: выкл'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Выбор предустановленных тем (на основе текущих настроек ThemeContext) */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark dark:text-white">Предустановленная тема</label>
        <select
          value={currentTheme.id}
          onChange={(e) => updateTheme(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-stroke px-3 py-2 dark:border-dark-3 dark:bg-dark dark:text-white"
        >
          {/* Список доступных тем хранится в ThemeContext.settings.availableThemes */}
          {/* Чтобы не тянуть весь контекст сюда, оставим выбор по текущей теме (updateTheme сам переключит) */}
          <option value={currentTheme.id}>{currentTheme.name}</option>
        </select>
        <p className="text-xs text-body-color dark:text-dark-6">Список тем может быть расширен позже (Фаза 2).</p>
      </div>

      {/* Редактор палитры (MVP) */}
      <BasicThemeForm value={serverTheme} onChange={setServerTheme} />
    </div>
  );
};

export default ProjectThemeManager;

