import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, updateCartItem, removeFromCart, clearCart } from '../../services/cartService';
import { createOrder } from '../../services/orderService';
import './CartPage.css';

interface CartItem {
  id: number;
  productId: number;
  days: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rentDates, setRentDates] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const data = await getCartItems();
      setCartItems(data);
    } catch (error) {
      setError('Ошибка при загрузке корзины');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDays = async (itemId: number, days: number) => {
    try {
      await updateCartItem(itemId, days);
      await loadCartItems(); // Перезагружаем корзину
    } catch (error) {
      setError('Ошибка при обновлении количества дней');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      await loadCartItems();
    } catch (error) {
      setError('Ошибка при удалении товара');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (error) {
      setError('Ошибка при очистке корзины');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.days), 0
    );
  };

  const handleCheckout = async () => {
    try {
      if (!rentDates.start || !rentDates.end) {
        setError('Выберите даты аренды');
        return;
      }

      const orderData = {
        rentStart: rentDates.start,
        rentEnd: rentDates.end,
        items: cartItems.map(item => ({
          productId: item.productId,
          days: item.days
        }))
      };

      await createOrder(orderData);
      await clearCart();
      navigate('/orders');
    } catch (error) {
      setError('Ошибка при оформлении заказа');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Ваша корзина пуста</p>
          <button onClick={() => navigate('/catalog')}>
            Перейти в каталог
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.price} ₽/день</p>
                  <div className="days-input">
                    <label>Количество дней:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.days}
                      onChange={(e) => handleUpdateDays(item.id, Number(e.target.value))}
                    />
                  </div>
                  <p>Итого: {item.product.price * item.days} ₽</p>
                </div>
                <button 
                  className="remove-item"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="rent-dates">
              <h3>Даты аренды</h3>
              <div className="date-inputs">
                <input
                  type="date"
                  value={rentDates.start}
                  onChange={(e) => setRentDates(prev => ({ ...prev, start: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
                <span>—</span>
                <input
                  type="date"
                  value={rentDates.end}
                  onChange={(e) => setRentDates(prev => ({ ...prev, end: e.target.value }))}
                  min={rentDates.start}
                />
              </div>
            </div>

            <h2>Итого</h2>
            <p className="total">Общая сумма: {calculateTotal()} ₽</p>
            <div className="cart-actions">
              <button className="clear-cart" onClick={handleClearCart}>
                Очистить корзину
              </button>
              <button className="checkout-button" onClick={handleCheckout}>
                Оформить заказ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 