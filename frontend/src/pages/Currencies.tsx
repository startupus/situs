import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { TableColumn } from '../components/ui/Table';
import { Currency } from '../types';
import { apiClient } from '../services/api';

const Currencies: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    decimals: 2,
    description: '',
    color: '#6366f1',
  });

  useEffect(() => {
    fetchCurrencies();
  }, [showInactive]);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getCurrencies({ includeInactive: showInactive });
      setCurrencies(response.data);
    } catch (err) {
      console.error('Error fetching currencies:', err);
      setError('Не удалось загрузить валюты');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCurrency = async () => {
    try {
      setLoading(true);
      await apiClient.createCurrency(newCurrency);
      setShowCreateModal(false);
      setNewCurrency({
        code: '',
        name: '',
        symbol: '',
        decimals: 2,
        description: '',
        color: '#6366f1',
      });
      await fetchCurrencies();
    } catch (err) {
      console.error('Error creating currency:', err);
      setError('Не удалось создать валюту');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCurrency = async (id: string, updates: Partial<Currency>) => {
    try {
      setLoading(true);
      await apiClient.updateCurrency(id, updates);
      setEditingCurrency(null);
      await fetchCurrencies();
    } catch (err) {
      console.error('Error updating currency:', err);
      setError('Не удалось обновить валюту');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateCurrency = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите деактивировать эту валюту?')) {
      return;
    }

    try {
      setLoading(true);
      await apiClient.deactivateCurrency(id);
      await fetchCurrencies();
    } catch (err) {
      console.error('Error deactivating currency:', err);
      setError('Не удалось деактивировать валюту');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: Currency) => {
    return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
  };

  const getStatusBadge = (currency: Currency) => {
    if (currency.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Активна
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircleIcon className="h-3 w-3 mr-1" />
          Неактивна
        </span>
      );
    }
  };

  const getTypeBadge = (currency: Currency) => {
    if (currency.isSystem) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          Системная
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Пользовательская
        </span>
      );
    }
  };

  const columns: TableColumn<Currency>[] = [
    {
      key: 'code',
      label: 'Код',
      width: '100px',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: row.color || '#6366f1' }}
          />
          <span className="font-mono font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Название',
      width: '200px',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {row.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'symbol',
      label: 'Символ',
      width: '80px',
      render: (value) => (
        <span className="font-mono text-lg font-medium">{value}</span>
      ),
    },
    {
      key: 'decimals',
      label: 'Дробные',
      width: '80px',
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'isSystem',
      label: 'Тип',
      width: '120px',
      render: (value, row) => getTypeBadge(row),
    },
    {
      key: 'isActive',
      label: 'Статус',
      width: '100px',
      render: (value, row) => getStatusBadge(row),
    },
    {
      key: 'createdAt',
      label: 'Создана',
      width: '120px',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const filteredCurrencies = currencies.filter(currency => {
    if (!searchTerm) return true;
    return (
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderActions = (currency: Currency) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setEditingCurrency(currency)}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      
      {!currency.isSystem && currency.isActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeactivateCurrency(currency.id)}
        >
          <TrashIcon className="h-4 w-4 text-danger-600" />
        </Button>
      )}
    </div>
  );

  const renderCreateModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Создать новую валюту
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Код валюты</label>
              <input
                type="text"
                className="form-input"
                placeholder="USD, EUR, BTC..."
                value={newCurrency.code}
                onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                maxLength={10}
              />
            </div>
            
            <div>
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-input"
                placeholder="US Dollar, Bitcoin..."
                value={newCurrency.name}
                onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="form-label">Символ</label>
              <input
                type="text"
                className="form-input"
                placeholder="$, €, ₿..."
                value={newCurrency.symbol}
                onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                maxLength={10}
              />
            </div>
            
            <div>
              <label className="form-label">Дробные знаки</label>
              <input
                type="number"
                className="form-input"
                min="0"
                max="18"
                value={newCurrency.decimals}
                onChange={(e) => setNewCurrency({...newCurrency, decimals: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="form-label">Описание</label>
              <textarea
                className="form-input"
                placeholder="Описание валюты..."
                value={newCurrency.description}
                onChange={(e) => setNewCurrency({...newCurrency, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <label className="form-label">Цвет</label>
              <input
                type="color"
                className="form-input h-10"
                value={newCurrency.color}
                onChange={(e) => setNewCurrency({...newCurrency, color: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateCurrency}
              disabled={!newCurrency.code || !newCurrency.name || !newCurrency.symbol}
            >
              Создать
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление валютами</h1>
          <p className="text-sm text-gray-500">
            Создание и управление валютами биллинговой системы
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => fetchCurrencies()}
            loading={loading}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Обновить
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'Скрыть неактивные' : 'Показать неактивные'}
          </Button>
          
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Новая валюта
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Поиск по коду, названию или символу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Всего валют</p>
              <p className="text-lg font-semibold text-gray-900">{currencies.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Активных</p>
              <p className="text-lg font-semibold text-gray-900">
                {currencies.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xs">SYS</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Системных</p>
              <p className="text-lg font-semibold text-gray-900">
                {currencies.filter(c => c.isSystem).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-xs">USR</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Пользовательских</p>
              <p className="text-lg font-semibold text-gray-900">
                {currencies.filter(c => !c.isSystem).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

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
          <Button onClick={fetchCurrencies} variant="primary">
            Повторить попытку
          </Button>
        </Card>
      )}

      {/* Currencies Table */}
      <Table
        data={filteredCurrencies}
        columns={columns}
        loading={loading}
        actions={renderActions}
        emptyMessage="Валюты не найдены"
      />

      {/* Create Modal */}
      {renderCreateModal()}
    </div>
  );
};

export default Currencies;