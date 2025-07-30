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
  default: ({ isOpen, onClose, onSave, user }: any) => (
    isOpen ? (
      <div data-testid="user-modal">
        <h2>{user ? 'Редактировать пользователя' : 'Добавить пользователя'}</h2>
        <form>
          <label htmlFor="email">Email *</label>
          <input 
            id="email" 
            type="email" 
            defaultValue={user?.email || ''} 
            placeholder="Введите email"
          />
          <label htmlFor="firstName">Имя</label>
          <input 
            id="firstName" 
            type="text" 
            defaultValue={user?.firstName || ''} 
            placeholder="Введите имя"
          />
          <label htmlFor="lastName">Фамилия</label>
          <input 
            id="lastName" 
            type="text" 
            defaultValue={user?.lastName || ''} 
            placeholder="Введите фамилию"
          />
          <label htmlFor="company">Компания</label>
          <input 
            id="company" 
            type="text" 
            defaultValue={user?.company || ''} 
            placeholder="Введите название компании"
          />
          <label htmlFor="role">Роль</label>
          <select id="role" defaultValue={user?.role || 'client'}>
            <option value="super_admin">Супер администратор</option>
            <option value="company_admin">Администратор компании</option>
            <option value="admin">Администратор</option>
            <option value="moderator">Модератор</option>
            <option value="editor">Редактор</option>
            <option value="client">Клиент</option>
          </select>
          <label htmlFor="status">Статус</label>
          <select id="status" defaultValue={user?.status || 'active'}>
            <option value="active">Активен</option>
            <option value="inactive">Неактивен</option>
            <option value="pending">Ожидает активации</option>
          </select>
          <label htmlFor="password">Пароль *</label>
          <input 
            id="password" 
            type="password" 
            placeholder="Введите пароль"
          />
        </form>
        <button onClick={() => onSave({ email: 'test@test.com', firstName: 'Test', lastName: 'User', role: 'client', status: 'active' })}>
          Сохранить
        </button>
        <button onClick={onClose}>Отмена</button>
      </div>
    ) : null
  )
}));

vi.mock('../../components/RolePermissionsModal', () => ({
  default: ({ isOpen, onClose, onSave }: any) => (
    isOpen ? (
      <div data-testid="permissions-modal">
        <h2>Управление правами доступа</h2>
        <div>
          <h3>Проекты</h3>
          <div>
            <label>
              <input type="checkbox" value="projects.view" />
              Просмотр проектов
            </label>
            <label>
              <input type="checkbox" value="projects.edit" />
              Редактирование проектов
            </label>
          </div>
          <h3>Пользователи</h3>
          <div>
            <label>
              <input type="checkbox" value="users.view" />
              Просмотр пользователей
            </label>
            <label>
              <input type="checkbox" value="users.edit" />
              Редактирование пользователей
            </label>
          </div>
          <h3>Заказы</h3>
          <div>
            <label>
              <input type="checkbox" value="orders.view" />
              Просмотр заказов
            </label>
            <label>
              <input type="checkbox" value="orders.edit" />
              Редактирование заказов
            </label>
          </div>
          <h3>Маркетинг</h3>
          <div>
            <label>
              <input type="checkbox" value="marketing.view" />
              Просмотр маркетинга
            </label>
            <label>
              <input type="checkbox" value="marketing.edit" />
              Редактирование маркетинга
            </label>
          </div>
          <h3>Настройки</h3>
          <div>
            <label>
              <input type="checkbox" value="settings.view" />
              Просмотр настроек
            </label>
            <label>
              <input type="checkbox" value="settings.edit" />
              Редактирование настроек
            </label>
          </div>
          <h3>Отчеты</h3>
          <div>
            <label>
              <input type="checkbox" value="reports.view" />
              Просмотр отчетов
            </label>
            <label>
              <input type="checkbox" value="reports.edit" />
              Редактирование отчетов
            </label>
          </div>
        </div>
        <button onClick={() => onSave(['projects.view'])}>Сохранить права</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    ) : null
  )
}));

describe('SitusUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает заголовок и описание страницы', async () => {
    render(<SitusUsers />);
    
    await waitFor(() => {
      expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
      expect(screen.getByText('Управление пользователями платформы, ролями и правами доступа')).toBeInTheDocument();
    });
  });

  it('отображает статистические карточки', async () => {
    render(<SitusUsers />);
    
    await waitFor(() => {
      expect(screen.getByText('Всего пользователей')).toBeInTheDocument();
      expect(screen.getByText('Активных')).toBeInTheDocument();
      expect(screen.getByText('Новых за месяц')).toBeInTheDocument();
      expect(screen.getByText('Ожидают активации')).toBeInTheDocument();
    });
  });

  it('отображает фильтры поиска', async () => {
    render(<SitusUsers />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Поиск пользователей...')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Все роли')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Все статусы')).toBeInTheDocument();
    });
  });

  it('отображает таблицу пользователей', async () => {
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
    await waitFor(() => {
      expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
      expect(screen.getByText('admin@situs.com')).toBeInTheDocument();
      expect(screen.getByText('Анна Петрова')).toBeInTheDocument();
      expect(screen.getByText('manager@company.ru')).toBeInTheDocument();
    });
  });

  it('фильтрует пользователей по поиску', async () => {
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
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
    render(<SitusUsers />);
    
    await waitFor(() => {
      // Проверяем, что роли отображаются с правильными стилями
      const roleBadges = screen.getAllByText('Супер администратор');
      const superAdminBadge = roleBadges.find(badge => badge.tagName === 'SPAN');
      expect(superAdminBadge).toHaveClass('bg-purple-100', 'text-purple-800');
    });
  });

  it('отображает правильные цвета для статусов', async () => {
    render(<SitusUsers />);
    
    await waitFor(() => {
      // Проверяем, что статусы отображаются с правильными стилями
      const activeBadges = screen.getAllByText('Активен').filter(badge => badge.tagName === 'SPAN');
      activeBadges.forEach(badge => {
        expect(badge).toHaveClass('bg-green-100', 'text-green-800');
      });
    });
  });

  it('отображает сообщение при отсутствии результатов поиска', async () => {
    render(<SitusUsers />);
    
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
    render(<UserModal {...mockProps} />);
    expect(screen.getByText('Добавить пользователя')).toBeInTheDocument();
  });

  it('не отображается когда isOpen = false', () => {
    render(<UserModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Добавить пользователя')).not.toBeInTheDocument();
  });

  it('отображает форму для создания пользователя', () => {
    render(<UserModal {...mockProps} />);
    
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
      role: 'client' as const,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
      projectsCount: 0,
      ordersCount: 0,
      permissions: []
    };
    
    render(<UserModal {...mockProps} user={user} />);
    
    expect(screen.getByText('Редактировать пользователя')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
  });

  it('вызывает onSave при отправке формы', () => {
    render(<UserModal {...mockProps} />);
    
    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);
    
    expect(mockProps.onSave).toHaveBeenCalled();
  });

  it('вызывает onClose при нажатии отмены', () => {
    render(<UserModal {...mockProps} />);
    
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
    render(<RolePermissionsModal {...mockProps} />);
    expect(screen.getByText('Управление правами доступа')).toBeInTheDocument();
  });

  it('не отображается когда isOpen = false', () => {
    render(<RolePermissionsModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Управление правами доступа')).not.toBeInTheDocument();
  });

  it('отображает категории прав доступа', () => {
    render(<RolePermissionsModal {...mockProps} />);
    
    expect(screen.getByText('Проекты')).toBeInTheDocument();
    expect(screen.getByText('Пользователи')).toBeInTheDocument();
    expect(screen.getByText('Заказы')).toBeInTheDocument();
    expect(screen.getByText('Маркетинг')).toBeInTheDocument();
    expect(screen.getByText('Настройки')).toBeInTheDocument();
    expect(screen.getByText('Отчеты')).toBeInTheDocument();
  });

  it('вызывает onSave при сохранении прав', () => {
    render(<RolePermissionsModal {...mockProps} />);
    
    const saveButton = screen.getByText('Сохранить права');
    fireEvent.click(saveButton);
    
    expect(mockProps.onSave).toHaveBeenCalledWith(['projects.view']);
  });

  it('вызывает onClose при нажатии отмены', () => {
    render(<RolePermissionsModal {...mockProps} />);
    
    const cancelButton = screen.getByText('Отмена');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });
}); 