import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { TableColumn } from '../components/ui/Table';
import { Transaction, TransactionFilter, PaginatedResponse, Currency } from '../types';
import { apiClient } from '../services/api';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });

  const [sorting, setSorting] = useState<{
    field: keyof Transaction;
    direction: 'asc' | 'desc';
  }>({
    field: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.limit, sorting, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        filters: {
          ...filters,
          ...(searchTerm && { search: searchTerm }),
        },
      };

      const response = await apiClient.getTransactions(params);
      setTransactions(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Не удалось загрузить транзакции');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Transaction, direction: 'asc' | 'desc') => {
    setSorting({ field, direction });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleFilterChange = (newFilters: TransactionFilter) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRefund = async (transactionId: string) => {
    try {
      setLoading(true);
      await apiClient.refundTransaction(transactionId);
      await fetchTransactions();
    } catch (err) {
      console.error('Error refunding transaction:', err);
      setError('Не удалось сделать возврат');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: Currency) => {
    const currencySymbols: Record<Currency, string> = {
      MNT: '₮',
      USD: '$',
      EUR: '€',
      RUB: '₽',
      MRK: 'MRK',
    };
    return `${currencySymbols[currency]}${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
      cancelled: 'badge-gray',
    };
    
    const labels: Record<string, string> = {
      completed: 'Завершено',
      pending: 'В обработке',
      failed: 'Ошибка',
      cancelled: 'Отменено',
    };

    return (
      <span className={`badge ${badges[status] || 'badge-gray'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      deposit: 'badge-success',
      charge: 'badge-danger',
      refund: 'badge-warning',
      transfer: 'badge-primary',
    };
    
    const labels: Record<string, string> = {
      deposit: 'Пополнение',
      charge: 'Списание',
      refund: 'Возврат',
      transfer: 'Перевод',
    };

    return (
      <span className={`badge ${badges[type] || 'badge-gray'}`}>
        {labels[type] || type}
      </span>
    );
  };

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '120px',
      render: (value) => (
        <span className="font-mono text-xs text-gray-500">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Тип',
      width: '120px',
      render: (value) => getTypeBadge(value),
    },
    {
      key: 'amount',
      label: 'Сумма',
      width: '120px',
      sortable: true,
      render: (value, row) => (
        <span className={`font-medium ${row.type === 'deposit' ? 'text-success-600' : 'text-danger-600'}`}>
          {row.type === 'deposit' ? '+' : '-'}
          {formatCurrency(value, row.currency)}
        </span>
      ),
    },
    {
      key: 'currency',
      label: 'Валюта',
      width: '80px',
      render: (value) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      width: '120px',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'userId',
      label: 'Пользователь',
      width: '100px',
      render: (value) => (
        <Link to={`/users/${value}`} className="text-primary-600 hover:text-primary-800">
          {value.substring(0, 8)}...
        </Link>
      ),
    },
    {
      key: 'createdAt',
      label: 'Создано',
      width: '140px',
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'description',
      label: 'Описание',
      render: (value) => (
        <span className="text-sm text-gray-600 max-w-xs truncate block">
          {value || '-'}
        </span>
      ),
    },
  ];

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="form-label">Пользователь</label>
            <input
              type="text"
              className="form-input"
              placeholder="ID пользователя"
              value={filters.userId || ''}
              onChange={(e) => handleFilterChange({ ...filters, userId: e.target.value || undefined })}
            />
          </div>
          
          <div>
            <label className="form-label">Тип</label>
            <select
              className="form-input"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange({ ...filters, type: e.target.value as any || undefined })}
            >
              <option value="">Все типы</option>
              <option value="deposit">Пополнение</option>
              <option value="charge">Списание</option>
              <option value="refund">Возврат</option>
              <option value="transfer">Перевод</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Статус</label>
            <select
              className="form-input"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ ...filters, status: e.target.value as any || undefined })}
            >
              <option value="">Все статусы</option>
              <option value="completed">Завершено</option>
              <option value="pending">В обработке</option>
              <option value="failed">Ошибка</option>
              <option value="cancelled">Отменено</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Валюта</label>
            <select
              className="form-input"
              value={filters.currency || ''}
              onChange={(e) => handleFilterChange({ ...filters, currency: e.target.value as Currency || undefined })}
            >
              <option value="">Все валюты</option>
              <option value="MNT">MNT</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
              <option value="MRK">MRK</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Дата от</label>
            <input
              type="date"
              className="form-input"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange({ ...filters, dateFrom: e.target.value || undefined })}
            />
          </div>
          
          <div>
            <label className="form-label">Дата до</label>
            <input
              type="date"
              className="form-input"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange({ ...filters, dateTo: e.target.value || undefined })}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({});
              setSearchTerm('');
            }}
          >
            Очистить фильтры
          </Button>
          <Button
            variant="primary"
            onClick={fetchTransactions}
          >
            Применить фильтры
          </Button>
        </div>
      </Card>
    );
  };

  const renderActions = (transaction: Transaction) => (
    <div className="flex items-center space-x-2">
      <Link to={`/transactions/${transaction.id}`}>
        <Button variant="ghost" size="sm">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </Link>
      
      {transaction.status === 'completed' && transaction.type !== 'refund' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRefund(transaction.id)}
        >
          <ArrowPathIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Транзакции</h1>
          <p className="text-sm text-gray-500">
            Управление транзакциями биллинговой системы
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => fetchTransactions()}
            loading={loading}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Обновить
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          
          <Link to="/transactions/new">
            <Button variant="primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              Новая транзакция
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Поиск по ID, пользователю, описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                fetchTransactions();
              }
            }}
          />
        </div>
      </Card>

      {/* Filters */}
      {renderFilters()}

      {/* Error State */}
      {error && (
        <Card className="text-center py-8">
          <div className="text-danger-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchTransactions} variant="primary">
            Повторить попытку
          </Button>
        </Card>
      )}

      {/* Transactions Table */}
      <Table
        data={transactions}
        columns={columns}
        loading={loading}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
        }}
        sorting={{
          field: sorting.field,
          direction: sorting.direction,
          onSort: handleSort,
        }}
        actions={renderActions}
        emptyMessage="Транзакции не найдены"
      />
    </div>
  );
};

export default Transactions;