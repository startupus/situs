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
  const { currentTheme, isDarkMode, updateTheme, toggleDarkMode, saveThemeSettings, settings, updateThemeVariant } = useTheme();
  const [serverTheme, setServerTheme] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [usage, setUsage] = useState<{ lastUpdatedAt?: string; lastThemeId?: string; timesSaved?: number } | null>(null);

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
        // Статистика использования
        try {
          const u = await projectsApi.getProjectThemeUsage(effectiveProjectId);
          if (mounted) setUsage(u);
        } catch {}
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки темы');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [effectiveProjectId]);

  const handleSelectPreset = (themeId: string) => {
    try {
      const preset = settings.availableThemes.find((t) => t.id === themeId);
      if (!preset) return;
      // Обновляем контекст на выбранную предустановку
      updateTheme(themeId);
      // И синхронизируем редактируемую конфигурацию с пресетом
      setServerTheme(preset);
      if (previewMode) {
        try {
          updateThemeVariant('light', preset.colors.light as any);
          updateThemeVariant('dark', preset.colors.dark as any);
        } catch {}
      }
    } catch {}
  };

  const togglePreview = () => {
    const next = !previewMode;
    setPreviewMode(next);
    try {
      if (serverTheme && serverTheme.colors) {
        updateThemeVariant('light', serverTheme.colors.light as any);
        updateThemeVariant('dark', serverTheme.colors.dark as any);
      }
    } catch {}
  };

  const handleSave = async () => {
    if (!effectiveProjectId || !serverTheme) return;
    setSaving(true);
    setError(null);
    try {
      await projectsApi.updateProjectTheme(effectiveProjectId, serverTheme);
      await saveThemeSettings();
      setNotice({ type: 'success', text: 'Тема успешно сохранена' });
    } catch (e: any) {
      const msg = e?.message || 'Ошибка сохранения темы';
      setError(msg);
      setNotice({ type: 'error', text: msg });
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
            onClick={togglePreview}
            className={`px-3 py-2 border rounded-lg text-sm ${previewMode ? 'border-primary text-primary' : 'border-stroke hover:bg-gray-50 dark:hover:bg-dark-3'}`}
          >
            {previewMode ? 'Предпросмотр включен' : 'Предпросмотр'}
          </button>
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

      {notice && (
        <div
          className={`rounded-lg p-3 text-sm ${
            notice.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900'
              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900'
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Статистика использования */}
      {!!usage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-stroke dark:border-dark-3 p-3">
            <div className="text-xs text-body-color dark:text-dark-6">Последнее обновление</div>
            <div className="text-sm text-dark dark:text-white font-medium">{usage.lastUpdatedAt ? new Date(usage.lastUpdatedAt).toLocaleString() : '—'}</div>
          </div>
          <div className="rounded-lg border border-stroke dark:border-dark-3 p-3">
            <div className="text-xs text-body-color dark:text-dark-6">Последняя тема</div>
            <div className="text-sm text-dark dark:text-white font-medium">{usage.lastThemeId || '—'}</div>
          </div>
          <div className="rounded-lg border border-stroke dark:border-dark-3 p-3">
            <div className="text-xs text-body-color dark:text-dark-6">Сохранений</div>
            <div className="text-sm text-dark dark:text-white font-medium">{usage.timesSaved ?? 0}</div>
          </div>
        </div>
      )}

      {/* Выбор предустановленных тем */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark dark:text-white">Предустановленная тема</label>
        <select
          value={currentTheme.id}
          onChange={(e) => handleSelectPreset(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-stroke px-3 py-2 dark:border-dark-3 dark:bg-dark dark:text-white"
        >
          {settings.availableThemes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <p className="text-xs text-body-color dark:text-dark-6">Можно настроить палитру ниже и сохранить как активную для проекта.</p>
      </div>

      {/* Редактор палитры (MVP) */}
      <BasicThemeForm value={serverTheme} onChange={setServerTheme} />

      {/* Блок предпросмотра UI элементов */}
      <div className="space-y-4">
        <div className="font-semibold text-dark dark:text-white">Предпросмотр элементов</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Карточка */}
          <div
            className="rounded-xl border p-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="text-lg font-semibold mb-1">Карточка</div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Пример текста. Проверьте контраст и читабельность.
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="px-3 py-2 rounded-lg text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Кнопка
              </button>
              <button
                className="px-3 py-2 rounded-lg"
                style={{
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)'
                }}
              >
                Обводка
              </button>
            </div>
          </div>

          {/* Формы */}
          <div
            className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Поле ввода</label>
            <input
              type="text"
              placeholder="Текст..."
              className="w-full rounded-lg px-3 py-2"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
            />
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Подпись/подсказка
            </div>
          </div>
        </div>
      </div>

      {/* Импорт / Экспорт темы (MVP) */}
      <div className="space-y-3">
        <div className="font-semibold text-dark dark:text-white">Импорт/Экспорт</div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              try {
                const dataStr = JSON.stringify(serverTheme, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'project-theme.json';
                a.click();
                URL.revokeObjectURL(url);
                setNotice({ type: 'success', text: 'Экспорт выполнен' });
              } catch (e: any) {
                setNotice({ type: 'error', text: e?.message || 'Ошибка экспорта' });
              }
            }}
            className="px-3 py-2 rounded-lg border border-stroke hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            Экспорт JSON
          </button>
          <label className="px-3 py-2 rounded-lg border border-stroke cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-3">
            Импорт JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                try {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  const parsed = JSON.parse(text);
                  const imported = parsed?.theme || parsed;
                  if (!imported?.colors?.light || !imported?.colors?.dark) {
                    throw new Error('Неверный формат файла темы');
                  }
                  setServerTheme(imported);
                  if (previewMode) {
                    try {
                      updateThemeVariant('light', imported.colors.light as any);
                      updateThemeVariant('dark', imported.colors.dark as any);
                    } catch {}
                  }
                  setNotice({ type: 'success', text: 'Тема импортирована (не забывайте сохранить)' });
                } catch (err: any) {
                  setNotice({ type: 'error', text: err?.message || 'Ошибка импорта' });
                } finally {
                  e.currentTarget.value = '';
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProjectThemeManager;

