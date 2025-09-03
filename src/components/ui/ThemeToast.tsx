import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  avatar?: string;
  timestamp?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ThemeToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ThemeToast: React.FC<ThemeToastProps> = ({ toast, onClose, position = 'top-right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Автоматическое закрытие
    if (toast.duration && toast.duration > 0) {
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoCloseTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getTypeStyles = () => {
    const styles = {
      success: {
        icon: <FiCheckCircle className="w-5 h-5" />,
        iconColor: 'text-green-600',
        borderColor: 'border-l-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      },
      error: {
        icon: <FiAlertCircle className="w-5 h-5" />,
        iconColor: 'text-red-600',
        borderColor: 'border-l-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
      },
      warning: {
        icon: <FiAlertTriangle className="w-5 h-5" />,
        iconColor: 'text-yellow-600',
        borderColor: 'border-l-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      },
      info: {
        icon: <FiInfo className="w-5 h-5" />,
        iconColor: 'text-blue-600',
        borderColor: 'border-l-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      },
    };
    return styles[toast.type];
  };

  const getPositionStyles = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };
    return positions[position];
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full
        ${getPositionStyles()}
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
      `
        .trim()
        .replace(/\s+/g, ' ')}
    >
      <div
        className={`
          relative flex items-start p-4 rounded-lg border-l-4 shadow-lg
          ${typeStyles.borderColor}
          ${typeStyles.bgColor}
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
        `
          .trim()
          .replace(/\s+/g, ' ')}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Иконка или аватар */}
        <div className="flex-shrink-0 mr-3">
          {toast.avatar ? (
            <img src={toast.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className={`${typeStyles.iconColor}`}>{typeStyles.icon}</div>
          )}
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0 pr-6">
          {toast.title && <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{toast.title}</p>}
          <p className="text-sm text-gray-700 dark:text-gray-300">{toast.message}</p>

          {/* Время и действие */}
          <div className="flex items-center justify-between mt-2">
            {toast.timestamp && <span className="text-xs text-gray-500 dark:text-gray-400">{toast.timestamp}</span>}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Контекст и провайдер для управления toast-уведомлениями
export interface ToastContextType {
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toastData: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      ...toastData,
      id,
      duration: toastData.duration ?? 5000,
    };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50">
        {toasts.map((toast) => (
          <ThemeToast key={toast.id} toast={toast} onClose={removeToast} position={position} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ThemeToast;
