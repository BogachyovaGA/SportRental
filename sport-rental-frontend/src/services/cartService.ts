import { API_BASE_URL, getAuthHeader } from '../config/api.config';

export const getCartItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    throw error;
  }
};

export const addToCart = async (productId: number, days: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, days }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при добавлении в корзину:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId: number, days: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ days }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при обновлении количества дней для товара ${itemId}:`, error);
    throw error;
  }
};

export const removeFromCart = async (itemId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Ошибка при удалении товара ${itemId} из корзины:`, error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка при очистке корзины:', error);
    throw error;
  }
}; 