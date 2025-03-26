import { PRODUCTS_MOCK } from '../../mocks/apiMocks';

// Имитация корзины в localStorage
const CART_STORAGE_KEY = 'sport-rental-cart';

// Тип элемента корзины
interface CartItem {
  id: number;
  productId: number;
  days: number;
  product: {
    name: string;
    brand?: string;
    price: number;
    image: string;
    description?: string;
  };
}

/**
 * Инициализация корзины в localStorage при первом использовании
 */
const initializeCart = () => {
  if (!localStorage.getItem(CART_STORAGE_KEY)) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [] }));
  }
};

// Инициализируем корзину сразу при импорте модуля
initializeCart();

/**
 * Получение всех товаров в корзине
 */
export const mockGetCartItems = async (): Promise<CartItem[]> => {
  // Имитация задержки сетевого запроса
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Получаем корзину из localStorage
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    
    // Если корзина не существует, возвращаем пустой массив
    if (!cartData) {
      // Инициализируем пустую корзину
      initializeCart();
      return [];
    }
    
    // Парсим данные корзины из JSON
    const parsedCart: { items: { id: number; productId: number; days: number }[] } = JSON.parse(cartData);
    
    // Проверяем структуру данных корзины
    if (!parsedCart || !parsedCart.items) {
      console.error('Некорректная структура данных корзины');
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [] }));
      return [];
    }
    
    // Для каждого элемента корзины получаем информацию о товаре из моковых данных
    const cartItems = parsedCart.items.map(item => {
      // Находим товар по ID
      const product = PRODUCTS_MOCK.find(p => p.id === item.productId);
      
      if (!product) {
        console.error(`Товар с ID ${item.productId} не найден`);
        return null;
      }
      
      // Возвращаем элемент корзины с данными товара
      return {
        id: item.id,
        productId: item.productId,
        days: item.days,
        product: {
          name: product.name,
          brand: product.name.split(' ')[0], // Просто для демонстрации используем первое слово как бренд
          price: product.price,
          image: product.imageUrl,
          description: product.description
        }
      };
    }).filter(item => item !== null) as CartItem[];
    
    return cartItems;
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    // В случае ошибки инициализируем пустую корзину
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [] }));
    return [];
  }
};

/**
 * Добавление товара в корзину
 */
export const mockAddToCart = async (productId: number, days: number): Promise<void> => {
  // Имитация задержки сетевого запроса
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    if (days <= 0) {
      throw new Error('Количество дней должно быть положительным числом');
    }
    
    // Находим товар по ID для проверки существования
    const product = PRODUCTS_MOCK.find(p => p.id === productId);
    
    if (!product) {
      throw new Error(`Товар с ID ${productId} не найден`);
    }
    
    // Получаем текущую корзину или создаем новую
    let cart: { items: { id: number; productId: number; days: number }[] } = { items: [] };
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);
        if (parsedCart && Array.isArray(parsedCart.items)) {
          cart = parsedCart;
        } else {
          console.error('Некорректная структура данных корзины');
        }
      } catch (e) {
        console.error('Ошибка при парсинге данных корзины:', e);
      }
    }
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // Если товар уже есть, обновляем количество дней
      cart.items[existingItemIndex].days += days;
    } else {
      // Если товара нет, добавляем новый элемент
      const newItem = {
        id: Date.now(), // Генерируем уникальный ID
        productId: productId,
        days: days
      };
      
      cart.items.push(newItem);
    }
    
    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    
    // Показываем уведомление об успешном добавлении
    return;
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    throw new Error('Не удалось добавить товар в корзину');
  }
};

/**
 * Обновление количества дней в корзине
 */
export const mockUpdateCartItem = async (itemId: number, days: number): Promise<void> => {
  // Имитация задержки сетевого запроса
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // Проверяем корректность значения дней
    if (days < 1) {
      throw new Error('Количество дней должно быть положительным числом');
    }
    
    // Получаем текущую корзину
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    
    if (!cartData) {
      initializeCart();
      throw new Error('Корзина не найдена');
    }
    
    let cart;
    try {
      cart = JSON.parse(cartData);
      
      // Проверка структуры данных
      if (!cart || !Array.isArray(cart.items)) {
        console.error('Некорректная структура данных корзины');
        cart = { items: [] };
      }
    } catch (e) {
      console.error('Ошибка при парсинге данных корзины:', e);
      cart = { items: [] };
    }
    
    // Находим элемент корзины по ID
    const itemIndex = cart.items.findIndex((item: any) => Number(item.id) === Number(itemId));
    
    if (itemIndex === -1) {
      throw new Error(`Элемент корзины с ID ${itemId} не найден`);
    }
    
    // Обновляем количество дней
    cart.items[itemIndex].days = days;
    
    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Ошибка при обновлении элемента корзины:', error);
    throw new Error('Не удалось обновить элемент корзины');
  }
};

/**
 * Удаление товара из корзины
 */
export const mockRemoveFromCart = async (itemId: number): Promise<void> => {
  // Имитация задержки сетевого запроса
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // Получаем текущую корзину
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    
    if (!cartData) {
      initializeCart();
      return;
    }
    
    let cart;
    try {
      cart = JSON.parse(cartData);
      
      // Проверка структуры данных
      if (!cart || !Array.isArray(cart.items)) {
        console.error('Некорректная структура данных корзины');
        cart = { items: [] };
      }
    } catch (e) {
      console.error('Ошибка при парсинге данных корзины:', e);
      cart = { items: [] };
    }
    
    // Фильтруем элементы корзины, исключая удаляемый
    cart.items = cart.items.filter((item: any) => Number(item.id) !== Number(itemId));
    
    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Ошибка при удалении товара из корзины:', error);
    throw new Error('Не удалось удалить товар из корзины');
  }
};

/**
 * Очистка корзины
 */
export const mockClearCart = async (): Promise<void> => {
  // Имитация задержки сетевого запроса
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // Создаем новую пустую корзину
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [] }));
  } catch (error) {
    console.error('Ошибка при очистке корзины:', error);
    throw new Error('Не удалось очистить корзину');
  }
}; 