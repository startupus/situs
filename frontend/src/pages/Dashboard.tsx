import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  UsersIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { DashboardStats, Transaction, Currency } from '../types';
import { apiClient } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Не удалось загрузить данные дашборда');
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'text-success-600',
      pending: 'text-warning-600',
      failed: 'text-danger-600',
      cancelled: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
      cancelled: 'badge-gray',
    };
    return colors[status] || 'badge-gray';
  };

  const renderStatsCards = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="skeleton h-4 w-1/2 mb-2"></div>
              <div className="skeleton h-8 w-3/4"></div>
            </Card>
          ))}
        </div>
      );
    }

    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего пользователей</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-success-600">
                {stats.activeUsers} активных
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCardIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Транзакций</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
              <p className="text-sm text-gray-500">
                за все время
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Общий оборот</p>
              <div className="text-lg font-bold text-gray-900">
                {Object.entries(stats.totalVolume).map(([currency, amount]) => (
                  <div key={currency} className="text-sm">
                    {formatCurrency(amount, currency as Currency)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Пользователи с балансом</p>
              <p className="text-2xl font-bold text-gray-900">{stats.balanceByUsers}</p>
              <p className="text-sm text-gray-500">
                имеют активный баланс
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderSystemHealth = () => {
    if (!stats) return null;

    const { systemHealth } = stats;

    return (
      <Card title="Состояние системы" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircleIcon className="h-6 w-6 text-success-600" />
            </div>
            <p className="text-sm text-gray-500">Время работы</p>
            <p className="text-xl font-bold text-success-600">
              {Math.floor(systemHealth.uptime / 3600)}ч {Math.floor((systemHealth.uptime % 3600) / 60)}м
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ChartBarIcon className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-sm text-gray-500">Время отклика</p>
            <p className="text-xl font-bold text-primary-600">
              {systemHealth.responseTime}ms
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ExclamationTriangleIcon 
                className={`h-6 w-6 ${systemHealth.errorRate > 0.05 ? 'text-danger-600' : 'text-success-600'}`} 
              />
            </div>
            <p className="text-sm text-gray-500">Процент ошибок</p>
            <p className={`text-xl font-bold ${systemHealth.errorRate > 0.05 ? 'text-danger-600' : 'text-success-600'}`}>
              {(systemHealth.errorRate * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </Card>
    );
  };

  const renderRecentTransactions = () => {
    if (!stats || !stats.recentTransactions.length) return null;

    return (
      <Card 
        title="Последние транзакции" 
        headerActions={
          <Link to="/transactions">
            <Button variant="outline" size="sm">
              Все транзакции
            </Button>
          </Link>
        }
      >
        <div className="space-y-4">
          {stats.recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <CreditCardIcon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type === 'deposit' ? 'Пополнение' : 
                     transaction.type === 'charge' ? 'Списание' : 
                     transaction.type === 'refund' ? 'Возврат' : 'Перевод'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${transaction.type === 'deposit' ? 'text-success-600' : 'text-danger-600'}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
                <span className={`badge ${getStatusBadgeColor(transaction.status)}`}>
                  {transaction.status === 'completed' ? 'Завершено' :
                   transaction.status === 'pending' ? 'В обработке' :
                   transaction.status === 'failed' ? 'Ошибка' : 'Отменено'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderQuickActions = () => (
    <Card title="Быстрые действия" className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/users/new">
          <Button variant="outline" fullWidth>
            <UsersIcon className="h-5 w-5 mr-2" />
            Новый пользователь
          </Button>
        </Link>
        <Link to="/transactions/new">
          <Button variant="outline" fullWidth>
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Новая транзакция
          </Button>
        </Link>
        <Link to="/balances">
          <Button variant="outline" fullWidth>
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Управление балансами
          </Button>
        </Link>
        <Link to="/reports">
          <Button variant="outline" fullWidth>
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Отчеты
          </Button>
        </Link>
      </div>
    </Card>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-danger-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchDashboardStats} variant="primary">
            Повторить попытку
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-sm text-gray-500">
            Обзор системы управления биллингом
          </p>
        </div>
        <Button 
          onClick={fetchDashboardStats} 
          variant="outline" 
          size="sm"
          loading={loading}
        >
          Обновить
        </Button>
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* System Health */}
      {renderSystemHealth()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Recent Transactions */}
      {renderRecentTransactions()}
    </div>
  );
};

export default Dashboard;