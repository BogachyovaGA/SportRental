import { CATEGORIES_MOCK } from '../../mocks/apiMocks';


//Вспомогательная функция для имитации задержки ответа сервера
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//Локальное хранилище данных категорий
let mockCategories = [
  {
    id: 1,
    name: 'Беговые дорожки',
    description: 'Профессиональные беговые дорожки для тренировок',
    image: 'https://avatars.mds.yandex.net/i?id=188a563c1d021f33b8c32c4dc758f028_l-5875471-images-thumbs&n=13',
    productsCount: 18
  },
  {
    id: 2,
    name: 'Лыжи',
    description: 'Все виды лыж для катания по снежным склонам',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=800&auto=format&fit=crop',
    productsCount: 15
  },
  {
    id: 3,
    name: 'Сноуборды',
    description: 'Сноуборды и аксессуары для активного зимнего отдыха',
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800&auto=format&fit=crop',
    productsCount: 10
  },
  {
    id: 4,
    name: 'Коньки',
    description: 'Коньки для фигурного катания и хоккея',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop',
    productsCount: 12
  },
  {
    id: 5,
    name: 'Велосипеды',
    description: 'Горные, городские и гоночные велосипеды',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800&auto=format&fit=crop',
    productsCount: 14
  },
  {
    id: 6,
    name: 'Силовые тренажеры',
    description: 'Тренажеры для силовых тренировок и фитнеса',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    productsCount: 10
  }
];

//Получает список всех категорий
export const mockGetCategories = async () => {
  await delay(1000); // Имитация задержки сервера
  return [...mockCategories]; // Возвращаем копию массива для избежания прямых изменений
};

//Создает новую категорию
export const mockCreateCategory = async (categoryData: FormData) => {
  await delay(1000); // Имитация задержки сервера
  
  // Создаем новую категорию с уникальным ID
  const newCategory = {
    id: mockCategories.length + 1,
    name: categoryData.get('name') as string,
    description: categoryData.get('description') as string,
    image: URL.createObjectURL(categoryData.get('image') as File), // Создаем URL для загруженного изображения
    productsCount: 0 // Новая категория начинается с 0 товаров
  };
  
  mockCategories.push(newCategory); // Добавляем категорию в массив
  return newCategory;
};

//Обновляет существующую категорию
export const mockUpdateCategory = async (id: number, categoryData: FormData) => {
  await delay(1000); // Имитация задержки сервера
  
  // Находим индекс категории в массиве
  const index = mockCategories.findIndex(cat => cat.id === id);
  if (index === -1) throw new Error('Категория не найдена');

  // Создаем обновленную версию категории
  const updatedCategory = {
    ...mockCategories[index], // Сохраняем существующие данные
    name: categoryData.get('name') as string,
    description: categoryData.get('description') as string
  };

  // Обновляем изображение только если оно было загружено
  const image = categoryData.get('image');
  if (image instanceof File) {
    updatedCategory.image = URL.createObjectURL(image);
  }

  mockCategories[index] = updatedCategory; // Обновляем категорию в массиве
  return updatedCategory;
};

//Удаляет категорию
export const mockDeleteCategory = async (id: number) => {
  await delay(1000); // Имитация задержки сервера
  mockCategories = mockCategories.filter(cat => cat.id !== id); // Удаляем категорию из массива
  return true; // Подтверждаем успешное удаление
};

//Получает категорию по её ID
export const mockGetCategoryById = async (categoryId: number) => {
  await delay(1000); // Имитация задержки сервера
  
  // Ищем категорию в моковых данных
  const category = mockCategories.find(c => c.id === categoryId);
  if (!category) throw new Error('Категория не найдена');
  
  return category;
}; 