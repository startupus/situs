import { useEffect, useRef } from 'react';

interface UserSSEEvent {
  type: 'user_updated' | 'sse_connected';
  payload: {
    userId?: string;
    user?: any;
    changes?: any;
    ts?: string;
  };
}

interface UseUsersSSEProps {
  onUserUpdated?: (userId: string, user: any, changes: any) => void;
  onConnected?: () => void;
  onError?: (error: Event) => void;
}

export const useUsersSSE = ({ onUserUpdated, onConnected, onError }: UseUsersSSEProps) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Создаем SSE соединение
    const eventSource = new EventSource('/api/realtime/users');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('🔗 SSE соединение с пользователями установлено');
      onConnected?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data: UserSSEEvent = JSON.parse(event.data);

        switch (data.type) {
          case 'sse_connected':
            console.log('✅ SSE handshake для пользователей завершен');
            break;
          case 'user_updated':
            if (data.payload.userId && data.payload.user && data.payload.changes) {
              console.log('👤 Пользователь обновлен:', data.payload.userId);
              onUserUpdated?.(data.payload.userId, data.payload.user, data.payload.changes);
            }
            break;
          default:
            console.log('📨 Неизвестное SSE событие пользователей:', data);
        }
      } catch (error) {
        console.error('❌ Ошибка парсинга SSE события пользователей:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Ошибка SSE соединения пользователей:', error);
      onError?.(error);
    };

    // Cleanup при размонтировании
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onUserUpdated, onConnected, onError]);

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
    close: () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    },
  };
};
