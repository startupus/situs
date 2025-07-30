import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import SitusSidebar from "../SitusSidebar";
// Обертка для рендера с роутером
const renderWithRouter = (component) => {
    return render(_jsx(BrowserRouter, { children: component }));
};
describe("SitusSidebar", () => {
    const mockSetSidebarOpen = vi.fn();
    beforeEach(() => {
        mockSetSidebarOpen.mockClear();
    });
    it("рендерит логотип Situs", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        const logo = screen.getByText("S");
        expect(logo).toBeInTheDocument();
    });
    it("содержит все основные пункты навигации", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        const links = screen.getAllByRole('link');
        // Проверяем наличие основных ссылок
        const hrefs = links.map(link => link.getAttribute('href'));
        expect(hrefs).toContain('/');
        expect(hrefs).toContain('/orders');
        expect(hrefs).toContain('/projects');
        expect(hrefs).toContain('/users');
        expect(hrefs).toContain('/settings');
        expect(hrefs).toContain('/logout');
    });
    it("содержит дубликат аккаунта пользователя внизу", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        // Ищем пользователя по имени "У"
        const userAvatars = screen.getAllByText("У");
        expect(userAvatars.length).toBeGreaterThan(0);
    });
    it("содержит разделитель", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        // Разделитель представлен как div с классом bg-stroke
        const dividers = document.querySelectorAll('.bg-stroke');
        expect(dividers.length).toBeGreaterThan(0);
    });
    it("правильно обрабатывает состояние sidebarOpen", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        const sidebar = document.querySelector('.absolute');
        expect(sidebar).toHaveClass('translate-x-0');
        expect(sidebar).not.toHaveClass('-translate-x-full');
    });
    it("вызывает setSidebarOpen при клике на оверлей", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        const overlay = document.querySelector('.fixed');
        fireEvent.click(overlay);
        expect(mockSetSidebarOpen).toHaveBeenCalledWith(true);
    });
    it("содержит тултипы для пунктов навигации", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        const tooltips = document.querySelectorAll('.invisible');
        expect(tooltips.length).toBeGreaterThan(0);
    });
    it("поддерживает мобильную адаптивность", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        const sidebar = document.querySelector('.absolute');
        const overlay = document.querySelector('.fixed');
        expect(sidebar).toHaveClass('xl:translate-x-0');
        expect(overlay).toHaveClass('xl:hidden');
    });
    it("содержит ссылку на проекты без подменю", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        // Проверяем, что есть ссылка на проекты (текст в тултипе)
        const projectsTooltip = screen.getByText("Проекты");
        expect(projectsTooltip).toBeInTheDocument();
        // Проверяем, что есть ссылка с правильным href
        const links = screen.getAllByRole('link');
        const projectsLink = links.find(link => link.getAttribute('href') === '/projects');
        expect(projectsLink).toBeDefined();
    });
    it("не содержит подменю для проектов", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        // Проверяем, что нет элементов подменю
        const submenuElements = document.querySelectorAll('.bg-gray-100');
        expect(submenuElements.length).toBe(0);
    });
    it("содержит все необходимые иконки", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        // Проверяем наличие SVG иконок
        const svgIcons = document.querySelectorAll('svg');
        expect(svgIcons.length).toBeGreaterThan(0);
    });
    it("правильно обрабатывает активное состояние ссылок", () => {
        renderWithRouter(_jsx(SitusSidebar, { sidebarOpen: false, setSidebarOpen: mockSetSidebarOpen }));
        // Проверяем, что ссылки имеют правильные классы
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
        // Проверяем, что все ссылки имеют базовые классы
        links.forEach(link => {
            expect(link).toHaveClass('text-body-color');
        });
    });
});
//# sourceMappingURL=SitusSidebar.test.js.map