import React, { useEffect, useRef, ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
  centered?: boolean;
}

const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
  centered = true,
}) => {
  const modal = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!modal.current) return;
      if (!isOpen || modal.current.contains(event.target as Node)) return;
      onClose();
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [isOpen, onClose]);

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!isOpen || event.keyCode !== 27) return;
      onClose();
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 z-50 ${!centered ? 'items-start pt-20' : ''}`}
    >
      <div ref={modal} className={`w-full ${sizeClasses[size]} rounded-[20px] bg-white dark:bg-dark-2 ${className}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            {title && <h3 className="text-xl font-semibold text-dark dark:text-white sm:text-2xl">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
};

export default ThemeModal;
