import { CART_MOCK } from '../../mocks/apiMocks';

export const mockGetCartItems = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return CART_MOCK;
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...CART_MOCK,
    items: CART_MOCK.items.map(item =>
      item.id === itemId ? { ...item, days, total: item.price * days } : item
    )
  };
};

export const mockRemoveFromCart = async (itemId: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const mockClearCart = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
}; 