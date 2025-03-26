import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockGetCartItems, mockUpdateCartItem, mockRemoveFromCart, mockClearCart } from '../../services/mock/mockCartService';
import { mockCreateOrder } from '../../services/mock/mockOrderService';
import './CartPage.css';

interface CartItem {
  id: number;
  productId: number;
  days: number;
  product: {
    name: string;
    price: number;
    image: string;
    brand?: string;
  };
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(cartItems.map(item => item.id));
    } else if (selectedItems.length === cartItems.length && cartItems.length > 0) {
      setSelectAll(true);
    }
  }, [selectAll, cartItems]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const data = await mockGetCartItems();
      setCartItems(data);
    } catch (error) {
      setError('Ошибка при загрузке корзины');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDays = async (itemId: number, days: number) => {
    if (days < 1) return;
    try {
      await mockUpdateCartItem(itemId, days);
      await loadCartItems();
    } catch (error) {
      setError('Ошибка при обновлении количества дней');
    }
  };

  const handleDecreaseDays = (itemId: number, currentDays: number) => {
    if (currentDays > 1) {
      handleUpdateDays(itemId, currentDays - 1);
    }
  };

  const handleIncreaseDays = (itemId: number, currentDays: number) => {
    handleUpdateDays(itemId, currentDays + 1);
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await mockRemoveFromCart(itemId);
      await loadCartItems();
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } catch (error) {
      setError('Ошибка при удалении товара');
    }
  };

  const handleClearCart = async () => {
    try {
      await mockClearCart();
      setCartItems([]);
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      setError('Ошибка при очистке корзины');
    }
  };

  const handleSelectItem = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, itemId]);
      if (selectedItems.length + 1 === cartItems.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      for (const itemId of selectedItems) {
        await mockRemoveFromCart(itemId);
      }
      await loadCartItems();
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      setError('Ошибка при удалении выбранных товаров');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.days), 0
    );
  };

  const handleCheckout = () => {
    // Проверяем валидность дат аренды
    if (!rentDates.start || !rentDates.end) {
      setError('Пожалуйста, выберите даты аренды');
      return;
    }
    
    // Открыть модальное окно оформления заказа
    setShowCheckoutModal(true);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo({
      ...customerInfo,
      [field]: value
    });
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    for (const field of requiredFields) {
      if (!customerInfo[field as keyof CustomerInfo]) {
        return `Пожалуйста, заполните поле "${field}"`;
      }
    }
    return null;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Проверяем авторизацию пользователя
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      // Если пользователь не авторизован, сохраняем данные заказа
      // и перенаправляем на страницу логина
      localStorage.setItem('pendingOrder', JSON.stringify({
        items: cartItems,
        rentDates,
        customerInfo
      }));
      navigate('/login');
      return;
    }
    
    try {
      setProcessingOrder(true);
      setError(null);
      
      const orderData = {
        rentStart: rentDates.start,
        rentEnd: rentDates.end,
        items: cartItems.map(item => ({
          productId: item.productId,
          days: item.days,
          price: item.product.price,
          total: item.product.price * item.days
        })),
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode
        }
      };
      
      await mockCreateOrder(orderData);
      await mockClearCart(); // Очищаем корзину после оформления заказа
      setOrderSuccess(true);
      
      // Скрываем сообщение об успехе через 3 секунды и переходим на страницу заказов
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
      
    } catch (error) {
      setError('Ошибка при оформлении заказа');
    } finally {
      setProcessingOrder(false);
    }
  };

  const closeModal = () => {
    if (!processingOrder) {
      setShowCheckoutModal(false);
      setError(null);
    }
  };

  if (loading) return (
    <div className="cart-loading">
      <div className="spinner"></div>
      <p>Загрузка корзины...</p>
    </div>
  );
  
  if (error) return (
    <div className="cart-error">
      <p>{error}</p>
      <button onClick={loadCartItems} className="retry-button">
        Попробовать снова
      </button>
    </div>
  );

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="#aaa"/>
            </svg>
          </div>
          <p>Ваша корзина пуста</p>
          <button onClick={() => navigate('/catalog')} className="go-to-catalog">
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-section">
            <div className="cart-header">
              <label className="select-all-container">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span className="checkbox-text">Выбрать все</span>
              </label>
              {selectedItems.length > 0 && (
                <button className="remove-selected" onClick={handleRemoveSelected}>
                  Удалить выбранное
                </button>
              )}
            </div>
            
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-select">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </div>
                  <div className="item-image">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className="item-details">
                    {item.product.brand && (
                      <div className="item-brand">{item.product.brand}</div>
                    )}
                    <h3 className="item-name">{item.product.name}</h3>
                    <div className="item-price">{item.product.price} ₽ на {item.days} дней</div>
                  </div>
                  <div className="item-quantity">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleDecreaseDays(item.id, item.days)}
                        disabled={item.days <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.days}
                        readOnly
                        className="quantity-input"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleIncreaseDays(item.id, item.days)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-total">
                    {item.product.price * item.days} ₽
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-content">
              <div className="rent-dates">
                <h3>Даты аренды</h3>
                <div className="date-inputs">
                  <div className="date-group">
                    <label>Начало аренды:</label>
                    <input
                      type="date"
                      value={rentDates.start}
                      onChange={(e) => setRentDates({...rentDates, start: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="date-group">
                    <label>Окончание аренды:</label>
                    <input
                      type="date"
                      value={rentDates.end}
                      onChange={(e) => setRentDates({...rentDates, end: e.target.value})}
                      min={rentDates.start || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
              
              <div className="summary-item">
                <span>Товары, {cartItems.length} шт.</span>
                <span>{calculateTotal()} ₽</span>
              </div>
              
              <div className="summary-total">
                <span>Итого</span>
                <span className="total-amount">{calculateTotal()} ₽</span>
              </div>
              
              <button 
                className="checkout-button" 
                onClick={handleCheckout}
                disabled={!rentDates.start || !rentDates.end}
              >
                Перейти к бронированию
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно оформления заказа */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay" onClick={closeModal}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            {orderSuccess ? (
              <div className="order-success">
                <div className="success-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
                  </svg>
                </div>
                <h2>Заказ успешно оформлен!</h2>
                <p>Ваш заказ принят. Вы будете перенаправлены на страницу заказов через несколько секунд.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Оформление заказа</h2>
                  <button className="close-button" onClick={closeModal} disabled={processingOrder}>×</button>
                </div>
                
                {error && <div className="modal-error">{error}</div>}
                
                <form onSubmit={handleSubmitOrder} className="checkout-form">
                  <div className="form-section">
                    <h3>Личные данные</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Имя</label>
                        <input
                          type="text"
                          value={customerInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Фамилия</label>
                        <input
                          type="text"
                          value={customerInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Телефон</label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h3>Адрес доставки</h3>
                    <div className="form-group">
                      <label>Адрес</label>
                      <input
                        type="text"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Город</label>
                        <input
                          type="text"
                          value={customerInfo.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Почтовый индекс</label>
                        <input
                          type="text"
                          value={customerInfo.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-section order-summary">
                    <h3>Информация о заказе</h3>
                    <div className="order-dates">
                      <p>Даты аренды: с {rentDates.start} по {rentDates.end}</p>
                    </div>
                    <div className="order-total">
                      <p>Итого к оплате: <strong>{calculateTotal()} ₽</strong></p>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={closeModal}
                      disabled={processingOrder}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="confirm-button"
                      disabled={processingOrder}
                    >
                      {processingOrder ? (
                        <>
                          <span className="spinner-small"></span>
                          Оформление...
                        </>
                      ) : (
                        'Оформить заказ'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 