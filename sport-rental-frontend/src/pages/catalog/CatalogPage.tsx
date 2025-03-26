import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { mockGetProducts } from '../../services/mock/mockProductService';
import { mockGetCategories } from '../../services/mock/mockCategoryService';
import './CatalogPage.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    categoryId: categoryId || '',
    minPrice: '',
    maxPrice: '',
    available: false
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      setFilters(prev => ({
        ...prev,
        categoryId: categoryId
      }));
    }
  }, [categoryId]);

  useEffect(() => {
    loadProducts();
    
    // Определить текущую категорию
    if (filters.categoryId && categories.length > 0) {
      const category = categories.find(cat => cat.id === Number(filters.categoryId));
      setCurrentCategory(category || null);
    } else {
      setCurrentCategory(null);
    }
  }, [filters, categories]);

  const loadCategories = async () => {
    try {
      const data = await mockGetCategories();
      setCategories(data);
    } catch (error) {
      setError('Ошибка при загрузке категорий');
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filterParams = {
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        available: filters.available
      };
      const data = await mockGetProducts(filterParams);
      setProducts(data);
    } catch (error) {
      setError('Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRentClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  if (loading && !products.length) return (
    <div className="catalog-loading">
      <div className="spinner"></div>
      <p>Загрузка...</p>
    </div>
  );
  
  if (error) return (
    <div className="catalog-error">
      <p>Ошибка: {error}</p>
      <button onClick={() => window.location.reload()}>Попробовать снова</button>
    </div>
  );

  return (
    <div className="catalog-page">
      {/* Header Section */}
      <header className="catalog-header">
        <div className="header-container">
          <h1>Каталог</h1>
          {currentCategory && (
            <div className="current-category">
              <span>Категория:</span> {currentCategory.name}
            </div>
          )}
        </div>
        <div className="category-banner">
          {currentCategory ? (
            <div className="category-hero">
              <img src={currentCategory.image} alt={currentCategory.name} />
              <div className="category-overlay">
                <div className="banner-content">
                  <h2>{currentCategory.name}</h2>
                  <p>{currentCategory.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="category-hero">
              <img src="https://images.unsplash.com/photo-1486218119243-13883505764c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" alt="Все категории" />
              <div className="category-overlay">
                <div className="banner-content">
                  <h2>Все категории спортивного инвентаря</h2>
                  <p>Выберите категорию или воспользуйтесь фильтрами для поиска</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="catalog-content">
        {/* Sidebar with filters */}
        <aside className="filters-sidebar">
          <h2>Фильтры</h2>
          <div className="filter-section">
            <label className="filter-label">Категория</label>
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="filter-select"
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label className="filter-label">Цена</label>
            <div className="price-filters">
              <input
                type="number"
                placeholder="Мин. цена"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="filter-input"
              />
              <input
                type="number"
                placeholder="Макс. цена"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="available"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
              />
              <label htmlFor="available">Только доступные</label>
            </div>
          </div>
        </aside>

        <main className="products-content">
          {!currentCategory && categories.length > 0 && (
            <section className="categories-section">
              <h2>Категории оборудования</h2>
              <div className="categories-grid">
                {categories.map(category => (
                  <Link to={`/catalog?category=${category.id}`} key={category.id} className="category-card">
                    <img src={category.image} alt={category.name} />
                    <div className="category-info">
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(currentCategory || products.length > 0) && (
            <>
              <div className="products-header">
                <h2>{currentCategory ? `Товары категории "${currentCategory.name}"` : 'Все товары'}</h2>
                <div className="product-count">Найдено товаров: {products.length}</div>
              </div>

              {products.length > 0 ? (
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-card">
                      <Link to={`/product/${product.id}`} className="product-image">
                        <img src={product.image} alt={product.name} />
                      </Link>
                      <div className="product-info">
                        <Link to={`/product/${product.id}`} className="product-title">
                          <h3>{product.name}</h3>
                        </Link>
                        <p className="product-description">{product.description}</p>
                        <div className="product-footer">
                          <p className="product-price">От {product.price} ₽ в день</p>
                          <span className={`product-status ${product.available ? 'available' : 'unavailable'}`}>
                            {product.available ? 'В наличии' : 'Нет в наличии'}
                          </span>
                        </div>
                        <button 
                          className="rent-button"
                          onClick={() => handleRentClick(product.id)}
                          disabled={!product.available}
                        >
                          Арендовать
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <p>По вашему запросу ничего не найдено</p>
                  <button onClick={() => setFilters({
                    categoryId: '',
                    minPrice: '',
                    maxPrice: '',
                    available: false
                  })}>Сбросить фильтры</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage; 