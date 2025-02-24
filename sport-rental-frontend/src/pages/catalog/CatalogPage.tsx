import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
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
}

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    available: false
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
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
      const data = await getProducts(filterParams);
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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="catalog">
      <aside className="filters-sidebar">
        <h2>Фильтры</h2>
        <div className="filter-section">
          <select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Мин. цена"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />

          <input
            type="number"
            placeholder="Макс. цена"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={filters.available}
              onChange={(e) => handleFilterChange('available', e.target.checked)}
            />
            Только доступные
          </label>
        </div>
      </aside>

      <main className="products-section">
        <div className="products-header">
          <h1>Каталог</h1>
          <div className="sorting">
            <select>
              <option value="popular">По популярности</option>
              <option value="price-asc">По возрастанию цены</option>
              <option value="price-desc">По убыванию цены</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">{product.price} ₽/день</p>
              <span className={`status ${product.available ? 'available' : 'unavailable'}`}>
                {product.available ? 'Доступен' : 'Недоступен'}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CatalogPage; 