import { API_BASE_URL, getAuthHeader } from '../config/api.config';
//Получает общую статистику для панели администратора
export const getDashboardStats = async () => {
  try {
    // Выполняем GET-запрос к API для получения статистики
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getAuthHeader(), // Добавляем заголовки авторизации
    });
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Преобразуем ответ в JSON формат и возвращаем данные
    return await response.json();
  } catch (error) {
    // Если произошла ошибка, логируем её и пробрасываем дальше
    console.error('Ошибка при получении статистики:', error);
    throw error;
  }
};
//Получает статистику заказов за определенный период
export const getOrderStats = async (dateRange?: {
  startDate: string;//начало период
  endDate: string;//конец
}) => {
  try {
    // Создаем объект для формирования параметров запроса
    const queryParams = new URLSearchParams();
    // Если передан диапазон дат, добавляем его в параметры запроса
    if (dateRange) {
      queryParams.append('startDate', dateRange.startDate);
      queryParams.append('endDate', dateRange.endDate);
    }
// Выполняем GET-запрос с параметрами
    const response = await fetch(
      `${API_BASE_URL}/admin/dashboard/order-stats?${queryParams}`,
      {
        headers: getAuthHeader(),
      }
    );
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении статистики заказов:', error);
    throw error;
  }
};
//отчет о доходах
/*export const getRevenueReport = async (dateRange: {
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
}; */