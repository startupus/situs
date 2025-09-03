import { ThemeConfig, ThemeColors } from '../types/theme';

/**
 * Утилиты для работы с темой
 */

/**
 * Генерация CSS переменных из конфигурации темы
 */
export const generateCSSVariables = (theme: ThemeConfig): string => {
  const { colors } = theme;

  return `
    :root {
      /* Основные цвета */
      --color-primary: ${colors.primary};
      --color-primary-hover: ${colors.primaryHover};
      --color-primary-active: ${colors.primaryActive};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      
      /* Статусные цвета */
      --color-success: ${colors.success};
      --color-warning: ${colors.warning};
      --color-error: ${colors.error};
      --color-info: ${colors.info};
      
      /* Базовые цвета */
      --color-background: ${colors.background};
      --color-surface: ${colors.surface};
      --color-text: ${colors.text};
      --color-text-secondary: ${colors.textSecondary};
      --color-border: ${colors.border};
      --color-border-light: ${colors.borderLight};
      
      /* Совместимость с существующими переменными */
      --color-body-color: ${colors.textSecondary};
      --color-dark: ${colors.text};
      --color-gray-3: ${colors.borderLight};
      --color-dark-5: ${colors.textSecondary};
      --color-dark-6: ${colors.textSecondary};
      --color-blue-dark: ${colors.primaryActive};
    }
  `.trim();
};

/**
 * Генерация Tailwind CSS с динамическими цветами
 */
export const generateTailwindCSS = (theme: ThemeConfig): string => {
  const { colors } = theme;

  return `
    @layer utilities {
      .bg-primary {
        background-color: ${colors.primary};
      }
      
      .bg-primary-hover {
        background-color: ${colors.primaryHover};
      }
      
      .bg-primary-active {
        background-color: ${colors.primaryActive};
      }
      
      .text-primary {
        color: ${colors.primary};
      }
      
      .border-primary {
        border-color: ${colors.primary};
      }
      
      .bg-secondary {
        background-color: ${colors.secondary};
      }
      
      .text-secondary {
        color: ${colors.secondary};
      }
      
      .border-secondary {
        border-color: ${colors.secondary};
      }
      
      .bg-success {
        background-color: ${colors.success};
      }
      
      .text-success {
        color: ${colors.success};
      }
      
      .bg-warning {
        background-color: ${colors.warning};
      }
      
      .text-warning {
        color: ${colors.warning};
      }
      
      .bg-error {
        background-color: ${colors.error};
      }
      
      .text-error {
        color: ${colors.error};
      }
      
      .bg-surface {
        background-color: ${colors.surface};
      }
      
      .text-body-color {
        color: ${colors.textSecondary};
      }
      
      .border-stroke {
        border-color: ${colors.border};
      }
      
      /* Hover состояния */
      .hover\\:bg-primary:hover {
        background-color: ${colors.primary};
      }
      
      .hover\\:bg-primary-hover:hover {
        background-color: ${colors.primaryHover};
      }
      
      .hover\\:text-primary:hover {
        color: ${colors.primary};
      }
      
      .hover\\:border-primary:hover {
        border-color: ${colors.primary};
      }
    }
  `.trim();
};

/**
 * Конвертация HEX в RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Генерация цвета с прозрачностью
 */
export const colorWithOpacity = (color: string, opacity: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

/**
 * Осветление цвета
 */
export const lightenColor = (color: string, amount: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const r = Math.min(255, rgb.r + amount);
  const g = Math.min(255, rgb.g + amount);
  const b = Math.min(255, rgb.b + amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Затемнение цвета
 */
export const darkenColor = (color: string, amount: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const r = Math.max(0, rgb.r - amount);
  const g = Math.max(0, rgb.g - amount);
  const b = Math.max(0, rgb.b - amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Генерация палитры оттенков из основного цвета
 */
export const generateColorPalette = (baseColor: string): Partial<ThemeColors> => {
  return {
    primary: baseColor,
    primaryHover: lightenColor(baseColor, 20),
    primaryActive: darkenColor(baseColor, 20),
  };
};

/**
 * Валидация цвета
 */
export const isValidColor = (color: string): boolean => {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
};

/**
 * Контраст между цветами
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Вычисление относительной яркости
 */
const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Рекомендуемый цвет текста на основе фона
 */
export const getRecommendedTextColor = (backgroundColor: string): string => {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');

  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
};
