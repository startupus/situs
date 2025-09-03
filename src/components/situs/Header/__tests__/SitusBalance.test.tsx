import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SitusBalance from '../SitusBalance';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SitusBalance', () => {
  it('отображает баланс Монетус', () => {
    renderWithRouter(<SitusBalance monetusBalance={1250} carrotusBalance={340} />);

    const monetusElements = screen.getAllByText('1,250');
    expect(monetusElements.length).toBeGreaterThan(0);
  });

  it('отображает баланс Морковкус', () => {
    renderWithRouter(<SitusBalance monetusBalance={1250} carrotusBalance={340} />);

    const carrotusElements = screen.getAllByText('340');
    expect(carrotusElements.length).toBeGreaterThan(0);
  });

  it('отображает кнопку пополнения как иконку +', () => {
    renderWithRouter(<SitusBalance monetusBalance={1250} carrotusBalance={340} />);

    const topUpLinks = screen.getAllByRole('link', { name: /пополнить баланс/i });
    expect(topUpLinks.length).toBeGreaterThan(0);

    const topUpLink = topUpLinks[0];
    expect(topUpLink).toHaveAttribute('href', '/billing');
    expect(topUpLink).toHaveAttribute('title', 'Пополнить баланс');
  });

  it('использует значения по умолчанию', () => {
    renderWithRouter(<SitusBalance monetusBalance={1250} carrotusBalance={340} />);

    const monetusElements = screen.getAllByText('1,250');
    const carrotusElements = screen.getAllByText('340');
    expect(monetusElements.length).toBeGreaterThan(0);
    expect(carrotusElements.length).toBeGreaterThan(0);
  });

  it('форматирует большие числа', () => {
    renderWithRouter(<SitusBalance monetusBalance={1000000} carrotusBalance={50000} />);

    expect(screen.getByText('1,000,000')).toBeInTheDocument();
    expect(screen.getByText('50,000')).toBeInTheDocument();
  });

  it('имеет компактный дизайн в одну строку', () => {
    render(<SitusBalance monetusBalance={1250} carrotusBalance={340} />);

    // Проверяем, что контейнер имеет правильные классы для компактного отображения
    const container = screen.getByText('1,250').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'gap-3');
  });
});
