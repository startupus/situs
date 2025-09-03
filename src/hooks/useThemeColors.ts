import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../types/theme';

/**
 * Хук для получения текущих цветов темы
 */
export const useThemeColors = (): ThemeColors => {
  const { currentTheme } = useTheme();
  return currentTheme.colors;
};

/**
 * Хук для получения CSS переменных темы
 */
export const useThemeCSSVars = () => {
  const colors = useThemeColors();

  return {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-active': colors.primaryActive,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-error': colors.error,
    '--color-info': colors.info,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-border': colors.border,
    '--color-border-light': colors.borderLight,
  } as React.CSSProperties;
};

/**
 * Хук для получения динамических стилей компонента
 */
export const useThemeStyles = () => {
  const colors = useThemeColors();

  return {
    // Стили для кнопок
    button: {
      primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        color: '#ffffff',
        ':hover': {
          backgroundColor: colors.primaryHover,
          borderColor: colors.primaryHover,
        },
        ':active': {
          backgroundColor: colors.primaryActive,
          borderColor: colors.primaryActive,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: colors.primary,
        color: colors.primary,
        ':hover': {
          backgroundColor: colors.primary + '10', // 10% opacity
        },
      },
    },

    // Стили для карточек
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
    },

    // Стили для текста
    text: {
      primary: { color: colors.text },
      secondary: { color: colors.textSecondary },
    },

    // Стили для статусов
    status: {
      success: { color: colors.success },
      warning: { color: colors.warning },
      error: { color: colors.error },
      info: { color: colors.info },
    },
  };
};

/**
 * Хук для создания цветных Tailwind классов
 */
export const useThemeTailwindClasses = () => {
  const colors = useThemeColors();

  // Генерируем inline стили для случаев, когда Tailwind не поддерживает динамические цвета
  const getDynamicBg = (opacity?: number) => {
    const op = opacity
      ? Math.round(opacity * 255)
          .toString(16)
          .padStart(2, '0')
      : '';
    return { backgroundColor: colors.primary + op };
  };

  const getDynamicText = () => {
    return { color: colors.primary };
  };

  const getDynamicBorder = () => {
    return { borderColor: colors.primary };
  };

  return {
    // CSS-in-JS стили для динамических цветов
    dynamicStyles: {
      bgPrimary: getDynamicBg(),
      bgPrimaryLight: getDynamicBg(0.1),
      textPrimary: getDynamicText(),
      borderPrimary: getDynamicBorder(),
    },

    // Стандартные Tailwind классы, которые используют CSS переменные
    classes: {
      bgPrimary: 'bg-primary',
      textPrimary: 'text-primary',
      borderPrimary: 'border-primary',
      bgSurface: 'bg-surface',
      textBody: 'text-body-color',
    },
  };
};

export default useThemeColors;
