import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import SitusProjects from '../SitusProjects';
import { SiteProvider } from '../../../../contexts/SiteContext';
import { UserProvider } from '../../../../contexts/UserContext';

// Мокаем react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/projects'
    })
  };
});

// Мокаем API
vi.mock('../../../../api/services/sites.api', () => ({
  sitesApi: {
    getSites: vi.fn().mockResolvedValue({
      sites: [
        {
          id: 'startapus-ecosystem',
          name: 'Стартапус - Демо проект',
          description: 'Демонстрационный проект',
          template: 'website',
          domain: 'startapus.com',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-23T15:30:00Z',
          pages: [
            {
              id: 'startapus-home',
              title: 'Главная',
              status: 'published'
            }
          ]
        }
      ]
    }),
    createSite: vi.fn().mockResolvedValue({
      id: 'new-project',
      name: 'Новый сайт',
      description: 'Описание для Новый сайт',
      template: 'website',
      domain: 'new-project.situs.ru',
      createdAt: '2024-12-23T15:30:00Z',
      updatedAt: '2024-12-23T15:30:00Z',
      pages: []
    })
  }
}));

// Мокаем UserContext
vi.mock('../../../../contexts/UserContext', async () => {
  const actual = await vi.importActual('../../../../contexts/UserContext');
  return {
    ...actual,
    useUser: () => ({
      user: {
        id: 'test-user',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      }
    })
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <UserProvider>
        <SiteProvider>
          {component}
        </SiteProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

describe('SitusProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает заголовок страницы', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Проекты')).toBeInTheDocument();
      expect(screen.getByText('Управление всеми вашими проектами')).toBeInTheDocument();
    });
  });

  it('отображает демо-проект Стартапус', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Стартапус - Демо проект')).toBeInTheDocument();
      expect(screen.getByText('Демонстрационный проект')).toBeInTheDocument();
    });
  });

  it('отображает кнопку создания проекта', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Создать проект')).toBeInTheDocument();
    });
  });

  it('открывает модальное окно при нажатии на кнопку создания проекта', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      const createButton = screen.getByText('Создать проект');
      fireEvent.click(createButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Создать новый проект')).toBeInTheDocument();
      expect(screen.getByText('Тип проекта')).toBeInTheDocument();
    });
  });

  it('отображает фильтры проектов', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Все')).toBeInTheDocument();
      expect(screen.getByText('Сайты')).toBeInTheDocument();
      expect(screen.getByText('Магазины')).toBeInTheDocument();
      expect(screen.getByText('Чат-боты')).toBeInTheDocument();
    });
  });

  it('отображает поиск проектов', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Поиск проектов...')).toBeInTheDocument();
    });
  });

  it('отображает боковое меню с разделами проектов', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Разделы проектов')).toBeInTheDocument();
      expect(screen.getByText('Выберите тип проекта для просмотра')).toBeInTheDocument();
      expect(screen.getByText('Все проекты')).toBeInTheDocument();
      expect(screen.getByText('Сайты')).toBeInTheDocument();
      expect(screen.getByText('Магазины')).toBeInTheDocument();
      expect(screen.getByText('Чатботы')).toBeInTheDocument();
      expect(screen.getByText('Лендинги')).toBeInTheDocument();
      expect(screen.getByText('Приложения')).toBeInTheDocument();
    });
  });

  it('отображает быстрые действия', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Быстрые действия')).toBeInTheDocument();
      expect(screen.getAllByText('+ Создать проект')).toHaveLength(2); // В боковом меню и в основном контенте
    });
  });

  it('отображает статус проекта', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Активен')).toBeInTheDocument();
    });
  });

  it('отображает URL проекта', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('startapus.com')).toBeInTheDocument();
    });
  });

  it('отображает статистику проекта', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Посетители')).toBeInTheDocument();
      expect(screen.getByText('Заказы')).toBeInTheDocument();
      expect(screen.getByText('Доход')).toBeInTheDocument();
    });
  });

  it('отображает кнопки действий для проекта', async () => {
    renderWithProviders(<SitusProjects />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Редактировать')).toHaveLength(1);
      expect(screen.getAllByText('Аналитика')).toHaveLength(1);
    });
  });
}); 