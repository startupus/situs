// Утилиты для управления темой редактора

let currentEditorTheme: 'light' | 'dark' = 'light';

/**
 * Переключает тему редактора
 */
export const toggleEditorTheme = () => {
  currentEditorTheme = currentEditorTheme === 'light' ? 'dark' : 'light';
  applyEditorTheme(currentEditorTheme);
  console.log('🎨 Editor theme toggled to:', currentEditorTheme);
};

/**
 * Устанавливает тему редактора
 */
export const setEditorTheme = (theme: 'light' | 'dark') => {
  currentEditorTheme = theme;
  applyEditorTheme(theme);
  console.log('🎨 Editor theme set to:', theme);
};

/**
 * Получает текущую тему редактора
 */
export const getEditorTheme = (): 'light' | 'dark' => {
  return currentEditorTheme;
};

/**
 * Применяет тему к DOM
 */
const applyEditorTheme = (theme: 'light' | 'dark') => {
  // Применяем к body для глобального эффекта
  document.body.setAttribute('data-editor-theme', theme);
  
  // Также применяем к html элементу
  document.documentElement.setAttribute('data-editor-theme', theme);
  
  // Обновляем CSS переменную
  document.documentElement.style.setProperty('--editor-theme', `'${theme}'`);
  
  // Добавляем/убираем класс dark для активации Tailwind dark: классов
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Инициализирует тему редактора
 */
export const initEditorTheme = () => {
  // По умолчанию светлая тема
  setEditorTheme('light');
}; 