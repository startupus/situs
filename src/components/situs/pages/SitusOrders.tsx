import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Order {
  id: string;
  orderNumber: string;
  projectName: string;
  projectId: string;
  customerName: string;
  customerEmail: string;
  type: 'product' | 'service' | 'form';
  status: 'new' | 'processing' | 'completed' | 'cancelled' | 'paid';
  amount: number;
  currency: string;
  date: Date;
  description: string;
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const SitusOrders: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "#ORD-2024-001",
      projectName: "Интернет-магазин электроники",
      projectId: "project-1",
      customerName: "Иван Петров",
      customerEmail: "ivan@example.com",
      type: "product",
      status: "new",
      amount: 45000,
      currency: "RUB",
      date: new Date("2024-01-15T10:30:00"),
      description: "Заказ смартфона и аксессуаров",
      items: [
        { name: "iPhone 15 Pro", quantity: 1, price: 42000 },
        { name: "Чехол", quantity: 1, price: 3000 }
      ]
    },
    {
      id: "2",
      orderNumber: "#ORD-2024-002",
      projectName: "Студия веб-разработки",
      projectId: "project-2",
      customerName: "Анна Сидорова",
      customerEmail: "anna@company.com",
      type: "service",
      status: "processing",
      amount: 120000,
      currency: "RUB",
      date: new Date("2024-01-14T14:20:00"),
      description: "Разработка корпоративного сайта"
    },
    {
      id: "3",
      orderNumber: "#FORM-2024-003",
      projectName: "Лендинг консультации",
      projectId: "project-3",
      customerName: "Михаил Козлов",
      customerEmail: "mikhail@domain.com",
      type: "form",
      status: "new",
      amount: 0,
      currency: "RUB",
      date: new Date("2024-01-15T12:00:00"),
      description: "Заявка на бесплатную консультацию"
    },
    {
      id: "4",
      orderNumber: "#ORD-2024-004",
      projectName: "Интернет-магазин одежды",
      projectId: "project-4",
      customerName: "Елена Волкова",
      customerEmail: "elena@mail.ru",
      type: "product",
      status: "paid",
      amount: 15600,
      currency: "RUB",
      date: new Date("2024-01-13T09:15:00"),
      description: "Заказ зимней коллекции"
    },
    {
      id: "5",
      orderNumber: "#SRV-2024-005",
      projectName: "Агентство маркетинга",
      projectId: "project-5",
      customerName: "ООО Успех",
      customerEmail: "order@success.com",
      type: "service",
      status: "completed",
      amount: 85000,
      currency: "RUB",
      date: new Date("2024-01-10T16:45:00"),
      description: "SMM продвижение на 3 месяца"
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    { id: 'all', name: 'Все проекты' },
    { id: 'project-1', name: 'Интернет-магазин электроники' },
    { id: 'project-2', name: 'Студия веб-разработки' },
    { id: 'project-3', name: 'Лендинг консультации' },
    { id: 'project-4', name: 'Интернет-магазин одежды' },
    { id: 'project-5', name: 'Агентство маркетинга' }
  ];

  const getTypeText = (type: string) => {
    switch (type) {
      case 'product': return 'Товар';
      case 'service': return 'Услуга';
      case 'form': return 'Форма';
      default: return type;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'processing': return 'Обработка';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'service':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'form':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    if (amount === 0) return 'Бесплатно';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesProject = selectedProject === 'all' || order.projectId === selectedProject;
    const matchesType = selectedType === 'all' || order.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProject && matchesType && matchesStatus && matchesSearch;
  });

  const getStatistics = () => {
    const total = orders.length;
    const newOrders = orders.filter(o => o.status === 'new').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const completed = orders.filter(o => o.status === 'completed' || o.status === 'paid').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed' || o.status === 'paid')
      .reduce((sum, o) => sum + o.amount, 0);

    return { total, newOrders, processing, completed, totalRevenue };
  };

  const stats = getStatistics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Заголовок и статистика */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark dark:text-white">
              Заказы
            </h1>
            <p className="mt-2 text-body-color dark:text-dark-6">
              Управление заказами из всех проектов
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/orders/analytics"
              className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              Аналитика заказов
            </Link>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-body-color dark:text-dark-6">Всего заказов</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-body-color dark:text-dark-6">Новые</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{stats.newOrders}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-body-color dark:text-dark-6">В обработке</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-body-color dark:text-dark-6">Завершено</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-body-color dark:text-dark-6">Выручка</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">
                  {formatAmount(stats.totalRevenue, 'RUB')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white">Фильтры</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* Поиск */}
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по номеру, клиенту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[50px] w-full rounded-lg border border-stroke bg-white pl-14 pr-6 text-base text-body-color outline-hidden focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                  fill="#637381"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.957 11.958C12.2499 11.6651 12.7247 11.6651 13.0176 11.958L16.2801 15.2205C16.573 15.5133 16.573 15.9882 16.2801 16.2811C15.9872 16.574 15.5124 16.574 15.2195 16.2811L11.957 13.0186C11.6641 12.7257 11.6641 12.2508 11.957 11.958Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>

          {/* Проект */}
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

          {/* Тип */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-[50px] w-full rounded-lg border border-stroke bg-white px-6 text-base text-body-color outline-hidden focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            >
              <option value="all">Все типы</option>
              <option value="product">Товары</option>
              <option value="service">Услуги</option>
              <option value="form">Обратная связь</option>
            </select>
          </div>

          {/* Статус */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-[50px] w-full rounded-lg border border-stroke bg-white px-6 text-base text-body-color outline-hidden focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="processing">Обработка</option>
              <option value="paid">Оплачены</option>
              <option value="completed">Завершены</option>
              <option value="cancelled">Отменены</option>
            </select>
          </div>

          {/* Сброс */}
          <div>
            <button
              onClick={() => {
                setSelectedProject('all');
                setSelectedType('all');
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

      {/* Таблица заказов */}
      <div className="rounded-lg bg-white shadow dark:bg-dark-2">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-stroke dark:divide-dark-3">
            <thead className="bg-gray-50 dark:bg-dark-3">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Заказ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Проект
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Дата
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke bg-white dark:divide-dark-3 dark:bg-dark-2">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-3">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-dark dark:text-white">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-body-color dark:text-dark-6 line-clamp-2">
                        {order.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-dark dark:text-white">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-body-color dark:text-dark-6">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                    <Link
                      to={`/projects/${order.projectId}`}
                      className="text-primary hover:text-primary/80"
                    >
                      {order.projectName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(order.type)}`}>
                      {getTypeText(order.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
                    {formatAmount(order.amount, order.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary/80">
                      Открыть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-dark dark:text-white">
              Заказы не найдены
            </h3>
            <p className="mt-1 text-sm text-body-color dark:text-dark-6">
              Попробуйте изменить фильтры или параметры поиска.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitusOrders; 