import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockGetOrders } from '../../services/mock/mockOrderService';
import './ProfilePage.css';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface UserOrder {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  rentStart: string;
  rentEnd: string;
  items: {
    productId: number;
    days: number;
    product: {
      name: string;
      image: string;
    }
  }[];
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  
  useEffect(() => {
    loadUserData();
    loadUserOrders();
  }, []);
  
  const loadUserData = () => {
    try {
      // Проверяем авторизацию пользователя
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации берем данные из localStorage
      const userEmail = localStorage.getItem('userEmail') || 'test@example.com';
      const firstName = localStorage.getItem('firstName') || 'Иван';
      const lastName = localStorage.getItem('lastName') || 'Иванов';
      const phone = localStorage.getItem('userPhone') || '+7 (999) 999-99-99';
      const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 1;
      const address = localStorage.getItem('userAddress') || 'ул. Примерная, д. 123, кв. 45';
      const city = localStorage.getItem('userCity') || 'Москва';
      const postalCode = localStorage.getItem('userPostalCode') || '123456';
      
      const user: UserData = {
        id: userId,
        firstName,
        lastName,
        email: userEmail,
        phone,
        address,
        city,
        postalCode
      };
      
      setUserData(user);
      setEditedData(user);
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
      setError('Не удалось загрузить данные пользователя');
    }
  };
  
  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await mockGetOrders();
      
      // Преобразуем полученные данные в правильный формат для UI
      const formattedOrders = userOrders.map(order => {
        return {
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          rentStart: order.rentStart,
          rentEnd: order.rentEnd,
          items: order.items.map(item => {
            // В полученных данных нет поля product, но нам оно нужно для UI
            // Создаем плейсхолдер с названием товара и изображением
            return {
              productId: item.productId,
              days: item.days,
              product: {
                name: `Товар #${item.productId}`,
                image: 'https://via.placeholder.com/100x100'
              }
            };
          })
        };
      });
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Ошибка при загрузке заказов:', error);
      setError('Не удалось загрузить историю заказов');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (field: keyof UserData, value: string) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: value
      });
    }
  };
  
  const handleSaveChanges = () => {
    if (!editedData) return;
    
    // В реальном приложении здесь был бы запрос к API для сохранения данных
    // Для демонстрации сохраняем в localStorage
    localStorage.setItem('firstName', editedData.firstName);
    localStorage.setItem('lastName', editedData.lastName);
    localStorage.setItem('userEmail', editedData.email);
    localStorage.setItem('userPhone', editedData.phone);
    
    if (editedData.address) localStorage.setItem('userAddress', editedData.address);
    if (editedData.city) localStorage.setItem('userCity', editedData.city);
    if (editedData.postalCode) localStorage.setItem('userPostalCode', editedData.postalCode);
    
    setUserData(editedData);
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'Ожидает';
      case 'active': return 'Активен';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };
  
  if (loading && !userData) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Загрузка данных профиля...</p>
      </div>
    );
  }
  
  if (error && !userData) {
    return (
      <div className="profile-error">
        <p>{error}</p>
        <button onClick={loadUserData} className="retry-button">
          Попробовать снова
        </button>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Личный кабинет</h1>
        <button onClick={handleLogout} className="logout-button">Выйти</button>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="user-info-card">
            <div className="user-avatar">
              <div className="avatar-placeholder">
                {userData?.firstName.charAt(0)}{userData?.lastName.charAt(0)}
              </div>
            </div>
            <div className="user-details">
              <h2>{userData?.firstName} {userData?.lastName}</h2>
              <p className="user-email">{userData?.email}</p>
            </div>
            {!isEditing && (
              <button 
                className="edit-profile-button"
                onClick={() => setIsEditing(true)}
              >
                Редактировать профиль
              </button>
            )}
          </div>
          
          <div className="profile-navigation">
            <Link to="/orders" className="nav-link">
              <span className="nav-icon">📦</span>
              Мои заказы
            </Link>
            <Link to="/cart" className="nav-link">
              <span className="nav-icon">🛒</span>
              Корзина
            </Link>
            <hr className="nav-divider" />
            <button className="nav-link logout-link" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Выйти
            </button>
          </div>
        </div>
        
        <div className="profile-main">
          <div className="profile-section">
            <h2>Личные данные</h2>
            
            {isEditing ? (
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Имя</label>
                    <input 
                      type="text" 
                      value={editedData?.firstName || ''} 
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Фамилия</label>
                    <input 
                      type="text" 
                      value={editedData?.lastName || ''} 
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={editedData?.email || ''} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Телефон</label>
                    <input 
                      type="tel" 
                      value={editedData?.phone || ''} 
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <h3>Адрес доставки</h3>
                <div className="form-group full-width">
                  <label>Адрес</label>
                  <input 
                    type="text" 
                    value={editedData?.address || ''} 
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Город</label>
                    <input 
                      type="text" 
                      value={editedData?.city || ''} 
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Почтовый индекс</label>
                    <input 
                      type="text" 
                      value={editedData?.postalCode || ''} 
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(userData);
                    }}
                  >
                    Отмена
                  </button>
                  <button 
                    type="button" 
                    className="save-button"
                    onClick={handleSaveChanges}
                  >
                    Сохранить изменения
                  </button>
                </div>
              </div>
            ) : (
              <div className="user-data">
                <div className="data-row">
                  <div className="data-group">
                    <span className="data-label">Имя:</span>
                    <span className="data-value">{userData?.firstName}</span>
                  </div>
                  <div className="data-group">
                    <span className="data-label">Фамилия:</span>
                    <span className="data-value">{userData?.lastName}</span>
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-group">
                    <span className="data-label">Email:</span>
                    <span className="data-value">{userData?.email}</span>
                  </div>
                  <div className="data-group">
                    <span className="data-label">Телефон:</span>
                    <span className="data-value">{userData?.phone}</span>
                  </div>
                </div>
                
                <h3>Адрес доставки</h3>
                <div className="data-row">
                  <div className="data-group full-width">
                    <span className="data-label">Адрес:</span>
                    <span className="data-value">{userData?.address || 'Не указан'}</span>
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-group">
                    <span className="data-label">Город:</span>
                    <span className="data-value">{userData?.city || 'Не указан'}</span>
                  </div>
                  <div className="data-group">
                    <span className="data-label">Индекс:</span>
                    <span className="data-value">{userData?.postalCode || 'Не указан'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-section">
            <div className="section-header">
              <h2>Последние заказы</h2>
              <Link to="/orders" className="view-all">Все заказы</Link>
            </div>
            
            {loading ? (
              <div className="orders-loading">
                <div className="spinner-small"></div>
                <p>Загрузка заказов...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="recent-orders">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-number">Заказ #{order.id}</span>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="order-dates">
                      <span>С {order.rentStart} по {order.rentEnd}</span>
                      <span>Создан: {order.createdAt}</span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-image">
                            <img src={item.product.image} alt={item.product.name} />
                          </div>
                          <div className="item-name">{item.product.name}</div>
                          <div className="item-days">{item.days} {item.days === 1 ? 'день' : item.days < 5 ? 'дня' : 'дней'}</div>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <span className="order-total">Итого: {order.totalAmount} ₽</span>
                      <Link to={`/orders/${order.id}`} className="order-details-link">
                        Подробнее
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <p>У вас пока нет заказов.</p>
                <Link to="/catalog" className="browse-catalog">
                  Перейти в каталог
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 