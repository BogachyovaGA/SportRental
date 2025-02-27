import { CATEGORIES_MOCK } from '../../mocks/apiMocks';

export const mockGetCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return CATEGORIES_MOCK;
};

export const mockGetCategoryById = async (categoryId: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const category = CATEGORIES_MOCK.find(c => c.id === categoryId);
  if (!category) throw new Error('Категория не найдена');
  return category;
}; 