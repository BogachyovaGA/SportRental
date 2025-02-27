import React, { useState, useEffect } from 'react';
import {
  mockGetAllOrders,
  mockGetOrderById,
  mockUpdateOrderStatus,
  mockUpdateOrderDates
} from '../../../services/mock/mockOrderService';
import { mockGetDashboardStats } from '../../../services/mock/mockAdminService';
import './OrdersManagementPage.css';

interface OrderItem {
  id: number;
  productId: number;
  days: number;
  pricePerDay: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: number;
  userId: string;
  userName: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  rentStart: string;
  rentEnd: string;
}

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
}

const OrdersManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [selectedStatus, dateRange]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const filters = {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined
      };
      const data = await mockGetAllOrders(filters);
      setOrders(data);
    } catch (error) {
      setError('Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await mockGetDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Ошибка при загрузке статистики');
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      await mockUpdateOrderStatus(orderId, newStatus);
      await loadOrders();
      await loadStats();
    } catch (error) {
      setError('Ошибка при обновлении статуса');
    }
  };

  const handleDateChange = async (orderId: number, dates: { rentStart: string; rentEnd: string }) => {
    try {
      await mockUpdateOrderDates(orderId, dates);
      await loadOrders();
    } catch (error) {
      setError('Ошибка при обновлении дат');
    }
  };

  const handleViewDetails = async (orderId: number) => {
    try {
      const orderDetails = await mockGetOrderById(orderId);
      setSelectedOrder(orderDetails);
      setIsModalOpen(true);
    } catch (error) {
      setError('Ошибка при загрузке деталей заказа');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="orders-management">
      <div className="dashboard-stats">
        {stats && (
          <>
            <div className="stat-card">
              <h3>Всего заказов</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Активные заказы</h3>
              <p>{stats.activeOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Общая выручка</h3>
              <p>{stats.totalRevenue} ₽</p>
            </div>
          </>
        )}
      </div>

      <div className="filters">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">Все заказы</option>
          <option value="pending">Ожидающие</option>
          <option value="active">Активные</option>
          <option value="completed">Завершенные</option>
          <option value="cancelled">Отмененные</option>
        </select>

        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
        />
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
        />
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Дата создания</th>
              <th>Период аренды</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userName}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  {new Date(order.rentStart).toLocaleDateString()} -
                  {new Date(order.rentEnd).toLocaleDateString()}
                </td>
                <td>{order.totalAmount} ₽</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                  >
                    <option value="pending">Ожидает</option>
                    <option value="active">Активен</option>
                    <option value="completed">Завершен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    Детали
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Детали заказа #{selectedOrder.id}</h2>
            <div className="order-details">
              <p><strong>Клиент:</strong> {selectedOrder.userName}</p>
              <p><strong>Статус:</strong> {selectedOrder.status}</p>
              <p><strong>Сумма:</strong> {selectedOrder.totalAmount} ₽</p>
              
              <div className="rental-dates">
                <h3>Период аренды</h3>
                <input
                  type="date"
                  value={selectedOrder.rentStart}
                  onChange={(e) => handleDateChange(selectedOrder.id, {
                    rentStart: e.target.value,
                    rentEnd: selectedOrder.rentEnd
                  })}
                />
                <input
                  type="date"
                  value={selectedOrder.rentEnd}
                  onChange={(e) => handleDateChange(selectedOrder.id, {
                    rentStart: selectedOrder.rentStart,
                    rentEnd: e.target.value
                  })}
                />
              </div>

              <div className="order-items">
                <h3>Товары</h3>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="item-info">
                      <p>{item.product.name}</p>
                      <p>{item.days} дней x {item.pricePerDay} ₽</p>
                      <p>Итого: {item.days * item.pricePerDay} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagementPage; 