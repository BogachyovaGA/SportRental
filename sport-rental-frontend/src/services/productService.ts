import { API_BASE_URL, getAuthHeader } from '../config/api.config';

interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export const getProducts = async (filters?: ProductFilters) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    throw error;
  }
};

export const getProductById = async (productId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении продукта ${productId}:`, error);
    throw error;
  }
};

export const searchProducts = async (query: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?query=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при поиске продуктов:', error);
    throw error;
  }
};

// Админские методы
export const createProduct = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
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
    console.error('Ошибка при создании продукта:', error);
    throw error;
  }
};

export const updateProduct = async (productId: number, formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
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
    console.error(`Ошибка при обновлении продукта ${productId}:`, error);
    throw error;
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Ошибка при удалении продукта ${productId}:`, error);
    throw error;
  }
}; 