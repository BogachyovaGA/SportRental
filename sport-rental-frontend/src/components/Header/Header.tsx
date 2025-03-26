import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Информация о пользователе из localStorage
  const userIsLoggedIn = !!localStorage.getItem('token');
  const userName = userIsLoggedIn ? 'Иван Иванов' : '';
  const userEmail = userIsLoggedIn ? 'email@gmail.com' : '';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/?search=' + encodeURIComponent(searchQuery.trim()));
      
      // Если пользователь не на главной странице, перенаправляем его туда
      if (window.location.pathname !== '/') {
        navigate('/?search=' + encodeURIComponent(searchQuery.trim()));
      }
    }
  };

  const handleUserButtonClick = () => {
    if (userIsLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="header">
        <div className="location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
          <span>Новосибирск</span>
        </div>
        
        <nav className="nav-menu">
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/feedback">Отзывы</Link>
          <Link to="/contacts">Контакты</Link>
        </nav>
      </header>
      
      {/* Logo and search */}
      <div className="logo-search">
        <Link to="/" className="logo">
          <span className="sport">Sport</span>
          <span className="tech">Tech</span>
        </Link>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#666"/>
            </svg>
          </button>
        </form>
        
        <div className="user-section">
          <button
            className="user-action"
            onClick={handleUserButtonClick}
            title={userIsLoggedIn ? "Профиль" : "Войти"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#666"/>
            </svg>
            {userIsLoggedIn && (
              <div className="user-tooltip">
                <div className="user-name">{userName}</div>
                <div className="user-email">{userEmail}</div>
              </div>
            )}
          </button>
          
          <Link to="/cart">
            <button className="user-action" title="Корзина">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" fill="#666"/>
              </svg>
            </button>
          </Link>
          
          {userIsLoggedIn && (
            <Link to="/orders">
              <button className="user-action" title="Заказы">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#666"/>
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header; 