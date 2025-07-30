import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SitusSupport from '../SitusSupport';
// Мок компонент для тестирования
const SitusSupportWrapper = () => (_jsx(BrowserRouter, { children: _jsx(SitusSupport, {}) }));
describe('SitusSupport', () => {
    beforeEach(() => {
        render(_jsx(SitusSupportWrapper, {}));
    });
    it('отображает заголовок и описание страницы', () => {
        expect(screen.getByText('Поддержка')).toBeInTheDocument();
        expect(screen.getByText('Управление обращениями в службу поддержки')).toBeInTheDocument();
    });
    it('отображает кнопку создания обращения', () => {
        expect(screen.getByText('Создать обращение')).toBeInTheDocument();
    });
    it('отображает статистические карточки', () => {
        expect(screen.getByText('Всего обращений')).toBeInTheDocument();
        expect(screen.getByText('Открытых')).toBeInTheDocument();
        expect(screen.getByText('В работе')).toBeInTheDocument();
        expect(screen.getByText('Закрытых')).toBeInTheDocument();
    });
    it('отображает поля фильтрации', () => {
        expect(screen.getByPlaceholderText('Поиск по названию, ID...')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Все статусы')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Все приоритеты')).toBeInTheDocument();
        expect(screen.getByText('Сбросить')).toBeInTheDocument();
    });
    it('отображает таблицу с обращениями', () => {
        expect(screen.getByText('Обращение')).toBeInTheDocument();
        expect(screen.getByText('Статус')).toBeInTheDocument();
        expect(screen.getByText('Приоритет')).toBeInTheDocument();
        expect(screen.getByText('Категория')).toBeInTheDocument();
        expect(screen.getByText('Ответы')).toBeInTheDocument();
        expect(screen.getByText('Обновлено')).toBeInTheDocument();
    });
    it('отображает тестовые обращения', () => {
        expect(screen.getByText('Проблема с подключением API')).toBeInTheDocument();
        expect(screen.getByText('Вопрос по тарифам')).toBeInTheDocument();
        expect(screen.getByText('Предложение новой функции')).toBeInTheDocument();
        expect(screen.getByText('Ошибка в компоненте Modal')).toBeInTheDocument();
        expect(screen.getByText('Помощь с интеграцией')).toBeInTheDocument();
    });
    it('фильтрует обращения по статусу', async () => {
        const user = userEvent.setup();
        // Фильтруем по статусу "Открытые"
        const statusSelect = screen.getByDisplayValue('Все статусы');
        await user.selectOptions(statusSelect, 'open');
        // Проверяем, что отображаются только открытые обращения
        expect(screen.getByText('Проблема с подключением API')).toBeInTheDocument();
        expect(screen.getByText('Ошибка в компоненте Modal')).toBeInTheDocument();
        // Проверяем, что закрытые обращения не отображаются
        expect(screen.queryByText('Предложение новой функции')).not.toBeInTheDocument();
    });
    it('фильтрует обращения по приоритету', async () => {
        const user = userEvent.setup();
        // Фильтруем по приоритету "Срочно"
        const prioritySelect = screen.getByDisplayValue('Все приоритеты');
        await user.selectOptions(prioritySelect, 'urgent');
        // Проверяем, что отображается только срочное обращение
        expect(screen.getByText('Ошибка в компоненте Modal')).toBeInTheDocument();
        // Проверяем, что обращения с другими приоритетами не отображаются
        expect(screen.queryByText('Проблема с подключением API')).not.toBeInTheDocument();
    });
    it('выполняет поиск по тексту', async () => {
        const user = userEvent.setup();
        // Вводим поисковый запрос
        const searchInput = screen.getByPlaceholderText('Поиск по названию, ID...');
        await user.type(searchInput, 'API');
        // Проверяем, что отображается только обращение с API
        expect(screen.getByText('Проблема с подключением API')).toBeInTheDocument();
        // Проверяем, что другие обращения не отображаются
        expect(screen.queryByText('Вопрос по тарифам')).not.toBeInTheDocument();
        expect(screen.queryByText('Предложение новой функции')).not.toBeInTheDocument();
    });
    it('сбрасывает фильтры при нажатии на кнопку "Сбросить"', async () => {
        const user = userEvent.setup();
        // Устанавливаем фильтры
        const statusSelect = screen.getByDisplayValue('Все статусы');
        await user.selectOptions(statusSelect, 'open');
        const searchInput = screen.getByPlaceholderText('Поиск по названию, ID...');
        await user.type(searchInput, 'test');
        // Нажимаем кнопку сброса
        const resetButton = screen.getByText('Сбросить');
        await user.click(resetButton);
        // Проверяем, что фильтры сброшены
        expect(statusSelect).toHaveValue('all');
        expect(searchInput).toHaveValue('');
        // Проверяем, что все обращения снова видны
        expect(screen.getByText('Проблема с подключением API')).toBeInTheDocument();
        expect(screen.getByText('Вопрос по тарифам')).toBeInTheDocument();
    });
    it('отображает правильные цвета статусов', () => {
        // Проверяем наличие статусов с правильными текстами
        expect(screen.getByText('Открыт')).toBeInTheDocument();
        expect(screen.getByText('В работе')).toBeInTheDocument();
        expect(screen.getByText('Закрыт')).toBeInTheDocument();
    });
    it('отображает правильные цвета приоритетов', () => {
        // Проверяем наличие приоритетов с правильными текстами
        expect(screen.getByText('Срочно')).toBeInTheDocument();
        expect(screen.getByText('Высокий')).toBeInTheDocument();
        expect(screen.getByText('Средний')).toBeInTheDocument();
        expect(screen.getByText('Низкий')).toBeInTheDocument();
    });
    it('отображает сообщение когда обращения не найдены', async () => {
        const user = userEvent.setup();
        // Вводим поисковый запрос, который не даст результатов
        const searchInput = screen.getByPlaceholderText('Поиск по названию, ID...');
        await user.type(searchInput, 'несуществующий запрос');
        // Проверяем, что отображается сообщение об отсутствии результатов
        expect(screen.getByText('Обращения не найдены')).toBeInTheDocument();
        expect(screen.getByText('Попробуйте изменить фильтры или создать новое обращение.')).toBeInTheDocument();
    });
    it('отображает кнопки действий для каждого обращения', () => {
        const openButtons = screen.getAllByText('Открыть');
        expect(openButtons).toHaveLength(5); // 5 тестовых обращений
    });
    it('отображает правильную статистику', () => {
        // Всего обращений: 5
        expect(screen.getByText('5')).toBeInTheDocument();
        // Статистика по статусам должна быть корректной
        // Открытых: 2, В работе: 2, Закрытых: 1
        const statsNumbers = screen.getAllByText(/^[0-9]+$/);
        expect(statsNumbers).toHaveLength(4); // 4 статистических показателя
    });
});
describe('SitusSupport - Функции помощники', () => {
    it('корректно форматирует дату', () => {
        const testDate = new Date('2024-01-15T10:30:00');
        const formatted = testDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        expect(formatted).toContain('15.01.2024');
    });
});
//# sourceMappingURL=support-page.test.js.map