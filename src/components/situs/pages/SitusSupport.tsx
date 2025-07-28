import React, { useState } from "react";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  createdAt: Date;
  updatedAt: Date;
  responses: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: "TICK-001",
    title: "Проблема с подключением API",
    description: "Не могу подключиться к API компонентов. Получаю ошибку 401",
    status: "open",
    priority: "high",
    category: "technical",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    responses: 0
  },
  {
    id: "TICK-002", 
    title: "Вопрос по тарифам",
    description: "Хотел бы узнать подробности о корпоративном тарифе",
    status: "in_progress",
    priority: "medium",
    category: "billing",
    createdAt: new Date("2024-01-14T14:20:00"),
    updatedAt: new Date("2024-01-15T09:15:00"),
    responses: 2
  },
  {
    id: "TICK-003",
    title: "Предложение новой функции",
    description: "Было бы здорово добавить поддержку dark mode для всех компонентов",
    status: "closed",
    priority: "low",
    category: "feature",
    createdAt: new Date("2024-01-12T16:45:00"),
    updatedAt: new Date("2024-01-14T11:30:00"),
    responses: 4
  },
  {
    id: "TICK-004",
    title: "Ошибка в компоненте Modal",
    description: "Модальное окно не закрывается при нажатии на overlay",
    status: "open",
    priority: "urgent",
    category: "bug",
    createdAt: new Date("2024-01-15T12:00:00"),
    updatedAt: new Date("2024-01-15T12:00:00"),
    responses: 0
  },
  {
    id: "TICK-005",
    title: "Помощь с интеграцией",
    description: "Нужна консультация по интеграции TailGrids в существующий проект",
    status: "in_progress",
    priority: "medium",
    category: "other",
    createdAt: new Date("2024-01-13T09:30:00"),
    updatedAt: new Date("2024-01-15T08:45:00"),
    responses: 3
  }
];

const SitusSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Открыт';
      case 'in_progress': return 'В работе';
      case 'closed': return 'Закрыт';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Срочно';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'technical': return 'Техническая';
      case 'billing': return 'Биллинг';
      case 'feature': return 'Функции';
      case 'bug': return 'Ошибка';
      case 'other': return 'Другое';
      default: return category;
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatistics = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    
    return { total, open, inProgress, closed };
  };

  const stats = getStatistics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Заголовок и статистика */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark dark:text-white">
              Поддержка
            </h1>
            <p className="mt-2 text-body-color dark:text-dark-6">
              Управление обращениями в службу поддержки
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90">
              Создать обращение
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-body-color dark:text-dark-6">Всего обращений</p>
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
                <p className="text-sm font-medium text-body-color dark:text-dark-6">Открытых</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{stats.open}</p>
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
                <p className="text-sm font-medium text-body-color dark:text-dark-6">В работе</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{stats.inProgress}</p>
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
                <p className="text-sm font-medium text-body-color dark:text-dark-6">Закрытых</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{stats.closed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-dark-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Поиск
            </label>
            <input
              type="text"
              placeholder="Поиск по названию, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark placeholder-dark-5 outline-hidden focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
            >
              <option value="all">Все статусы</option>
              <option value="open">Открытые</option>
              <option value="in_progress">В работе</option>
              <option value="closed">Закрытые</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Приоритет
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark outline-hidden focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
            >
              <option value="all">Все приоритеты</option>
              <option value="urgent">Срочно</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setSearchQuery('');
              }}
              className="w-full rounded-lg border border-stroke px-3 py-2 text-dark transition-colors hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      {/* Список обращений */}
      <div className="rounded-lg bg-white shadow dark:bg-dark-2">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-stroke dark:divide-dark-3">
            <thead className="bg-gray-50 dark:bg-dark-3">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Обращение
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Приоритет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Ответы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-body-color dark:text-dark-6">
                  Обновлено
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke bg-white dark:divide-dark-3 dark:bg-dark-2">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-dark-3">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {ticket.title}
                        </p>
                        <span className="ml-2 text-xs text-body-color dark:text-dark-6">
                          #{ticket.id}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-body-color dark:text-dark-6 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                    {getCategoryText(ticket.category)}
                  </td>
                  <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                    {ticket.responses}
                  </td>
                  <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                    {formatDate(ticket.updatedAt)}
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

        {filteredTickets.length === 0 && (
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
              Обращения не найдены
            </h3>
            <p className="mt-1 text-sm text-body-color dark:text-dark-6">
              Попробуйте изменить фильтры или создать новое обращение.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitusSupport; 