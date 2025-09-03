// Скрипт для проверки состояния темы в localStorage
console.log('🎨 Checking theme state...');

// Проверяем тему интерфейса
const interfaceTheme = localStorage.getItem('theme');
console.log('🎨 Interface theme:', interfaceTheme);

// Проверяем тему канваса
const canvasTheme = localStorage.getItem('canvas-theme');
console.log('🎨 Canvas theme:', canvasTheme);

// Проверяем тему редактора
const editorTheme = localStorage.getItem('editor-theme');
console.log('🎨 Editor theme:', editorTheme);

// Проверяем DOM элементы
const canvasElement = document.querySelector('[data-canvas-container]');
if (canvasElement) {
  console.log('🎨 Canvas element found');
  console.log('🎨 Canvas data-canvas-theme:', canvasElement.getAttribute('data-canvas-theme'));
  console.log('🎨 Canvas has dark class:', canvasElement.classList.contains('dark'));
} else {
  console.log('🎨 Canvas element not found');
}

// Проверяем html элемент
const htmlElement = document.documentElement;
console.log('🎨 HTML has dark class:', htmlElement.classList.contains('dark'));
console.log('🎨 HTML data-editor-theme:', htmlElement.getAttribute('data-editor-theme'));
