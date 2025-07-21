import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hoverable?: boolean;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hoverable = false,
  title,
  subtitle,
  headerActions,
  footer,
}) => {
  const getPaddingClasses = () => {
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    return paddings[padding];
  };

  const getShadowClasses = () => {
    const shadows = {
      none: '',
      sm: 'shadow-soft',
      md: 'shadow-medium',
      lg: 'shadow-strong',
    };
    return shadows[shadow];
  };

  const baseClasses = 'card';
  const paddingClasses = getPaddingClasses();
  const shadowClasses = getShadowClasses();
  const borderClasses = border ? 'border border-gray-200' : '';
  const hoverClasses = hoverable ? 'hover:shadow-medium transition-shadow duration-200 cursor-pointer' : '';

  const cardClasses = `${baseClasses} ${paddingClasses} ${shadowClasses} ${borderClasses} ${hoverClasses} ${className}`;

  const renderHeader = () => {
    if (!title && !subtitle && !headerActions) return null;

    return (
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center space-x-2">
            {headerActions}
          </div>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        {footer}
      </div>
    );
  };

  return (
    <div className={cardClasses}>
      {renderHeader()}
      <div className={title || subtitle ? 'mt-0' : ''}>
        {children}
      </div>
      {renderFooter()}
    </div>
  );
};

export default Card;