import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SitusUsers from '../SitusUsers';
import UserModal from '../../components/UserModal';
import RolePermissionsModal from '../../components/RolePermissionsModal';
// Мокируем API
vi.mock('../../../api/services/users.api', () => ({
    usersApi: {
        getUsers: vi.fn().mockResolvedValue({
            users: [
                {
                    id: '1',
                    email: 'admin@situs.com',
                    firstName: 'Дмитрий',
                    lastName: 'Иванов',
                    avatar: '/images/avatars/admin.jpg',
                    role: 'super_admin',
                    status: 'active',
                    createdAt: new Date('2024-01-01T10:00:00Z'),
                    updatedAt: new Date('2024-12-23T15:30:00Z'),
                    lastLoginAt: new Date('2024-12-23T15:30:00Z'),
                    isEmailVerified: true,
                    phone: '+7 (495) 123-45-67',
                    company: 'Стартапус',
                    position: 'Главный администратор',
                    projectsCount: 15,
                    ordersCount: 45,
                    permissions: ['projects.*', 'users.*', 'orders.*', 'marketing.*', 'settings.*', 'reports.*']
                },
                {
                    id: '2',
                    email: 'manager@company.ru',
                    firstName: 'Анна',
                    lastName: 'Петрова',
                    avatar: '/images/avatars/manager.jpg',
                    role: 'company_admin',
                    status: 'active',
                    createdAt: new Date('2024-02-15T09:00:00Z'),
                    updatedAt: new Date('2024-12-20T12:15:00Z'),
                    lastLoginAt: new Date('2024-12-20T12:15:00Z'),
                    isEmailVerified: true,
                    phone: '+7 (495) 234-56-78',
                    company: 'ООО "Инновации"',
                    position: 'Менеджер проектов',
                    projectsCount: 8,
                    ordersCount: 23,
                    permissions: ['projects.view', 'projects.edit', 'orders.view', 'orders.edit']
                }
            ],
            pagination: {
                page: 1,
                limit: 20,
                total: 2,
                totalPages: 1
            }
        }),
        createUser: vi.fn().mockResolvedValue({ id: '3', email: 'test@test.com' }),
        updateUser: vi.fn().mockResolvedValue({ id: '1', email: 'admin@situs.com' }),
        deleteUser: vi.fn().mockResolvedValue(undefined)
    }
}));
// Мокируем модальные компоненты
vi.mock('../../components/UserModal', () => ({
    default: ({ isOpen, onClose, onSave, user }) => (isOpen ? (_jsxs("div", { "data-testid": "user-modal", children: [_jsx("h2", { children: user ? 'Редактировать пользователя' : 'Добавить пользователя' }), _jsxs("form", { children: [_jsx("label", { htmlFor: "email", children: "Email *" }), _jsx("input", { id: "email", type: "email", defaultValue: user?.email || '', placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 email" }), _jsx("label", { htmlFor: "firstName", children: "\u0418\u043C\u044F" }), _jsx("input", { id: "firstName", type: "text", defaultValue: user?.firstName || '', placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F" }), _jsx("label", { htmlFor: "lastName", children: "\u0424\u0430\u043C\u0438\u043B\u0438\u044F" }), _jsx("input", { id: "lastName", type: "text", defaultValue: user?.lastName || '', placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E" }), _jsx("label", { htmlFor: "company", children: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" }), _jsx("input", { id: "company", type: "text", defaultValue: user?.company || '', placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" }), _jsx("label", { htmlFor: "role", children: "\u0420\u043E\u043B\u044C" }), _jsxs("select", { id: "role", defaultValue: user?.role || 'client', children: [_jsx("option", { value: "super_admin", children: "\u0421\u0443\u043F\u0435\u0440 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "company_admin", children: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" }), _jsx("option", { value: "admin", children: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "moderator", children: "\u041C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440" }), _jsx("option", { value: "editor", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440" }), _jsx("option", { value: "client", children: "\u041A\u043B\u0438\u0435\u043D\u0442" })] }), _jsx("label", { htmlFor: "status", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsxs("select", { id: "status", defaultValue: user?.status || 'active', children: [_jsx("option", { value: "active", children: "\u0410\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "inactive", children: "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u0435\u043D" }), _jsx("option", { value: "pending", children: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u0438" })] }), _jsx("label", { htmlFor: "password", children: "\u041F\u0430\u0440\u043E\u043B\u044C *" }), _jsx("input", { id: "password", type: "password", placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" })] }), _jsx("button", { onClick: () => onSave({ email: 'test@test.com', firstName: 'Test', lastName: 'User', role: 'client', status: 'active' }), children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }), _jsx("button", { onClick: onClose, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })) : null)
}));
vi.mock('../../components/RolePermissionsModal', () => ({
    default: ({ isOpen, onClose, onSave }) => (isOpen ? (_jsxs("div", { "data-testid": "permissions-modal", children: [_jsx("h2", { children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0430\u043C\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" }), _jsxs("div", { children: [_jsx("h3", { children: "\u041F\u0440\u043E\u0435\u043A\u0442\u044B" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "projects.view" }), "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "projects.edit" }), "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432"] })] }), _jsx("h3", { children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "users.view" }), "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "users.edit" }), "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439"] })] }), _jsx("h3", { children: "\u0417\u0430\u043A\u0430\u0437\u044B" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "orders.view" }), "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0437\u0430\u043A\u0430\u0437\u043E\u0432"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "orders.edit" }), "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u043E\u0432"] })] }), _jsx("h3", { children: "\u041C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "marketing.view" }), "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433\u0430"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "marketing.edit" }), "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433\u0430"] })] }), _jsx("h3", { children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "settings.view" }), "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "settings.edit" }), "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A"] })] }), _jsx("h3", { children: "\u041E\u0442\u0447\u0435\u0442\u044B" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "reports.view" }), "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043E\u0442\u0447\u0435\u0442\u043E\u0432"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", value: "reports.edit" }), "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u0447\u0435\u0442\u043E\u0432"] })] })] }), _jsx("button", { onClick: () => onSave(['projects.view']), children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0430" }), _jsx("button", { onClick: onClose, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })) : null)
}));
describe('SitusUsers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('отображает заголовок и описание страницы', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
            expect(screen.getByText('Управление пользователями платформы, ролями и правами доступа')).toBeInTheDocument();
        });
    });
    it('отображает статистические карточки', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            expect(screen.getByText('Всего пользователей')).toBeInTheDocument();
            expect(screen.getByText('Активных')).toBeInTheDocument();
            expect(screen.getByText('Новых за месяц')).toBeInTheDocument();
            expect(screen.getByText('Ожидают активации')).toBeInTheDocument();
        });
    });
    it('отображает фильтры поиска', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Поиск пользователей...')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Все роли')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Все статусы')).toBeInTheDocument();
        });
    });
    it('отображает таблицу пользователей', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            expect(screen.getByText('Пользователь')).toBeInTheDocument();
            expect(screen.getAllByText('Роль')).toHaveLength(2); // One in filter, one in table header
            expect(screen.getAllByText('Статус')).toHaveLength(2); // One in filter, one in table header
            expect(screen.getByText('Проекты')).toBeInTheDocument();
            expect(screen.getByText('Последний вход')).toBeInTheDocument();
            expect(screen.getByText('Действия')).toBeInTheDocument();
        });
    });
    it('отображает данные пользователей', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
            expect(screen.getByText('admin@situs.com')).toBeInTheDocument();
            expect(screen.getByText('Анна Петрова')).toBeInTheDocument();
            expect(screen.getByText('manager@company.ru')).toBeInTheDocument();
        });
    });
    it('фильтрует пользователей по поиску', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText('Поиск пользователей...');
            fireEvent.change(searchInput, { target: { value: 'Дмитрий' } });
        });
        await waitFor(() => {
            expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
            expect(screen.queryByText('Анна Петрова')).not.toBeInTheDocument();
        });
    });
    it('фильтрует пользователей по роли', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const roleSelect = screen.getByDisplayValue('Все роли');
            fireEvent.change(roleSelect, { target: { value: 'super_admin' } });
        });
        await waitFor(() => {
            expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
            expect(screen.queryByText('Анна Петрова')).not.toBeInTheDocument();
        });
    });
    it('фильтрует пользователей по статусу', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const statusSelect = screen.getByDisplayValue('Все статусы');
            fireEvent.change(statusSelect, { target: { value: 'active' } });
        });
        await waitFor(() => {
            expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
            expect(screen.getByText('Анна Петрова')).toBeInTheDocument();
        });
    });
    it('открывает модальное окно редактирования пользователя', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const editButtons = screen.getAllByText('Редактировать');
            fireEvent.click(editButtons[0]);
        });
        await waitFor(() => {
            expect(screen.getByTestId('user-modal')).toBeInTheDocument();
            expect(screen.getByText('Редактировать пользователя')).toBeInTheDocument();
        });
    });
    it('открывает модальное окно управления правами', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const permissionButtons = screen.getAllByText('Права');
            fireEvent.click(permissionButtons[0]);
        });
        await waitFor(() => {
            expect(screen.getByTestId('permissions-modal')).toBeInTheDocument();
            expect(screen.getByText('Управление правами доступа')).toBeInTheDocument();
        });
    });
    it('обрабатывает сохранение нового пользователя', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const addButtons = screen.getAllByText('Добавить пользователя');
            const addButton = addButtons.find(button => button.tagName === 'BUTTON');
            if (addButton) {
                fireEvent.click(addButton);
            }
        });
        await waitFor(() => {
            expect(screen.getByTestId('user-modal')).toBeInTheDocument();
            const modalTitles = screen.getAllByText('Добавить пользователя');
            const modalTitle = modalTitles.find(title => title.tagName === 'H2');
            expect(modalTitle).toBeInTheDocument();
        });
        const saveButton = screen.getByText('Сохранить');
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();
        });
    });
    it('обрабатывает сохранение прав доступа', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const permissionButtons = screen.getAllByText('Права');
            fireEvent.click(permissionButtons[0]);
        });
        await waitFor(() => {
            expect(screen.getByTestId('permissions-modal')).toBeInTheDocument();
        });
        const saveButton = screen.getByText('Сохранить права');
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(screen.queryByTestId('permissions-modal')).not.toBeInTheDocument();
        });
    });
    it('отображает правильные цвета для ролей', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            // Проверяем, что роли отображаются с правильными стилями
            const roleBadges = screen.getAllByText('Супер администратор');
            const superAdminBadge = roleBadges.find(badge => badge.tagName === 'SPAN');
            expect(superAdminBadge).toHaveClass('bg-purple-100', 'text-purple-800');
        });
    });
    it('отображает правильные цвета для статусов', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            // Проверяем, что статусы отображаются с правильными стилями
            const activeBadges = screen.getAllByText('Активен').filter(badge => badge.tagName === 'SPAN');
            activeBadges.forEach(badge => {
                expect(badge).toHaveClass('bg-green-100', 'text-green-800');
            });
        });
    });
    it('отображает сообщение при отсутствии результатов поиска', async () => {
        render(_jsx(SitusUsers, {}));
        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText('Поиск пользователей...');
            fireEvent.change(searchInput, { target: { value: 'несуществующий пользователь' } });
        });
        await waitFor(() => {
            // Проверяем, что пользователи не отображаются
            expect(screen.queryByText('Дмитрий Иванов')).not.toBeInTheDocument();
            expect(screen.queryByText('Анна Петрова')).not.toBeInTheDocument();
        });
    });
});
describe('UserModal', () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSave: vi.fn(),
        user: null
    };
    it('отображается когда isOpen = true', () => {
        render(_jsx(UserModal, { ...mockProps }));
        expect(screen.getByText('Добавить пользователя')).toBeInTheDocument();
    });
    it('не отображается когда isOpen = false', () => {
        render(_jsx(UserModal, { ...mockProps, isOpen: false }));
        expect(screen.queryByText('Добавить пользователя')).not.toBeInTheDocument();
    });
    it('отображает форму для создания пользователя', () => {
        render(_jsx(UserModal, { ...mockProps }));
        expect(screen.getByLabelText('Email *')).toBeInTheDocument();
        expect(screen.getByLabelText('Имя')).toBeInTheDocument();
        expect(screen.getByLabelText('Фамилия')).toBeInTheDocument();
        expect(screen.getByLabelText('Роль')).toBeInTheDocument();
        expect(screen.getByLabelText('Статус')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль *')).toBeInTheDocument();
    });
    it('отображает форму для редактирования пользователя', () => {
        const user = {
            id: '1',
            email: 'test@test.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'client',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            isEmailVerified: true,
            projectsCount: 0,
            ordersCount: 0,
            permissions: []
        };
        render(_jsx(UserModal, { ...mockProps, user: user }));
        expect(screen.getByText('Редактировать пользователя')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
        expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    });
    it('вызывает onSave при отправке формы', () => {
        render(_jsx(UserModal, { ...mockProps }));
        const saveButton = screen.getByText('Сохранить');
        fireEvent.click(saveButton);
        expect(mockProps.onSave).toHaveBeenCalled();
    });
    it('вызывает onClose при нажатии отмены', () => {
        render(_jsx(UserModal, { ...mockProps }));
        const cancelButton = screen.getByText('Отмена');
        fireEvent.click(cancelButton);
        expect(mockProps.onClose).toHaveBeenCalled();
    });
});
describe('RolePermissionsModal', () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSave: vi.fn(),
        userId: '1'
    };
    it('отображается когда isOpen = true', () => {
        render(_jsx(RolePermissionsModal, { ...mockProps }));
        expect(screen.getByText('Управление правами доступа')).toBeInTheDocument();
    });
    it('не отображается когда isOpen = false', () => {
        render(_jsx(RolePermissionsModal, { ...mockProps, isOpen: false }));
        expect(screen.queryByText('Управление правами доступа')).not.toBeInTheDocument();
    });
    it('отображает категории прав доступа', () => {
        render(_jsx(RolePermissionsModal, { ...mockProps }));
        expect(screen.getByText('Проекты')).toBeInTheDocument();
        expect(screen.getByText('Пользователи')).toBeInTheDocument();
        expect(screen.getByText('Заказы')).toBeInTheDocument();
        expect(screen.getByText('Маркетинг')).toBeInTheDocument();
        expect(screen.getByText('Настройки')).toBeInTheDocument();
        expect(screen.getByText('Отчеты')).toBeInTheDocument();
    });
    it('вызывает onSave при сохранении прав', () => {
        render(_jsx(RolePermissionsModal, { ...mockProps }));
        const saveButton = screen.getByText('Сохранить права');
        fireEvent.click(saveButton);
        expect(mockProps.onSave).toHaveBeenCalledWith(['projects.view']);
    });
    it('вызывает onClose при нажатии отмены', () => {
        render(_jsx(RolePermissionsModal, { ...mockProps }));
        const cancelButton = screen.getByText('Отмена');
        fireEvent.click(cancelButton);
        expect(mockProps.onClose).toHaveBeenCalled();
    });
});
//# sourceMappingURL=users-system.test.js.map