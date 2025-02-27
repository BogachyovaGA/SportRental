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

interface Order {
  id: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  rentStart: string;
  rentEnd: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

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
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Заказ #{order.id}</h3>
                <span className={`status ${order.status}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="order-details">
                <p>Дата создания: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Период аренды: {new Date(order.rentStart).toLocaleDateString()} - {new Date(order.rentEnd).toLocaleDateString()}</p>
                
                <div className="order-items">
                  <h4>Товары:</h4>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>
                        <img src={item.product.image} alt={item.product.name} />
                        <span>{item.product.name} - {item.days} дней</span>
                        <span>{item.pricePerDay * item.days} ₽</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p className="order-total">Итого: {order.totalAmount} ₽</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 