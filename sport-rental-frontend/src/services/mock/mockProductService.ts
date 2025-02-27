import { PRODUCTS_MOCK } from '../../mocks/apiMocks';

interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export const mockGetProducts = async (filters?: ProductFilters) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filteredProducts = [...PRODUCTS_MOCK];

  if (filters) {
    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.available !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.available === filters.available);
    }
  }

  return filteredProducts;
};

export const mockGetProductById = async (productId: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const product = PRODUCTS_MOCK.find(p => p.id === productId);
  if (!product) throw new Error('Продукт не найден');
  return product;
};

export const mockSearchProducts = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return PRODUCTS_MOCK.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );
}; 