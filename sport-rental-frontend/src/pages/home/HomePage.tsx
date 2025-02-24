import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { getProducts, searchProducts } from '../../services/productService';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts({ available: true }) // Получаем только доступные товары
      ]);
      
      setCategories(categoriesData);
      setPopularProducts(productsData.slice(0, 6)); // Берем первые 6 товаров как популярные
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
      const results = await searchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      setError('Ошибка при поиске');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Аренда оборудования</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск оборудования..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isSearching && searchResults.length > 0 && (
          <div className="search-results">
            <h2>Результаты поиска</h2>
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
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="categories-section">
        <h2>Категории оборудования</h2>
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

      <section className="popular-products-section">
        <h2>Популярное оборудование</h2>
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

      <section className="how-it-works-section">
        <h2>Как это работает</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Выберите оборудование</h3>
            <p>Просмотрите каталог и выберите необходимое оборудование</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Укажите срок аренды</h3>
            <p>Выберите даты начала и окончания аренды</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Оформите заказ</h3>
            <p>Заполните необходимые данные и подтвердите заказ</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Получите оборудование</h3>
            <p>Заберите оборудование в пункте выдачи</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 