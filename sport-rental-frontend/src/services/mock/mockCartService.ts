import { CART_MOCK } from '../../mocks/apiMocks';

// Имитация задержки сервера
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Моковые данные корзины
let mockCart: Array<{
  id: number;
  productId: number;
  days: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
}> = [
  {
    id: 1,
    productId: 1,
    days: 3,
    product: {
      name: "Горные лыжи",
      price: 1000,
      image: "/images/skis.jpg"
    }
  },
  {
    id: 2,
    productId: 2,
    days: 5,
    product: {
      name: "Сноуборд",
      price: 1200,
      image: "/images/snowboard.jpg"
    }
  }
];

export const mockGetCartItems = async () => {
  await delay(1000);
  return [...mockCart];
};

export const mockAddToCart = async (productId: number, days: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const product = CART_MOCK.items.find(item => item.productId === productId);
  if (product) {
    throw new Error('Товар уже в корзине');
  }
  return CART_MOCK;
};

export const mockUpdateCartItem = async (itemId: number, days: number) => {
  await delay(1000);
  const itemIndex = mockCart.findIndex(item => item.id === itemId);
  if (itemIndex === -1) throw new Error('Товар не найден');
  
  mockCart[itemIndex] = {
    ...mockCart[itemIndex],
    days
  };
  return mockCart[itemIndex];
};

export const mockRemoveFromCart = async (itemId: number) => {
  await delay(1000);
  mockCart = mockCart.filter(item => item.id !== itemId);
  return true;
};

export const mockClearCart = async () => {
  await delay(1000);
  mockCart = [];
  return true;
}; 