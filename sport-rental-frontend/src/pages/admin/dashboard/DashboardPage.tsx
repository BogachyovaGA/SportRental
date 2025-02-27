import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  mockGetDashboardStats,
  mockGetOrderStats,
  mockGetRevenueReport
} from '../../../services/mock/mockAdminService';
import { mockGetAllOrders } from '../../../services/mock/mockOrderService';
import './DashboardPage.css';

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
  popularProducts: Array<{
    id: number;
    name: string;
    rentCount: number;
  }>;
}

interface OrderStats {
  pending: number;
  active: number;
  completed: number;
  cancelled: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

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
  items: OrderItem[];
  status: string;
  totalAmount: number;
  rentStart: string;
  rentEnd: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadRevenueData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersStatsData, ordersData] = await Promise.all([
        mockGetDashboardStats(),
        mockGetOrderStats(),
        mockGetAllOrders() // Получаем последние 5 заказов
      ]);

      setStats(statsData);
      setOrderStats(ordersStatsData);
      setRecentOrders(ordersData);
    } catch (error) {
      setError('Ошибка при загрузке данных дашборда');
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueData = async () => {
    try {
      const data = await mockGetRevenueReport(dateRange);
      setRevenueData(data.dailyRevenue.map(item => ({
        date: item.date,
        revenue: item.amount
      })));
    } catch (error) {
      console.error('Ошибка при загрузке данных о выручке');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!stats || !orderStats) return null;

  return (
    <div className="admin-dashboard">
      <h1>Панель администратора</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Активные заказы</h3>
          <p className="stat-number">{stats.activeOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Товары в аренде</h3>
          <p className="stat-number">{stats.popularProducts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Общий доход</h3>
          <p className="stat-number">{stats.totalRevenue} ₽</p>
        </div>
      </div>

      <div className="admin-menu">
        <Link to="/admin/products" className="menu-card">
          <h3>Управление товарами</h3>
          <p>Добавление, редактирование и удаление товаров</p>
        </Link>
        
        <Link to="/admin/categories" className="menu-card">
          <h3>Управление категориями</h3>
          <p>Настройка категорий товаров</p>
        </Link>
        
        <Link to="/admin/orders" className="menu-card">
          <h3>Управление заказами</h3>
          <p>Просмотр и обработка заказов</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage; 