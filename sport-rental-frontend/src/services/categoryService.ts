import { API_BASE_URL, getAuthHeader } from '../config/api.config';

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    throw error;
  }
};

export const getCategoryById = async (categoryId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении категории ${categoryId}:`, error);
    throw error;
  }
};

// Админские методы
export const createCategory = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: number, formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при обновлении категории ${categoryId}:`, error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Ошибка при удалении категории ${categoryId}:`, error);
    throw error;
  }
}; 