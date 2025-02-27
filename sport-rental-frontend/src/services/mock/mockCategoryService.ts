import { CATEGORIES_MOCK } from '../../mocks/apiMocks';

// Имитация задержки сервера
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Мок данные для категорий
let mockCategories = [
  {
    id: 1,
    name: 'Лыжи',
    description: 'Все виды лыж для катания',
    image: '/images/skis.jpg',
    productsCount: 15
  },
  {
    id: 2,
    name: 'Сноуборды',
    description: 'Сноуборды и аксессуары',
    image: '/images/snowboards.jpg',
    productsCount: 10
  }
];

export const mockGetCategories = async () => {
  await delay(1000);
  return [...mockCategories];
};

export const mockCreateCategory = async (categoryData: FormData) => {
  await delay(1000);
  const newCategory = {
    id: mockCategories.length + 1,
    name: categoryData.get('name') as string,
    description: categoryData.get('description') as string,
    image: URL.createObjectURL(categoryData.get('image') as File),
    productsCount: 0
  };
  mockCategories.push(newCategory);
  return newCategory;
};

export const mockUpdateCategory = async (id: number, categoryData: FormData) => {
  await delay(1000);
  const index = mockCategories.findIndex(cat => cat.id === id);
  if (index === -1) throw new Error('Категория не найдена');

  const updatedCategory = {
    ...mockCategories[index],
    name: categoryData.get('name') as string,
    description: categoryData.get('description') as string
  };

  const image = categoryData.get('image');
  if (image instanceof File) {
    updatedCategory.image = URL.createObjectURL(image);
  }

  mockCategories[index] = updatedCategory;
  return updatedCategory;
};

export const mockDeleteCategory = async (id: number) => {
  await delay(1000);
  mockCategories = mockCategories.filter(cat => cat.id !== id);
  return true;
};

export const mockGetCategoryById = async (categoryId: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const category = CATEGORIES_MOCK.find(c => c.id === categoryId);
  if (!category) throw new Error('Категория не найдена');
  return category;
}; 