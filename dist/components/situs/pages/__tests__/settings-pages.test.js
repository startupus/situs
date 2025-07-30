import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SitusProfileSettings from '../SitusProfileSettings';
import SitusSectionSettings from '../SitusSectionSettings';
// Моки для внешних зависимостей
vi.mock('react-icons/fa', () => ({
    FaCamera: () => _jsx("div", { "data-testid": "camera-icon" }),
    FaEdit: () => _jsx("div", { "data-testid": "edit-icon" }),
    FaLinkedin: () => _jsx("div", { "data-testid": "linkedin-icon" }),
    FaTwitter: () => _jsx("div", { "data-testid": "twitter-icon" }),
    FaGithub: () => _jsx("div", { "data-testid": "github-icon" }),
    FaInstagram: () => _jsx("div", { "data-testid": "instagram-icon" }),
    FaCog: () => _jsx("div", { "data-testid": "cog-icon" }),
    FaUsers: () => _jsx("div", { "data-testid": "users-icon" }),
    FaProjectDiagram: () => _jsx("div", { "data-testid": "project-icon" }),
    FaStore: () => _jsx("div", { "data-testid": "store-icon" }),
    FaRobot: () => _jsx("div", { "data-testid": "robot-icon" }),
    FaChartBar: () => _jsx("div", { "data-testid": "chart-icon" }),
    FaLock: () => _jsx("div", { "data-testid": "lock-icon" }),
    FaBell: () => _jsx("div", { "data-testid": "bell-icon" }),
    FaGlobe: () => _jsx("div", { "data-testid": "globe-icon" }),
    FaPalette: () => _jsx("div", { "data-testid": "palette-icon" })
}));
// Вспомогательная функция для рендера с роутером
const renderWithRouter = (component) => {
    return render(_jsx(BrowserRouter, { children: component }));
};
describe('SitusProfileSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('должен отображаться правильно', () => {
        renderWithRouter(_jsx(SitusProfileSettings, {}));
        expect(screen.getByText('Дмитрий Разработчик')).toBeInTheDocument();
        expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
        expect(screen.getByText('Основная информация')).toBeInTheDocument();
        expect(screen.getByText('Социальные сети')).toBeInTheDocument();
    });
    it('должен отображать форму настроек профиля', () => {
        renderWithRouter(_jsx(SitusProfileSettings, {}));
        expect(screen.getByDisplayValue('Дмитрий')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Разработчик')).toBeInTheDocument();
        expect(screen.getByDisplayValue('dmitriy@situs.ru')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Fullstack Developer')).toBeInTheDocument();
    });
    it('должен изменять данные профиля при вводе', async () => {
        renderWithRouter(_jsx(SitusProfileSettings, {}));
        const firstNameInput = screen.getByDisplayValue('Дмитрий');
        fireEvent.change(firstNameInput, { target: { value: 'Александр' } });
        await waitFor(() => {
            expect(firstNameInput).toHaveValue('Александр');
        });
    });
    it('должен отображать социальные сети', () => {
        renderWithRouter(_jsx(SitusProfileSettings, {}));
        expect(screen.getByDisplayValue('https://linkedin.com/in/dmitriy')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://twitter.com/dmitriy')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://github.com/dmitriy')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://instagram.com/dmitriy')).toBeInTheDocument();
    });
    it('должен вызывать функцию сохранения при клике на кнопку', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        renderWithRouter(_jsx(SitusProfileSettings, {}));
        const saveButton = screen.getByText('Сохранить изменения');
        fireEvent.click(saveButton);
        expect(consoleSpy).toHaveBeenCalledWith('Сохранение профиля:', expect.any(Object));
        consoleSpy.mockRestore();
    });
    it('должен обрабатывать загрузку файлов аватара и обложки', () => {
        renderWithRouter(_jsx(SitusProfileSettings, {}));
        const avatarInput = screen.getByLabelText(/аватар/i);
        const coverInput = screen.getByLabelText(/обложка/i);
        expect(avatarInput).toHaveAttribute('type', 'file');
        expect(coverInput).toHaveAttribute('type', 'file');
        expect(avatarInput).toHaveAttribute('accept', 'image/*');
        expect(coverInput).toHaveAttribute('accept', 'image/*');
    });
});
describe('SitusSectionSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('должен отображаться правильно', () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        expect(screen.getByText('Настройки разделов')).toBeInTheDocument();
        expect(screen.getByText('Разделы платформы')).toBeInTheDocument();
        expect(screen.getByText('Системные настройки')).toBeInTheDocument();
    });
    it('должен отображать список разделов', () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        expect(screen.getByText('Дашборд')).toBeInTheDocument();
        expect(screen.getByText('Проекты')).toBeInTheDocument();
        expect(screen.getByText('Веб-сайты')).toBeInTheDocument();
        expect(screen.getByText('Интернет-магазины')).toBeInTheDocument();
        expect(screen.getByText('Чат-боты')).toBeInTheDocument();
        expect(screen.getByText('Пользователи')).toBeInTheDocument();
    });
    it('должен переключаться между разделами при клике', async () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        const projectsSection = screen.getByText('Проекты');
        fireEvent.click(projectsSection);
        await waitFor(() => {
            expect(screen.getByText('Управление проектами и портфолио')).toBeInTheDocument();
        });
    });
    it('должен отображать настройки активного раздела', () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // По умолчанию активен dashboard
        expect(screen.getByText('Основная панель управления и аналитики')).toBeInTheDocument();
        expect(screen.getByText('Основные настройки')).toBeInTheDocument();
        expect(screen.getByText('Права доступа')).toBeInTheDocument();
    });
    it('должен переключать состояние раздела', async () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        const enableToggle = screen.getAllByRole('checkbox')[0]; // Первый чекбокс - включение раздела
        const initialState = enableToggle.checked;
        fireEvent.click(enableToggle);
        await waitFor(() => {
            expect(enableToggle.checked).toBe(!initialState);
        });
    });
    it('должен отображать глобальные настройки', async () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // Переключаемся на общие настройки
        const generalSettings = screen.getByText('Общие настройки');
        fireEvent.click(generalSettings);
        await waitFor(() => {
            expect(screen.getByText('Тема оформления')).toBeInTheDocument();
            expect(screen.getByText('Язык интерфейса')).toBeInTheDocument();
        });
    });
    it('должен отображать настройки уведомлений', async () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // Переключаемся на уведомления
        const notificationsSettings = screen.getByText('Уведомления');
        fireEvent.click(notificationsSettings);
        await waitFor(() => {
            expect(screen.getByText('Email уведомления')).toBeInTheDocument();
            expect(screen.getByText('Push уведомления')).toBeInTheDocument();
            expect(screen.getByText('SMS уведомления')).toBeInTheDocument();
        });
    });
    it('должен изменять глобальные настройки', async () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // Переключаемся на общие настройки
        const generalSettings = screen.getByText('Общие настройки');
        fireEvent.click(generalSettings);
        await waitFor(async () => {
            const themeSelect = screen.getByDisplayValue('auto');
            fireEvent.change(themeSelect, { target: { value: 'dark' } });
            expect(themeSelect).toHaveValue('dark');
        });
    });
    it('должен сохранять настройки', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        const saveButton = screen.getByText('Сохранить изменения');
        fireEvent.click(saveButton);
        expect(consoleSpy).toHaveBeenCalledWith('Сохранение настроек');
        consoleSpy.mockRestore();
    });
    it('должен обрабатывать настройки прав доступа', () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // Проверяем, что права доступа отображаются
        expect(screen.getByText('Права доступа')).toBeInTheDocument();
        // Проверяем, что есть переключатели для прав
        const permissionToggles = screen.getAllByRole('checkbox');
        expect(permissionToggles.length).toBeGreaterThan(0);
    });
    it('должен отображать индикаторы состояния разделов', () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // Проверяем наличие индикаторов состояния (зеленые/красные точки)
        const statusIndicators = document.querySelectorAll('.bg-green-500, .bg-red-500');
        expect(statusIndicators.length).toBeGreaterThan(0);
    });
});
describe('Интеграционные тесты настроек', () => {
    it('страница профиля должна работать в связке с системными настройками', () => {
        renderWithRouter(_jsx(SitusProfileSettings, {}));
        // Проверяем базовую функциональность
        expect(screen.getByText('Дмитрий Разработчик')).toBeInTheDocument();
        expect(screen.getByText('Основная информация')).toBeInTheDocument();
    });
    it('страница настроек разделов должна корректно отображать все секции', () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // Проверяем все основные секции
        expect(screen.getByText('Дашборд')).toBeInTheDocument();
        expect(screen.getByText('Проекты')).toBeInTheDocument();
        expect(screen.getByText('Веб-сайты')).toBeInTheDocument();
        expect(screen.getByText('Интернет-магазины')).toBeInTheDocument();
        expect(screen.getByText('Чат-боты')).toBeInTheDocument();
        expect(screen.getByText('Пользователи')).toBeInTheDocument();
    });
    it('должен правильно обрабатывать переходы между секциями настроек', async () => {
        renderWithRouter(_jsx(SitusSectionSettings, {}));
        // Тестируем переход от дашборда к проектам
        const projectsButton = screen.getByText('Проекты');
        fireEvent.click(projectsButton);
        await waitFor(() => {
            expect(screen.getByText('Управление проектами и портфолио')).toBeInTheDocument();
        });
        // Тестируем переход к системным настройкам
        const generalButton = screen.getByText('Общие настройки');
        fireEvent.click(generalButton);
        await waitFor(() => {
            expect(screen.getByText('Тема оформления')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=settings-pages.test.js.map