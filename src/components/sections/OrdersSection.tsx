import React, { useEffect, useState } from 'react';
import { DemoAPI } from '../../api/services/demo.api';
import { 
  FiShoppingBag, FiMail, FiPhone, FiUser, FiCalendar, 
  FiClock, FiDollarSign, FiPackage, FiFilter, FiSearch,
  FiEye, FiCheck, FiX, FiMoreHorizontal, FiBell
} from 'react-icons/fi';

interface Order {
  id: string;
  type: 'ecommerce' | 'contact' | 'callback';
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount?: number;
  currency?: string;
  items?: OrderItem[];
  message?: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const OrdersSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'ecommerce' | 'contact'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await DemoAPI.orders();
        const list = (resp as any)?.data || [];
        if (mounted) setOrders(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (activeTab !== 'all') {
      if (activeTab === 'new') {
        filtered = filtered.filter(order => order.status === 'new');
      } else {
        filtered = filtered.filter(order => order.type === activeTab);
      }
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'ecommerce': return FiShoppingBag;
      case 'contact': return FiMail;
      case 'callback': return FiPhone;
      default: return FiPackage;
    }
  };

  const getOrderTypeName = (type: string) => {
    switch (type) {
      case 'ecommerce': return 'Заказ';
      case 'contact': return 'Заявка';
      case 'callback': return 'Обратный звонок';
      default: return 'Заявка';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'processing': return 'В работе';
      case 'completed': return 'Выполнен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} дн. назад`;
    } else if (diffHours > 0) {
      return `${diffHours} ч. назад`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} мин. назад`;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // Здесь будет логика обновления статуса
    console.log(`Изменение статуса заказа ${orderId} на ${newStatus}`);
  };

  const newOrdersCount = orders.filter(order => order.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Заголовок с уведомлением о новых заказах */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Заказы и заявки</h2>
          {newOrdersCount > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-900 rounded-full">
              <FiBell className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {newOrdersCount} новых
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Фильтр по статусу */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="processing">В работе</option>
            <option value="completed">Выполненные</option>
            <option value="cancelled">Отмененные</option>
          </select>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FiBell className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Новые</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'new').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">В работе</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Заказы</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.type === 'ecommerce').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Выручка</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.type === 'ecommerce' && o.status === 'completed')
                  .reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()} ₽
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'all', label: 'Все', count: orders.length },
            { id: 'new', label: 'Новые', count: orders.filter(o => o.status === 'new').length },
            { id: 'ecommerce', label: 'Заказы', count: orders.filter(o => o.type === 'ecommerce').length },
            { id: 'contact', label: 'Заявки', count: orders.filter(o => o.type !== 'ecommerce').length }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{label}</span>
              {count > 0 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Список заказов */}
      <div className="space-y-4">
        {getFilteredOrders().map((order) => {
          const TypeIcon = getOrderTypeIcon(order.type);
          return (
            <div
              key={order.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 ${getPriorityColor(order.priority)}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <TypeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {order.id}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusName(order.status)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {getOrderTypeName(order.type)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <FiUser className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white font-medium">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {order.customerEmail}
                            </span>
                          </div>
                          {order.customerPhone && (
                            <div className="flex items-center space-x-2">
                              <FiPhone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {order.customerPhone}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {order.amount && (
                          <div className="flex items-center space-x-2">
                            <FiDollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {order.amount.toLocaleString()} {order.currency}
                            </span>
                            {order.items && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({order.items.reduce((sum, item) => sum + item.quantity, 0)} товаров)
                              </span>
                            )}
                          </div>
                        )}
                        
                        {order.message && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {order.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatTime(order.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      
                      {order.status === 'new' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'processing')}
                          className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FiMoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {getFilteredOrders().length === 0 && (
        <div className="text-center py-12">
          <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Заказов не найдено
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Заказы и заявки будут отображаться здесь
          </p>
        </div>
      )}

      {/* Модальное окно детального просмотра */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Детали {selectedOrder.type === 'ecommerce' ? 'заказа' : 'заявки'} {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Информация о клиенте */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Информация о клиенте
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedOrder.customerEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {selectedOrder.customerEmail}
                      </a>
                    </div>
                    {selectedOrder.customerPhone && (
                      <div className="flex items-center space-x-3">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${selectedOrder.customerPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {selectedOrder.customerPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Товары (для e-commerce заказов) */}
                {selectedOrder.items && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      Товары
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {(item.price * item.quantity).toLocaleString()} ₽
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-semibold text-gray-900 dark:text-white">Итого:</span>
                        <span className="font-semibold text-lg text-gray-900 dark:text-white">
                          {selectedOrder.amount?.toLocaleString()} {selectedOrder.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Сообщение */}
                {selectedOrder.message && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      Сообщение
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {selectedOrder.message}
                    </p>
                  </div>
                )}
                
                {/* Действия */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Закрыть
                  </button>
                  {selectedOrder.status === 'new' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'processing');
                        setSelectedOrder(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Взять в работу
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection; 