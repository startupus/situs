/**
 * Projects API Service
 * Интеграция с Projects Service бэкенда
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';
import { Project, CreateProjectData, UpdateProjectData } from '../../types/project';

export interface ProjectFilters {
  search?: string;
  status?: string;
  type?: string;
  sortBy?: 'name' | 'updated' | 'created';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProjectsListResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ProjectsApiService {
  private readonly baseEndpoint = '/api/projects';

  /**
   * Получить список проектов пользователя
   */
  async getProjects(filters?: ProjectFilters): Promise<ProjectsListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ProjectsListResponse>>(
        this.baseEndpoint,
        filters
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке проектов');
    } catch (error) {
      console.error('Projects API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельный проект
   */
  async getProject(projectId: string): Promise<Project> {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(
        `${this.baseEndpoint}/${projectId}`
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Проект не найден');
    } catch (error) {
      console.error('Get Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать новый проект
   */
  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      const response = await apiClient.post<ApiResponse<Project>>(
        this.baseEndpoint,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании проекта');
    } catch (error) {
      console.error('Create Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить проект
   */
  async updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
    try {
      const response = await apiClient.patch<ApiResponse<Project>>(
        `${this.baseEndpoint}/${projectId}`,
        data
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении проекта');
    } catch (error) {
      console.error('Update Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Удалить проект
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при удалении проекта');
      }
    } catch (error) {
      console.error('Delete Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Опубликовать проект
   */
  async publishProject(projectId: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}/publish`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при публикации проекта');
      }
    } catch (error) {
      console.error('Publish Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Снять с публикации проект
   */
  async unpublishProject(projectId: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}/unpublish`
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при снятии с публикации');
      }
    } catch (error) {
      console.error('Unpublish Project API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Изменить статус проекта
   */
  async updateProjectStatus(projectId: string, status: string): Promise<void> {
    try {
      const response = await apiClient.patch<ApiResponse<void>>(
        `${this.baseEndpoint}/${projectId}/status`,
        { status }
      );

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Update Project Status API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Проверить доступность слага
   */
  async checkSlugAvailability(slug: string, excludeProjectId?: string): Promise<boolean> {
    try {
      const params = excludeProjectId ? { exclude: excludeProjectId } : undefined;
      const response = await apiClient.get<ApiResponse<{ slug: string; available: boolean }>>(
        `${this.baseEndpoint}/check-slug/${slug}`,
        params
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data.available;
      }

      return false;
    } catch (error) {
      console.error('Check Slug Availability API Error:', error);
      return false;
    }
  }

  /**
   * Проверить доступность домена
   */
  async checkDomainAvailability(domain: string, excludeProjectId?: string): Promise<boolean> {
    try {
      const params = excludeProjectId ? { exclude: excludeProjectId } : undefined;
      const response = await apiClient.get<ApiResponse<{ domain: string; available: boolean }>>(
        `${this.baseEndpoint}/check-domain/${domain}`,
        params
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data.available;
      }

      return false;
    } catch (error) {
      console.error('Check Domain Availability API Error:', error);
      return false;
    }
  }

  /**
   * Подписка на серверные события проектов (SSE)
   * Возвращает функцию отписки
   */
  subscribeEvents(onEvent: (e: any) => void): () => void {
    try {
      const base = (apiClient as any).getBaseURL?.() || (typeof window !== 'undefined' ? `${window.location.protocol}//localhost:3001` : 'http://localhost:3001');
      // Генерируем/получаем ID подписчика (для отладки кросс-сессий)
      const getSubId = () => {
        try {
          const w: any = typeof window !== 'undefined' ? window : {};
          if (w.__situsSubId) return w.__situsSubId as string;
          const stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('situs:sub-id') : null;
          const id = stored || `sub_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
          if (typeof localStorage !== 'undefined' && !stored) localStorage.setItem('situs:sub-id', id);
          w.__situsSubId = id;
          return id;
        } catch {
          return `sub_${Date.now()}`;
        }
      };
      const subId = getSubId();
      const url = `${base}/api/projects/events?sub=${encodeURIComponent(subId)}`;
      // Локальный журнал событий для отладки
      const pushLog = (entry: any) => {
        try {
          const w: any = typeof window !== 'undefined' ? window : {};
          const log = (w.__situsEventLog = w.__situsEventLog || []);
          log.push({ t: new Date().toISOString(), sub: subId, ...entry });
          // Ограничиваем размер
          if (log.length > 500) log.splice(0, log.length - 500);
        } catch {}
      };
      pushLog({ dir: 'info', msg: 'subscribe start', url });
      // 1) Сначала пробуем EventSource (стандартный путь для Chromium/обычных вкладок)
      try {
        const es = new EventSource(url);
        let usedES = true;
        let gotAny = false;
        const to = setTimeout(() => {
          if (!gotAny) {
            // не получили ничего быстро — переключаемся на fetch-стрим
            try { es.close(); } catch {}
            usedES = false;
          }
        }, 1500);
        es.onmessage = (ev: MessageEvent) => {
          gotAny = true;
          try {
            const data = JSON.parse(ev.data);
            if (data?.type === 'sse_connected') pushLog({ dir: 'info', msg: 'sse_connected', sub: subId });
            onEvent(data);
            pushLog({ dir: 'in', transport: 'es', data: ev.data });
          } catch {
            pushLog({ dir: 'warn', note: 'json parse failed (es)' });
          }
        };
        es.onerror = () => {
          pushLog({ dir: 'err', transport: 'es' });
          // первый error — переключаемся на fetch
          try { es.close(); } catch {}
          usedES = false;
        };
        pushLog({ dir: 'info', msg: 'EventSource attempt' });
        // Возвращаем комбинированную отписку, которая закрывает ES и возможный fetch
        const closeFns: Array<() => void> = [];
        const startFetchFallback = () => {
          // запустим fallback только один раз
          if ((window as any).__situsFetchStarted) return;
          (window as any).__situsFetchStarted = true;
          const controller = new AbortController();
          let cancelled = false;
          const abortOnUnload = () => { cancelled = true; try { controller.abort(); } catch {} };
          if (typeof window !== 'undefined') window.addEventListener('beforeunload', abortOnUnload);
          (async () => {
            try {
              const resp = await fetch(url, { mode: 'cors', cache: 'no-store', signal: controller.signal } as RequestInit);
              const reader = (resp.body as any)?.getReader?.();
              if (!reader) return;
              const decoder = new TextDecoder('utf-8');
              let buffer = '';
              while (!cancelled) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                let idx;
                while ((idx = buffer.indexOf('\n\n')) !== -1) {
                  const chunk = buffer.slice(0, idx);
                  buffer = buffer.slice(idx + 2);
                  const dataLine = chunk.split('\n').find((l) => l.startsWith('data:')) || '';
                  const payload = dataLine.replace(/^data:\s?/, '');
                   if (payload) {
                    try {
                      const data = JSON.parse(payload);
                      if (data?.type === 'sse_connected') pushLog({ dir: 'info', msg: 'sse_connected', sub: subId });
                      onEvent(data);
                      pushLog({ dir: 'in', transport: 'fetch', data: payload });
                    } catch {
                      pushLog({ dir: 'warn', note: 'json parse failed (fetch)' });
                    }
                   }
                }
              }
            } catch (e: any) {
              pushLog({ dir: 'err', transport: 'fetch', error: e?.message });
            }
          })();
          closeFns.push(() => { cancelled = true; try { controller.abort(); } catch {}; if (typeof window !== 'undefined') window.removeEventListener('beforeunload', abortOnUnload); });
        };
        // Таймер проверит, нужен ли fallback
        setTimeout(() => { if (!usedES || !gotAny) startFetchFallback(); }, 1600);
        closeFns.push(() => { try { clearTimeout(to); } catch {}; try { es.close(); } catch {} });
        return () => { pushLog({ dir: 'info', msg: 'subscription closed' }); closeFns.forEach((fn) => fn()); };
      } catch {
        // упадём на fetch-стрим сразу
      }

      // 2) Надёжный fallback: fetch + ReadableStream (работает в FF/инкогнито)
      const controller = new AbortController();
      let cancelled = false;
      const abortOnUnload = () => { cancelled = true; try { controller.abort(); } catch {} };
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', abortOnUnload);
      }
      (async () => {
        try {
          const resp = await fetch(url, { mode: 'cors', cache: 'no-store', signal: controller.signal } as RequestInit);
          if (!(resp as any).body) return;
          const reader = (resp.body as any).getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';
          while (!cancelled) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let idx;
            while ((idx = buffer.indexOf('\n\n')) !== -1) {
              const chunk = buffer.slice(0, idx);
              buffer = buffer.slice(idx + 2);
              const dataLine = chunk.split('\n').find((l) => l.startsWith('data:')) || '';
              const payload = dataLine.replace(/^data:\s?/, '');
              if (payload) {
                try { onEvent(JSON.parse(payload)); pushLog({ dir: 'in', transport: 'fetch', data: payload }); } catch { pushLog({ dir: 'warn', note: 'json parse failed' }); }
              }
            }
          }
        } catch (e: any) {
          pushLog({ dir: 'err', transport: 'fetch', error: e?.message });
        }
      })();
      return () => {
        cancelled = true;
        try { controller.abort(); } catch {}
        if (typeof window !== 'undefined') {
          window.removeEventListener('beforeunload', abortOnUnload);
        }
      };
    } catch {
      return () => {};
    }
  }
}

export const projectsApi = new ProjectsApiService();
export default projectsApi;