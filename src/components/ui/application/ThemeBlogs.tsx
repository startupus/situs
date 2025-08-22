// src/components/ui/application/ThemeBlogs.tsx
import React from 'react';
import Blog1 from '../core/application/Blog/Blog1';
import Blog2 from '../core/application/Blog/Blog2';

// Интерфейс для пропсов Blog компонентов
interface BlogProps {
  children?: React.ReactNode;
  className?: string;
}

// Утилита для адаптации стилей под глобальную тему
const adaptBlogProps = (props: BlogProps) => ({
  ...props,
  className: `${props.className || ''} transition-colors duration-200`
});

// Blog Variants с поддержкой темы
export const ThemeBlog1: React.FC<BlogProps> = (props) => (
  <Blog1 {...adaptBlogProps(props)} />
);

export const ThemeBlog2: React.FC<BlogProps> = (props) => (
  <Blog2 {...adaptBlogProps(props)} />
);

// Заглушки для остальных Blog компонентов (будут добавлены позже)
export const ThemeBlog3: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Blog3 - будет добавлен позже</p>
  </div>
);

export const ThemeBlog4: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Blog4 - будет добавлен позже</p>
  </div>
);

export const ThemeBlog5: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Blog5 - будет добавлен позже</p>
  </div>
);

export const ThemeBlog6: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Blog6 - будет добавлен позже</p>
  </div>
);

export const ThemeBlog7: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Blog7 - будет добавлен позже</p>
  </div>
);

export const ThemeBlog8: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">Blog8 - будет добавлен позже</p>
  </div>
);

export const ThemeBlogDetails1: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">BlogDetails1 - будет добавлен позже</p>
  </div>
);

export const ThemeBlogDetails2: React.FC<BlogProps> = (props) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
    <p className="text-gray-600 dark:text-gray-400">BlogDetails2 - будет добавлен позже</p>
  </div>
);

// Экспорт всех Blog компонентов как единый объект для удобства
export const ThemeBlogs = {
  Blog1: ThemeBlog1,
  Blog2: ThemeBlog2,
  Blog3: ThemeBlog3,
  Blog4: ThemeBlog4,
  Blog5: ThemeBlog5,
  Blog6: ThemeBlog6,
  Blog7: ThemeBlog7,
  Blog8: ThemeBlog8,
  BlogDetails1: ThemeBlogDetails1,
  BlogDetails2: ThemeBlogDetails2,
};

export default ThemeBlogs;