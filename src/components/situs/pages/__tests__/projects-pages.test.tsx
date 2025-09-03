import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SitusProjects from '../SitusProjects';
import SitusWebsites from '../SitusWebsites';
import SitusStores from '../SitusStores';
import SitusChatbots from '../SitusChatbots';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SitusProjects', () => {
  it('отображает заголовок страницы проектов', () => {
    renderWithRouter(<SitusProjects />);

    const titleElements = screen.getAllByText('Проекты');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Управление всеми вашими проектами')).toBeInTheDocument();
  });

  it('отображает кнопку создания проекта', () => {
    renderWithRouter(<SitusProjects />);

    const createButtons = screen.getAllByText('Создать проект');
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it('отображает фильтры по типам проектов', () => {
    renderWithRouter(<SitusProjects />);

    // Теперь фильтры находятся в левой панели
    expect(screen.getByText('Все проекты')).toBeInTheDocument();
    expect(screen.getByText('Сайты')).toBeInTheDocument();
    expect(screen.getByText('Магазины')).toBeInTheDocument();
    expect(screen.getByText('Чатботы')).toBeInTheDocument();
    expect(screen.getByText('Лендинги')).toBeInTheDocument();
    expect(screen.getByText('Приложения')).toBeInTheDocument();
  });

  it('отображает список проектов', () => {
    renderWithRouter(<SitusProjects />);

    const projectElements = screen.getAllByText("Корпоративный сайт ООО 'ТехноСтрой'");
    expect(projectElements.length).toBeGreaterThan(0);

    const storeElements = screen.getAllByText("Интернет-магазин 'МодаСтиль'");
    expect(storeElements.length).toBeGreaterThan(0);

    const chatbotElements = screen.getAllByText("Чат-бот поддержки 'Помощник24'");
    expect(chatbotElements.length).toBeGreaterThan(0);
  });

  it('отображает поиск проектов', () => {
    renderWithRouter(<SitusProjects />);

    const searchInputs = screen.getAllByPlaceholderText('Поиск проектов...');
    expect(searchInputs.length).toBeGreaterThan(0);
  });
});

describe('SitusWebsites', () => {
  it('отображает заголовок страницы сайтов', () => {
    renderWithRouter(<SitusWebsites />);

    const titleElements = screen.getAllByText('Сайты');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Управление веб-сайтами и лендингами')).toBeInTheDocument();
  });

  it('отображает кнопку создания сайта', () => {
    renderWithRouter(<SitusWebsites />);

    const createButtons = screen.getAllByText('Создать сайт');
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it('отображает список сайтов', () => {
    renderWithRouter(<SitusWebsites />);

    const websiteElements = screen.getAllByText("Корпоративный сайт ООО 'ТехноСтрой'");
    expect(websiteElements.length).toBeGreaterThan(0);

    const landingElements = screen.getAllByText("Лендинг 'Курсы программирования'");
    expect(landingElements.length).toBeGreaterThan(0);

    const blogElements = screen.getAllByText("Блог 'Технологии будущего'");
    expect(blogElements.length).toBeGreaterThan(0);
  });

  it('отображает поиск сайтов', () => {
    renderWithRouter(<SitusWebsites />);

    const searchInputs = screen.getAllByPlaceholderText('Поиск сайтов...');
    expect(searchInputs.length).toBeGreaterThan(0);
  });
});

describe('SitusStores', () => {
  it('отображает заголовок страницы магазинов', () => {
    renderWithRouter(<SitusStores />);

    const titleElements = screen.getAllByText('Магазины');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Управление интернет-магазинами')).toBeInTheDocument();
  });

  it('отображает кнопку создания магазина', () => {
    renderWithRouter(<SitusStores />);

    const createButtons = screen.getAllByText('Создать магазин');
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it('отображает список магазинов', () => {
    renderWithRouter(<SitusStores />);

    const storeElements = screen.getAllByText("Интернет-магазин 'МодаСтиль'");
    expect(storeElements.length).toBeGreaterThan(0);

    const techElements = screen.getAllByText("Магазин электроники 'ТехноМир'");
    expect(techElements.length).toBeGreaterThan(0);

    const bookElements = screen.getAllByText("Магазин книг 'ЧитайГород'");
    expect(bookElements.length).toBeGreaterThan(0);
  });

  it('отображает поиск магазинов', () => {
    renderWithRouter(<SitusStores />);

    const searchInputs = screen.getAllByPlaceholderText('Поиск магазинов...');
    expect(searchInputs.length).toBeGreaterThan(0);
  });
});

describe('SitusChatbots', () => {
  it('отображает заголовок страницы чат-ботов', () => {
    renderWithRouter(<SitusChatbots />);

    const titleElements = screen.getAllByText('Чатботы');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Управление чат-ботами и автоматизацией')).toBeInTheDocument();
  });

  it('отображает кнопку создания чат-бота', () => {
    renderWithRouter(<SitusChatbots />);

    const createButtons = screen.getAllByText('Создать чат-бот');
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it('отображает список чат-ботов', () => {
    renderWithRouter(<SitusChatbots />);

    const helperElements = screen.getAllByText("Чат-бот поддержки 'Помощник24'");
    expect(helperElements.length).toBeGreaterThan(0);

    const pizzaElements = screen.getAllByText("Чат-бот заказа пиццы 'ПиццаБот'");
    expect(pizzaElements.length).toBeGreaterThan(0);

    const lawyerElements = screen.getAllByText("Чат-бот консультаций 'ЮристБот'");
    expect(lawyerElements.length).toBeGreaterThan(0);
  });

  it('отображает поиск чат-ботов', () => {
    renderWithRouter(<SitusChatbots />);

    const searchInputs = screen.getAllByPlaceholderText('Поиск чат-ботов...');
    expect(searchInputs.length).toBeGreaterThan(0);
  });
});
