import { API_BASE_URL, getAuthHeader } from '../config/api.config';

// Методы для пользователей
export const getUserOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/my`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении заказов пользователя:', error);
    throw error;
  }
};

export const createOrder = async (orderData: {
  rentStart: string;
  rentEnd: string;
  items: Array<{ productId: number; days: number }>;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};

// Методы для администраторов
export const getAllOrders = async (filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const response = await fetch(`${API_BASE_URL}/admin/orders?${queryParams}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении всех заказов:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении заказа ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: number,
  status: 'pending' | 'active' | 'completed' | 'cancelled'
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при обновлении статуса заказа ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderDates = async (
  orderId: number,
  dates: { rentStart: string; rentEnd: string }
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/dates`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(dates),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при обновлении дат заказа ${orderId}:`, error);
    throw error;
  }
}; 