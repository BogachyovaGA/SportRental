import { PRODUCTS_MOCK } from '../../mocks/apiMocks';

//Интерфейс продукта
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  available: boolean;
}

/*
 * Интерфейс для фильтрации продуктов (расширенный)
 * Включает поиск по тексту
 */
interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

/*
 * Интерфейс параметров фильтрации (базовый)
 * Используется в основном методе получения продуктов
 */
interface FilterParams {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

//Вспомогательная функция для имитации задержки сервера
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Локальное хранилище данных продуктов
 * Содержит тестовые данные для имитации работы с БД
 */
let mockProducts = [
  // Беговые дорожки
  {
    id: 1,
    name: "Беговая дорожка KETTLER Air R",
    description: "Профессиональная беговая дорожка для домашних тренировок с системой амортизации и широкой беговой поверхностью",
    price: 690,
    categoryId: 1,
    available: true,
    image: "https://avatars.mds.yandex.net/i?id=188a563c1d021f33b8c32c4dc758f028_l-5875471-images-thumbs&n=13"
  },
  {
    id: 2,
    name: "Беговая дорожка TORNEO Nota",
    description: "Компактная беговая дорожка с электрическим приводом, регулировкой скорости и встроенными программами тренировок",
    price: 550,
    categoryId: 1,
    available: true,
    image: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Беговая дорожка SVENSSON BODY LABS ORTHOLINE TRX",
    description: "Мощная беговая дорожка для интенсивных тренировок с усиленной рамой и высококачественным двигателем",
    price: 800,
    categoryId: 1,
    available: true,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Беговая дорожка CARBON FITNESS T706 HRC",
    description: "Современная беговая дорожка с Bluetooth подключением, возможностью синхронизации с фитнес-приложениями и датчиком пульса",
    price: 720,
    categoryId: 1,
    available: false,
    image: "https://images.unsplash.com/photo-1579364046732-c21c2177730d?q=80&w=800&auto=format&fit=crop"
  },
  
  // Лыжи
  {
    id: 5,
    name: "Горные лыжи Atomic Redster",
    description: "Профессиональные горные лыжи для опытных лыжников. Отличный контроль на высоких скоростях.",
    price: 1000,
    categoryId: 2,
    available: true,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Горные лыжи Fischer RC4",
    description: "Универсальные лыжи для различных стилей катания, подходят для любого уровня подготовки",
    price: 850,
    categoryId: 2,
    available: true,
    image: "https://images.unsplash.com/photo-1617693322537-dec0e577f5e1?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Беговые лыжи Rossignol X-IUM",
    description: "Легкие и быстрые беговые лыжи для классического хода. Идеально подходят для соревнований.",
    price: 780,
    categoryId: 2,
    available: true,
    image: "https://images.unsplash.com/photo-1551698618-dd1dbddbc5a3?q=80&w=800&auto=format&fit=crop"
  },
  
  // Сноуборды
  {
    id: 8,
    name: "Сноуборд Burton Custom",
    description: "Универсальный сноуборд для фрирайда и трюков. Популярная модель с отличными характеристиками.",
    price: 1200,
    categoryId: 3,
    available: true,
    image: "https://images.unsplash.com/photo-1482442120256-9c03866de390?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Сноуборд Lib Tech Travis Rice Pro",
    description: "Сноуборд для продвинутых райдеров с уникальной технологией Magne-Traction для лучшего сцепления с поверхностью",
    price: 1350,
    categoryId: 3,
    available: true,
    image: "https://images.unsplash.com/photo-1522056615691-da7b8106c665?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "Сноуборд Jones Mountain Twin",
    description: "Высокопроизводительный сноуборд для разнообразных условий катания. Прекрасно подходит для всех гор.",
    price: 1180,
    categoryId: 3,
    available: false,
    image: "https://images.unsplash.com/photo-1473187983305-f615310e7daa?q=80&w=800&auto=format&fit=crop"
  },
  
  // Коньки
  {
    id: 11,
    name: "Коньки фигурные Edea Overture",
    description: "Профессиональные фигурные коньки с высококачественными лезвиями и удобным ботинком",
    price: 800,
    categoryId: 4,
    available: true,
    image: "https://images.unsplash.com/photo-1604250185496-4e1de7ec47b8?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 12,
    name: "Коньки хоккейные Bauer Supreme",
    description: "Профессиональные хоккейные коньки с усиленной защитой и улучшенной маневренностью",
    price: 950,
    categoryId: 4,
    available: true,
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 13,
    name: "Коньки прогулочные Nordway Paris",
    description: "Удобные и теплые прогулочные коньки для катания на открытых катках",
    price: 560,
    categoryId: 4,
    available: true,
    image: "https://images.unsplash.com/photo-1549880369-17ede098cbd4?q=80&w=800&auto=format&fit=crop"
  },
  
  // Велосипеды
  {
    id: 14,
    name: "Горный велосипед Trek Marlin 7",
    description: "Надежный горный велосипед с алюминиевой рамой и дисковыми тормозами для бездорожья",
    price: 1200,
    categoryId: 5,
    available: true,
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 15,
    name: "Шоссейный велосипед Specialized Allez",
    description: "Быстрый шоссейный велосипед для скоростной езды по асфальту и участия в соревнованиях",
    price: 1450,
    categoryId: 5,
    available: true,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 16,
    name: "Городской велосипед Electra Loft 7D",
    description: "Стильный городской велосипед для комфортного передвижения по городу с возможностью установки аксессуаров",
    price: 890,
    categoryId: 5,
    available: false,
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=800&auto=format&fit=crop"
  },
  
  // Силовые тренажеры
  {
    id: 17,
    name: "Силовая станция Body Solid EXM3000LPS",
    description: "Многофункциональная силовая станция для тренировки всех групп мышц",
    price: 2100,
    categoryId: 6,
    available: true,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 18,
    name: "Скамья для жима Weider 330",
    description: "Регулируемая скамья для жима с дополнительными опциями для разнообразных упражнений",
    price: 780,
    categoryId: 6,
    available: true,
    image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 19,
    name: "Гантельный ряд Hammer 2.5-25 кг",
    description: "Полный набор гантелей разного веса для силовых тренировок и функциональных упражнений",
    price: 950,
    categoryId: 6,
    available: true,
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop"
  }
];

//Получает список продуктов с возможностью фильтрации
export const mockGetProducts = async (filters?: FilterParams) => {
  await delay(1000);
  let filteredProducts = [...mockProducts];

  // Применяем фильтры последовательно
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

//Получает продукт по его ID
export const mockGetProductById = async (id: number): Promise<Product> => {
  await delay(1000);
  const product = mockProducts.find(p => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

//Поиск продуктов по поисковому запросу
export const mockSearchProducts = async (query: string) => {
  await delay(1000);
  
  // Преобразуем запрос в нижний регистр для регистронезависимого поиска
  const searchQuery = query.toLowerCase();
  
  // Фильтруем продукты по названию и описанию
  const results = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery) || 
    product.description.toLowerCase().includes(searchQuery)
  );
  
  return results;
};

//Создает новый продукт
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

//Обновляет существующий продукт
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

  // Обновляем изображение только если оно было загружено
  const image = productData.get('image');
  if (image instanceof File) {
    updatedProduct.image = URL.createObjectURL(image);
  }

  mockProducts[index] = updatedProduct;
  return updatedProduct;
};

//Удаляет продукт
export const mockDeleteProduct = async (id: number) => {
  await delay(1000);
  mockProducts = mockProducts.filter(product => product.id !== id);
  return true;
}; 