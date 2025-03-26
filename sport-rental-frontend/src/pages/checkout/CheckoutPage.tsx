import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockGetCartItems } from '../../services/mock/mockCartService';
import { mockCreateOrder } from '../../services/mock/mockOrderService';
import './CheckoutPage.css';

interface CartItem {
  id: number;
  productId: number;
  days: number;
  product: {
    name: string;
    brand?: string;
    price: number;
    image: string;
  };
}

interface CheckoutFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
  };
  paymentInfo: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rentStart = queryParams.get('rentStart') || '';
  const rentEnd = queryParams.get('rentEnd') || '';

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    deliveryInfo: {
      address: '',
      city: '',
      postalCode: ''
    },
    paymentInfo: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    }
  });

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const data = await mockGetCartItems();
      
      if (data.length === 0) {
        navigate('/cart');
        return;
      }
      
      setCartItems(data);
    } catch (error) {
      setError('Ошибка при загрузке данных корзины');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.days), 0
    );
  };

  const formatCardNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');
    
    // Ограничиваем до 16 цифр и форматируем группами по 4
    let formattedValue = '';
    for (let i = 0; i < Math.min(digits.length, 16); i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += digits[i];
    }
    return formattedValue;
  };

  const formatExpiryDate = (value: string) => {
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');
    
    // Ограничиваем до 4 цифр и форматируем как MM/YY
    if (digits.length > 0) {
      const month = digits.substring(0, Math.min(digits.length, 2));
      const year = digits.length > 2 ? '/' + digits.substring(2, 4) : '';
      return month + year;
    }
    return '';
  };

  const handleInputChange = (section: keyof CheckoutFormData, field: string, value: string) => {
    // Специальная обработка для некоторых полей
    if (section === 'paymentInfo') {
      if (field === 'cardNumber') {
        value = formatCardNumber(value);
      } else if (field === 'expiryDate') {
        value = formatExpiryDate(value);
      } else if (field === 'cvv') {
        // Ограничиваем CVV до 3-4 цифр
        value = value.replace(/\D/g, '').substring(0, 4);
      }
    }
    
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Валидация персональных данных
        const { firstName, lastName, email, phone } = formData.personalInfo;
        if (!firstName.trim()) return 'Введите ваше имя';
        if (!lastName.trim()) return 'Введите вашу фамилию';
        if (!email.trim()) return 'Введите ваш email';
        if (!phone.trim()) return 'Введите ваш телефон';
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
          return 'Введите корректный email';
        }
        return null;
      
      case 2: // Валидация данных доставки
        const { address, city, postalCode } = formData.deliveryInfo;
        if (!address.trim()) return 'Введите ваш адрес';
        if (!city.trim()) return 'Введите ваш город';
        if (!postalCode.trim()) return 'Введите ваш почтовый индекс';
        return null;
      
      case 3: // Валидация платежных данных
        const { cardNumber, cardHolder, expiryDate, cvv } = formData.paymentInfo;
        if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
          return 'Введите корректный номер карты';
        }
        if (!cardHolder.trim()) return 'Введите имя владельца карты';
        if (!expiryDate.trim() || expiryDate.length < 5) {
          return 'Введите корректную дату истечения срока карты';
        }
        if (!cvv.trim() || cvv.length < 3) return 'Введите корректный CVV-код';
        return null;
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setError(error);
      return;
    }
    setError(null);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateStep(currentStep);
    if (error) {
      setError(error);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (!rentStart || !rentEnd) {
        setError('Не указаны даты аренды');
        return;
      }

      const orderData = {
        rentStart,
        rentEnd,
        items: cartItems.map(item => ({
          productId: item.productId,
          days: item.days
        })),
        customerInfo: {
          ...formData.personalInfo,
          ...formData.deliveryInfo
        }
      };

      // Добавляем цену и общую стоимость для каждого товара
      const orderDataWithPrices = {
        ...orderData,
        items: cartItems.map(item => ({
          productId: item.productId,
          days: item.days,
          price: item.product?.price || 0,
          total: (item.product?.price || 0) * item.days
        }))
      };

      await mockCreateOrder(orderDataWithPrices);
      setOrderComplete(true);
      
      // После создания заказа очищаем корзину и сохраняем данные о заказе
      localStorage.setItem('lastOrderCustomer', JSON.stringify({
        ...formData.personalInfo,
        ...formData.deliveryInfo
      }));
      
      // Задержка перед перенаправлением на страницу заказов
      setTimeout(() => {
        navigate('/orders');
      }, 5000);
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setError('Ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>Загрузка данных заказа...</p>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-complete">
        <div className="checkout-complete-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
          </svg>
        </div>
        <h2>Заказ успешно оформлен!</h2>
        <p>Ваш заказ принят и будет доставлен по указанному адресу.</p>
        <p>Вы будете перенаправлены на страницу заказов через несколько секунд...</p>
        <button 
          className="checkout-return-button"
          onClick={() => navigate('/orders')}
        >
          Перейти к заказам
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Оформление заказа</h1>
          <div className="checkout-steps">
            <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-title">Личные данные</div>
            </div>
            <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-title">Доставка</div>
            </div>
            <div className={`step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-title">Оплата</div>
            </div>
            <div className={`step ${currentStep === 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-title">Подтверждение</div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              {currentStep === 1 && (
                <div className="form-step">
                  <h2>Личные данные</h2>
                  <div className="form-group">
                    <label htmlFor="firstName">Имя</label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      placeholder="Иван"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Фамилия</label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      placeholder="Иванов"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      placeholder="ivan.ivanov@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Телефон</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="next-button" onClick={nextStep}>
                      Продолжить
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="form-step">
                  <h2>Адрес доставки</h2>
                  <div className="form-group">
                    <label htmlFor="address">Адрес</label>
                    <input
                      type="text"
                      id="address"
                      value={formData.deliveryInfo.address}
                      onChange={(e) => handleInputChange('deliveryInfo', 'address', e.target.value)}
                      placeholder="ул. Примерная, д. 123, кв. 45"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Город</label>
                    <input
                      type="text"
                      id="city"
                      value={formData.deliveryInfo.city}
                      onChange={(e) => handleInputChange('deliveryInfo', 'city', e.target.value)}
                      placeholder="Москва"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Индекс</label>
                    <input
                      type="text"
                      id="postalCode"
                      value={formData.deliveryInfo.postalCode}
                      onChange={(e) => handleInputChange('deliveryInfo', 'postalCode', e.target.value)}
                      placeholder="123456"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="back-button" onClick={prevStep}>
                      Назад
                    </button>
                    <button type="button" className="next-button" onClick={nextStep}>
                      Продолжить
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="form-step">
                  <h2>Данные оплаты</h2>
                  <div className="form-group">
                    <label htmlFor="cardNumber">Номер карты</label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={formData.paymentInfo.cardNumber}
                      onChange={(e) => handleInputChange('paymentInfo', 'cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardHolder">Имя владельца</label>
                    <input
                      type="text"
                      id="cardHolder"
                      value={formData.paymentInfo.cardHolder}
                      onChange={(e) => handleInputChange('paymentInfo', 'cardHolder', e.target.value)}
                      placeholder="IVAN IVANOV"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="expiryDate">Срок действия</label>
                      <input
                        type="text"
                        id="expiryDate"
                        value={formData.paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('paymentInfo', 'expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group half">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="password"
                        id="cvv"
                        value={formData.paymentInfo.cvv}
                        onChange={(e) => handleInputChange('paymentInfo', 'cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="back-button" onClick={prevStep}>
                      Назад
                    </button>
                    <button type="button" className="next-button" onClick={nextStep}>
                      Продолжить
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="form-step">
                  <h2>Подтверждение заказа</h2>
                  
                  <div className="order-summary">
                    <h3>Информация о покупателе</h3>
                    <div className="summary-section">
                      <p><strong>Имя:</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                      <p><strong>Email:</strong> {formData.personalInfo.email}</p>
                      <p><strong>Телефон:</strong> {formData.personalInfo.phone}</p>
                    </div>
                    
                    <h3>Адрес доставки</h3>
                    <div className="summary-section">
                      <p><strong>Адрес:</strong> {formData.deliveryInfo.address}</p>
                      <p><strong>Город:</strong> {formData.deliveryInfo.city}</p>
                      <p><strong>Индекс:</strong> {formData.deliveryInfo.postalCode}</p>
                    </div>
                    
                    <h3>Способ оплаты</h3>
                    <div className="summary-section">
                      <p><strong>Карта:</strong> **** **** **** {formData.paymentInfo.cardNumber.slice(-4)}</p>
                    </div>
                    
                    <h3>Дата аренды</h3>
                    <div className="summary-section">
                      <p><strong>C:</strong> {rentStart}</p>
                      <p><strong>По:</strong> {rentEnd}</p>
                    </div>
                    
                    <h3>Товары</h3>
                    <div className="summary-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="summary-item">
                          <div className="item-image">
                            <img src={item.product.image} alt={item.product.name} />
                          </div>
                          <div className="item-details">
                            <p className="item-name">{item.product.name}</p>
                            <p className="item-price">{item.product.price} ₽ × {item.days} дней</p>
                          </div>
                          <div className="item-total">
                            {item.product.price * item.days} ₽
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-total">
                      <p>Итого: <span>{calculateTotal()} ₽</span></p>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="back-button" onClick={prevStep}>
                      Назад
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-button"
                      disabled={loading}
                    >
                      {loading ? 'Оформление...' : 'Подтвердить заказ'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          <div className="checkout-summary">
            <h2>Ваш заказ</h2>
            <div className="cart-preview">
              {cartItems.map(item => (
                <div key={item.id} className="cart-preview-item">
                  <div className="preview-item-image">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className="preview-item-details">
                    <p className="preview-item-name">{item.product.name}</p>
                    <p className="preview-item-price">{item.product.price} ₽ × {item.days} дней</p>
                    <p className="preview-item-total">{item.product.price * item.days} ₽</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="checkout-total">
              <div className="total-row">
                <span>Товары ({cartItems.length}):</span>
                <span>{calculateTotal()} ₽</span>
              </div>
              <div className="total-row">
                <span>Доставка:</span>
                <span>0 ₽</span>
              </div>
              <div className="total-row grand-total">
                <span>Итого:</span>
                <span>{calculateTotal()} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 