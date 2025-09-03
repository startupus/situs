import { useEffect, useState, useRef } from 'react';

interface UseAutoSaveOptions {
  delay?: number; // Задержка в миллисекундах
  onSave?: (data: any) => Promise<void> | void;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  saveNow: () => Promise<void>;
}

export const useAutoSave = <T>(data: T, options: UseAutoSaveOptions = {}): UseAutoSaveReturn => {
  const {
    delay = 3000, // 3 секунды по умолчанию
    onSave,
    enabled = true,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<T>(data);

  // Функция для сохранения
  const saveData = async () => {
    if (!onSave || !enabled) return;

    // Проверяем, изменились ли данные
    if (JSON.stringify(data) === JSON.stringify(lastDataRef.current)) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(data);
      setLastSaved(new Date());
      lastDataRef.current = data;
      console.log('✅ Auto-save successful:', new Date().toLocaleTimeString());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSaveError(errorMessage);
      console.error('❌ Auto-save failed:', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Функция для принудительного сохранения
  const saveNow = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    await saveData();
  };

  // Эффект для автосохранения с задержкой
  useEffect(() => {
    if (!enabled) return;

    // Очищаем предыдущий таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Устанавливаем новый таймер
    timeoutRef.current = setTimeout(() => {
      saveData();
    }, delay);

    // Очистка при размонтировании
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    saveError,
    saveNow,
  };
};
