import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ServiceOrder {
  id: string;
  orderNumber: string;
  projectName: string;
  customerName: string;
  customerEmail: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled' | 'paid';
  amount: number;
  date: Date;
  serviceName: string;
  description: string;
  deadline?: Date;
  duration?: string;
}

const SitusOrdersServices: React.FC = () => {
  const [orders] = useState<ServiceOrder[]>([
    {
      id: "2",
      orderNumber: "#SRV-2024-002",
      projectName: "Студия веб-разработки",
      customerName: "Анна Сидорова",
      customerEmail: "anna@company.com",
      status: "processing",
      amount: 120000,
      date: new Date("2024-01-14T14:20:00"),
      serviceName: "Разработка корпоративного сайта",
      description: "Создание современного адаптивного сайта с админ-панелью",
      deadline: new Date("2024-02-28"),
      duration: "45 дней"
    },
    {
      id: "5",
      orderNumber: "#SRV-2024-005",
      projectName: "Агентство маркетинга",
      customerName: "ООО Успех",
      customerEmail: "order@success.com",
      status: "completed",
      amount: 85000,
      date: new Date("2024-01-10T16:45:00"),
      serviceName: "SMM продвижение",
      description: "Полное ведение социальных сетей на 3 месяца",
      duration: "3 месяца"
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    { id: 'all', name: 'Все проекты' },
    { id: 'project-2', name: 'Студия веб-разработки' },
    { id: 'project-5', name: 'Агентство маркетинга' }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'processing': return 'В работе';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      case 'paid': return 'Оплачен';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesProject = selectedProject === 'all' || order.projectName.includes(selectedProject);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProject && matchesStatus && matchesSearch;
  });

  const getDaysLeft = (deadline?: Date) => {
    if (!deadline) return null;
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark dark:text-white">
              Заказы услуг
            </h1>
            <p className="mt-2 text-body-color dark:text-dark-6">
              Управление заказами услуг и консультаций
            </p>
          </div>
          <Link
            to="/orders"
            className="text-primary hover:text-primary/80"
          >
            ← Все заказы
          </Link>
        </div>
      </div>

      {/* Фильтры */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по услугам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[50px] w-full rounded-lg border border-stroke bg-white pl-14 pr-6 text-base text-body-color outline-hidden focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z" fill="#637381"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.957 11.958C12.2499 11.6651 12.7247 11.6651 13.0176 11.958L16.2801 15.2205C16.573 15.5133 16.573 15.9882 16.2801 16.2811C15.9872 16.574 15.5124 16.574 15.2195 16.2811L11.957 13.0186C11.6641 12.7257 11.6641 12.2508 11.957 11.958Z" fill="#637381"/>
              </svg>
            </span>
          </div>

          <div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="h-[50px] w-full rounded-lg border border-stroke bg-white px-6 text-base text-body-color outline-hidden focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-[50px] w-full rounded-lg border border-stroke bg-white px-6 text-base text-body-color outline-hidden focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="processing">В работе</option>
              <option value="paid">Оплачены</option>
              <option value="completed">Завершены</option>
              <option value="cancelled">Отменены</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setSelectedProject('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="h-[50px] w-full rounded-lg border border-stroke bg-white px-6 text-body-color hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      {/* Список заказов */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="rounded-lg bg-white p-6 shadow dark:bg-dark-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dark dark:text-white">
                    {order.orderNumber} - {order.serviceName}
                  </h3>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-body-color dark:text-dark-6">{order.description}</p>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-body-color dark:text-dark-6">Клиент</p>
                    <p className="font-medium text-dark dark:text-white">{order.customerName}</p>
                    <p className="text-sm text-body-color dark:text-dark-6">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-body-color dark:text-dark-6">Проект</p>
                    <p className="font-medium text-dark dark:text-white">{order.projectName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-body-color dark:text-dark-6">Дата заказа</p>
                    <p className="font-medium text-dark dark:text-white">{formatDateTime(order.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-body-color dark:text-dark-6">Длительность</p>
                    <p className="font-medium text-dark dark:text-white">{order.duration || 'Не указано'}</p>
                  </div>
                </div>

                {order.deadline && (
                  <div className="mb-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                          Дедлайн: {formatDate(order.deadline)}
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-300">
                          {getDaysLeft(order.deadline) !== null && getDaysLeft(order.deadline)! > 0 
                            ? `Осталось: ${getDaysLeft(order.deadline)} дней`
                            : getDaysLeft(order.deadline) === 0
                              ? 'Дедлайн сегодня!'
                              : 'Дедлайн просрочен!'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-dark dark:text-white">
                    Стоимость: {formatAmount(order.amount)}
                  </div>
                  <div className="flex space-x-3">
                    <button className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90">
                      Открыть проект
                    </button>
                    <button className="rounded-lg border border-stroke px-4 py-2 text-body-color transition-colors hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6">
                      Связаться с клиентом
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-dark-2">
          <svg
            className="mx-auto h-12 w-12 text-body-color dark:text-dark-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-dark dark:text-white">
            Заказы услуг не найдены
          </h3>
          <p className="mt-1 text-sm text-body-color dark:text-dark-6">
            Попробуйте изменить фильтры или параметры поиска.
          </p>
        </div>
      )}
    </div>
  );
};

export default SitusOrdersServices; 