import { API_BASE_URL, getAuthHeader } from '../config/api.config';

export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    throw error;
  }
};

export const getOrderStats = async (dateRange?: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (dateRange) {
      queryParams.append('startDate', dateRange.startDate);
      queryParams.append('endDate', dateRange.endDate);
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/dashboard/order-stats?${queryParams}`,
      {
        headers: getAuthHeader(),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении статистики заказов:', error);
    throw error;
  }
};

export const getRevenueReport = async (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const queryParams = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await fetch(
      `${API_BASE_URL}/admin/dashboard/revenue?${queryParams}`,
      {
        headers: getAuthHeader(),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении отчета о доходах:', error);
    throw error;
  }
}; 