/**
 * Типы для системы управления темой интерфейса
 */

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  borderLight: string;
}

export interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface ThemeLayout {
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    full: string;
  };
  spacing: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  shadows: {
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  sidebarWidth: string;
  headerHeight: string;
  containerMaxWidth: string;
}

export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  enabled: boolean;
  reducedMotion: boolean;
}

export interface ThemeGradients {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface CustomColorPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: Date;
  isDefault?: boolean;
}

export interface DualThemeVariant {
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: DualThemeVariant; // Теперь содержит светлую и темную версии
  typography?: ThemeTypography;
  layout?: ThemeLayout;
  animations?: ThemeAnimations;
  gradients?: ThemeGradients;
  customCss?: string;
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description?: string;
  config: ThemeConfig;
  createdAt: Date;
  isBuiltIn: boolean;
  tags?: string[];
}

export interface ThemeSettings {
  currentTheme: string;
  isDarkMode: boolean; // Новое поле для отслеживания темного/светлого режима
  allowCustomization: boolean;
  availableThemes: ThemeConfig[];
  customTheme?: ThemeConfig;
  templates: ThemeTemplate[];
}

export interface ThemeContextType {
  currentTheme: ThemeConfig;
  isDarkMode: boolean;
  currentColors: ThemeColors; // Текущие активные цвета (светлые или темные)
  settings: ThemeSettings;
  updateTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  updateThemeVariant: (variant: 'light' | 'dark', colors: Partial<ThemeColors>) => void;
  updateTypography: (typography: Partial<ThemeTypography>) => void;
  updateLayout: (layout: Partial<ThemeLayout>) => void;
  updateAnimations: (animations: Partial<ThemeAnimations>) => void;
  updateGradients: (gradients: Partial<ThemeGradients>) => void;
  resetToDefault: () => void;
  saveThemeSettings: () => Promise<void>;
  loadThemeSettings: () => Promise<void>;
  colorPalettes: CustomColorPalette[];
  createColorPalette: (name: string, colors: string[]) => CustomColorPalette;
  deleteColorPalette: (id: string) => void;
  saveTemplate: (name: string, description?: string, tags?: string[]) => ThemeTemplate;
  deleteTemplate: (id: string) => void;
  loadTemplate: (id: string) => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => boolean;
}

// Дефолтные настройки типографики
export const DEFAULT_TYPOGRAPHY: ThemeTypography = {
  fontFamily: {
    primary: 'Inter, system-ui, -apple-system, sans-serif',
    secondary: 'Georgia, serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

// Дефолтные настройки макета
export const DEFAULT_LAYOUT: ThemeLayout = {
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    base: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    base: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  sidebarWidth: '280px',
  headerHeight: '64px',
  containerMaxWidth: '1200px',
};

// Дефолтные настройки анимаций
export const DEFAULT_ANIMATIONS: ThemeAnimations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  enabled: true,
  reducedMotion: false,
};

// Дефолтные градиенты
export const DEFAULT_GRADIENTS: ThemeGradients = {
  primary: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
  secondary: 'linear-gradient(135deg, var(--color-secondary) 0%, #22AD5C 100%)',
  accent: 'linear-gradient(135deg, var(--color-accent) 0%, #F59E0B 100%)',
  success: 'linear-gradient(135deg, #22AD5C 0%, #16A34A 100%)',
  warning: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
  error: 'linear-gradient(135deg, #F23030 0%, #EF4444 100%)',
};

// Предустановленные темы с поддержкой двойных вариантов (светлая/темная)
export const DEFAULT_THEMES: ThemeConfig[] = [
  {
    id: 'standard-theme',
    name: 'Стандартная тема',
    colors: {
      light: {
        primary: '#4C1D95', // цвет 1 (фиолетовый)
        primaryHover: '#7C3AED',
        primaryActive: '#5B21B6',
        secondary: '#13C296', // цвет 2 (зеленый)
        accent: '#9055FD', // цвет 3 (светло-фиолетовый)
        success: '#22AD5C', // цвет 4 (зеленый успех)
        warning: '#FBBF24',
        error: '#F23030',
        info: '#2D68F8',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
      },
      dark: {
        primary: '#8B5CF6', // цвет 1 (светло-фиолетовый в темной теме)
        primaryHover: '#A78BFA',
        primaryActive: '#7C3AED',
        secondary: '#10B981', // цвет 4 (тот же зеленый в темной)
        accent: '#34D399', // цвет 5 (зеленый акцент)
        success: '#34D399', // цвет 7 (зеленый успех)
        warning: '#F59E0B',
        error: '#F87171',
        info: '#60A5FA',
        background: '#0F0F23',
        surface: '#1E1E3F',
        text: '#F1F5F9',
        textSecondary: '#CBD5E1',
        border: '#4C1D95',
        borderLight: '#6D28D9',
      },
    },
    typography: DEFAULT_TYPOGRAPHY,
    layout: DEFAULT_LAYOUT,
    animations: DEFAULT_ANIMATIONS,
    gradients: DEFAULT_GRADIENTS,
  },
  {
    id: 'eco-theme',
    name: 'ЭКО тема',
    colors: {
      light: {
        primary: '#059669', // цвет 1 (зеленый)
        primaryHover: '#047857',
        primaryActive: '#065F46',
        secondary: '#06B6D4', // цвет 9 (голубой)
        accent: '#8B5CF6', // цвет 13 (фиолетовый)
        success: '#F59E0B', // цвет 24 (оранжевый)
        warning: '#FBBF24',
        error: '#F23030',
        info: '#2D68F8',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
      },
      dark: {
        primary: '#10B981', // цвет 11 (изумрудный)
        primaryHover: '#34D399',
        primaryActive: '#059669',
        secondary: '#8B5CF6', // цвет 43 (фиолетовый в темной)
        accent: '#F59E0B', // цвет 45 (оранжевый в темной)
        success: '#34D399', // цвет 73 (зеленый акцент)
        warning: '#FBBF24',
        error: '#F87171',
        info: '#60A5FA',
        background: '#0C1F0C',
        surface: '#1A2E1A',
        text: '#F1F5F9',
        textSecondary: '#CBD5E1',
        border: '#166534',
        borderLight: '#15803D',
      },
    },
    typography: DEFAULT_TYPOGRAPHY,
    layout: DEFAULT_LAYOUT,
    animations: DEFAULT_ANIMATIONS,
    gradients: DEFAULT_GRADIENTS,
  },
  {
    id: 'blue-classic-theme',
    name: 'Классическая синяя',
    colors: {
      light: {
        primary: '#3758F9',
        primaryHover: '#2A47E8',
        primaryActive: '#1B44C8',
        secondary: '#13C296',
        accent: '#9055FD',
        success: '#22AD5C',
        warning: '#FBBF24',
        error: '#F23030',
        info: '#2D68F8',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
      },
      dark: {
        primary: '#6366F1',
        primaryHover: '#8B5CF6',
        primaryActive: '#5B21B6',
        secondary: '#34D399',
        accent: '#FBBF24',
        success: '#34D399',
        warning: '#F59E0B',
        error: '#F87171',
        info: '#60A5FA',
        background: '#0C1426',
        surface: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#CBD5E1',
        border: '#334155',
        borderLight: '#475569',
      },
    },
    typography: DEFAULT_TYPOGRAPHY,
    layout: DEFAULT_LAYOUT,
    animations: DEFAULT_ANIMATIONS,
    gradients: DEFAULT_GRADIENTS,
  },
];

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  currentTheme: 'standard-theme',
  isDarkMode: false,
  allowCustomization: true,
  availableThemes: DEFAULT_THEMES,
  templates: [],
};

// Новые типы для разделения тем
export type AdminTheme = 'light' | 'dark' | 'system';
export type EditorTheme = 'light' | 'dark' | 'system';
export type ProjectTheme = 'light' | 'dark' | 'system' | 'inherit';

export interface AdminThemeSettings {
  theme: AdminTheme;
  isDarkMode: boolean;
}

export interface EditorThemeSettings {
  theme: EditorTheme;
  isDarkMode: boolean;
}

export interface ProjectThemeSettings {
  theme: ProjectTheme;
  isDarkMode: boolean;
  inheritFromSite: boolean;
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
}

export interface ThemeSystem {
  admin: AdminThemeSettings;
  editor: EditorThemeSettings;
  project: ProjectThemeSettings;
}
