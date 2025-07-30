import { jsx as _jsx } from "react/jsx-runtime";
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// Мокаем Next.js модули
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }) => (_jsx("a", { href: href, ...props, children: children }))
}));
vi.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/test',
        push: vi.fn(),
        query: {}
    })
}));
// Импортируем компоненты после моков
import { Admin, Login, Playground, AppSettings, MediaLibrary } from '../redaktus-core';
// Обертка для компонентов с роутером
const renderWithRouter = (component) => {
    return render(_jsx(BrowserRouter, { children: component }));
};
describe('Redaktus Core Components', () => {
    test('Admin component renders correctly', () => {
        renderWithRouter(_jsx(Admin, { children: "Test Content" }));
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
    test('Login component renders correctly', () => {
        renderWithRouter(_jsx(Login, {}));
        expect(screen.getByText('Sign in to Redaktus')).toBeInTheDocument();
    });
    test('Playground component renders correctly', () => {
        renderWithRouter(_jsx(Playground, {}));
        expect(screen.getByText('Playground')).toBeInTheDocument();
    });
    test('AppSettings component renders correctly', () => {
        renderWithRouter(_jsx(AppSettings, {}));
        expect(screen.getByText('App Settings')).toBeInTheDocument();
    });
    test('MediaLibrary component renders correctly', () => {
        renderWithRouter(_jsx(MediaLibrary, {}));
        expect(screen.getByText('Media Library')).toBeInTheDocument();
    });
});
//# sourceMappingURL=redaktus-core.test.js.map