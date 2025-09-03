import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ProjectTrafficChartProps {
  data: {
    projectName: string;
    traffic: number[];
  }[];
  timeLabels: string[];
}

const ProjectTrafficChart: React.FC<ProjectTrafficChartProps> = ({ data, timeLabels }) => {
  const series = data.map((project) => ({
    name: project.projectName,
    data: project.traffic,
  }));

  const options = {
    legend: {
      show: false,
      position: 'top' as const,
      horizontalAlign: 'left' as const,
    },
    colors: ['#3758F9', '#13C296', '#F2994A', '#E53E3E', '#805AD5'],
    chart: {
      fontFamily: 'Inter, sans-serif',
      height: 450,
      type: 'line' as const,
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [4, 4, 4, 4, 4],
      curve: 'smooth' as const,
    },
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      type: 'category' as const,
      categories: timeLabels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Посетители',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: '#64748B',
        },
      },
      min: 0,
      max: 1000,
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + ' посетителей';
        },
      },
    },
  };

  return (
    <div className="mx-auto w-full max-w-[760px] rounded-lg border border-stroke bg-white px-5 pb-5 pt-[30px] dark:border-dark-3 dark:bg-dark-2 sm:px-[30px]">
      <div className="flex justify-between">
        <div>
          <h5 className="text-xl font-semibold text-dark dark:text-white">Динамика посещаемости</h5>
          <p className="text-sm text-body-color dark:text-dark-6 sm:text-base">Тренды посещаемости по проектам</p>
        </div>
        <div>
          <div className="relative z-20 inline-block rounded-md bg-transparent">
            <select className="relative z-20 inline-flex appearance-none rounded-md border border-stroke bg-transparent py-[7px] pl-3 pr-10 text-base text-body-color outline-hidden dark:border-dark-3 dark:text-dark-6">
              <option value="" className="dark:bg-dark-2">
                Месяц
              </option>
              <option value="" className="dark:bg-dark-2">
                Квартал
              </option>
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-body-color dark:text-dark-6">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path d="M9 12.8249C8.83125 12.8249 8.69062 12.7687 8.55 12.6562L2.08125 6.2999C1.82812 6.04678 1.82812 5.65303 2.08125 5.3999C2.33437 5.14678 2.72812 5.14678 2.98125 5.3999L9 11.278L15.0187 5.34365C15.2719 5.09053 15.6656 5.09053 15.9187 5.34365C16.1719 5.59678 16.1719 5.99053 15.9187 6.24365L9.45 12.5999C9.30937 12.7405 9.16875 12.8249 9 12.8249Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div id="chartTwo" className="-mx-5">
        <ReactApexChart options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default ProjectTrafficChart;
