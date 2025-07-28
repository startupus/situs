import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectOrdersChart from '../ProjectOrdersChart';
import ProjectTrafficChart from '../ProjectTrafficChart';
import ProjectConversionWidget from '../ProjectConversionWidget';
import { projectOrdersData, projectTrafficData, timeLabels, projectConversionData } from '../dashboardData';

// Мокаем ReactApexChart
vi.mock('react-apexcharts', () => ({
  default: ({ options, series, type, height }: any) => (
    <div data-testid="apex-chart" data-type={type} data-height={height}>
      Chart Component
    </div>
  ),
}));

describe('ProjectOrdersChart', () => {
  it('рендерит график заказов с правильными данными', () => {
    render(<ProjectOrdersChart data={projectOrdersData} />);
    
    expect(screen.getByText('Заказы по проектам')).toBeInTheDocument();
    expect(screen.getByText('Количество лидов и заказов за текущий месяц')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('отображает правильный тип графика', () => {
    render(<ProjectOrdersChart data={projectOrdersData} />);
    
    const chart = screen.getByTestId('apex-chart');
    expect(chart).toHaveAttribute('data-type', 'bar');
  });
});

describe('ProjectTrafficChart', () => {
  it('рендерит график посещаемости с правильными данными', () => {
    render(<ProjectTrafficChart data={projectTrafficData} timeLabels={timeLabels} />);
    
    expect(screen.getByText('Динамика посещаемости')).toBeInTheDocument();
    expect(screen.getByText('Тренды посещаемости по проектам')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('отображает правильный тип графика', () => {
    render(<ProjectTrafficChart data={projectTrafficData} timeLabels={timeLabels} />);
    
    const chart = screen.getByTestId('apex-chart');
    expect(chart).toHaveAttribute('data-type', 'line');
  });
});

describe('ProjectConversionWidget', () => {
  it('рендерит виджет конверсии с правильными данными', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    expect(screen.getByText('Конверсия проектов')).toBeInTheDocument();
    expect(screen.getByText('Показатели эффективности по проектам')).toBeInTheDocument();
  });

  it('показывает только первые 4 проекта по умолчанию', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    // Проверяем, что показаны первые 4 проекта
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Website')).toBeInTheDocument();
    expect(screen.getByText('E-commerce Store')).toBeInTheDocument();
    expect(screen.getByText('Blog Platform')).toBeInTheDocument();
    
    // Проверяем, что 5-й проект не показан
    expect(screen.queryByText('Corporate Site')).not.toBeInTheDocument();
  });

  it('показывает кнопку "Подробнее" когда проектов больше 4', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    expect(screen.getByText('Подробнее')).toBeInTheDocument();
  });

  it('разворачивает список при нажатии на "Подробнее"', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    const showMoreButton = screen.getByText('Подробнее');
    fireEvent.click(showMoreButton);
    
    // Проверяем, что теперь показаны все проекты
    expect(screen.getByText('Restaurant Menu')).toBeInTheDocument();
    expect(screen.getByText('Online Course')).toBeInTheDocument();
    expect(screen.getByText('Real Estate')).toBeInTheDocument();
    
    // Кнопка должна измениться на "Скрыть"
    expect(screen.getByText('Скрыть')).toBeInTheDocument();
  });

  it('сворачивает список при нажатии на "Свернуть"', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    const showMoreButton = screen.getByText('Подробнее');
    fireEvent.click(showMoreButton);
    
    const collapseButton = screen.getByText('Скрыть');
    fireEvent.click(collapseButton);
    
    // Проверяем, что 5-й проект снова скрыт
    expect(screen.queryByText('Corporate Site')).not.toBeInTheDocument();
    
    // Кнопка должна вернуться к "Подробнее"
    expect(screen.getByText('Подробнее')).toBeInTheDocument();
  });

  it('отображает правильные показатели конверсии', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    // Проверяем конверсию первого проекта
    expect(screen.getByText('3.2%')).toBeInTheDocument();
    expect(screen.getAllByText('Конверсия')).toHaveLength(4);
  });

  it('отображает правильные показатели дохода', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    // Проверяем доход первого проекта (184000 руб)
    expect(screen.getByText(/184,000/)).toBeInTheDocument();
    expect(screen.getAllByText('Доход')).toHaveLength(4);
  });

  it('отображает тренды с правильными иконками', () => {
    render(<ProjectConversionWidget projects={projectConversionData} />);
    
    // Проверяем тренд первого проекта (up +12.5%)
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });
});

describe('Dashboard Data', () => {
  it('содержит корректные данные для заказов', () => {
    expect(projectOrdersData).toHaveLength(8);
    expect(projectOrdersData[0]).toHaveProperty('projectName');
    expect(projectOrdersData[0]).toHaveProperty('orders');
    expect(typeof projectOrdersData[0].orders).toBe('number');
  });

  it('содержит корректные данные для посещаемости', () => {
    expect(projectTrafficData).toHaveLength(5);
    expect(projectTrafficData[0]).toHaveProperty('projectName');
    expect(projectTrafficData[0]).toHaveProperty('traffic');
    expect(Array.isArray(projectTrafficData[0].traffic)).toBe(true);
  });

  it('содержит корректные временные метки', () => {
    expect(timeLabels).toHaveLength(30);
    expect(timeLabels[0]).toBe('1');
    expect(timeLabels[29]).toBe('30');
  });

  it('содержит корректные данные конверсии', () => {
    expect(projectConversionData).toHaveLength(8);
    expect(projectConversionData[0]).toHaveProperty('id');
    expect(projectConversionData[0]).toHaveProperty('name');
    expect(projectConversionData[0]).toHaveProperty('conversionRate');
    expect(projectConversionData[0]).toHaveProperty('visitors');
    expect(projectConversionData[0]).toHaveProperty('orders');
    expect(projectConversionData[0]).toHaveProperty('revenue');
    expect(projectConversionData[0]).toHaveProperty('trend');
    expect(projectConversionData[0]).toHaveProperty('trendValue');
  });
}); 