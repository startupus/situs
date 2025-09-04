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
      --color-primary: ${(colors as any).primary};
      --color-primary-hover: ${(colors as any).primaryHover};
      --color-primary-active: ${(colors as any).primaryActive};
      --color-secondary: ${(colors as any).secondary};
      --color-accent: ${(colors as any).accent};
      
      /* Статусные цвета */
      --color-success: ${(colors as any).success};
      --color-warning: ${(colors as any).warning};
      --color-error: ${(colors as any).error};
      --color-info: ${(colors as any).info};
      
      /* Базовые цвета */
      --color-background: ${(colors as any).background};
      --color-surface: ${(colors as any).surface};
      --color-text: ${(colors as any).text};
      --color-text-secondary: ${(colors as any).textSecondary};
      --color-border: ${(colors as any).border};
      --color-border-light: ${(colors as any).borderLight};
      
      /* Совместимость с существующими переменными */
      --color-body-color: ${(colors as any).textSecondary};
      --color-dark: ${(colors as any).text};
      --color-gray-3: ${(colors as any).borderLight};
      --color-dark-5: ${(colors as any).textSecondary};
      --color-dark-6: ${(colors as any).textSecondary};
      --color-blue-dark: ${(colors as any).primaryActive};
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
        background-color: ${(colors as any).primary};
      }
      
      .bg-primary-hover {
        background-color: ${(colors as any).primaryHover};
      }
      
      .bg-primary-active {
        background-color: ${(colors as any).primaryActive};
      }
      
      .text-primary {
        color: ${(colors as any).primary};
      }
      
      .border-primary {
        border-color: ${(colors as any).primary};
      }
      
      .bg-secondary {
        background-color: ${(colors as any).secondary};
      }
      
      .text-secondary {
        color: ${(colors as any).secondary};
      }
      
      .border-secondary {
        border-color: ${(colors as any).secondary};
      }
      
      .bg-success {
        background-color: ${(colors as any).success};
      }
      
      .text-success {
        color: ${(colors as any).success};
      }
      
      .bg-warning {
        background-color: ${(colors as any).warning};
      }
      
      .text-warning {
        color: ${(colors as any).warning};
      }
      
      .bg-error {
        background-color: ${(colors as any).error};
      }
      
      .text-error {
        color: ${(colors as any).error};
      }
      
      .bg-surface {
        background-color: ${(colors as any).surface};
      }
      
      .text-body-color {
        color: ${(colors as any).textSecondary};
      }
      
      .border-stroke {
        border-color: ${(colors as any).border};
      }
      
      /* Hover состояния */
      .hover\\:bg-primary:hover {
        background-color: ${(colors as any).primary};
      }
      
      .hover\\:bg-primary-hover:hover {
        background-color: ${(colors as any).primaryHover};
      }
      
      .hover\\:text-primary:hover {
        color: ${(colors as any).primary};
      }
      
      .hover\\:border-primary:hover {
        border-color: ${(colors as any).primary};
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
