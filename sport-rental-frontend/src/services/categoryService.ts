import { API_BASE_URL, getAuthHeader } from '../config/api.config';

//Получает список всех категорий
export const getCategories = async () => {
  try {
    // Отправляем GET запрос для получения всех категорий
    const response = await fetch(`${API_BASE_URL}/categories`);
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем данные в формате JSON
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку получения категорий
    console.error('Ошибка при получении категорий:', error);
    throw error;
  }
};

//Получает информацию о конкретной категории по её ID
export const getCategoryById = async (categoryId: number) => {
  try {
    // Отправляем GET запрос для получения конкретной категории
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем данные категории
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку получения категории
    console.error(`Ошибка при получении категории ${categoryId}:`, error);
    throw error;
  }
};

// ========== Методы для администраторов ==========

//Создает новую категорию (только для админов)
export const createCategory = async (formData: FormData) => {
  try {
    // Отправляем POST запрос для создания категории
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(), // Добавляем заголовки авторизации
      },
      body: formData, // Отправляем FormData (может содержать файлы)
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем данные созданной категории
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку создания категории
    console.error('Ошибка при создании категории:', error);
    throw error;
  }
};

//Обновляет существующую категорию (только для админов)
export const updateCategory = async (categoryId: number, formData: FormData) => {
  try {
    // Отправляем PUT запрос для обновления категории
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(), // Добавляем заголовки авторизации
      },
      body: formData, // Отправляем FormData с обновленными данными
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем обновленные данные категории
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку обновления категории
    console.error(`Ошибка при обновлении категории ${categoryId}:`, error);
    throw error;
  }
}

//Удаляет категорию (только для админов)
export const deleteCategory = async (categoryId: number) => {
  try {
    // Отправляем DELETE запрос для удаления категории
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getAuthHeader(), // Добавляем заголовки авторизации
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Обрабатываем ошибку удаления категории
    console.error(`Ошибка при удалении категории ${categoryId}:`, error);
    throw error;
  }
}; 
/*
Публичные методы (доступны всем):
getCategories - получение списка всех категорий
getCategoryById - получение конкретной категории
Административные методы (требуют авторизации):
createCategory - создание новой категории
updateCategory - обновление существующей категории
deleteCategory - удаление категории
*/