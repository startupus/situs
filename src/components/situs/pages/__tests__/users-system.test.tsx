import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SitusUsers from '../SitusUsers';
import UserModal from '../../components/UserModal';
import RolePermissionsModal from '../../components/RolePermissionsModal';

// Мокируем модальные компоненты
vi.mock('../../components/UserModal', () => ({
  default: ({ isOpen, onClose, onSave, user }: any) => (
    isOpen ? (
      <div data-testid="user-modal">
        <h2>{user ? 'Редактировать пользователя' : 'Добавить пользователя'}</h2>
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
        <button onClick={() => onSave(['projects.view'])}>Сохранить права</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    ) : null
  )
}));

describe('SitusUsers', () => {
  it('отображает заголовок и описание страницы', () => {
    render(<SitusUsers />);
    
    expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
    expect(screen.getByText('Управление пользователями платформы, ролями и правами доступа')).toBeInTheDocument();
  });

  it('отображает статистические карточки', () => {
    render(<SitusUsers />);
    
    // Проверяем наличие статистических данных
    expect(screen.getByText('Всего пользователей')).toBeInTheDocument();
    expect(screen.getByText('Активных')).toBeInTheDocument();
    expect(screen.getByText('Новых за месяц')).toBeInTheDocument();
    expect(screen.getByText('Ожидают активации')).toBeInTheDocument();
  });

  it('отображает фильтры поиска', () => {
    render(<SitusUsers />);
    
    // Проверяем наличие элементов фильтрации
    expect(screen.getByPlaceholderText('Поиск пользователей...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Все роли')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Все статусы')).toBeInTheDocument();
  });

  it('отображает таблицу пользователей', () => {
    render(<SitusUsers />);
    
    // Проверяем заголовки таблицы
    expect(screen.getByText('Пользователь')).toBeInTheDocument();
    expect(screen.getByText('Роль')).toBeInTheDocument();
    expect(screen.getByText('Статус')).toBeInTheDocument();
    expect(screen.getByText('Проекты')).toBeInTheDocument();
    expect(screen.getByText('Последний вход')).toBeInTheDocument();
    expect(screen.getByText('Действия')).toBeInTheDocument();
  });

  it('отображает данные пользователей', () => {
    render(<SitusUsers />);
    
    // Проверяем отображение пользователей из мок-данных
    expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
    expect(screen.getByText('admin@situs.com')).toBeInTheDocument();
    expect(screen.getByText('Анна Петрова')).toBeInTheDocument();
    expect(screen.getByText('manager@company.ru')).toBeInTheDocument();
  });

  it('фильтрует пользователей по поиску', async () => {
    render(<SitusUsers />);
    
    const searchInput = screen.getByPlaceholderText('Поиск пользователей...');
    fireEvent.change(searchInput, { target: { value: 'Дмитрий' } });
    
    await waitFor(() => {
      expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
      expect(screen.queryByText('Анна Петрова')).not.toBeInTheDocument();
    });
  });

  it('фильтрует пользователей по роли', async () => {
    render(<SitusUsers />);
    
    const roleSelect = screen.getByDisplayValue('Все роли');
    fireEvent.change(roleSelect, { target: { value: 'super_admin' } });
    
    await waitFor(() => {
      expect(screen.getByText('Дмитрий Иванов')).toBeInTheDocument();
      expect(screen.queryByText('Анна Петрова')).not.toBeInTheDocument();
    });
  });

  it('фильтрует пользователей по статусу', async () => {
    render(<SitusUsers />);
    
    const statusSelect = screen.getByDisplayValue('Все статусы');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    
    await waitFor(() => {
      expect(screen.getByText('Алексей Новиков')).toBeInTheDocument();
      expect(screen.queryByText('Дмитрий Иванов')).not.toBeInTheDocument();
    });
  });

  it('открывает модальное окно создания пользователя', async () => {
    render(<SitusUsers />);
    
    const addButton = screen.getByRole('button', { name: 'Добавить пользователя' });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-modal')).toBeInTheDocument();
      expect(screen.getAllByText('Добавить пользователя')).toHaveLength(2);
    });
  });

  it('открывает модальное окно редактирования пользователя', async () => {
    render(<SitusUsers />);
    
    const editButtons = screen.getAllByText('Редактировать');
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-modal')).toBeInTheDocument();
      expect(screen.getByText('Редактировать пользователя')).toBeInTheDocument();
    });
  });

  it('открывает модальное окно управления правами', async () => {
    render(<SitusUsers />);
    
    const permissionButtons = screen.getAllByText('Права');
    fireEvent.click(permissionButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByTestId('permissions-modal')).toBeInTheDocument();
      expect(screen.getByText('Управление правами доступа')).toBeInTheDocument();
    });
  });

  it('обрабатывает сохранение нового пользователя', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<SitusUsers />);
    
    const addButton = screen.getByText('Добавить пользователя');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Saving user:', expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('обрабатывает сохранение прав доступа', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<SitusUsers />);
    
    const permissionButtons = screen.getAllByText('Права');
    fireEvent.click(permissionButtons[0]);
    
    await waitFor(() => {
      const saveButton = screen.getByText('Сохранить права');
      fireEvent.click(saveButton);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Saving permissions:', expect.any(Array));
    consoleSpy.mockRestore();
  });

  it('отображает правильные цвета для ролей', () => {
    render(<SitusUsers />);
    
    // Проверяем, что роли отображаются с правильными стилями (берем элементы из таблицы)
    const roleBadges = screen.getAllByText('Супер админ');
    const superAdminBadge = roleBadges.find(badge => badge.tagName === 'SPAN');
    expect(superAdminBadge).toHaveClass('bg-purple-100', 'text-purple-800');
    
    const adminBadges = screen.getAllByText('Админ компании');
    const adminBadge = adminBadges.find(badge => badge.tagName === 'SPAN');
    expect(adminBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('отображает правильные цвета для статусов', () => {
    render(<SitusUsers />);
    
    // Проверяем, что статусы отображаются с правильными стилями (только span элементы)
    const activeBadges = screen.getAllByText('Активен').filter(badge => badge.tagName === 'SPAN');
    activeBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });
    
    const pendingBadges = screen.getAllByText('Ожидает').filter(badge => badge.tagName === 'SPAN');
    pendingBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
  });

  it('отображает сообщение при отсутствии результатов поиска', async () => {
    render(<SitusUsers />);
    
    const searchInput = screen.getByPlaceholderText('Поиск пользователей...');
    fireEvent.change(searchInput, { target: { value: 'несуществующий пользователь' } });
    
    await waitFor(() => {
      expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument();
    });
  });
});

describe('UserModal', () => {
  const mockProps = {
    user: null,
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображается когда isOpen = true', () => {
    render(<UserModal {...mockProps} />);
    expect(screen.getByText('Добавить пользователя')).toBeInTheDocument();
  });

  it('не отображается когда isOpen = false', () => {
    render(<UserModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Добавить пользователя')).not.toBeInTheDocument();
  });

  it('отображает заголовок редактирования для существующего пользователя', () => {
    const user = {
      id: '1',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'client' as any,
      status: 'active' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
      projectsCount: 0,
      ordersCount: 0,
      permissions: [],
    };

    render(<UserModal {...mockProps} user={user} />);
    expect(screen.getByText('Редактировать пользователя')).toBeInTheDocument();
  });
});

describe('RolePermissionsModal', () => {
  const mockProps = {
    userId: '1',
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображается когда isOpen = true', () => {
    render(<RolePermissionsModal {...mockProps} />);
    expect(screen.getByText('Управление правами доступа')).toBeInTheDocument();
  });

  it('не отображается когда isOpen = false', () => {
    render(<RolePermissionsModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Управление правами доступа')).not.toBeInTheDocument();
  });
}); 