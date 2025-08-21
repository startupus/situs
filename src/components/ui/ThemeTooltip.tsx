import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface ThemeTooltipProps {
  content: string | ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light' | 'primary' | 'success' | 'danger' | 'warning' | 'info';
  delay?: number;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

const ThemeTooltip: React.FC<ThemeTooltipProps> = ({
  content,
  position = 'top',
  size = 'md',
  variant = 'dark',
  delay = 300,
  disabled = false,
  className = '',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getSizeStyles = () => {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      dark: 'bg-gray-900 text-white border-gray-900',
      light: 'bg-white text-gray-900 border-gray-200 shadow-lg',
      primary: 'bg-blue-600 text-white border-blue-600',
      success: 'bg-green-600 text-white border-green-600',
      danger: 'bg-red-600 text-white border-red-600',
      warning: 'bg-yellow-600 text-white border-yellow-600',
      info: 'bg-cyan-600 text-white border-cyan-600'
    };
    return variants[variant];
  };

  const getPositionStyles = () => {
    const positions = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    return positions[actualPosition];
  };

  const getArrowStyles = () => {
    const arrowBase = 'absolute w-2 h-2 transform rotate-45 border';
    const arrowVariant = getVariantStyles();
    
    const arrows = {
      top: `${arrowBase} ${arrowVariant} top-full left-1/2 -translate-x-1/2 -mt-1`,
      bottom: `${arrowBase} ${arrowVariant} bottom-full left-1/2 -translate-x-1/2 -mb-1`,
      left: `${arrowBase} ${arrowVariant} left-full top-1/2 -translate-y-1/2 -ml-1`,
      right: `${arrowBase} ${arrowVariant} right-full top-1/2 -translate-y-1/2 -mr-1`
    };
    return arrows[actualPosition];
  };

  const checkPosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Проверяем, помещается ли tooltip в текущей позиции
    switch (position) {
      case 'top':
        if (rect.top - tooltipRect.height < 0) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (rect.bottom + tooltipRect.height > viewport.height) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (rect.left - tooltipRect.width < 0) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (rect.right + tooltipRect.width > viewport.width) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Проверяем позицию после рендера
      setTimeout(checkPosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  if (!content || disabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 whitespace-nowrap rounded-md border
            ${getPositionStyles()}
            ${getSizeStyles()}
            ${getVariantStyles()}
            transition-opacity duration-200 ease-in-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `.trim().replace(/\s+/g, ' ')}
          role="tooltip"
        >
          {content}
          <div className={getArrowStyles()} />
        </div>
      )}
    </div>
  );
};

export default ThemeTooltip;
