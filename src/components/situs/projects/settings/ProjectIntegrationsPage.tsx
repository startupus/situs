import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { integrationsApi, IntegrationInstance, IntegrationProviderMeta, CreateIntegrationRequest, UpdateIntegrationRequest } from '../../../../api/services/integrations.api';

/**
 * Страница настроек интеграций проекта
 * - Вкладки: Каталог провайдеров, Установленные
 * - Создание инстанса провайдера (instanceKey, title, минимальный config)
 * - Тестирование и включение/выключение инстанса
 */
const ProjectIntegrationsPage: React.FC = () => {
  const { projectId = '' } = useParams();
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
    const source = new EventSource('/api/realtime/integrations');
    setEs(source);
    source.onmessage = async (ev) => {
      try {
        const data = JSON.parse(ev.data || '{}');
        const t = (data?.type || '').toString();
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
    if (!q) return instances;
    return instances.filter((i) => (
      (i.title||'').toLowerCase().includes(q) ||
      (i.provider||'').toLowerCase().includes(q) ||
      (i.instanceKey||'').toLowerCase().includes(q) ||
      (i.status||'').toLowerCase().includes(q)
    ));
  }, [instances, query]);

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
    } catch (e: any) {
      setError(e?.message || 'Не удалось создать интеграцию');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(inst: IntegrationInstance) {
    setBusy(true); setError(null);
    try {
      const updated = await integrationsApi.update(inst.id, { isActive: !inst.isActive });
      setInstances((prev) => prev.map((x) => (x.id === inst.id ? updated : x)));
    } catch (e: any) {
      setError(e?.message || 'Не удалось изменить статус');
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
    } catch (e: any) {
      setError(e?.message || 'Не удалось сохранить настройки');
    } finally {
      setBusy(false);
    }
  }

  async function testInstance(inst: IntegrationInstance) {
    setBusy(true); setError(null);
    try {
      const res = await integrationsApi.test(inst.id);
      alert(`Тест: ${res.success ? 'успех' : 'ошибка'} (${res.status})${res.detail ? `: ${res.detail}` : ''}`);
    } catch (e: any) {
      setError(e?.message || 'Не удалось протестировать интеграцию');
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3">
          <button className={`py-2 px-3 ${tab==='catalog'?'border-b-2 border-primary text-primary':'text-gray-600 dark:text-gray-300'}`} onClick={() => setTab('catalog')}>Каталог</button>
          <button className={`py-2 px-3 ${tab==='installed'?'border-b-2 border-primary text-primary':'text-gray-600 dark:text-gray-300'}`} onClick={() => setTab('installed')}>Установленные</button>
        </div>
        <div className="flex items-center gap-2">
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
          {filteredProviders.map((p) => (
            <div key={p.key} className="rounded border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.key} · v{p.version}</div>
                </div>
                <span className="text-xs text-gray-500">{p.category}</span>
              </div>
              <div className="mt-3">
                <button disabled={busy} onClick={() => createInstance(p)} className="inline-flex items-center px-3 py-2 text-sm rounded bg-primary text-white disabled:opacity-60">Подключить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'installed' && (
        <div className="space-y-3">
          {filteredInstances.length === 0 && <div className="text-sm text-gray-500">Нет установленных интеграций</div>}
          {filteredInstances.map((inst) => (
            <div key={inst.id} className="rounded border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${inst.status==='READY'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-700'} ${inst.status==='ERROR'?'bg-red-100 text-red-800':''}`} title={`Статус: ${inst.status}`}>
                    {inst.status}
                  </span>
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
                <button disabled={busy} onClick={() => testInstance(inst)} className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600">Тест</button>
                <button disabled={busy} onClick={() => toggleActive(inst)} className="px-3 py-2 text-sm rounded bg-primary text-white disabled:opacity-60">{inst.isActive ? 'Выключить' : 'Включить'}</button>
              </div>
            </div>
          ))}
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
                  <input type="password" value={(form.config?.auth?.apiKey)||''} onChange={(e)=>setForm(f=>({
                    ...f,
                    config: { ...(f.config||{}), auth: { ...(f.config?.auth||{}), apiKey: e.target.value } }
                  }))} placeholder="n8n API Key" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" />
                  <p className="text-xs text-gray-500 mt-1">Ключ хранится в конфиге инстанса; отображение маскируется.</p>
                </div>
                <div>
                  <label className="block text-sm mb-1">HMAC Secret (опц.)</label>
                  <input value={(form.config?.security?.hmacSecret)||''} onChange={(e)=>setForm(f=>({
                    ...f,
                    config: { ...(f.config||{}), security: { ...(f.config?.security||{}), hmacSecret: e.target.value } }
                  }))} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" />
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
                    <input
                      placeholder="action key (например, email.send)"
                      value={actionKeyInput}
                      onChange={(e)=>setActionKeyInput(e.target.value)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 text-sm rounded bg-primary text-white disabled:opacity-60"
                      disabled={!actionKeyInput || !selectedWorkflowId}
                      onClick={()=>{
                        if (!actionKeyInput || !selectedWorkflowId) return;
                        setForm(f=>{
                          const prev = (f.config?.routes)||{} as Record<string,string>;
                          const nextRoutes = { ...prev, [actionKeyInput]: selectedWorkflowId };
                          return { ...f, config: { ...(f.config||{}), routes: nextRoutes } };
                        });
                        setActionKeyInput('');
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


