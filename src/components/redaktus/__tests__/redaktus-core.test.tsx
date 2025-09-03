import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Мокаем Next.js модули
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/test',
    push: vi.fn(),
    query: {},
  }),
}));

// Импортируем компоненты после моков
import { Admin, Editor, Login, Playground, AppSettings, MediaLibrary } from '../redaktus-core';

// Обертка для компонентов с роутером
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Redaktus Core Components', () => {
  test('Admin component renders correctly', () => {
    renderWithRouter(<Admin>Test Content</Admin>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('Login component renders correctly', () => {
    renderWithRouter(<Login />);
    expect(screen.getByText('Sign in to Redaktus')).toBeInTheDocument();
  });

  test('Playground component renders correctly', () => {
    renderWithRouter(<Playground />);
    expect(screen.getByText('Playground')).toBeInTheDocument();
  });

  test('AppSettings component renders correctly', () => {
    renderWithRouter(<AppSettings />);
    expect(screen.getByText('App Settings')).toBeInTheDocument();
  });

  test('MediaLibrary component renders correctly', () => {
    renderWithRouter(<MediaLibrary />);
    expect(screen.getByText('Media Library')).toBeInTheDocument();
  });
});
