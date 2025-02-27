import { API_BASE_URL, getAuthHeader } from '../config/api.config';

// ========== Методы для обычных пользователей ==========

//Получает список заказов текущего пользователя
export const getUserOrders = async () => {
  try {
    // Отправляем GET запрос для получения заказов пользователя
    const response = await fetch(`${API_BASE_URL}/orders/my`, {
      headers: getAuthHeader(), // Добавляем заголовки авторизации
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем список заказов
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку получения заказов
    console.error('Ошибка при получении заказов пользователя:', error);
    throw error;
  }
};

//Создает новый заказ
export const createOrder = async (orderData: {
  rentStart: string;
  rentEnd: string;
  items: Array<{ productId: number; days: number }>;
}) => {
  try {
    // Отправляем POST запрос для создания заказа
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(orderData), // Преобразуем данные в JSON
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем данные созданного заказа
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку создания заказа
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};

// ========== Методы для администраторов ==========

//Получает список всех заказов с возможностью фильтрации (только для админов)
export const getAllOrders = async (filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    // Создаем объект для параметров запроса
    const queryParams = new URLSearchParams();
    
    // Если есть фильтры, добавляем их в параметры запроса
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    // Отправляем GET запрос с параметрами фильтрации
    const response = await fetch(`${API_BASE_URL}/admin/orders?${queryParams}`, {
      headers: getAuthHeader(),
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем список заказов
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку получения заказов
    console.error('Ошибка при получении всех заказов:', error);
    throw error;
  }
};

//Получает детальную информацию о конкретном заказе (только для админов)
export const getOrderById = async (orderId: number) => {
  try {
    // Отправляем GET запрос для получения информации о заказе
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      headers: getAuthHeader(),
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем данные заказа
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку получения заказа
    console.error(`Ошибка при получении заказа ${orderId}:`, error);
    throw error;
  }
};

//Обновляет статус заказа (только для админов)
export const updateOrderStatus = async (
  orderId: number,
  status: 'pending' | 'active' | 'completed' | 'cancelled'
) => {
  try {
    // Отправляем PUT запрос для обновления статуса
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем обновленные данные заказа
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку обновления статуса
    console.error(`Ошибка при обновлении статуса заказа ${orderId}:`, error);
    throw error;
  }
};

//Обновляет даты аренды заказа (только для админов)
export const updateOrderDates = async (
  orderId: number,
  dates: { rentStart: string; rentEnd: string }
) => {
  try {
    // Отправляем PUT запрос для обновления дат
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/dates`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(dates),
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем обновленные данные заказа
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку обновления дат
    console.error(`Ошибка при обновлении дат заказа ${orderId}:`, error);
    throw error;
  }
}; 
/*
Методы для обычных пользователей:
getUserOrders - получение своих заказов
createOrder - создание нового заказа
Методы для администраторов:
getAllOrders - получение всех заказов с фильтрацией
getOrderById - получение детальной информации о заказе
updateOrderStatus - изменение статуса заказа
updateOrderDates - изменение дат аренды
*/