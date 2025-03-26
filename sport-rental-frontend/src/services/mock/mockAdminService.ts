import { DASHBOARD_STATS_MOCK } from '../../mocks/apiMocks';

/*
 * Имитирует получение общей статистики для панели администратора
 * Возвращает основные метрики:
 * - Общее количество заказов
 * - Количество активных заказов
 * - Общая выручка
 * - Список популярных продуктов
 */
export const mockGetDashboardStats = async () => {
  // Имитируем задержку сервера в 1 секунду для реалистичности
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Возвращаем данные из мока, структурируя их согласно интерфейсу
  return {
    totalOrders: DASHBOARD_STATS_MOCK.totalOrders,    // Общее число заказов
    activeOrders: DASHBOARD_STATS_MOCK.activeOrders,  // Число активных заказов
    totalRevenue: DASHBOARD_STATS_MOCK.totalRevenue,  // Общая выручка
    popularProducts: DASHBOARD_STATS_MOCK.popularProducts  // Массив популярных товаров
  };
};

/*
 * Имитирует получение статистики заказов за указанный период
 * Возвращает количество заказов в разных статусах:
 * - В ожидании (pending)
 * - Активные (active)
 * - Завершенные (completed)
 * - Отмененные (cancelled)
 */
export const mockGetOrderStats = async (dateRange?: {
  startDate: string;
  endDate: string;
}) => {
  // Имитируем задержку сервера
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Возвращаем фиксированные значения для каждого статуса
  // В реальном API эти данные были бы отфильтрованы по dateRange
  return {
    pending: 30,    // Заказов в ожидании
    active: 45,     // Активных заказов
    completed: 65,  // Завершенных заказов
    cancelled: 10   // Отмененных заказов
  };
};

/*
 * Имитирует получение отчета о доходах за указанный период
 * Возвращает:
 * - Общую сумму дохода
 * - Ежедневную статистику доходов
 * - Распределение доходов по категориям товаров
 */
export const mockGetRevenueReport = async (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  // Имитируем задержку сервера
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Возвращаем объект с тремя типами данных о доходах
  return {
    // Общая сумма дохода за период
    totalRevenue: 250000,
    
    // Массив с ежедневной статистикой
    dailyRevenue: [
      { date: '2024-03-20', amount: 15000 },  // Доход за 20 марта
      { date: '2024-03-21', amount: 18000 },  // Доход за 21 марта
      { date: '2024-03-22', amount: 12000 }   // Доход за 22 марта
    ],
    
    // Распределение дохода по категориям товаров
    revenueByCategory: [
      { category: 'Лыжи', amount: 120000 },      // Доход от лыж
      { category: 'Сноуборды', amount: 85000 },  // Доход от сноубордов
      { category: 'Коньки', amount: 45000 }      // Доход от коньков
    ]
  };
}; 