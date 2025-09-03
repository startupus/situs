import React, { ReactNode } from 'react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

interface ThemeAlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  showIcon?: boolean;
  className?: string;
}

const ThemeAlert: React.FC<ThemeAlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  showIcon = true,
  className = '',
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'border-green-500 bg-green-50 dark:bg-green-900/20',
          icon: 'text-green-600',
          title: 'text-green-800 dark:text-green-400',
          text: 'text-green-700 dark:text-green-300',
        };
      case 'error':
        return {
          container: 'border-red-500 bg-red-50 dark:bg-red-900/20',
          icon: 'text-red-600',
          title: 'text-red-800 dark:text-red-400',
          text: 'text-red-700 dark:text-red-300',
        };
      case 'warning':
        return {
          container: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
          icon: 'text-yellow-600',
          title: 'text-yellow-800 dark:text-yellow-400',
          text: 'text-yellow-700 dark:text-yellow-300',
        };
      case 'info':
      default:
        return {
          container: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          icon: 'text-blue-600',
          title: 'text-blue-800 dark:text-blue-400',
          text: 'text-blue-700 dark:text-blue-300',
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`border-l-4 rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex">
        {showIcon && <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          {title && <h3 className={`text-sm font-medium ${styles.title} mb-1`}>{title}</h3>}
          <div className={`text-sm ${styles.text}`}>{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${styles.icon} hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600`}
              >
                <span className="sr-only">Закрыть</span>
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeAlert;
