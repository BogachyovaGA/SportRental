import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockGetCategories } from '../../services/mock/mockCategoryService';
import { mockGetProducts, mockSearchProducts } from '../../services/mock/mockProductService';
import './HomePage.css';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

const HomePage: React.FC = () => {
  const HERO_IMAGE_URL = 'https://avatars.mds.yandex.net/i?id=188a563c1d021f33b8c32c4dc758f028_l-5875471-images-thumbs&n=13';
  const location = useLocation();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Информация о пользователе из localStorage
  const userIsLoggedIn = !!localStorage.getItem('token');
  const userName = userIsLoggedIn ? 'Иван Иванов' : '';
  const userEmail = userIsLoggedIn ? 'email@gmail.com' : '';

  // Получение поискового запроса из URL при загрузке страницы или изменении URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      setIsSearching(true);
    } else {
      setSearchQuery('');
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [location.search]);
  
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        mockGetCategories(),
        mockGetProducts({ available: true })
      ]);
      
      setCategories(categoriesData);
      setPopularProducts(productsData.slice(0, 6));
    } catch (error) {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await mockSearchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      setError('Ошибка при поиске');
    }
  };

  if (loading && !isSearching) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="home-page">
      {/* Hero section - отображаем только если не выполняется поиск */}
      {!isSearching && (
        <section className="hero-section">
          <img 
            src={HERO_IMAGE_URL} 
            alt="Спортсмен" 
            className="hero-background"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60';
            }}
          />
          <div className="hero-content">
            <div className="quick-rent">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5.08V3h-2v2.08C7.61 5.57 5 8.47 5 12c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.53-2.61-6.43-6-6.92zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor"/>
                <path d="M11 9h2v5h-2V9z" fill="currentColor"/>
              </svg>
              Аренда за 5 минут
            </div>
            <h1 className="hero-title">
              Используйте спортивный инвентарь ровно столько, сколько нужно именно <span>вам</span>
            </h1>
          </div>
        </section>
      )}

      {/* Результаты поиска */}
      {isSearching && (
        <section className="search-results-section">
          <div className="search-results-container">
            <h2 className="section-title">Результаты поиска "{searchQuery}"</h2>
            {searchResults.length > 0 ? (
              <div className="products-grid">
                {searchResults.map(product => (
                  <Link 
                    to={`/product/${product.id}`} 
                    key={product.id}
                    className="product-card"
                  >
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <span className="price">{product.price} ₽/день</span>
                    <span className={`status ${product.available ? 'available' : 'unavailable'}`}>
                      {product.available ? 'Доступно' : 'Недоступно'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>По вашему запросу ничего не найдено.</p>
                <p>Попробуйте изменить поисковый запрос или вернуться в <Link to="/">каталог</Link>.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories section - отображаем всегда */}
      <section className="categories-section">
        <h2 className="section-title">Категории оборудования</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link 
              to={`/catalog?category=${category.id}`} 
              key={category.id}
              className="category-card"
            >
              <img src={category.image} alt={category.name} />
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular products - отображаем только если не выполняется поиск */}
      {!isSearching && (
        <section className="popular-products-section">
          <h2 className="section-title">Популярное оборудование</h2>
          <div className="products-grid">
            {popularProducts.map(product => (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id}
                className="product-card"
              >
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="price">{product.price} ₽/день</span>
                <span className={`status ${product.available ? 'available' : 'unavailable'}`}>
                  {product.available ? 'Доступно' : 'Недоступно'}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About section - отображаем только если не выполняется поиск */}
      {!isSearching && (
        <section className="about-section">
          <h2 className="section-title">О нас</h2>
          <div className="about-content">
            <div className="about-info">
              <p>
                SportTech - ваш надежный партнер в аренде качественного спортивного инвентаря. 
                Мы предлагаем широкий выбор оборудования для активного отдыха и тренировок.
              </p>
              <p>
                Наша миссия - сделать спорт доступным для каждого. Арендуйте инвентарь на любой срок без необходимости его покупки.
              </p>
              <ul className="about-benefits">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#28a745"/>
                  </svg>
                  <span>Доставка по всему городу</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#28a745"/>
                  </svg>
                  <span>Гарантия качества</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#28a745"/>
                  </svg>
                  <span>Гибкие условия аренды</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#28a745"/>
                  </svg>
                  <span>Техническая поддержка</span>
                </li>
              </ul>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Спорт" />
            </div>
          </div>
        </section>
      )}

      {/* Footer - отображаем всегда */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/" className="logo">
              <span className="sport">Sport</span>
              <span className="tech">Tech</span>
            </Link>
            <p>Аренда спортивного инвентаря</p>
          </div>
          
          <div className="footer-links">
            <h3>Меню</h3>
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/feedback">Отзывы</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Контакты</h3>
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z" fill="#666"/>
              </svg>
              ул. Спортивная, 123, Новосибирск
            </p>
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.1-.04-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.45-5.15-3.76-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z" fill="#666"/>
              </svg>
              +7 (999) 123-45-67
            </p>
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#666"/>
              </svg>
              info@sporttech.ru
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 SportTech. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 