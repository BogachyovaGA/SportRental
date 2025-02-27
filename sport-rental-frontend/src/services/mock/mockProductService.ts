import { PRODUCTS_MOCK } from '../../mocks/apiMocks';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  available: boolean;
}

interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

interface FilterParams {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

// Имитация задержки сервера
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Моковые данные для продуктов
let mockProducts = [
  {
    id: 1,
    name: "Горные лыжи",
    description: "Профессиональные горные лыжи для опытных лыжников",
    price: 1000,
    categoryId: 1,
    available: true,
    image: "/images/skis.jpg"
  },
  {
    id: 2,
    name: "Сноуборд",
    description: "Универсальный сноуборд для фрирайда",
    price: 1200,
    categoryId: 2,
    available: true,
    image: "/images/snowboard.jpg"
  }
];

export const mockGetProducts = async (filters?: FilterParams) => {
  await delay(1000);
  let filteredProducts = [...mockProducts];

  if (filters?.categoryId) {
    filteredProducts = filteredProducts.filter(
      product => product.categoryId === filters.categoryId
    );
  }

  if (filters?.minPrice) {
    filteredProducts = filteredProducts.filter(
      product => product.price >= filters.minPrice!
    );
  }

  if (filters?.maxPrice) {
    filteredProducts = filteredProducts.filter(
      product => product.price <= filters.maxPrice!
    );
  }

  if (filters?.available) {
    filteredProducts = filteredProducts.filter(
      product => product.available
    );
  }

  return filteredProducts;
};

export const mockGetProductById = async (id: number): Promise<Product> => {
  await delay(1000);
  const product = PRODUCTS_MOCK.find(p => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Преобразуем структуру данных, меняя imageUrl на image
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    image: product.imageUrl, // Здесь меняем imageUrl на image
    available: product.available
  };
};

export const mockSearchProducts = async (query: string) => {
  await delay(1000);
  const searchQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery) ||
    product.description.toLowerCase().includes(searchQuery)
  );
};

export const mockCreateProduct = async (productData: FormData) => {
  await delay(1000);
  const newProduct = {
    id: mockProducts.length + 1,
    name: productData.get('name') as string,
    description: productData.get('description') as string,
    price: Number(productData.get('price')),
    categoryId: Number(productData.get('categoryId')),
    available: productData.get('available') === 'true',
    image: URL.createObjectURL(productData.get('image') as File)
  };
  
  mockProducts.push(newProduct);
  return newProduct;
};

export const mockUpdateProduct = async (id: number, productData: FormData) => {
  await delay(1000);
  const index = mockProducts.findIndex(product => product.id === id);
  if (index === -1) throw new Error('Продукт не найден');

  const updatedProduct = {
    ...mockProducts[index],
    name: productData.get('name') as string,
    description: productData.get('description') as string,
    price: Number(productData.get('price')),
    categoryId: Number(productData.get('categoryId')),
    available: productData.get('available') === 'true'
  };

  const image = productData.get('image');
  if (image instanceof File) {
    updatedProduct.image = URL.createObjectURL(image);
  }

  mockProducts[index] = updatedProduct;
  return updatedProduct;
};

export const mockDeleteProduct = async (id: number) => {
  await delay(1000);
  mockProducts = mockProducts.filter(product => product.id !== id);
  return true;
}; 