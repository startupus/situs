// Скрипт для принудительного переключения темы канваса
console.log('🎨 Force canvas theme script loaded');

function forceCanvasTheme(theme) {
  console.log('🎨 Forcing canvas theme to:', theme);

  // Устанавливаем в localStorage
  localStorage.setItem('canvas-theme', theme);
  console.log('🎨 Saved to localStorage:', theme);

  // Находим элемент канваса
  const canvasElement = document.querySelector('[data-canvas-container]');
  if (canvasElement) {
    // Устанавливаем атрибут
    canvasElement.setAttribute('data-canvas-theme', theme);
    console.log('🎨 Set data-canvas-theme attribute to:', theme);

    // Убираем класс dark
    canvasElement.classList.remove('dark');
    console.log('🎨 Removed dark class from canvas');

    // Принудительно применяем стили
    if (theme === 'dark') {
      canvasElement.style.backgroundColor = '#111827';
      canvasElement.style.color = '#f9fafb';
    } else {
      canvasElement.style.backgroundColor = '#ffffff';
      canvasElement.style.color = '#111827';
    }
    console.log('🎨 Applied inline styles for theme:', theme);
  } else {
    console.log('🎨 Canvas element not found');
  }
}

// Функции для быстрого доступа
window.forceLightCanvas = () => forceCanvasTheme('light');
window.forceDarkCanvas = () => forceCanvasTheme('dark');

console.log('🎨 Available functions:');
console.log('🎨 - forceLightCanvas() - принудительно установить светлую тему канваса');
console.log('🎨 - forceDarkCanvas() - принудительно установить темную тему канваса');
console.log('🎨 - forceCanvasTheme("light"|"dark") - установить конкретную тему');
