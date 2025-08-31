import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { integrationsApi, IntegrationInstance, IntegrationProviderMeta, CreateIntegrationRequest, UpdateIntegrationRequest } from '../../../../api/services/integrations.api';
import { useToast } from '../../../ui/ThemeToast';
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * Страница настроек интеграций проекта
 * - Вкладки: Каталог провайдеров, Установленные
 * - Создание инстанса провайдера (instanceKey, title, минимальный config)
 * - Тестирование и включение/выключение инстанса
 */
const ProjectIntegrationsPage: React.FC = () => {
  const { projectId = '' } = useParams();
  const { addToast } = useToast();
  const [tab, setTab] = useState<'catalog' | 'installed' | 'edit'>(() => {
    const hash = (typeof window !== 'undefined') ? window.location.hash.replace('#','') : '';
    if (hash === 'installed' || hash === 'edit' || hash === 'catalog') return hash as any;
    return 'catalog';
  });
  const [providers, setProviders] = useState<IntegrationProviderMeta[]>([]);
  const [instances, setInstances] = useState<IntegrationInstance[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<IntegrationInstance | null>(null);
  const [form, setForm] = useState<{ title?: string; instanceKey?: string; config?: any; secrets?: any }>({});
  const [workflows, setWorkflows] = useState<any[] | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [actionKeyInput, setActionKeyInput] = useState<string>('');
  const [es, setEs] = useState<EventSource | null>(null);
  const [query, setQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'status' | 'provider' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [testingInstances, setTestingInstances] = useState<Set<string>>(new Set());
  const [healthStatuses, setHealthStatuses] = useState<Record<string, { success: boolean; status: string; detail?: string; lastChecked: number }>>({});
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const [prov, list] = await Promise.all([
          integrationsApi.listProviders(),
          integrationsApi.listByProject(projectId),
        ]);
        if (!aborted) {
          setProviders(prov);
          setInstances(list);
        }
      } catch (e: any) {
        if (!aborted) setError(e?.message || 'Ошибка загрузки');
      }
    })();
    return () => { aborted = true; };
  }, [projectId]);

  // Подписка на SSE integration_* события для автообновления списков/статусов
  useEffect(() => {
    try { es?.close(); } catch {}
    const source = new EventSource(`/api/realtime/integrations?projectId=${encodeURIComponent(projectId)}`);
    setEs(source);
    source.onmessage = async (ev) => {
      try {
        const data = JSON.parse(ev.data || '{}');
        const t = (data?.type || '').toString();
        
        if (t === 'integration_health_changed') {
          // Update health status without refetching full list
          const payload = data.payload || {};
          if (payload.health) {
            setHealthStatuses(prev => ({
              ...prev,
              [payload.id]: { ...payload.health, lastChecked: Date.now() }
            }));
          }
          return;
        }
        
        if (!t.startsWith('integration_')) return;
        // На любое обновление интеграций — перезагружаем список для текущего проекта
        const list = await integrationsApi.listByProject(projectId);
        setInstances(list);
      } catch {}
    };
    source.onerror = () => { try { source.close(); } catch {}; };
    return () => { try { source.close(); } catch {}; setEs(null); };
  }, [projectId]);

  const byProvider = useMemo(() => {
    const map: Record<string, IntegrationInstance[]> = {};
    for (const inst of instances) {
      (map[inst.provider] ||= []).push(inst);
    }
    return map;
  }, [instances]);

  const filteredProviders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => (
      p.name.toLowerCase().includes(q) ||
      p.key.toLowerCase().includes(q) ||
      (p.category||'').toLowerCase().includes(q)
    ));
  }, [providers, query]);

  const filteredInstances = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = instances;
    
    // Фильтрация по поисковому запросу
    if (q) {
      filtered = instances.filter((i) => (
        (i.title||'').toLowerCase().includes(q) ||
        (i.provider||'').toLowerCase().includes(q) ||
        (i.instanceKey||'').toLowerCase().includes(q) ||
        (i.status||'').toLowerCase().includes(q)
      ));
    }
    
    // Сортировка
    return filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'status':
          // Приоритет: ERROR > READY > DISABLED
          const statusPriority = { ERROR: 3, READY: 2, DISABLED: 1 };
          aVal = statusPriority[a.status as keyof typeof statusPriority] || 0;
          bVal = statusPriority[b.status as keyof typeof statusPriority] || 0;
          break;
        case 'provider':
          aVal = a.provider;
          bVal = b.provider;
          break;
        case 'updatedAt':
        default:
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
          break;
      }
      
      if (aVal === bVal) return 0;
      const comparison = aVal < bVal ? -1 : 1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [instances, query, sortBy, sortOrder]);

  const paginatedInstances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInstances.slice(startIndex, endIndex);
  }, [filteredInstances, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInstances.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortBy, sortOrder]);

  async function createInstance(provider: IntegrationProviderMeta) {
    setBusy(true); setError(null);
    try {
      // Минимальная форма создания: сгенерируем instanceKey
      const instanceKey = `${provider.key.toLowerCase()}-${Math.random().toString(36).slice(2, 6)}`;
      const req: CreateIntegrationRequest = {
        projectId,
        provider: provider.key,
        instanceKey,
        title: provider.name,
        // Базовый конфиг для N8N и EMAIL_SMTP как заглушка
        config: provider.key === 'N8N' ? { baseUrl: '' } : {},
      };
      const created = await integrationsApi.create(req);
      setInstances((prev) => [created, ...prev]);
      setTab('installed');
      addToast({
        type: 'success',
        title: 'Интеграция создана',
        message: `${provider.name} успешно подключен`,
        duration: 4000
      });
    } catch (e: any) {
      const errorMsg = e?.message || 'Не удалось создать интеграцию';
      setError(errorMsg);
      addToast({
        type: 'error',
        title: 'Ошибка создания',
        message: errorMsg,
        duration: 6000
      });
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(inst: IntegrationInstance) {
    setBusy(true); setError(null);
    try {
      const updated = await integrationsApi.update(inst.id, { isActive: !inst.isActive });
      setInstances((prev) => prev.map((x) => (x.id === inst.id ? updated : x)));
      addToast({
        type: 'success',
        title: 'Статус изменен',
        message: `${inst.title || inst.provider} ${updated.isActive ? 'включен' : 'выключен'}`,
        duration: 3000
      });
    } catch (e: any) {
      const errorMsg = e?.message || 'Не удалось изменить статус';
      setError(errorMsg);
      addToast({
        type: 'error',
        title: 'Ошибка изменения статуса',
        message: errorMsg,
        duration: 5000
      });
    } finally {
      setBusy(false);
    }
  }

  function openEdit(inst: IntegrationInstance) {
    setEditing(inst);
    let cfg: any = {};
    try { cfg = inst.config || {}; } catch {}
    setForm({ title: inst.title, instanceKey: inst.instanceKey, config: cfg });
    setTab('edit');
    setWorkflows(null);
    // Если это N8N и есть apiKey — подгрузим воркфлоу
    const apiKey = cfg?.auth?.apiKey;
    if (inst.provider === 'N8N' && apiKey) {
      (async () => {
        try {
          const list = await integrationsApi.listN8nWorkflows(inst.id);
          setWorkflows(Array.isArray(list) ? list : []);
        } catch (e) {
          setWorkflows([]);
        }
      })();
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setBusy(true); setError(null);
    try {
      const payload: UpdateIntegrationRequest = {
        title: form.title,
        instanceKey: form.instanceKey,
        config: form.config,
      };
      const updated = await integrationsApi.update(editing.id, payload);
      setInstances((prev) => prev.map((x) => (x.id === editing.id ? updated : x)));
      setEditing(updated);
      setTab('installed');
      addToast({
        type: 'success',
        title: 'Настройки сохранены',
        message: `${updated.title || updated.provider} обновлен`,
        duration: 3000
      });
    } catch (e: any) {
      const errorMsg = e?.message || 'Не удалось сохранить настройки';
      setError(errorMsg);
      addToast({
        type: 'error',
        title: 'Ошибка сохранения',
        message: errorMsg,
        duration: 5000
      });
    } finally {
      setBusy(false);
    }
  }

  async function testInstance(inst: IntegrationInstance) {
    setTestingInstances(prev => new Set([...prev, inst.id]));
    try {
      const res = await integrationsApi.test(inst.id);
      setHealthStatuses(prev => ({
        ...prev,
        [inst.id]: { ...res, lastChecked: Date.now() }
      }));
      addToast({
        type: res.success ? 'success' : 'error',
        title: `Тест ${inst.title || inst.provider}`,
        message: res.success ? 
          `Соединение установлено (${res.status})` : 
          `Ошибка: ${res.detail || res.status}`,
        duration: res.success ? 3000 : 6000
      });
    } catch (e: any) {
      const errorMsg = e?.message || 'Не удалось протестировать интеграцию';
      addToast({
        type: 'error',
        title: 'Ошибка тестирования',
        message: errorMsg,
        duration: 5000
      });
    } finally {
      setTestingInstances(prev => {
        const next = new Set(prev);
        next.delete(inst.id);
        return next;
      });
    }
  }

  async function testAllInstances() {
    const activeInstances = instances.filter(inst => inst.isActive);
    if (activeInstances.length === 0) {
      addToast({
        type: 'warning',
        title: 'Нет активных интеграций',
        message: 'Включите хотя бы одну интеграцию для тестирования',
        duration: 4000
      });
      return;
    }

    setBusy(true);
    const testPromises = activeInstances.map(async (inst) => {
      setTestingInstances(prev => new Set([...prev, inst.id]));
      try {
        const res = await integrationsApi.test(inst.id);
        setHealthStatuses(prev => ({
          ...prev,
          [inst.id]: { ...res, lastChecked: Date.now() }
        }));
        return { instance: inst, result: res, error: null };
      } catch (e: any) {
        return { instance: inst, result: null, error: e?.message || 'Ошибка' };
      } finally {
        setTestingInstances(prev => {
          const next = new Set(prev);
          next.delete(inst.id);
          return next;
        });
      }
    });

    try {
      const results = await Promise.all(testPromises);
      const successful = results.filter(r => r.result?.success).length;
      const failed = results.length - successful;
      
      addToast({
        type: failed === 0 ? 'success' : (successful === 0 ? 'error' : 'warning'),
        title: 'Тестирование завершено',
        message: `Успешно: ${successful}, ошибок: ${failed}`,
        duration: 5000
      });
    } catch (e: any) {
      addToast({
        type: 'error',
        title: 'Ошибка массового тестирования',
        message: e?.message || 'Не удалось выполнить тестирование',
        duration: 5000
      });
    } finally {
      setBusy(false);
    }
  }

  // Синхронизация вкладок с URL (hash)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const target = `#${tab}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, '', target);
    }
  }, [tab]);

  function maskInstanceKey(inst: IntegrationInstance): string {
    const v = inst.instanceKey || '';
    if (!v) return '';
    if (v.length <= 12) return v;
    return `${v.slice(0, 8)}…${v.slice(-4)}`;
  }

  function getHealthIndicator(inst: IntegrationInstance) {
    const health = healthStatuses[inst.id];
    const isTestingNow = testingInstances.has(inst.id);
    
    if (isTestingNow) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" title="Тестирование...">
          <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          тест...
        </span>
      );
    }
    
    if (!health) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" title="Не проверялось">
          ?
        </span>
      );
    }
    
    const isRecent = (Date.now() - health.lastChecked) < 300000; // 5 минут
    const opacity = isRecent ? '' : 'opacity-60';
    
    if (health.success) {
      return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ${opacity}`} title={`Здоров: ${health.detail || health.status}`}>
          ✓
        </span>
      );
    } else {
      return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ${opacity}`} title={`Ошибка: ${health.detail || health.status}`}>
          ✗
        </span>
      );
    }
  }

  function getProviderHelp(providerKey: string): { title: string; content: string } {
    const helpContent: Record<string, { title: string; content: string }> = {
      'EMAIL_SMTP': {
        title: 'Настройка Email (SMTP)',
        content: 'Для отправки email-уведомлений настройте SMTP-сервер в разделе "Каналы связи". Интеграция использует глобальные настройки EMAIL канала для отправки писем через ваш почтовый сервер.'
      },
      'N8N': {
        title: 'Настройка n8n',
        content: 'n8n - платформа автоматизации workflow. Укажите Base URL вашего n8n инстанса и API ключ. После подключения вы сможете настроить маршрутизацию действий к конкретным workflow через карту routes.'
      },
      'WEBHOOK_GENERIC': {
        title: 'Настройка Webhook',
        content: 'Универсальный webhook для отправки HTTP-запросов во внешние системы. Настройте URL, метод, заголовки и формат данных для интеграции с любыми внешними API.'
      }
    };
    return helpContent[providerKey] || { title: 'Справка', content: 'Документация для этого провайдера пока не добавлена.' };
  }

  function isValidActionKey(key: string): boolean {
    if (!key) return false;
    // Allow letters, numbers, dots, underscores, and hyphens
    return /^[a-zA-Z0-9._-]+$/.test(key) && key.length >= 2 && key.length <= 50;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3">
          <button className={`py-2 px-3 ${tab==='catalog'?'border-b-2 border-primary text-primary':'text-gray-600 dark:text-gray-300'}`} onClick={() => setTab('catalog')}>Каталог</button>
          <button className={`py-2 px-3 ${tab==='installed'?'border-b-2 border-primary text-primary':'text-gray-600 dark:text-gray-300'}`} onClick={() => setTab('installed')}>Установленные</button>
        </div>
        <div className="flex items-center gap-2">
          {tab === 'installed' && (
            <>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="h-9 rounded-md border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 dark:text-white px-3 text-sm"
              >
                <option value="updatedAt-desc">Дата ↓</option>
                <option value="updatedAt-asc">Дата ↑</option>
                <option value="status-desc">Статус ↓</option>
                <option value="status-asc">Статус ↑</option>
                <option value="provider-asc">Провайдер ↑</option>
                <option value="provider-desc">Провайдер ↓</option>
              </select>
              <button
                disabled={busy || instances.filter(i => i.isActive).length === 0}
                onClick={testAllInstances}
                className="h-9 px-3 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Проверить все активные интеграции"
              >
                Проверить все
              </button>
            </>
          )}
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Поиск (название, ключ, статус)"
            className="h-9 rounded-md border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 dark:text-white px-3 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}

      {tab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProviders.map((p) => {
            const help = getProviderHelp(p.key);
            const isHelpOpen = showHelp === p.key;
            return (
              <div key={p.key} className="rounded border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-medium flex items-center gap-2">
                      {p.name}
                      <button
                        onClick={() => setShowHelp(isHelpOpen ? null : p.key)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Показать справку"
                      >
                        <FiHelpCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">{p.key} · v{p.version}</div>
                  </div>
                  <span className="text-xs text-gray-500">{p.category}</span>
                </div>
                
                {/* Help popover */}
                {isHelpOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="text-sm font-medium mb-2">{help.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{help.content}</div>
                    <button
                      onClick={() => setShowHelp(null)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiChevronUp className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <div className="mt-3">
                  <button disabled={busy} onClick={() => createInstance(p)} className="inline-flex items-center px-3 py-2 text-sm rounded bg-primary text-white disabled:opacity-60">Подключить</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'installed' && (
        <div className="space-y-4">
          {/* Статистика */}
          {filteredInstances.length > 0 && (
            <div className="text-sm text-gray-500">
              Показано {Math.min(itemsPerPage, filteredInstances.length - (currentPage - 1) * itemsPerPage)} из {filteredInstances.length} интеграций
            </div>
          )}
          
          <div className="space-y-3">
            {filteredInstances.length === 0 && <div className="text-sm text-gray-500">Нет установленных интеграций</div>}
            {paginatedInstances.map((inst) => (
            <div key={inst.id} className="rounded border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${inst.status==='READY'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-700'} ${inst.status==='ERROR'?'bg-red-100 text-red-800':''}`} title={`Статус: ${inst.status}`}>
                    {inst.status}
                  </span>
                  {getHealthIndicator(inst)}
                  {inst.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800" title="Интеграция активна">active</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700" title="Интеграция выключена">inactive</span>
                  )}
                  <span className="truncate">
                    {inst.title || inst.provider}
                    <span className="text-xs text-gray-500 ml-2 break-all inline-block align-baseline">
                      [{inst.provider}/{maskInstanceKey(inst)}]
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={busy} onClick={() => openEdit(inst)} className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600">Настроить</button>
                <button 
                  disabled={busy || testingInstances.has(inst.id)} 
                  onClick={() => testInstance(inst)} 
                  className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-60"
                >
                  {testingInstances.has(inst.id) ? 'Тест...' : 'Тест'}
                </button>
                <button disabled={busy} onClick={() => toggleActive(inst)} className="px-3 py-2 text-sm rounded bg-primary text-white disabled:opacity-60">{inst.isActive ? 'Выключить' : 'Включить'}</button>
              </div>
            </div>
          ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Страница {currentPage} из {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Назад
                </button>
                <span className="px-3 py-2 text-sm">
                  {currentPage}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Вперед
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'edit' && editing && (
        <div className="max-w-2xl">
          <div className="mb-4">
            <div className="text-lg font-medium">Настройки: {editing.title || editing.provider}</div>
            <div className="text-xs text-gray-500">[{editing.provider}/{editing.instanceKey}]</div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Название</label>
              <input value={form.title || ''} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Ключ инстанса</label>
              <input value={form.instanceKey || ''} onChange={(e)=>setForm(f=>({...f,instanceKey:e.target.value}))} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" />
            </div>
            {editing.provider === 'EMAIL_SMTP' && (
              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Предпросмотр email-приглашения</label>
                  <p className="text-xs text-gray-500">Проверьте как будет выглядеть email-приглашение с текущим шаблоном</p>
                </div>
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={async () => {
                    try {
                      const result = await integrationsApi.previewEmail(editing.id);
                      if (result.success && result.preview) {
                        // Show preview in a modal-like toast
                        addToast({
                          type: 'info',
                          title: 'Предпросмотр email',
                          message: result.preview.substring(0, 200) + (result.preview.length > 200 ? '...' : ''),
                          duration: 10000,
                          action: {
                            label: 'Подробнее',
                            onClick: () => {
                              // Open a simple modal with full preview
                              const modal = window.open('', '_blank', 'width=600,height=400');
                              if (modal) {
                                modal.document.write(`
                                  <html>
                                    <head><title>Предпросмотр email</title></head>
                                    <body style="font-family: Arial, sans-serif; padding: 20px;">
                                      <h3>Предпросмотр email-приглашения</h3>
                                      <div style="border: 1px solid #ddd; padding: 15px; background: #f9f9f9;">
                                        ${result.preview}
                                      </div>
                                    </body>
                                  </html>
                                `);
                                modal.document.close();
                              }
                            }
                          }
                        });
                      } else {
                        addToast({
                          type: 'error',
                          title: 'Ошибка предпросмотра',
                          message: result.error || 'Не удалось создать предпросмотр',
                          duration: 5000
                        });
                      }
                    } catch (e: any) {
                      addToast({
                        type: 'error',
                        title: 'Ошибка предпросмотра',
                        message: e?.message || 'Не удалось создать предпросмотр',
                        duration: 5000
                      });
                    }
                  }}
                >
                  Показать предпросмотр
                </button>
              </div>
            )}
            
            {editing.provider === 'N8N' && (
              <>
                <div>
                  <label className="block text-sm mb-1">n8n Base URL</label>
                  <input value={(form.config?.baseUrl)||''} onChange={(e)=>setForm(f=>({
                    ...f,
                    config: { ...(f.config||{}), baseUrl: e.target.value }
                  }))} placeholder="https://n8n.company.com" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm mb-1">API Key</label>
                  <div className="relative">
                    <input 
                      type={showSecrets['apiKey'] ? 'text' : 'password'} 
                      value={(form.config?.auth?.apiKey)||''} 
                      onChange={(e)=>setForm(f=>({
                        ...f,
                        config: { ...(f.config||{}), auth: { ...(f.config?.auth||{}), apiKey: e.target.value } }
                      }))} 
                      placeholder="n8n API Key" 
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 pr-10" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(prev => ({ ...prev, apiKey: !prev.apiKey }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={showSecrets['apiKey'] ? 'Скрыть' : 'Показать'}
                    >
                      {showSecrets['apiKey'] ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ключ хранится в конфиге инстанса; отображение маскируется.</p>
                </div>
                <div>
                  <label className="block text-sm mb-1">HMAC Secret (опц.)</label>
                  <div className="relative">
                    <input 
                      type={showSecrets['hmacSecret'] ? 'text' : 'password'} 
                      value={(form.config?.security?.hmacSecret)||''} 
                      onChange={(e)=>setForm(f=>({
                        ...f,
                        config: { ...(f.config||{}), security: { ...(f.config?.security||{}), hmacSecret: e.target.value } }
                      }))} 
                      placeholder="Секрет для HMAC подписи" 
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 pr-10" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(prev => ({ ...prev, hmacSecret: !prev.hmacSecret }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={showSecrets['hmacSecret'] ? 'Скрыть' : 'Показать'}
                    >
                      {showSecrets['hmacSecret'] ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm">Доступные воркфлоу</label>
                    <button type="button" className="text-xs underline" onClick={async ()=>{
                      try {
                        setWorkflows(null);
                        // Передаем baseUrl и apiKey, если пользователь ещё не сохранил конфиг
                        const baseUrl = (form.config as any)?.baseUrl;
                        const apiKey = (form.config as any)?.auth?.apiKey;
                        const list = await integrationsApi.listN8nWorkflows(editing.id, baseUrl, apiKey);
                        const arr = Array.isArray(list) ? list : [];
                        setWorkflows(arr);
                        // Если ничего не выбрано — выберем первый элемент
                        if (!selectedWorkflowId && arr.length > 0) {
                          setSelectedWorkflowId(arr[0].id);
                        }
                      } catch { setWorkflows([]); }
                    }}>Обновить</button>
                  </div>
                  {!workflows && <div className="text-xs text-gray-500">Загрузка...</div>}
                  {workflows && workflows.length===0 && <div className="text-xs text-gray-500">Список пуст или нет доступа. Проверьте API Key.</div>}
                  {workflows && workflows.length>0 && (
                    <div className="max-h-64 overflow-auto border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 divide-y divide-gray-100 dark:divide-dark-3">
                      {workflows.map((wf: any)=> (
                        <label
                          key={wf.id}
                          onClick={()=>setSelectedWorkflowId(wf.id)}
                          className={`flex items-center justify-between gap-3 p-3 cursor-pointer transition-all ${selectedWorkflowId===wf.id ? 'bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-dark-3'}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="radio"
                              name="n8n-workflow"
                              className="shrink-0"
                              checked={selectedWorkflowId===wf.id}
                              onChange={()=>setSelectedWorkflowId(wf.id)}
                            />
                            <div className="truncate mr-2">{wf.name || wf.id}</div>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{wf.active ? 'active' : 'inactive'}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Маршрутизация действий -> воркфлоу */}
                <div className="mt-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Маршрутизация действий (routes)</label>
                    <p className="text-xs text-gray-500">Свяжите ключ действия с конкретным воркфлоу n8n. Примеры ключей: invitations.send, email.send, content.ai.process</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <input
                        placeholder="action key (например, email.send)"
                        value={actionKeyInput}
                        onChange={(e)=>setActionKeyInput(e.target.value)}
                        className={`w-full rounded border ${isValidActionKey(actionKeyInput) || !actionKeyInput ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-600'} bg-white dark:bg-gray-900 px-3 py-2`}
                      />
                      {actionKeyInput && !isValidActionKey(actionKeyInput) && (
                        <p className="text-xs text-red-500 mt-1">Ключ должен содержать только буквы, цифры, точки и подчеркивания</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-3 py-2 text-sm rounded bg-primary text-white disabled:opacity-60"
                      disabled={!actionKeyInput || !selectedWorkflowId || !isValidActionKey(actionKeyInput) || (form.config?.routes && actionKeyInput in (form.config.routes || {}))}
                      onClick={()=>{
                        if (!actionKeyInput || !selectedWorkflowId || !isValidActionKey(actionKeyInput)) return;
                        const existingRoutes = form.config?.routes || {};
                        if (actionKeyInput in existingRoutes) {
                          addToast({
                            type: 'warning',
                            title: 'Маршрут уже существует',
                            message: `Ключ "${actionKeyInput}" уже привязан к workflow`,
                            duration: 4000
                          });
                          return;
                        }
                        setForm(f=>{
                          const prev = (f.config?.routes)||{} as Record<string,string>;
                          const nextRoutes = { ...prev, [actionKeyInput]: selectedWorkflowId };
                          return { ...f, config: { ...(f.config||{}), routes: nextRoutes } };
                        });
                        setActionKeyInput('');
                        addToast({
                          type: 'success',
                          title: 'Маршрут добавлен',
                          message: `Ключ "${actionKeyInput}" привязан к workflow`,
                          duration: 3000
                        });
                      }}
                    >Добавить маршрут</button>
                  </div>

                  {/* Список текущих маршрутов */}
                  <div className="border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-dark-2 divide-y divide-gray-100 dark:divide-dark-3">
                    {Object.keys((form.config?.routes)||{}).length===0 && (
                      <div className="text-xs text-gray-500 p-3">Маршруты не настроены</div>
                    )}
                    {Object.entries((form.config?.routes)||{}).map(([key, wfId]: any)=>{
                      const wf = (workflows||[]).find((w:any)=>w.id===wfId);
                      return (
                        <div key={key} className="flex items-center justify-between p-3">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{key}</div>
                            <div className="text-xs text-gray-500 truncate">→ {wf?.name || wfId}</div>
                          </div>
                          <button
                            type="button"
                            className="text-xs underline shrink-0 text-red-600 hover:text-red-500"
                            onClick={()=>{
                              setForm(f=>{
                                const prev = { ...((f.config?.routes)||{}) } as Record<string,string>;
                                delete prev[key as string];
                                return { ...f, config: { ...(f.config||{}), routes: prev } };
                              });
                            }}
                          >Удалить</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button disabled={busy} onClick={saveEdit} className="px-4 py-2 rounded bg-primary text-white disabled:opacity-60">Сохранить</button>
            <button disabled={busy} onClick={()=>setTab('installed')} className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600">Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectIntegrationsPage;


