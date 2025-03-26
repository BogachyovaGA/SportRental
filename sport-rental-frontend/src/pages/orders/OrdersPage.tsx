import React, { useState, useEffect } from 'react';
import { mockGetUserOrders } from '../../services/mock/mockOrderService';
import './OrdersPage.css';

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

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface Order {
  id: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  rentStart: string;
  rentEnd: string;
  customerInfo?: CustomerInfo;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await mockGetUserOrders();
      setOrders(data);
    } catch (error) {
      setError('Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'Ожидает подтверждения',
      active: 'Активный',
      completed: 'Завершен',
      cancelled: 'Отменен'
    };
    return statusMap[status];
  };

  const toggleOrderDetails = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="orders-loading">
      <div className="spinner"></div>
      <p>Загрузка заказов...</p>
    </div>
  );
  
  if (error) return (
    <div className="orders-error">
      <p>Ошибка: {error}</p>
      <button onClick={loadOrders}>Попробовать снова</button>
    </div>
  );

  return (
    <div className="orders-page">
      <h1>История заказов</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>У вас пока нет заказов</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className={`order-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-header-main">
                  <h3>Заказ #{order.id}</h3>
                  <span className={`status ${order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="order-header-info">
                  <p>Дата создания: {formatDate(order.createdAt)}</p>
                  <p>Сумма: {order.totalAmount} ₽</p>
                  <div className="toggle-button">
                    {expandedOrder === order.id ? '▲' : '▼'}
                  </div>
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="order-details">
                  <div className="order-section">
                    <h4>Период аренды:</h4>
                    <p>С {formatDate(order.rentStart)} по {formatDate(order.rentEnd)}</p>
                  </div>
                  
                  {order.customerInfo && (
                    <div className="order-section">
                      <h4>Информация о заказчике:</h4>
                      <p>
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </p>
                      <p>Email: {order.customerInfo.email}</p>
                      <p>Телефон: {order.customerInfo.phone}</p>
                      {order.customerInfo.address && (
                        <p>
                          Адрес: {order.customerInfo.address}, 
                          {order.customerInfo.city}, 
                          {order.customerInfo.postalCode}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="order-section">
                    <h4>Товары:</h4>
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="item-image">
                            <img src={item.product.image} alt={item.product.name} />
                          </div>
                          <div className="item-details">
                            <p className="item-name">{item.product.name}</p>
                            <p className="item-price">{item.pricePerDay} ₽ × {item.days} дней = {item.pricePerDay * item.days} ₽</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="order-total">
                    <p>Итого: <span>{order.totalAmount} ₽</span></p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 