import { API_BASE_URL, getAuthHeader } from '../config/api.config';

/*
Интерфейс для фильтрации продуктов
Все поля опциональные (необязательные)
 */
interface ProductFilters {
  categoryId?: number;    // ID категории
  search?: string;        // Поисковый запрос
  minPrice?: number;      // Минимальная цена
  maxPrice?: number;      // Максимальная цена
  available?: boolean;    // Доступность товара
}


//Получает список всех продуктов с возможностью фильтрации
export const getProducts = async (filters?: ProductFilters) => {
  try {
    // Создаем объект для параметров запроса
    const queryParams = new URLSearchParams();
    
    // Если есть фильтры, добавляем их в параметры запроса
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    // Отправляем GET запрос с параметрами фильтрации
    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем список продуктов
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку получения продуктов
    console.error('Ошибка при получении продуктов:', error);
    throw error;
  }
};

//Получает информацию о конкретном продукте по его ID
export const getProductById = async (productId: number) => {
  try {
    // Отправляем GET запрос для получения информации о продукте
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем данные продукта
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку получения продукта
    console.error(`Ошибка при получении продукта ${productId}:`, error);
    throw error;
  }
};

//Поиск продуктов по поисковому запросу
export const searchProducts = async (query: string) => {
  try {
    // Отправляем GET запрос для поиска продуктов
    const response = await fetch(`${API_BASE_URL}/products/search?query=${query}`);
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Возвращаем результаты поиска
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку поиска
    console.error('Ошибка при поиске продуктов:', error);
    throw error;
  }
};

// ========== Методы для администраторов ==========

//Создает новый продукт (только для админов)
export const createProduct = async (formData: FormData) => {
  try {
    // Отправляем POST запрос для создания продукта
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
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
    
    // Возвращаем данные созданного продукта
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку создания продукта
    console.error('Ошибка при создании продукта:', error);
    throw error;
  }
};


//Обновляет существующий продукт (только для админов)
export const updateProduct = async (productId: number, formData: FormData) => {
  try {
    // Отправляем PUT запрос для обновления продукта
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
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
    
    // Возвращаем обновленные данные продукта
    return await response.json();
  } catch (error) {
    // Обрабатываем ошибку обновления продукта
    console.error(`Ошибка при обновлении продукта ${productId}:`, error);
    throw error;
  }
};

//Удаляет продукт (только для админов)
export const deleteProduct = async (productId: number) => {
  try {
    // Отправляем DELETE запрос для удаления продукта
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader(), // Добавляем заголовки авторизации
    });
    
    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Обрабатываем ошибку удаления продукта
    console.error(`Ошибка при удалении продукта ${productId}:`, error);
    throw error;
  }
}; 
/*
Публичные методы (доступны всем):
getProducts - получение списка продуктов с фильтрацией
getProductById - получение конкретного продукта
searchProducts - поиск продуктов
Административные методы:
createProduct - создание нового продукта
updateProduct - обновление существующего продукта
deleteProduct - удаление продукта
*/