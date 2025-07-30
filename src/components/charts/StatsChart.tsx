import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

/**
 * Типы графиков
 */
export type ChartType = 'line' | 'bar' | 'doughnut';

/**
 * Интерфейс данных для графика
 */
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

/**
 * Пропсы компонента StatsChart
 */
export interface StatsChartProps {
  type: ChartType;
  data: ChartData;
  title?: string;
  height?: number;
  width?: number;
  className?: string;
  options?: any;
  showLegend?: boolean;
  showTooltip?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Компонент StatsChart - Универсальный компонент для отображения графиков
 */
const StatsChart: React.FC<StatsChartProps> = ({
  type,
  data,
  title,
  height = 300,
  width,
  className = '',
  options: customOptions = {},
  showLegend = true,
  showTooltip = true,
  theme = 'light'
}) => {
  // Цветовая схема для темной и светлой темы
  const colors = {
    light: {
      background: '#ffffff',
      border: '#e5e7eb',
      text: '#374151',
      grid: '#f3f4f6',
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      danger: '#ef4444'
    },
    dark: {
      background: '#1f2937',
      border: '#374151',
      text: '#f9fafb',
      grid: '#374151',
      primary: '#60a5fa',
      secondary: '#34d399',
      accent: '#fbbf24',
      danger: '#f87171'
    }
  };

  const currentColors = colors[theme];

  // Дефолтные цвета для датасетов
  const defaultColors = [
    currentColors.primary,
    currentColors.secondary,
    currentColors.accent,
    currentColors.danger,
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16'  // lime
  ];

  // Обработка данных с применением цветовой схемы
  const processedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || (
        type === 'doughnut' 
          ? defaultColors.slice(0, data.labels.length)
          : `${defaultColors[index % defaultColors.length]}20`
      ),
      borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
      borderWidth: dataset.borderWidth || 2,
      tension: dataset.tension || 0.4
    }))
  };

  // Базовые опции для всех типов графиков
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          color: currentColors.text,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        color: currentColors.text,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: showTooltip,
        backgroundColor: currentColors.background,
        titleColor: currentColors.text,
        bodyColor: currentColors.text,
        borderColor: currentColors.border,
        borderWidth: 1
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        display: true,
        grid: {
          color: currentColors.grid,
          drawBorder: false
        },
        ticks: {
          color: currentColors.text,
          font: {
            size: 11
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: currentColors.grid,
          drawBorder: false
        },
        ticks: {
          color: currentColors.text,
          font: {
            size: 11
          }
        }
      }
    } : undefined,
    ...customOptions
  };

  // Контейнер для графика
  const chartStyle = {
    height: `${height}px`,
    width: width ? `${width}px` : '100%',
  };

  const containerClasses = `
    p-4 rounded-lg border
    ${theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200'
    }
    ${className}
  `.trim();

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={processedData} options={baseOptions} />;
      case 'bar':
        return <Bar data={processedData} options={baseOptions} />;
      case 'doughnut':
        return <Doughnut data={processedData} options={baseOptions} />;
      default:
        return <div>Неподдерживаемый тип графика</div>;
    }
  };

  return (
    <div className={containerClasses}>
      <div style={chartStyle}>
        {renderChart()}
      </div>
    </div>
  );
};

export default StatsChart;