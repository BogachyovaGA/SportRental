import { API_BASE_URL, getAuthHeader } from '../config/api.config';
//Получает список всех товаров в корзине пользователя

export const getCartItems = async () => {
  try {
    // Отправляем GET запрос для получения содержимого корзины
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeader(), // Добавляем заголовки авторизации
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Возвращаем данные в формате JSON
    return await response.json();
  } catch (error) {
    // Если произошла ошибка, логируем её и пробрасываем дальше
    console.error('Ошибка при получении корзины:', error);
    throw error;
  }
};

//Добавляет товар в корзину
export const addToCart = async (productId: number, days: number) => {
  try {
    // Отправляем POST запрос для добавления товара в корзину
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST', // Указываем метод запроса
      headers: getAuthHeader(), // Добавляем заголовки авторизации
      body: JSON.stringify({ productId, days }), // Преобразуем данные в JSON
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Возвращаем обновленные данные корзины
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку добавления в корзину
    console.error('Ошибка при добавлении в корзину:', error);
    throw error;
  }
};

//Обновляет количество дней аренды для товара в корзине
export const updateCartItem = async (itemId: number, days: number) => {
  try {
    // Отправляем PUT запрос для обновления количества дней
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ days }),
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Возвращаем обновленные данные
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку обновления
    console.error(`Ошибка при обновлении количества дней для товара ${itemId}:`, error);
    throw error;
  }
};

//Удаляет товар из корзины
export const removeFromCart = async (itemId: number) => {
  try {
    // Отправляем DELETE запрос для удаления товара из корзины
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Обрабатываем ошибку удаления
    console.error(`Ошибка при удалении товара ${itemId} из корзины:`, error);
    throw error;
  }
};

//Очищает всю корзину пользователя
export const clearCart = async () => {
  try {
    // Отправляем DELETE запрос для очистки всей корзины
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Обрабатываем ошибку очистки корзины
    console.error('Ошибка при очистке корзины:', error);
    throw error;
  }
}; 
/*
getCartItems - получение всех товаров в корзине:
GET запрос
Требует авторизации
Возвращает список товаров
addToCart - добавление товара в корзину:
POST запрос
Принимает ID товара и количество дней
Возвращает обновленную корзину
updateCartItem - обновление количества дней аренды:
PUT запрос
Принимает ID позиции и новое количество дней
Возвращает обновленную позицию
removeFromCart - удаление товара из корзины:
DELETE запрос
Принимает ID позиции
Не возвращает данных
clearCart - очистка всей корзины:
DELETE запрос
Удаляет все товары из корзины
Не возвращает данных
*/