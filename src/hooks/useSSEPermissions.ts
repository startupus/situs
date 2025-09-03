import { useState, useEffect, useRef, useCallback } from 'react';

interface PermissionChange {
  roleId: string;
  permissionId: string;
  context: 'admin' | 'site';
  enabled: boolean;
  timestamp: number;
}

interface SSEPermissionsHook {
  isConnected: boolean;
  lastUpdate: Date | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendPermissionChange: (change: PermissionChange) => Promise<void>;
  reconnect: () => void;
}

/**
 * Хук для работы с SSE (Server-Sent Events) для автоматического применения изменений прав
 */
export const useSSEPermissions = (projectId?: string): SSEPermissionsHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>(
    'disconnected',
  );

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<PermissionChange[]>([]);

  // Функция для отправки изменений прав
  const sendPermissionChange = useCallback(
    async (change: PermissionChange) => {
      try {
        const response = await fetch('/api/permissions/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId,
            ...change,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Добавляем в очередь для отслеживания
        pendingChangesRef.current.push(change);

        console.log('✅ Изменение прав отправлено:', change);
      } catch (error) {
        console.error('❌ Ошибка отправки изменения прав:', error);
        throw error;
      }
    },
    [projectId],
  );

  // Функция подключения к SSE
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionStatus('connecting');

    const url = projectId ? `/api/permissions/stream?projectId=${projectId}` : '/api/permissions/stream';

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('🔗 SSE подключение установлено');
      setIsConnected(true);
      setConnectionStatus('connected');

      // Очищаем таймер переподключения
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Получено SSE сообщение:', data);

        if (data.type === 'permission_updated') {
          setLastUpdate(new Date());

          // Удаляем из очереди ожидания, если это наше изменение
          const changeIndex = pendingChangesRef.current.findIndex(
            (change) =>
              change.roleId === data.roleId &&
              change.permissionId === data.permissionId &&
              change.context === data.context,
          );

          if (changeIndex !== -1) {
            pendingChangesRef.current.splice(changeIndex, 1);
          }

          // Здесь можно добавить callback для обновления UI
          window.dispatchEvent(
            new CustomEvent('permissionUpdated', {
              detail: data,
            }),
          );
        }
      } catch (error) {
        console.error('❌ Ошибка парсинга SSE сообщения:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Ошибка SSE соединения:', error);
      setIsConnected(false);
      setConnectionStatus('error');

      // Автоматическое переподключение через 3 секунды
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Попытка переподключения SSE...');
          connect();
        }, 3000);
      }
    };
  }, [projectId]);

  // Функция переподключения
  const reconnect = useCallback(() => {
    console.log('🔄 Принудительное переподключение SSE...');
    connect();
  }, [connect]);

  // Эффект для установки соединения
  useEffect(() => {
    connect();

    // Cleanup при размонтировании
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [connect]);

  // Эффект для обработки видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        console.log('👁️ Страница стала видимой, переподключаем SSE...');
        reconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, reconnect]);

  return {
    isConnected,
    lastUpdate,
    connectionStatus,
    sendPermissionChange,
    reconnect,
  };
};
