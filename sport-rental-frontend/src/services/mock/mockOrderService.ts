import { ORDERS_MOCK, DASHBOARD_STATS_MOCK, REVENUE_REPORT_MOCK } from '../../mocks/apiMocks';

export const mockGetUserOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ORDERS_MOCK;
};

export const mockCreateOrder = async (orderData: {
  rentStart: string;
  rentEnd: string;
  items: Array<{ productId: number; days: number }>;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: Math.floor(Math.random() * 1000),
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
};

// Админские методы
export const mockGetAllOrders = async (filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  let filteredOrders = [...ORDERS_MOCK];
  
  if (filters?.status) {
    filteredOrders = filteredOrders.filter(order => order.status === filters.status);
  }
  
  return filteredOrders;
};

export const mockGetDashboardStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return DASHBOARD_STATS_MOCK;
};

export const mockGetRevenueReport = async (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return REVENUE_REPORT_MOCK;
}; 