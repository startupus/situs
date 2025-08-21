import React from 'react';
import { FiUser } from 'react-icons/fi';

interface ThemeAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const ThemeAvatar: React.FC<ThemeAvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  status,
  showStatus = false,
  className = '',
  onClick
}) => {
  const getSizeStyles = () => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl'
    };
    return sizes[size];
  };

  const getStatusStyles = () => {
    const statusStyles = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500'
    };
    return status ? statusStyles[status] : '';
  };

  const getStatusSize = () => {
    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
      '2xl': 'w-5 h-5'
    };
    return statusSizes[size];
  };

  const renderFallback = () => {
    if (fallback) {
      return (
        <span className="font-medium text-gray-600 dark:text-gray-300 uppercase">
          {fallback.slice(0, 2)}
        </span>
      );
    }
    return <FiUser className="w-1/2 h-1/2 text-gray-400" />;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${getSizeStyles()}
          rounded-full overflow-hidden
          bg-gray-100 dark:bg-gray-700
          flex items-center justify-center
          ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        `.trim().replace(/\s+/g, ' ')}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={src ? 'hidden' : 'flex items-center justify-center w-full h-full'}>
          {renderFallback()}
        </div>
      </div>
      
      {showStatus && status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${getStatusSize()}
            ${getStatusStyles()}
            rounded-full border-2 border-white dark:border-gray-800
          `.trim().replace(/\s+/g, ' ')}
        />
      )}
    </div>
  );
};

export default ThemeAvatar;
