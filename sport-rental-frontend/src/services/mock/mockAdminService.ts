import { DASHBOARD_STATS_MOCK } from '../../mocks/apiMocks';

/**
 * Получает общую статистику для панели администратора
 * @returns {Promise} Объект со статистическими данными
 */
export const mockGetDashboardStats = async () => {
  // Имитируем задержку сервера
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalOrders: DASHBOARD_STATS_MOCK.totalOrders,
    activeOrders: DASHBOARD_STATS_MOCK.activeOrders,
    totalRevenue: DASHBOARD_STATS_MOCK.totalRevenue,
    popularProducts: DASHBOARD_STATS_MOCK.popularProducts
  };
};

/**
 * Получает статистику заказов за определенный период
 * @param {Object} dateRange - Период для статистики
 * @param {string} dateRange.startDate - Дата начала периода
 * @param {string} dateRange.endDate - Дата конца периода
 * @returns {Promise} Статистика заказов за период
 */
export const mockGetOrderStats = async (dateRange?: {
  startDate: string;
  endDate: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Возвращаем только объект со статусами, как определено в интерфейсе OrderStats
  return {
    pending: 30,
    active: 45,
    completed: 65,
    cancelled: 10
  };
};

/**
 * Получает отчет о доходах за указанный период
 * @param {Object} dateRange - Период для отчета
 * @param {string} dateRange.startDate - Дата начала периода
 * @param {string} dateRange.endDate - Дата конца периода
 * @returns {Promise} Отчет о доходах
 */
export const mockGetRevenueReport = async (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalRevenue: 250000,
    dailyRevenue: [
      { date: '2024-03-20', amount: 15000 },
      { date: '2024-03-21', amount: 18000 },
      { date: '2024-03-22', amount: 12000 }
    ],
    revenueByCategory: [
      { category: 'Лыжи', amount: 120000 },
      { category: 'Сноуборды', amount: 85000 },
      { category: 'Коньки', amount: 45000 }
    ]
  };
}; 